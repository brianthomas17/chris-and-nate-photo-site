
import React from 'react';

interface SectionSeparatorProps {
  className?: string;
}

export default function SectionSeparator({ className = '' }: SectionSeparatorProps) {
  return (
    <div className={`flex justify-center my-8 md:my-12 ${className}`}>
      <img 
        src="/lovable-uploads/separator.svg" 
        alt="" 
        className="w-48 md:w-64 mx-20"
        aria-hidden="true"
      />
    </div>
  );
}
