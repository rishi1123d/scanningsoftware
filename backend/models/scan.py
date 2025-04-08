from enum import Enum
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

class ScanStatus(str, Enum):
    UPLOADING = "uploading"
    PROCESSING = "processing"
    FAILED = "failed"
    COMPLETED = "completed"

class ScanBase(BaseModel):
    user_email: Optional[str] = None
    foot_side: Optional[str] = None  # "left" or "right"
    notes: Optional[str] = None

class ScanCreate(ScanBase):
    pass

class ScanResponse(ScanBase):
    id: str
    status: ScanStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    file_count: int = 0
    download_url: Optional[str] = None
    preview_url: Optional[str] = None
    error_message: Optional[str] = None

    class Config:
        orm_mode = True

class ScanDB(ScanBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: ScanStatus = ScanStatus.UPLOADING
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    file_count: int = 0
    file_paths: List[str] = []
    result_path: Optional[str] = None
    preview_path: Optional[str] = None
    error_message: Optional[str] = None 