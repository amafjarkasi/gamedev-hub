import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import TutorialCard from './TutorialCard';
import SkeletonLoader from './SkeletonLoader';
import { tutorialShape } from '../utils/propTypeShapes';
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
  pageSize = 12,
}) {
  const [displayedCount, setDisplayedCount] = useState(pageSize);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef(null);

  useEffect(() => {
    // Reset displayed count when tutorials change (e.g., new search/filter)
    setDisplayedCount(pageSize);
  }, [tutorials, pageSize]);

  const loadMore = useCallback(() => {
    if (displayedCount < tutorials.length) {
      setIsLoadingMore(true);
      // Simulate network delay for loading effect
      setTimeout(() => {
        setDisplayedCount(prev => Math.min(prev + pageSize, tutorials.length));
        setIsLoadingMore(false);
      }, 500);
    }
  }, [displayedCount, tutorials.length, pageSize]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && displayedCount < tutorials.length && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore, displayedCount, tutorials.length, isLoadingMore]);

  const displayTutorials = tutorials.slice(0, displayedCount);

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

      {displayTutorials.length > 0 ? (
        <>
          <div className={styles.grid}>
            {displayTutorials.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
            {isLoadingMore && (
              <>
                <SkeletonLoader type="card" count={3} />
              </>
            )}
          </div>
          {displayedCount < tutorials.length && (
            <div ref={observerTarget} className={styles.loadingTrigger}>
              {/* Invisible trigger for intersection observer */}
            </div>
          )}
        </>
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
