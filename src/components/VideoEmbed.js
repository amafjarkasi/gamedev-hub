import React from 'react';
import { getEmbedUrl } from '../utils/videoUtils';
import styles from './VideoEmbed.module.css';

export default function VideoEmbed({ url, title }) {
  const embedUrl = getEmbedUrl(url);

  if (!embedUrl) {
    return (
      <div className={styles.embedWrapper}>
        <div className={styles.fallback}>
          <span className={styles.fallbackIcon}>&#x1F3AC;</span>
          <p>Video preview unavailable</p>
          <a
            href={url}
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

  return (
    <div className={styles.embedWrapper}>
      <iframe
        className={styles.iframe}
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
