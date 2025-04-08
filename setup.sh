#!/bin/bash

# FootScan3D Setup Script
echo "Setting up FootScan3D development environment..."

# Create storage directories
mkdir -p storage/uploads storage/results
echo "Created storage directories."

# Check if Docker is installed
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "Docker and Docker Compose are installed. Setting up with Docker..."
    
    # Start the development environment
    docker-compose up -d
    echo "Development environment is running!"
    echo "- Backend API: http://localhost:8000"
    echo "- Frontend: http://localhost:3000"
    
    echo "You can view logs with 'docker-compose logs -f'"
else
    echo "Docker not found. Setting up local development environment..."
    
    # Install backend dependencies
    echo "Setting up Python backend..."
    cd backend
    
    if command -v python3 &> /dev/null; then
        python3 -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
        echo "Backend dependencies installed successfully!"
    else
        echo "Python 3 not found. Please install Python 3 to continue."
        exit 1
    fi
    
    cd ..
    
    # Install frontend dependencies
    echo "Setting up React frontend..."
    cd frontend
    
    if command -v npm &> /dev/null; then
        npm install
        echo "Frontend dependencies installed successfully!"
    else
        echo "npm not found. Please install Node.js to continue."
        exit 1
    fi
    
    cd ..
    
    echo "Setup complete!"
    echo "To start the development servers:"
    echo "1. Backend: cd backend && source venv/bin/activate && uvicorn main:app --reload"
    echo "2. Frontend: cd frontend && npm start"
fi

echo ""
echo "Thank you for using FootScan3D!" 