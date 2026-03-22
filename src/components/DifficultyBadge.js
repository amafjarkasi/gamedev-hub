import React from 'react';
import styles from './DifficultyBadge.module.css';

export default function DifficultyBadge({ difficulty }) {
  const classMap = {
    Beginner: styles.beginner,
    Intermediate: styles.intermediate,
    Advanced: styles.advanced,
  };

  return (
    <span className={`${styles.badge} ${classMap[difficulty] || ''}`}>
      {difficulty}
    </span>
  );
}
