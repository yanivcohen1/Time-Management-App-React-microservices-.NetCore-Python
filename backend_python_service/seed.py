from pymongo import MongoClient
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def seed_users():
    client = MongoClient("mongodb://localhost:27017/fast_api_auth")
    db = client.fast_api_auth
    users_collection = db.users

    # Admin user
    admin_user = {
        "username": "admin@example.com",
        "full_name": "Admin User",
        "hashed_password": pwd_context.hash("Admin123!"),
        "disabled": False,
        "role": "admin",
    }
    users_collection.insert_one(admin_user)

    # User
    user_user = {
        "username": "user@example.com",
        "full_name": "Regular User",
        "hashed_password": pwd_context.hash("User123!"),
        "disabled": False,
        "role": "user",
    }
    users_collection.insert_one(user_user)

    print("Users seeded successfully")

if __name__ == "__main__":
    seed_users()
