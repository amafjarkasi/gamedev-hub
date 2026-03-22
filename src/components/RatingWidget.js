import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './RatingWidget.module.css';

export default function RatingWidget({ currentRating = 0, onRate, isAuthenticated }) {
  const [hover, setHover] = useState(0);

  if (!isAuthenticated) {
    return (
      <p className={styles.loginPrompt}>
        <Link to="/login">Log in</Link> to rate this tutorial
      </p>
    );
  }

  return (
    <div className={styles.ratingWidget}>
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`${styles.star} ${
              star <= (hover || currentRating) ? styles.starFilled : ''
            }`}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onRate(star)}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            &#9733;
          </button>
        ))}
      </div>
      {currentRating > 0 && (
        <span className={styles.ratingLabel}>Your rating: {currentRating}/5</span>
      )}
    </div>
  );
}
