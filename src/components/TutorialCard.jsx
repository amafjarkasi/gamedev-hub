import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTutorials } from '../hooks/useTutorials';
import { useToast } from '../hooks/useToast';
import { formatDuration, formatViewCount } from '../utils/formatUtils';
import { tutorialShape } from '../utils/propTypeShapes';
import { SERIES } from '../data/constants';
import DifficultyBadge from './DifficultyBadge';
import StarDisplay from './StarDisplay';
import FreshnessBadge from './FreshnessBadge';
import styles from './TutorialCard.module.css';

export default function TutorialCard({ tutorial }) {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const { toggleBookmark, isBookmarked, isCompleted, getFreshnessStatus } = useTutorials();
  const { addToast } = useToast();
  const [imgError, setImgError] = useState(false);

  const bookmarked = isAuthenticated && isBookmarked(currentUser.id, tutorial.id);
  const completed = isAuthenticated && isCompleted(currentUser.id, tutorial.id);
  const freshnessStatus = getFreshnessStatus(tutorial.id);

  const handleClick = () => {
    navigate(`/tutorial/${tutorial.id}`);
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggleBookmark(currentUser.id, tutorial.id);
    addToast(bookmarked ? 'Bookmark removed' : 'Bookmark added', 'success');
  };

  return (
    <div className={`${styles.card} ${completed ? styles.cardCompleted : ''}`} onClick={handleClick} role="button" tabIndex={0}>
      <div className={styles.thumbnailWrapper}>
        {!imgError ? (
          <img
            className={styles.thumbnail}
            src={tutorial.thumbnailUrl}
            alt={tutorial.title}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className={styles.placeholderThumb}>&#x1F3AC;</div>
        )}
        <span className={styles.duration}>{formatDuration(tutorial.estimatedDuration)}</span>
        <span className={styles.platformBadge}>{tutorial.platform}</span>
        {completed && <span className={styles.completedBadge}>&#10003; Completed</span>}
        <div className={styles.freshnessWrapper}>
          <FreshnessBadge consensus={freshnessStatus.consensus} compact />
        </div>
        <button
          className={`${styles.bookmarkBtn} ${bookmarked ? styles.bookmarked : ''}`}
          onClick={handleBookmark}
          aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}
        >
          {bookmarked ? '\u2605' : '\u2606'}
        </button>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardHeader}>
          <div className={styles.titleGroup}>
            <h3 className={styles.title}>{tutorial.title}</h3>
            {tutorial.engineVersion && (
              <span className={styles.versionBadge}>{tutorial.engineVersion}</span>
            )}
          </div>
          <DifficultyBadge difficulty={tutorial.difficulty} />
        </div>

        {tutorial.seriesId && (
          <div className={styles.seriesBadge}>
            {SERIES.find(s => s.id === tutorial.seriesId)?.title || 'Series'} Part {tutorial.seriesOrder || 1}
          </div>
        )}

        <p className={styles.description}>{tutorial.description}</p>

        <div className={styles.tags}>
          {tutorial.tags.slice(0, 3).map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        <div className={styles.meta}>
          <span className={styles.author}>{tutorial.author.name}</span>
          <div className={styles.stats}>
            <span className={styles.stat}>{formatViewCount(tutorial.viewCount)} views</span>
            <StarDisplay rating={tutorial.averageRating} compact />
          </div>
        </div>
      </div>
    </div>
  );
}

TutorialCard.propTypes = {
  tutorial: tutorialShape.isRequired,
};
