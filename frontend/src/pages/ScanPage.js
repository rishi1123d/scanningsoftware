import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import axios from 'axios';

// Custom components
import ScanInstructions from '../components/scan/ScanInstructions';
import ScanProgress from '../components/scan/ScanProgress';
import FootSelector from '../components/scan/FootSelector';

const ScanPage = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);

  // State management
  const [captureMode, setCaptureMode] = useState('guide'); // 'guide', 'camera', 'upload'
  const [capturedImages, setCapturedImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [email, setEmail] = useState('');
  const [footSide, setFootSide] = useState('');
  const [notes, setNotes] = useState('');

  // Handle image capture from webcam
  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        // Convert base64 to file
        fetch(imageSrc)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], `foot_${Date.now()}.jpg`, { type: 'image/jpeg' });
            setCapturedImages(prev => [...prev, file]);
          });
      }
    }
  }, [webcamRef]);

  // Handle file upload with dropzone
  const onDrop = useCallback(acceptedFiles => {
    // Filter for only image files
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/')
    );
    
    if (imageFiles.length === 0) {
      toast.error('Please upload image files only.');
      return;
    }
    
    setCapturedImages(prev => [...prev, ...imageFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxSize: 10485760, // 10MB
  });

  // Reset captured images
  const resetCapture = () => {
    setCapturedImages([]);
  };

  // Remove a specific image
  const removeImage = (index) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Submit the scan
  const submitScan = async () => {
    if (capturedImages.length < 10) {
      toast.warning('Please capture at least 10 images for an accurate scan.');
      return;
    }

    if (!footSide) {
      toast.warning('Please select which foot you are scanning.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create form data
      const formData = new FormData();
      capturedImages.forEach(file => {
        formData.append('files', file);
      });
      
      // Add metadata
      if (email) formData.append('email', email);
      formData.append('foot_side', footSide);
      if (notes) formData.append('notes', notes);

      // Upload to server
      const response = await axios.post('/api/upload', formData, {
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      // Handle successful upload
      toast.success('Scan uploaded successfully! Processing your 3D model...');
      
      // Navigate to results page
      navigate(`/results/${response.data.scan_id}`);
    } catch (error) {
      console.error('Error uploading scan:', error);
      toast.error('Failed to upload scan. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Render different UI based on capture mode
  const renderCaptureInterface = () => {
    switch (captureMode) {
      case 'guide':
        return (
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
            <ScanInstructions />
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setCaptureMode('camera')}
                className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Use Camera
              </button>
              <button
                onClick={() => setCaptureMode('upload')}
                className="px-6 py-3 bg-secondary-200 text-secondary-800 rounded-md hover:bg-secondary-300 transition-colors"
              >
                Upload Photos
              </button>
            </div>
          </div>
        );
      
      case 'camera':
        return (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-secondary-800 mb-4">Capture Foot Images</h2>
            
            <div className="mb-6">
              <div className="relative rounded-lg overflow-hidden bg-black">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    facingMode: 'environment',
                    aspectRatio: 4/3
                  }}
                  className="w-full h-auto"
                />
                
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <button
                    onClick={captureImage}
                    className="rounded-full bg-white p-4 shadow-lg"
                    disabled={isUploading}
                  >
                    <div className="w-12 h-12 rounded-full border-4 border-primary-600"></div>
                  </button>
                </div>
              </div>
            </div>
            
            {capturedImages.length > 0 && (
              <>
                <p className="text-secondary-600 mb-2">
                  Captured {capturedImages.length} {capturedImages.length === 1 ? 'image' : 'images'}
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-6">
                  {capturedImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Captured ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            <div className="flex flex-wrap gap-4 justify-between items-center">
              <button
                onClick={() => setCaptureMode('guide')}
                className="px-4 py-2 bg-secondary-200 text-secondary-800 rounded-md hover:bg-secondary-300 transition-colors"
              >
                Back to Guide
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={resetCapture}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                  disabled={capturedImages.length === 0 || isUploading}
                >
                  Reset
                </button>
                {capturedImages.length >= 10 && (
                  <button
                    onClick={() => setCaptureMode('review')}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                    disabled={isUploading}
                  >
                    Continue
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'upload':
        return (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-secondary-800 mb-4">Upload Foot Images</h2>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer mb-6 ${
                isDragActive ? 'border-primary-500 bg-primary-50' : 'border-secondary-300'
              }`}
            >
              <input {...getInputProps()} />
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              
              {isDragActive ? (
                <p className="mt-2 text-primary-600">Drop the images here...</p>
              ) : (
                <>
                  <p className="mt-2 text-secondary-600">Drag and drop foot images here, or click to browse</p>
                  <p className="text-sm text-secondary-500">For best results, upload 20-40 images taken from different angles</p>
                </>
              )}
            </div>
            
            {capturedImages.length > 0 && (
              <>
                <p className="text-secondary-600 mb-2">
                  Uploaded {capturedImages.length} {capturedImages.length === 1 ? 'image' : 'images'}
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-6">
                  {capturedImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Uploaded ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            <div className="flex flex-wrap gap-4 justify-between items-center">
              <button
                onClick={() => setCaptureMode('guide')}
                className="px-4 py-2 bg-secondary-200 text-secondary-800 rounded-md hover:bg-secondary-300 transition-colors"
              >
                Back to Guide
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={resetCapture}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                  disabled={capturedImages.length === 0 || isUploading}
                >
                  Reset
                </button>
                {capturedImages.length >= 10 && (
                  <button
                    onClick={() => setCaptureMode('review')}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                    disabled={isUploading}
                  >
                    Continue
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'review':
        return (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-secondary-800 mb-4">Review and Submit</h2>
            
            <div className="mb-6">
              <p className="text-secondary-600 mb-4">
                You've captured {capturedImages.length} images. Please review them and select which foot you're scanning.
              </p>
              
              <FootSelector footSide={footSide} setFootSide={setFootSide} />
              
              <div className="mt-6">
                <label htmlFor="email" className="block text-sm font-medium text-secondary-700">
                  Email (optional)
                </label>
                <p className="text-xs text-secondary-500 mb-1">
                  We'll notify you when your 3D model is ready.
                </p>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="youremail@example.com"
                />
              </div>
              
              <div className="mt-4">
                <label htmlFor="notes" className="block text-sm font-medium text-secondary-700">
                  Notes (optional)
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Any details about your foot scan..."
                />
              </div>
            </div>
            
            {isUploading ? (
              <ScanProgress progress={uploadProgress} />
            ) : (
              <div className="flex flex-wrap gap-4 justify-between items-center">
                <button
                  onClick={() => captureMode === 'camera' ? setCaptureMode('camera') : setCaptureMode('upload')}
                  className="px-4 py-2 bg-secondary-200 text-secondary-800 rounded-md hover:bg-secondary-300 transition-colors"
                >
                  Back
                </button>
                
                <button
                  onClick={submitScan}
                  className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  disabled={!footSide}
                >
                  Submit Scan
                </button>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-secondary-900 text-center mb-8">
        3D Foot Scanner
      </h1>
      
      {renderCaptureInterface()}
    </div>
  );
};

export default ScanPage; 