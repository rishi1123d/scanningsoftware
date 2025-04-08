import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ModelViewer from '../components/viewer/ModelViewer';

const ResultsPage = () => {
  const { scanId } = useParams();
  const [scanStatus, setScanStatus] = useState('loading'); // loading, processing, completed, failed
  const [scanData, setScanData] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);

  // Fetch scan status on component mount
  useEffect(() => {
    fetchScanStatus();
    
    // Set up polling if scan is in processing state
    const interval = setInterval(() => {
      fetchScanStatus();
    }, 5000); // Check every 5 seconds
    setPollingInterval(interval);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Stop polling when scan is completed or failed
  useEffect(() => {
    if (scanStatus === 'completed' || scanStatus === 'failed') {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
    }
  }, [scanStatus, pollingInterval]);

  const fetchScanStatus = async () => {
    try {
      const response = await axios.get(`/api/scans/${scanId}`);
      
      setScanData(response.data);
      
      if (response.data.status === 'COMPLETED') {
        setScanStatus('completed');
        toast.success('Your 3D model is ready!');
      } else if (response.data.status === 'FAILED') {
        setScanStatus('failed');
        toast.error('There was an error processing your scan.');
      } else if (response.data.status === 'PROCESSING') {
        setScanStatus('processing');
      }
    } catch (error) {
      console.error('Error fetching scan status:', error);
      setScanStatus('failed');
      toast.error('Unable to retrieve scan information.');
    }
  };

  const handleDownload = () => {
    if (scanData && scanData.download_url) {
      window.location.href = scanData.download_url;
    }
  };

  // Render based on scan status
  const renderContent = () => {
    switch (scanStatus) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center p-10">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-lg text-secondary-600">Loading scan information...</p>
          </div>
        );
      
      case 'processing':
        return (
          <div className="flex flex-col items-center justify-center p-10">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center mb-4">
                <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <h2 className="text-2xl font-bold text-secondary-800">Processing in Progress</h2>
              </div>
              
              <p className="text-lg text-center text-secondary-600 mb-6">
                We're creating your 3D foot model. This may take a few minutes.
              </p>
              
              <div className="w-full bg-secondary-200 rounded-full h-4 mb-6">
                <div className="bg-primary-600 h-4 rounded-full animate-pulse"></div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-secondary-500 mb-4">
                  You can stay on this page or come back later. We'll update this page automatically when your model is ready.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        );
      
      case 'completed':
        return (
          <div className="w-full">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-secondary-200">
                <h2 className="text-2xl font-bold text-secondary-800">Your 3D Foot Model</h2>
                <p className="text-secondary-600">
                  Your scan has been successfully processed. You can view and download your 3D model below.
                </p>
              </div>
              
              {/* 3D Model Viewer */}
              <div className="w-full h-96 bg-secondary-100">
                {scanData && scanData.preview_url && (
                  <ModelViewer modelUrl={scanData.preview_url} />
                )}
              </div>
              
              <div className="p-6 bg-secondary-50">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-medium text-secondary-800">Download Options</h3>
                    <p className="text-sm text-secondary-500">
                      Your model is ready to use with 3D printing or orthotic design software.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    >
                      Download STL
                    </button>
                    <Link
                      to="/scan"
                      className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 text-center"
                    >
                      Scan Another Foot
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-secondary-800 mb-4">What's Next?</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-secondary-200 rounded-lg p-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <h4 className="text-md font-medium text-secondary-800">3D Print Your Model</h4>
                  <p className="mt-2 text-sm text-secondary-500">
                    Use the STL file with any 3D printer to create a physical model of your foot.
                  </p>
                </div>
                
                <div className="border border-secondary-200 rounded-lg p-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h4 className="text-md font-medium text-secondary-800">Design Custom Orthotics</h4>
                  <p className="mt-2 text-sm text-secondary-500">
                    Import into orthotic design software to create perfectly fitted insoles.
                  </p>
                </div>
                
                <div className="border border-secondary-200 rounded-lg p-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                  <h4 className="text-md font-medium text-secondary-800">Share with Specialists</h4>
                  <p className="mt-2 text-sm text-secondary-500">
                    Send to podiatrists or shoemakers to aid in assessment or custom shoe design.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'failed':
        return (
          <div className="flex flex-col items-center justify-center p-10">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 text-center">
              <div className="flex items-center justify-center mb-4 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-secondary-800 mb-4">Processing Failed</h2>
              
              <p className="text-lg text-secondary-600 mb-6">
                We encountered an error while processing your foot scan.
              </p>
              
              {scanData && scanData.error_message && (
                <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md">
                  {scanData.error_message}
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/scan"
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Try Again
                </Link>
                <Link
                  to="/"
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-secondary-900 text-center mb-8">
        Scan Results
      </h1>
      
      {renderContent()}
    </div>
  );
};

export default ResultsPage; 