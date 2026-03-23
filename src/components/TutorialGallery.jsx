import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import TutorialCard from './TutorialCard';
import { tutorialShape } from '../utils/propTypeShapes';
import EmptyState from './EmptyState';
import styles from './TutorialGallery.module.css';

function getPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = [1];
  if (current > 3) pages.push('...');
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
}

export default function TutorialGallery({
  tutorials,
  title,
  subtitle,
  viewAllLink,
  showCount = false,
  emptyTitle = 'No tutorials found',
  emptyMessage = 'Try adjusting your search or filters.',
  onClearFilters,
  pageSize,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [tutorials]);

  const paginate = pageSize && tutorials.length > pageSize;
  const totalPages = paginate ? Math.ceil(tutorials.length / pageSize) : 1;
  const displayTutorials = paginate
    ? tutorials.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : tutorials;

  const startIdx = paginate ? (currentPage - 1) * pageSize + 1 : 1;
  const endIdx = paginate ? Math.min(currentPage * pageSize, tutorials.length) : tutorials.length;

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
          {paginate
            ? `Showing ${startIdx}\u2013${endIdx} of ${tutorials.length} tutorials`
            : `${tutorials.length} tutorial${tutorials.length !== 1 ? 's' : ''} found`}
        </p>
      )}

      {displayTutorials.length > 0 ? (
        <div className={styles.grid}>
          {displayTutorials.map((tutorial) => (
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

      {paginate && totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>
          {getPageNumbers(currentPage, totalPages).map((page, i) =>
            page === '...' ? (
              <span key={`ellipsis-${i}`} className={styles.ellipsis}>
                &hellip;
              </span>
            ) : (
              <button
                key={page}
                className={`${styles.pageBtn} ${
                  page === currentPage ? styles.pageBtnActive : ''
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            )
          )}
          <button
            className={styles.pageBtn}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}

TutorialGallery.propTypes = {
  tutorials: PropTypes.arrayOf(tutorialShape).isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  viewAllLink: PropTypes.string,
  showCount: PropTypes.bool,
  emptyTitle: PropTypes.string,
  emptyMessage: PropTypes.string,
  onClearFilters: PropTypes.func,
  pageSize: PropTypes.number,
};
