from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from typing import List, Optional
import os
import uuid
import shutil
from pathlib import Path

from api.routes import scan_router, user_router
from services.photogrammetry import PhotogrammetryService
from models.scan import ScanStatus

# Create uploads and results directories if they don't exist
UPLOAD_DIR = Path("storage/uploads")
RESULTS_DIR = Path("storage/results")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
RESULTS_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title="FootScan3D API",
    description="API for 3D foot scanning using photogrammetry",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for STL downloads and previews
app.mount("/storage", StaticFiles(directory="storage"), name="storage")

# Include API routes
app.include_router(scan_router, prefix="/api/scans", tags=["scans"])
app.include_router(user_router, prefix="/api/users", tags=["users"])

# Direct routes in main.py for simplicity in this example
@app.post("/api/upload")
async def upload_files(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
    email: Optional[str] = Form(None),
):
    """
    Upload images for 3D foot scan processing
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")
    
    # Create a unique scan ID
    scan_id = str(uuid.uuid4())
    scan_dir = UPLOAD_DIR / scan_id
    scan_dir.mkdir(exist_ok=True)
    
    # Save uploaded files
    saved_files = []
    for file in files:
        file_path = scan_dir / file.filename
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        saved_files.append(file_path)
    
    # Process the scan in the background
    background_tasks.add_task(
        PhotogrammetryService.process_scan,
        scan_id,
        saved_files,
        email
    )
    
    return {
        "scan_id": scan_id,
        "status": ScanStatus.PROCESSING,
        "file_count": len(saved_files),
        "message": "Scan upload complete. Processing has started."
    }

@app.get("/api/scans/{scan_id}")
async def get_scan_status(scan_id: str):
    """
    Get the status of a scan
    """
    result_path = RESULTS_DIR / f"{scan_id}.stl"
    preview_path = RESULTS_DIR / f"{scan_id}_preview.glb"
    
    if result_path.exists():
        return {
            "scan_id": scan_id,
            "status": ScanStatus.COMPLETED,
            "download_url": f"/storage/results/{scan_id}.stl",
            "preview_url": f"/storage/results/{scan_id}_preview.glb" if preview_path.exists() else None
        }
    
    # Check if scan is still processing
    scan_dir = UPLOAD_DIR / scan_id
    if scan_dir.exists():
        return {
            "scan_id": scan_id,
            "status": ScanStatus.PROCESSING,
            "message": "Scan is still processing."
        }
    
    raise HTTPException(status_code=404, detail="Scan not found")

@app.get("/api/scans/{scan_id}/download")
async def download_scan(scan_id: str):
    """
    Download the processed STL file
    """
    result_path = RESULTS_DIR / f"{scan_id}.stl"
    if not result_path.exists():
        raise HTTPException(status_code=404, detail="Scan result not found")
    
    return FileResponse(
        path=result_path,
        filename=f"foot_scan_{scan_id}.stl",
        media_type="application/octet-stream"
    )

@app.get("/")
async def read_root():
    return {"message": "Welcome to FootScan3D API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 