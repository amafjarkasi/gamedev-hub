import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatUtils';
import styles from './ReviewSection.module.css';

export default function ReviewSection({
  reviews,
  isAuthenticated,
  currentUser,
  onSubmitReview,
}) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim().length < 10) return;
    onSubmitReview(text.trim());
    setText('');
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>
        Reviews
        <span className={styles.reviewCount}>({reviews.length})</span>
      </h3>

      {isAuthenticated ? (
        <form className={styles.form} onSubmit={handleSubmit}>
          <textarea
            className={styles.textarea}
            placeholder="Share your thoughts about this tutorial... (min 10 characters)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={1000}
          />
          <button
            className={styles.submitBtn}
            type="submit"
            disabled={text.trim().length < 10}
          >
            Post Review
          </button>
        </form>
      ) : (
        <p className={styles.loginPrompt}>
          <Link to="/login">Log in</Link> to leave a review
        </p>
      )}

      <div className={styles.reviewList}>
        {reviews.length === 0 ? (
          <p className={styles.noReviews}>
            No reviews yet. Be the first to share your thoughts!
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className={styles.review}>
              <div className={styles.reviewHeader}>
                <span className={styles.reviewAuthor}>{review.username}</span>
                <span className={styles.reviewDate}>
                  {formatDate(review.createdAt)}
                </span>
              </div>
              <p className={styles.reviewText}>{review.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
