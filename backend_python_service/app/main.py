from pathlib import Path
import sys
import os
import argparse
from fastapi import Depends
from typing import Annotated

# Ensure package imports work when the file is executed directly (debug runs, `python app/main.py`, etc.).
project_root = Path(__file__).resolve().parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

from app.auth import app, User, get_current_active_user, get_current_active_admin


@app.get("/api/info")
async def read_service_info() -> dict[str, str]:
    return {"service": app.title, "status": "ok"}


@app.get("/api/users/me", response_model=User)
async def read_users_me(current_user: Annotated[User, Depends(get_current_active_user)]) -> User:
    return current_user

@app.get("/api/admin/reports", response_model=User)
async def read_admin_dashboard(current_admin: Annotated[User, Depends(get_current_active_admin)]) -> User:
    return current_admin

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run the FastAPI app with environment config.")
    parser.add_argument("--env", choices=["dev", "prod"], default="dev", help="Environment to run in (dev or prod). Defaults to dev.")
    args = parser.parse_args()

    # Set the config file based on environment
    os.environ['CONFIG_FILE'] = f"{args.env}.config.yaml"

    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=5000)
