import React from 'react';

const FootSelector = ({ footSide, setFootSide }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-secondary-700 mb-2">
        Select which foot you are scanning *
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Foot */}
        <div
          className={`relative border rounded-lg p-4 cursor-pointer transition-colors ${
            footSide === 'left'
              ? 'border-primary-500 bg-primary-50'
              : 'border-secondary-300 hover:border-primary-300'
          }`}
          onClick={() => setFootSide('left')}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-10 w-10 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.74,9.65a3.81,3.81,0,0,0-1.18-1.56,5.64,5.64,0,0,0-5.73-.41,5.06,5.06,0,0,0-1.69,1.5.29.29,0,0,0-.6.28.27.27,0,0,0,.4.11c.25.11.58-.31.88-.55a4.08,4.08,0,0,1,5.95.9A14.89,14.89,0,0,1,16,13.84a1,1,0,0,0,.8.65,1.13,1.13,0,0,0,.93-.29,2.88,2.88,0,0,0,.82-1.8A4.56,4.56,0,0,0,15.74,9.65Z" />
                <path d="M9.64,10.4a2.29,2.29,0,0,0-2.49.93,10,10,0,0,0-1.9,4.95c0,1-.15,2,.84,2.65A1.38,1.38,0,0,0,7.3,19a1.9,1.9,0,0,0,.52-1.72c-.18-1.52.43-3,1.27-4.34a.39.39,0,0,0-.19-.59A.25.25,0,0,0,9.64,10.4Z" />
                <path d="M11.65,10.58a.45.45,0,0,0-.52.29.44.44,0,0,0,.25.55,1.15,1.15,0,0,1,.61,1,5.42,5.42,0,0,1-.22,2.15c-.15.44-.34.89-.14,1.36.38.93,1.82.74,2.06-.19a10,10,0,0,0,.08-3.31A2.43,2.43,0,0,0,11.65,10.58Z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-secondary-800">Left Foot</h3>
            </div>
          </div>
          
          {footSide === 'left' && (
            <div className="absolute top-2 right-2">
              <svg className="h-5 w-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Right Foot */}
        <div
          className={`relative border rounded-lg p-4 cursor-pointer transition-colors ${
            footSide === 'right'
              ? 'border-primary-500 bg-primary-50'
              : 'border-secondary-300 hover:border-primary-300'
          }`}
          onClick={() => setFootSide('right')}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-10 w-10 text-primary-600" fill="currentColor" viewBox="0 0 24 24" style={{ transform: 'scaleX(-1)' }}>
                <path d="M15.74,9.65a3.81,3.81,0,0,0-1.18-1.56,5.64,5.64,0,0,0-5.73-.41,5.06,5.06,0,0,0-1.69,1.5.29.29,0,0,0-.6.28.27.27,0,0,0,.4.11c.25.11.58-.31.88-.55a4.08,4.08,0,0,1,5.95.9A14.89,14.89,0,0,1,16,13.84a1,1,0,0,0,.8.65,1.13,1.13,0,0,0,.93-.29,2.88,2.88,0,0,0,.82-1.8A4.56,4.56,0,0,0,15.74,9.65Z" />
                <path d="M9.64,10.4a2.29,2.29,0,0,0-2.49.93,10,10,0,0,0-1.9,4.95c0,1-.15,2,.84,2.65A1.38,1.38,0,0,0,7.3,19a1.9,1.9,0,0,0,.52-1.72c-.18-1.52.43-3,1.27-4.34a.39.39,0,0,0-.19-.59A.25.25,0,0,0,9.64,10.4Z" />
                <path d="M11.65,10.58a.45.45,0,0,0-.52.29.44.44,0,0,0,.25.55,1.15,1.15,0,0,1,.61,1,5.42,5.42,0,0,1-.22,2.15c-.15.44-.34.89-.14,1.36.38.93,1.82.74,2.06-.19a10,10,0,0,0,.08-3.31A2.43,2.43,0,0,0,11.65,10.58Z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-secondary-800">Right Foot</h3>
            </div>
          </div>
          
          {footSide === 'right' && (
            <div className="absolute top-2 right-2">
              <svg className="h-5 w-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FootSelector; 