// components/LoadingModal.js
import React from 'react';

const LoadingModal = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 rounded shadow-lg">
        <div className="flex items-center justify-center mb-4">
          <div className="animate-spin mr-2 h-6 w-6 text-indigo-500">
            Loading...
          </div>
        </div>
        <p className="text-sm text-gray-500">Please wait...</p>
      </div>
    </div>
  );
};

export default LoadingModal;
