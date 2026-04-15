import React from 'react';

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src="https://i.postimg.cc/3w4B7BXS/LOGO-SUNNYCARE.png" 
        alt="SunnyCare Logo" 
        className="h-20 md:h-24 object-contain drop-shadow-md"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
