import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTutorials } from '../hooks/useTutorials';
import { CATEGORIES } from '../data/constants';
import TutorialGallery from '../components/TutorialGallery';
import styles from './CategoryPage.module.css';

export default function CategoryPage() {
  const { slug } = useParams();
  const { getTutorialsByCategory } = useTutorials();

  const category = CATEGORIES.find((c) => c.value === slug);
  const tutorials = getTutorialsByCategory(slug);

  if (!category) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Category Not Found</h1>
        <p>
          <Link to="/">Go back home</Link>
        </p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link to="/" className={styles.backLink}>
          &larr; Back to Home
        </Link>
        <div className={styles.titleRow}>
          <span className={styles.icon}>{category.icon}</span>
          <h1 className={styles.title}>{category.label}</h1>
        </div>
        <p className={styles.subtitle}>
          {tutorials.length} tutorial{tutorials.length !== 1 ? 's' : ''} in this
          category
        </p>
      </div>

      <TutorialGallery
        tutorials={tutorials}
        emptyTitle="No tutorials yet"
        emptyMessage={`No tutorials found in ${category.label}. Be the first to submit one!`}
      />
    </div>
  );
}
