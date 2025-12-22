from datetime import datetime
from typing import List, Optional, TYPE_CHECKING
import uuid
from sqlmodel import Field, Relationship, SQLModel, Column, DateTime, func

if TYPE_CHECKING:
    from .task import Task

class User(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(unique=True, index=True)
    full_name: Optional[str] = None
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    )

    tasks: List["Task"] = Relationship(back_populates="user")
