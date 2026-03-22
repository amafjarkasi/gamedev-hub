import React from 'react';
import { Link } from 'react-router-dom';
import TutorialCard from './TutorialCard';
import EmptyState from './EmptyState';
import styles from './TutorialGallery.module.css';

export default function TutorialGallery({
  tutorials,
  title,
  subtitle,
  viewAllLink,
  showCount = false,
  emptyTitle = 'No tutorials found',
  emptyMessage = 'Try adjusting your search or filters.',
  onClearFilters,
}) {
  return (
    <section className={styles.gallery}>
      {(title || viewAllLink) && (
        <div className={styles.header}>
          <div>
            {title && <h2 className={styles.sectionTitle}>{title}</h2>}
            {subtitle && <p className={styles.sectionSubtitle}>{subtitle}</p>}
          </div>
          {viewAllLink && (
            <Link to={viewAllLink} className={styles.viewAll}>
              View All &rarr;
            </Link>
          )}
        </div>
      )}

      {showCount && tutorials.length > 0 && (
        <p className={styles.resultCount}>
          {tutorials.length} tutorial{tutorials.length !== 1 ? 's' : ''} found
        </p>
      )}

      {tutorials.length > 0 ? (
        <div className={styles.grid}>
          {tutorials.map((tutorial) => (
            <TutorialCard key={tutorial.id} tutorial={tutorial} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={emptyTitle}
          message={emptyMessage}
          actionLabel={onClearFilters ? 'Clear Filters' : undefined}
          onAction={onClearFilters}
        />
      )}
    </section>
  );
}
