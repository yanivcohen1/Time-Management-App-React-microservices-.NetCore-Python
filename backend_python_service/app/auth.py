import asyncio
import sys
import os
from datetime import datetime, timedelta
from typing import Annotated, Dict, Optional
from urllib.parse import urlparse
from types import coroutine as types_coroutine

# Motor 2.x expects the legacy selector loop on Windows; enforce it before any loops start.
if sys.platform.startswith("win"):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

if not hasattr(asyncio, "coroutine"):
    asyncio.coroutine = types_coroutine

from beanie import Document, init_beanie
from beanie.exceptions import CollectionWasNotInitialized
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from pydantic import BaseModel
from contextlib import asynccontextmanager
import yaml

config_file = os.environ.get('CONFIG_FILE', os.path.join(os.path.dirname(os.path.dirname(__file__)), 'dev.config.yaml'))
with open(config_file) as f:
    config = yaml.safe_load(f)

SECRET_KEY = config['Jwt']['Key']
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = config['Jwt']['TimeoutMinutes']

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")  # Avoid bcrypt password length limits for demo.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    global mongo_client, mongo_loop
    if mongo_client is not None:
        mongo_client.close()
        mongo_client = None
    mongo_loop = None

app = FastAPI(title="Role-based Auth API", lifespan=lifespan, redoc_url="/redoc")

origins = config['Cors']['AllowedOrigins'].split(',')
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mongo_client = None
mongo_loop = None


class Token(BaseModel):
    access_token: str
    token_type: str
    role: str


class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None


class User(BaseModel):
    username: str
    full_name: Optional[str] = None
    disabled: Optional[bool] = None
    role: str


class UserInDB(User):
    hashed_password: str


class UserDocument(Document):
    username: str
    full_name: Optional[str] = None
    disabled: Optional[bool] = False
    role: str
    hashed_password: str

    class Settings:
        name = "users"

    def to_user_in_db(self) -> UserInDB:
        return UserInDB(**self.model_dump())


async def init_db(force: bool = False) -> None:
    global mongo_client, mongo_loop
    current_loop = asyncio.get_running_loop()

    client_is_valid = (
        mongo_client is not None
        and mongo_loop is not None
        and not mongo_loop.is_closed()
        and mongo_loop is current_loop
    )

    if client_is_valid and not force:
        return

    if mongo_client is not None:
        mongo_client.close()

    mongo_client = AsyncIOMotorClient(
        config['ConnectionStrings']['MongoConnection'],
        io_loop=current_loop,
    )
    database = mongo_client.get_default_database()

    if database is None:
        parsed = urlparse(config['ConnectionStrings']['MongoConnection'])
        db_name = parsed.path.lstrip("/") or "fast_api_auth"
        database = mongo_client[db_name]

    await init_beanie(database=database, document_models=[UserDocument])
    mongo_loop = current_loop


async def ensure_beanie_initialized() -> None:
    await init_db()
    try:
        UserDocument.get_settings()
    except CollectionWasNotInitialized:
        await init_db(force=True)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


async def get_user(username: str) -> Optional[UserInDB]:
    await ensure_beanie_initialized()
    user_doc = await UserDocument.find_one({"username": username})
    if user_doc:
        return user_doc.to_user_in_db()
    return None


async def authenticate_user(username: str, password: str) -> Optional[UserInDB]:
    user = await get_user(username)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


def create_access_token(data: Dict[str, str], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")
        if username is None or role is None:
            raise credentials_exception
        token_data = TokenData(username=username, role=role)
    except JWTError as exc:
        raise credentials_exception from exc
    user_in_db = await get_user(username=token_data.username)
    if user_in_db is None:
        raise credentials_exception
    return User(**user_in_db.model_dump(exclude={"hashed_password"}))


async def get_current_active_user(current_user: Annotated[User, Depends(get_current_user)]) -> User:
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


async def get_current_active_admin(current_user: Annotated[User, Depends(get_current_active_user)]) -> User:
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return current_user

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/api/auth/login", response_model=Token)
async def login_for_access_token(request: LoginRequest) -> Token:
    user = await authenticate_user(request.username, request.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer", role=user.role)
