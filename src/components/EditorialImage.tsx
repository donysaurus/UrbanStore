import React, { useState } from 'react';
import { Shirt } from 'lucide-react';

interface EditorialImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const EditorialImage: React.FC<EditorialImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`w-full h-full bg-studio-gray flex flex-col items-center justify-center p-6 text-center select-none ${className}`}
      >
        <Shirt className="w-8 h-8 text-muted-slate mb-2 stroke-[1.25]" />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-slate">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`w-full h-full object-cover ${className}`}
    />
  );
};
