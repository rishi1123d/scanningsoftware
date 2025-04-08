import React from 'react';

const ScanInstructions = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-secondary-800 mb-4">How to Scan Your Foot</h2>
      
      <div className="space-y-6">
        {/* Step 1 */}
        <div className="bg-secondary-50 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary-500 text-white font-bold">1</div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-secondary-800">Prepare Your Environment</h3>
              <ul className="mt-2 text-secondary-600 list-disc pl-5 space-y-1">
                <li>Find a well-lit area with even lighting</li>
                <li>Choose a plain background (solid color floor or mat)</li>
                <li>Remove socks and place foot on a flat surface</li>
                <li>Clean the foot to avoid artifacts in the scan</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Step 2 */}
        <div className="bg-secondary-50 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary-500 text-white font-bold">2</div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-secondary-800">Take Multiple Photos</h3>
              <ul className="mt-2 text-secondary-600 list-disc pl-5 space-y-1">
                <li>Take 20-40 photos from different angles (more is better)</li>
                <li>Start from the top and move around in a circular pattern</li>
                <li>Include photos from slightly above and below the foot</li>
                <li>Keep the whole foot in frame in each photo</li>
                <li>Make sure the foot stays still between shots</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Step 3 */}
        <div className="bg-secondary-50 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary-500 text-white font-bold">3</div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-secondary-800">Important Tips</h3>
              <ul className="mt-2 text-secondary-600 list-disc pl-5 space-y-1">
                <li>Avoid shiny or reflective surfaces on the foot</li>
                <li>Make sure there's good contrast between foot and background</li>
                <li>Keep the camera at roughly the same distance for all photos</li>
                <li>Avoid blurry images - move slowly and keep steady</li>
                <li>Include some overlap between consecutive photos</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-2 text-center text-secondary-600">
          <p>Choose to either use your camera now or upload existing photos:</p>
        </div>
      </div>
    </div>
  );
};

export default ScanInstructions; 