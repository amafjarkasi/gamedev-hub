import React from 'react';
import PropTypes from 'prop-types';
import styles from './FollowableTag.module.css';

export default function FollowableTag({ tag, isFollowed, onToggle, isAuthenticated }) {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated) {
      onToggle(tag);
    }
  };

  return (
    <button
      className={`${styles.tag} ${isFollowed ? styles.followed : ''} ${!isAuthenticated ? styles.disabled : ''}`}
      onClick={handleClick}
      title={isAuthenticated ? (isFollowed ? 'Unfollow tag' : 'Follow tag') : 'Log in to follow tags'}
      type="button"
    >
      <span className={styles.label}>{tag}</span>
      {isAuthenticated && (
        <span className={styles.icon}>{isFollowed ? '−' : '+'}</span>
      )}
    </button>
  );
}

FollowableTag.propTypes = {
  tag: PropTypes.string.isRequired,
  isFollowed: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};