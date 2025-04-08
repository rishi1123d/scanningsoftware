import React from 'react';

const ScanProgress = ({ progress }) => {
  return (
    <div className="w-full bg-white p-4 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium text-secondary-800">Uploading Scan</h3>
        <span className="text-primary-600 font-semibold">{progress}%</span>
      </div>
      
      <div className="w-full bg-secondary-200 rounded-full h-4">
        <div 
          className="bg-primary-600 h-4 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <p className="mt-3 text-sm text-secondary-500">
        {progress < 100 
          ? "Please wait while we upload your images..." 
          : "Upload complete! Starting scan processing..."}
      </p>
    </div>
  );
};

export default ScanProgress; 