import React from 'react';
import { CATEGORIES } from '../data/constants';
import styles from './CategoryIcon.module.css';

export default function CategoryIcon({ category, showLabel = true }) {
  const cat = CATEGORIES.find((c) => c.value === category);
  if (!cat) return null;

  return (
    <span className={styles.categoryIcon}>
      <span className={styles.icon}>{cat.icon}</span>
      {showLabel && <span className={styles.label}>{cat.label}</span>}
    </span>
  );
}
