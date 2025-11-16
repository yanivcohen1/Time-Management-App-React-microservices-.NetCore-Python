# FastAPI Authentication with MongoDB

A role-based authentication API built with FastAPI, using JWT tokens and MongoDB for user storage.

## Features

- JWT-based authentication
- Role-based access control (admin/user roles)
- MongoDB user storage
- CORS support
- Configurable via YAML

## Setup

### Prerequisites

- Python 3.12+
- MongoDB running on localhost:27017

### Installation

1. Create a virtual environment:
   ```bash
   py -3.12 -m venv venv
   ```

2. Activate the virtual environment:
   ```bash
   .\venv\Scripts\activate  # Windows
   # or
   source venv/bin/activate  # Linux/Mac
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Seed the database with initial users:
   ```bash
   python seed.py
   ```

## Configuration

The application uses `config.yaml` for configuration:

- **JWT Key**: Secret key for JWT token signing
- **MongoDB Connection**: Database connection string
- **Server URLs**: HTTP/HTTPS endpoints
- **CORS Origins**: Allowed origins for CORS

## Running the Application

Start the server:
```bash
python app/main.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Public Endpoints

- `GET /info` - Service information

### Authentication

- `POST /login` - Login with username/password, returns JWT token

### Protected Endpoints

- `GET /users/me` - Get current user info (requires authentication)
- `GET /admin/dashboard` - Admin-only endpoint (requires admin role)

## Default Users

After seeding, the following users are available:

- **Admin**: `admin@example.com` / `Admin123!`
- **User**: `user@example.com` / `User123!`

## Testing

Run tests with pytest:
```bash
pytest
```

Or use VS Code's testing tab.

## Project Structure

```
fast_api_auth/
├── app/
│   ├── __init__.py
│   ├── auth.py       # Authentication logic and app setup
│   └── main.py       # Server entry point
├── tests/
│   ├── conftest.py
│   └── test_auth.py  # API tests
├── config.yaml       # Configuration file
├── seed.py           # Database seeding script
├── requirements.txt  # Python dependencies
└── readme.md         # This file
```