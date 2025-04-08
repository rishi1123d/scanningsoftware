from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form, BackgroundTasks
from typing import List, Optional
from models.scan import ScanResponse, ScanCreate, ScanStatus
import uuid
from pathlib import Path
import shutil

# Create routers
scan_router = APIRouter()
user_router = APIRouter()

# Mock database for simplicity
scans_db = {}
users_db = {}

# Scan routes
@scan_router.get("/", response_model=List[ScanResponse])
async def get_scans(email: Optional[str] = None):
    """Get all scans or filter by user email"""
    if email:
        return [scan for scan in scans_db.values() if scan.get("user_email") == email]
    return list(scans_db.values())

@scan_router.get("/{scan_id}", response_model=ScanResponse)
async def get_scan(scan_id: str):
    """Get a specific scan by ID"""
    if scan_id not in scans_db:
        raise HTTPException(status_code=404, detail="Scan not found")
    return scans_db[scan_id]

@scan_router.post("/", response_model=ScanResponse)
async def create_scan(scan_create: ScanCreate):
    """Create a new scan record (without files)"""
    scan_id = str(uuid.uuid4())
    scan = {
        "id": scan_id,
        "status": ScanStatus.UPLOADING,
        **scan_create.dict(),
        "created_at": "2023-11-01T00:00:00Z",  # Simplified for example
        "file_count": 0
    }
    scans_db[scan_id] = scan
    return scan

# User routes
@user_router.post("/")
async def create_user(email: str, name: Optional[str] = None):
    """Create a new user"""
    if email in users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    
    user = {
        "email": email,
        "name": name,
        "created_at": "2023-11-01T00:00:00Z"  # Simplified for example
    }
    users_db[email] = user
    return user

@user_router.get("/{email}")
async def get_user(email: str):
    """Get a user by email"""
    if email not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    return users_db[email] 