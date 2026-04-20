import React from 'react';
import { logoData } from '../logoData';

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src={logoData} 
        alt="Viện Tâm Lý SunnyCare Logo" 
        className="h-20 md:h-24 object-contain drop-shadow-md"
      />
    </div>
  );
}
