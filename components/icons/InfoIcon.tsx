
import React from 'react';

export const InfoIcon: React.FC<{ tooltip: string }> = ({ tooltip }) => (
  <div className="relative flex items-center group ml-1">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
    <div className="absolute bottom-full mb-2 w-48 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 border border-gray-600">
      {tooltip}
    </div>
  </div>
);
