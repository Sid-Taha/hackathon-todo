import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session
import uuid

from backend.core.config import settings
from backend.core.db import engine
from backend.models import User

reusable_oauth2 = HTTPBearer()

def get_current_user(token: HTTPAuthorizationCredentials = Depends(reusable_oauth2)) -> User:
    try:
        payload = jwt.decode(
            token.credentials, settings.BETTER_AUTH_SECRET, algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
            )
    except (jwt.PyJWTError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    
    with Session(engine) as session:
        user = session.get(User, uuid.UUID(user_id))
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
