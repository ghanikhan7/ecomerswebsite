import React, { useState } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  category?: string;
}

/**
 * Returns matching verified abaya collection asset based on category name
 */
const getCategoryFallback = (category?: string): string => {
  if (!category) return '/images/collections/everyday-abayas.png';
  const c = category.toLowerCase();
  if (c.includes('kaftan')) return '/images/collections/kaftans.png';
  if (c.includes('khimar')) return '/images/collections/khimars.png';
  if (c.includes('kimono')) return '/images/collections/kimono-abayas.png';
  if (c.includes('front open')) return '/images/collections/front-open-abayas.png';
  if (c.includes('double shrug') || c.includes('shrug')) return '/images/collections/double-shrug-abayas.png';
  if (c.includes('three layer') || c.includes('layer')) return '/images/collections/three-layer-abayas.png';
  if (c.includes('embroider')) return '/images/collections/embroidered-abayas.png';
  if (c.includes('premium')) return '/images/collections/premium-abayas.png';
  return '/images/collections/everyday-abayas.png';
};

/**
 * Robust image component with automatic luxury abaya fallback on load error or empty source
 */
export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = 'Abaya Attire Luxury Modest Fashion',
  fallbackSrc,
  category,
  className,
  onError,
  loading = 'lazy',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const targetFallback = fallbackSrc || getCategoryFallback(category);

  return (
    <img
      src={hasError || !src ? targetFallback : src}
      alt={alt}
      className={className}
      loading={loading}
      onError={(e) => {
        if (!hasError) {
          setHasError(true);
        }
        if (onError) {
          onError(e);
        }
      }}
      {...props}
    />
  );
};
