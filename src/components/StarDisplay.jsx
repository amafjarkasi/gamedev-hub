import React from 'react';
import PropTypes from 'prop-types';
import styles from './StarDisplay.module.css';

export default function StarDisplay({ rating, count, compact = false }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <span key={i} className={`${styles.star} ${styles.starFilled}`}>
          &#9733;
        </span>
      );
    } else if (i === fullStars + 1 && hasHalf) {
      stars.push(
        <span key={i} className={`${styles.star} ${styles.starFilled}`}>
          &#9733;
        </span>
      );
    } else {
      stars.push(
        <span key={i} className={styles.star}>
          &#9733;
        </span>
      );
    }
  }

  return (
    <div className={`${styles.stars} ${compact ? styles.compact : ''}`}>
      {stars}
      {typeof count !== 'undefined' && (
        <span className={styles.ratingText}>
          {rating.toFixed(1)}{count > 0 && ` (${count})`}
        </span>
      )}
    </div>
  );
}

StarDisplay.propTypes = {
  rating: PropTypes.number.isRequired,
  count: PropTypes.number,
  compact: PropTypes.bool,
};
