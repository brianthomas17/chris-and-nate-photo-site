
import React from 'react';

interface SectionSeparatorProps {
  className?: string;
}

export default function SectionSeparator({ className = '' }: SectionSeparatorProps) {
  return (
    <div className={`flex justify-center my-8 md:my-12 ${className}`}>
      <img 
        src="/separator_sections.svg" 
        alt="" 
        className="w-48 md:w-64 mx-20 max-w-[500px]"
        aria-hidden="true"
      />
    </div>
  );
}
