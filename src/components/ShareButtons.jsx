import React from 'react';
import PropTypes from 'prop-types';
import { useToast } from '../hooks/useToast';
import styles from './ShareButtons.module.css';

export default function ShareButtons({ title, url }) {
  const { addToast } = useToast();

  const shareUrl = url || window.location.href;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      addToast('Link copied to clipboard', 'info');
    } catch {
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      addToast('Link copied to clipboard', 'info');
    }
  };

  return (
    <div className={styles.shareButtons}>
      <span className={styles.shareLabel}>Share:</span>
      <button
        className={styles.shareBtn}
        onClick={handleCopyLink}
        aria-label="Copy link to clipboard"
      >
        🔗 Copy
      </button>
      <a
        className={`${styles.shareBtn} ${styles.twitter}`}
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Twitter"
      >
        🐦 Twitter
      </a>
      <a
        className={`${styles.shareBtn} ${styles.discord}`}
        href={`https://discordapp.com/channels/@me?message=${encodedUrl}%0A${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Discord"
      >
        💬 Discord
      </a>
      <a
        className={`${styles.shareBtn} ${styles.reddit}`}
        href={`https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Reddit"
      >
        🤓 Reddit
      </a>
    </div>
  );
}

ShareButtons.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string,
};
