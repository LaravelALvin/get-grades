import React from 'react';

const LoadingModal = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-gray-700 p-6 rounded-lg text-white text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="animate-spin mr-2 h-12 w-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" fill="#F3F4F6" stroke="#6B7280" strokeWidth="3">
                <animate
                  attributeName="fill"
                  values="#F3F4F6; #93C5FD; #FBBF24; #34D399; #F87171; #F3F4F6"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </div>
        </div>
        <p className="text-sm animate-pulse">
          Searching
        </p>
      </div>
    </div>
  );
};

export default LoadingModal;
