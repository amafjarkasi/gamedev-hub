import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './RatingWidget.module.css';

export default function RatingWidget({ currentRating = 0, onRate, isAuthenticated }) {
  const [hover, setHover] = useState(0);
  const [focusedStar, setFocusedStar] = useState(0);
  const starRefs = useRef([]);

  if (!isAuthenticated) {
    return (
      <p className={styles.loginPrompt}>
        <Link to="/login">Log in</Link> to rate this tutorial
      </p>
    );
  }

  const handleKeyDown = (star, e) => {
    let nextStar = star;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        nextStar = star >= 5 ? 1 : star + 1;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        nextStar = star <= 1 ? 5 : star - 1;
        break;
      default:
        return;
    }

    setFocusedStar(nextStar);
    starRefs.current[nextStar - 1]?.focus();
  };

  const activeTabStar = focusedStar || currentRating || 1;

  return (
    <div className={styles.ratingWidget}>
      <div
        className={styles.stars}
        role="radiogroup"
        aria-label="Tutorial rating"
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            ref={(el) => { starRefs.current[star - 1] = el; }}
            role="radio"
            aria-checked={star === currentRating}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            tabIndex={star === activeTabStar ? 0 : -1}
            className={`${styles.star} ${
              star <= (hover || currentRating) ? styles.starFilled : ''
            }`}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onFocus={() => setHover(star)}
            onBlur={() => setHover(0)}
            onClick={() => onRate(star)}
            onKeyDown={(e) => handleKeyDown(star, e)}
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

RatingWidget.propTypes = {
  currentRating: PropTypes.number,
  onRate: PropTypes.func,
  isAuthenticated: PropTypes.bool,
};
