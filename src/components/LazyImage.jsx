import React, { useState, useEffect, useRef } from 'react';
import SkeletonLoader from './SkeletonLoader';
import styles from './LazyImage.module.css';

export default function LazyImage({ 
  src, 
  alt, 
  className, 
  width, 
  height,
  placeholderVariant = 'thumbnail'
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    // Check if IntersectionObserver is supported
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start loading the image
            const img = imgRef.current;
            if (img && img.dataset.src) {
              img.src = img.dataset.src;
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '50px 0px' } // Start loading 50px before element is visible
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };

  return (
    <div className={`${styles.imageContainer} ${className}`} style={{ width, height }}>
      {!isLoaded && <SkeletonLoader variant={placeholderVariant} width={width} height={height} />}
      
      <img
        ref={imgRef}
        data-src={src}
        alt={alt}
        className={`${styles.lazyImage} ${isLoaded ? styles.loaded : ''}`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
      
      {error && (
        <div className={styles.errorPlaceholder}>
          <span>&#x26A0;</span>
        </div>
      )}
    </div>
  );
}
