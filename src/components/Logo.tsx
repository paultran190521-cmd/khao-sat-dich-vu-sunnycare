import React from 'react';

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src="/logo.png" 
        alt="Viện Tâm Lý SunnyCare Logo" 
        className="h-20 md:h-24 object-contain drop-shadow-md"
      />
    </div>
  );
}
