# FootScan3D - Stride Labs

A web-based foot scanning application that converts smartphone photos into high-quality 3D STL models for orthotics, footwear design, and podiatric analysis.

## Features

- **Universal Compatibility**: Works with any smartphone camera (iPhone or Android)
- **Photogrammetry-Based**: Transforms multiple images into accurate 3D foot models
- **Easy-to-Use Interface**: Guided photo capture process with real-time feedback
- **Cloud Processing**: Powerful backend for fast and accurate 3D mesh generation
- **STL Download**: Direct download of ready-to-use STL files
- **3D Preview**: Interactive 3D visualization before download

## Technical Architecture

- **Frontend**: React, Tailwind CSS, Three.js
- **Backend**: Python FastAPI
- **3D Processing**: COLMAP, OpenMVS, Trimesh
- **File Storage**: Cloud-based secure storage

## Getting Started

### Prerequisites

- Node.js 18+ for frontend
- Python 3.10+ for backend
- Docker (optional for containerized deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/stridelabs/footscan3d.git
cd footscan3d

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
pip install -r requirements.txt

# Start development servers
# Frontend
cd ../frontend
npm run dev

# Backend
cd ../backend
uvicorn main:app --reload
```

## How It Works

1. User captures 20-40 photos of their foot from different angles
2. Photos are uploaded to our secure backend
3. Photogrammetry pipeline reconstructs a 3D model
4. Model is processed, cleaned, and converted to STL
5. User can preview and download the final STL file

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [COLMAP](https://colmap.github.io/) for Structure-from-Motion
- [OpenMVS](https://github.com/cdcseacave/openMVS) for Multi-View Stereo
- [Trimesh](https://github.com/mikedh/trimesh) for 3D mesh processing
