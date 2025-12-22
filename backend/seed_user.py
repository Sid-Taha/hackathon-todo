# backend/seed_user.py
import sys
import os

# Ensure backend folder is in python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlmodel import Session, select
from backend.core.db import engine
from backend.models import User
from backend.core.config import settings
import jwt
import datetime

def create_test_user():
    email = "test@example.com"
    print(f"Checking for user: {email}...")
    
    with Session(engine) as session:
        # Check if user exists
        statement = select(User).where(User.email == email)
        user = session.exec(statement).first()
        
        if not user:
            print("User not found. Creating new user...")
            user = User(email=email, full_name="Test User")
            session.add(user)
            session.commit()
            session.refresh(user)
            print(f"✅ User created in DB: {user.id}")
        else:
            print(f"ℹ️ User already exists in DB: {user.id}")
        
        # Generate Token
        payload = {
            "sub": str(user.id),
            "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)
        }
        token = jwt.encode(payload, settings.BETTER_AUTH_SECRET, algorithm=settings.ALGORITHM)
        
        print("\n" + "="*50)
        print("🔑 USE THIS TOKEN TO LOGIN (Copy Pura Token):")
        print("="*50)
        print(token)
        print("="*50 + "\n")

if __name__ == "__main__":
    create_test_user()