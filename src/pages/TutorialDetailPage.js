import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTutorials } from '../hooks/useTutorials';
import { formatDuration, formatViewCount, formatDate } from '../utils/formatUtils';
import VideoEmbed from '../components/VideoEmbed';
import DifficultyBadge from '../components/DifficultyBadge';
import StarDisplay from '../components/StarDisplay';
import RatingWidget from '../components/RatingWidget';
import ReviewSection from '../components/ReviewSection';
import ShareButtons from '../components/ShareButtons';
import styles from './TutorialDetailPage.module.css';

export default function TutorialDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const {
    getTutorialById,
    incrementViewCount,
    addRating,
    getUserRating,
    addReview,
    getReviewsForTutorial,
    toggleBookmark,
    isBookmarked,
  } = useTutorials();

  const tutorial = getTutorialById(id);

  useEffect(() => {
    if (tutorial) {
      incrementViewCount(tutorial.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!tutorial) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <h2 className={styles.notFoundTitle}>Tutorial Not Found</h2>
          <p className={styles.notFoundText}>
            The tutorial you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/search" className={styles.watchBtn}>
            Browse Tutorials
          </Link>
        </div>
      </div>
    );
  }

  const userRating = isAuthenticated ? getUserRating(tutorial.id, currentUser.id) : 0;
  const reviews = getReviewsForTutorial(tutorial.id);
  const bookmarked = isAuthenticated && isBookmarked(currentUser.id, tutorial.id);

  const handleRate = (rating) => {
    if (isAuthenticated) {
      addRating(tutorial.id, currentUser.id, rating);
    }
  };

  const handleReview = (text) => {
    if (isAuthenticated) {
      addReview(tutorial.id, currentUser.id, currentUser.displayName, text);
    }
  };

  const handleBookmark = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggleBookmark(currentUser.id, tutorial.id);
  };

  return (
    <div className={styles.page}>
      <Link to="/search" className={styles.backLink}>
        &larr; Back to Browse
      </Link>

      <div className={styles.videoSection}>
        <VideoEmbed url={tutorial.url} title={tutorial.title} />
      </div>

      <div className={styles.infoSection}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{tutorial.title}</h1>
          <div className={styles.badges}>
            <DifficultyBadge difficulty={tutorial.difficulty} />
            <span className={styles.platformTag}>{tutorial.platform}</span>
          </div>
        </div>

        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            By <strong>{tutorial.author.name}</strong>
          </span>
          <span className={styles.metaItem}>
            {formatDuration(tutorial.estimatedDuration)}
          </span>
          <span className={styles.metaItem}>
            {formatViewCount(tutorial.viewCount)} views
          </span>
          <span className={styles.metaItem}>
            {formatDate(tutorial.createdAt)}
          </span>
          <StarDisplay
            rating={tutorial.averageRating}
            count={tutorial.ratingCount}
          />
        </div>

        <p className={styles.description}>{tutorial.description}</p>

        <div className={styles.tags}>
          {tutorial.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        <div className={styles.actionsRow}>
          <button
            className={`${styles.bookmarkBtn} ${bookmarked ? styles.bookmarked : ''}`}
            onClick={handleBookmark}
          >
            {bookmarked ? '\u2605 Bookmarked' : '\u2606 Bookmark'}
          </button>
          <a
            href={tutorial.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.watchBtn}
          >
            Watch on {tutorial.url.includes('youtube') ? 'YouTube' : 'External Site'}
          </a>
          <ShareButtons title={tutorial.title} url={tutorial.url} />
        </div>

        <div className={styles.ratingSection}>
          <h3 className={styles.ratingTitle}>Rate This Tutorial</h3>
          <RatingWidget
            currentRating={userRating}
            onRate={handleRate}
            isAuthenticated={isAuthenticated}
          />
        </div>

        <div className={styles.reviewsSection}>
          <ReviewSection
            reviews={reviews}
            isAuthenticated={isAuthenticated}
            currentUser={currentUser}
            onSubmitReview={handleReview}
          />
        </div>
      </div>
    </div>
  );
}
