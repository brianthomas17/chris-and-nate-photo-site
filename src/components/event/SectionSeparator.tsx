
import React from 'react';

interface SectionSeparatorProps {
  className?: string;
  spacing?: 'default' | 'large' | 'small';
}

export default function SectionSeparator({ 
  className = '',
  spacing = 'default'
}: SectionSeparatorProps) {
  const spacingClasses = {
    small: 'my-8 md:my-10',
    default: 'my-12 md:my-16', 
    large: 'my-16 md:my-20'
  };

  return (
    <div className={`flex justify-center ${spacingClasses[spacing]} ${className}`}>
      <img 
        src="/lovable-uploads/separator.svg" 
        alt="" 
        className="w-48 md:w-64"
        aria-hidden="true"
      />
    </div>
  );
}
