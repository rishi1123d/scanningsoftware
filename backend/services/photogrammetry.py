import os
import subprocess
import tempfile
import logging
import time
from pathlib import Path
from typing import List, Optional, Union
import numpy as np
import trimesh
import cv2
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("photogrammetry_service")

class PhotogrammetryService:
    """Service for processing images into 3D models using photogrammetry"""
    
    COLMAP_PATH = "colmap"  # Assumes COLMAP is installed and in PATH
    RESULTS_DIR = Path("storage/results")
    
    @classmethod
    async def process_scan(
        cls, 
        scan_id: str, 
        image_paths: List[Union[str, Path]], 
        email: Optional[str] = None
    ):
        """
        Process a foot scan from images
        
        Args:
            scan_id: Unique identifier for the scan
            image_paths: List of paths to images
            email: Optional email to notify upon completion
        """
        try:
            logger.info(f"Starting scan processing for scan_id: {scan_id}")
            start_time = time.time()
            
            # Create working directory
            with tempfile.TemporaryDirectory() as temp_dir:
                temp_path = Path(temp_dir)
                
                # 1. Prepare images (resize, enhance contrast if needed)
                image_dir = temp_path / "images"
                image_dir.mkdir(exist_ok=True)
                
                for i, img_path in enumerate(image_paths):
                    img = cv2.imread(str(img_path))
                    if img is None:
                        logger.warning(f"Could not read image: {img_path}")
                        continue
                    
                    # Resize to reasonable dimensions if needed
                    height, width = img.shape[:2]
                    if max(height, width) > 2000:
                        scale = 2000 / max(height, width)
                        img = cv2.resize(img, (int(width * scale), int(height * scale)))
                    
                    # Enhance contrast if needed
                    # img = cls._enhance_image(img)
                    
                    # Save prepared image
                    output_path = image_dir / f"image_{i:04d}.jpg"
                    cv2.imwrite(str(output_path), img)
                
                # 2. Run COLMAP SfM
                sparse_dir = temp_path / "sparse"
                sparse_dir.mkdir(exist_ok=True)
                
                # Feature extraction
                logger.info("Starting feature extraction...")
                cls._run_colmap_feature_extraction(image_dir, temp_path)
                
                # Feature matching
                logger.info("Starting feature matching...")
                cls._run_colmap_feature_matching(temp_path)
                
                # Sparse reconstruction
                logger.info("Starting sparse reconstruction...")
                cls._run_colmap_mapper(image_dir, sparse_dir, temp_path)
                
                # 3. Dense reconstruction (in a production system)
                # This is computationally intensive and would typically run on a GPU
                # For this example, we'll skip to mesh generation from sparse point cloud
                
                # 4. Generate mesh from point cloud
                logger.info("Generating mesh from point cloud...")
                sparse_model_path = sparse_dir / "0"
                point_cloud = cls._load_colmap_points(sparse_model_path)
                
                # In a real system, you would:
                # 1. Use COLMAP's dense reconstruction or OpenMVS
                # 2. Apply Poisson surface reconstruction
                # For this example, we'll create a simplified mesh from the sparse points
                mesh = cls._create_mesh_from_points(point_cloud)
                
                # 5. Save result as STL
                stl_path = cls.RESULTS_DIR / f"{scan_id}.stl"
                mesh.export(str(stl_path))
                
                # 6. Create a preview model (simplified for web viewing)
                preview_path = cls.RESULTS_DIR / f"{scan_id}_preview.glb"
                simplified_mesh = mesh.copy()
                simplified_mesh = simplified_mesh.simplify_quadratic_decimation(5000)  # Reduce to 5000 faces
                simplified_mesh.export(str(preview_path))
                
                # 7. Update scan status in database
                # This would update the database in a real system
                
                elapsed_time = time.time() - start_time
                logger.info(f"Scan processing completed in {elapsed_time:.2f} seconds")
                
                # 8. Send notification email if provided
                if email:
                    # This would send an email in a real system
                    logger.info(f"Sending completion email to {email}")
                
                return {
                    "scan_id": scan_id,
                    "status": "completed",
                    "result_path": str(stl_path),
                    "preview_path": str(preview_path)
                }
                
        except Exception as e:
            logger.error(f"Error processing scan {scan_id}: {str(e)}")
            # Update scan status to failed in database
            return {
                "scan_id": scan_id,
                "status": "failed",
                "error": str(e)
            }
    
    @staticmethod
    def _run_colmap_feature_extraction(image_dir: Path, workspace_dir: Path):
        """Run COLMAP feature extraction"""
        database_path = workspace_dir / "database.db"
        
        command = [
            PhotogrammetryService.COLMAP_PATH, "feature_extractor",
            "--database_path", str(database_path),
            "--image_path", str(image_dir),
            "--ImageReader.single_camera", "1",
            "--SiftExtraction.use_gpu", "1"
        ]
        
        # In a real implementation:
        # subprocess.run(command, check=True)
        
        # For this example, we're simulating the process
        logger.info(f"Would run: {' '.join(command)}")
        time.sleep(1)  # Simulate processing time
    
    @staticmethod
    def _run_colmap_feature_matching(workspace_dir: Path):
        """Run COLMAP feature matching"""
        database_path = workspace_dir / "database.db"
        
        command = [
            PhotogrammetryService.COLMAP_PATH, "exhaustive_matcher",
            "--database_path", str(database_path),
            "--SiftMatching.use_gpu", "1"
        ]
        
        # In a real implementation:
        # subprocess.run(command, check=True)
        
        # For this example, we're simulating the process
        logger.info(f"Would run: {' '.join(command)}")
        time.sleep(1)  # Simulate processing time
    
    @staticmethod
    def _run_colmap_mapper(image_dir: Path, sparse_dir: Path, workspace_dir: Path):
        """Run COLMAP mapper for sparse reconstruction"""
        database_path = workspace_dir / "database.db"
        
        command = [
            PhotogrammetryService.COLMAP_PATH, "mapper",
            "--database_path", str(database_path),
            "--image_path", str(image_dir),
            "--output_path", str(sparse_dir)
        ]
        
        # In a real implementation:
        # subprocess.run(command, check=True)
        
        # For this example, we're simulating the process
        logger.info(f"Would run: {' '.join(command)}")
        time.sleep(2)  # Simulate processing time
    
    @staticmethod
    def _load_colmap_points(model_path: Path):
        """
        Load point cloud from COLMAP sparse reconstruction
        (Simplified for this example)
        """
        # In a real implementation, parse COLMAP's points3D.txt
        # For this example, generate dummy points in a foot-like shape
        
        # Create a basic foot shape point cloud
        num_points = 2000
        points = np.zeros((num_points, 3))
        
        # Foot dimensions (roughly)
        length = 0.28  # ~28 cm
        width = 0.1    # ~10 cm at widest
        height = 0.05  # ~5 cm height
        
        for i in range(num_points):
            # Position along foot length (heel to toe)
            t = i / num_points
            
            # Foot shape approximation (narrower at heel and toe, wider in middle)
            w = width * (1 - (2*t - 1)**2)
            
            # Randomize points within this envelope
            x = t * length
            y = (np.random.random() - 0.5) * w
            z = np.random.random() * height
            
            points[i] = [x, y, z]
        
        return points
    
    @staticmethod
    def _create_mesh_from_points(points):
        """
        Create a mesh from point cloud
        (Simplified for this example)
        """
        # In a production system, use Poisson surface reconstruction
        # For this example, create a convex hull
        mesh = trimesh.Trimesh(vertices=points)
        convex_hull = mesh.convex_hull
        
        # Make it look more like a foot by flattening the bottom
        vertices = convex_hull.vertices
        # Flatten bottom (assuming z is up)
        min_z = vertices[:, 2].min()
        bottom_verts = vertices[:, 2] < min_z + 0.01
        vertices[bottom_verts, 2] = min_z
        
        return trimesh.Trimesh(vertices=vertices, faces=convex_hull.faces)
    
    @staticmethod
    def _enhance_image(img):
        """Enhance image contrast for better feature detection"""
        # Convert to LAB color space
        lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
        # Split channels
        l, a, b = cv2.split(lab)
        # Apply CLAHE to L channel
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        cl = clahe.apply(l)
        # Merge channels
        merged = cv2.merge((cl, a, b))
        # Convert back to BGR
        enhanced = cv2.cvtColor(merged, cv2.COLOR_LAB2BGR)
        return enhanced 