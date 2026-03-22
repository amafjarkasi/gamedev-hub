import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { getEmbedUrl, sanitizeUrl } from '../utils/videoUtils';
import styles from './VideoEmbed.module.css';

export default function VideoEmbed({ url, title }) {
  const embedUrl = getEmbedUrl(url);
  const safeUrl = sanitizeUrl(url);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setLoading(false);
    setHasError(true);
  }, []);

  if (!embedUrl) {
    return (
      <div className={styles.embedWrapper}>
        <div className={styles.fallback}>
          <span className={styles.fallbackIcon}>&#x1F3AC;</span>
          <p>Video preview unavailable</p>
          <a
            href={safeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.fallbackLink}
          >
            Watch on External Site
          </a>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={styles.embedWrapper}>
        <div className={styles.fallback}>
          <span className={styles.fallbackIcon}>&#x26A0;</span>
          <p className={styles.errorTitle}>Video Unavailable</p>
          <p className={styles.errorHint}>
            This video may have been removed or is temporarily inaccessible.
          </p>
          <a
            href={safeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.fallbackLink}
          >
            Try on {url.includes('vimeo') ? 'Vimeo' : 'YouTube'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.embedWrapper}>
      {loading && (
        <div className={styles.loader}>
          <div className={styles.spinner} />
          <p>Loading video...</p>
        </div>
      )}
      <iframe
        className={styles.iframe}
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}

VideoEmbed.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string,
};
