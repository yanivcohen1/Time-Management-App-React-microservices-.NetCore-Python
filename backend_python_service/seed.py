import asyncio

from app.auth import UserDocument, init_db, pwd_context


async def seed_users() -> None:
    await init_db()

    # Reset the collection for deterministic seed runs.
    await UserDocument.find_all().delete()

    admin_user = UserDocument(
        username="admin@example.com",
        full_name="Admin User",
        hashed_password=pwd_context.hash("Admin123!"),
        disabled=False,
        role="admin",
    )

    regular_user = UserDocument(
        username="user@example.com",
        full_name="Regular User",
        hashed_password=pwd_context.hash("User123!"),
        disabled=False,
        role="user",
    )

    await UserDocument.insert_many([admin_user, regular_user])
    print("Users seeded successfully")


if __name__ == "__main__":
    asyncio.run(seed_users())
