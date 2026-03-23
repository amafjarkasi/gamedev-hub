import React, { useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTutorials } from '../hooks/useTutorials';
import { useToast } from '../hooks/useToast';
import { formatDuration, formatViewCount, formatDate } from '../utils/formatUtils';
import { sanitizeUrl } from '../utils/videoUtils';
import { SERIES } from '../data/constants';
import VideoEmbed from '../components/VideoEmbed';
import TutorialGallery from '../components/TutorialGallery';
import DifficultyBadge from '../components/DifficultyBadge';
import StarDisplay from '../components/StarDisplay';
import RatingWidget from '../components/RatingWidget';
import ReviewSection from '../components/ReviewSection';
import ShareButtons from '../components/ShareButtons';
import FreshnessBadge from '../components/FreshnessBadge';
import FreshnessVoter from '../components/FreshnessVoter';
import FollowableTag from '../components/FollowableTag';
import PrerequisiteSection from '../components/PrerequisiteSection';
import styles from './TutorialDetailPage.module.css';

export default function TutorialDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const {
    getTutorialById,
    allTutorials,
    incrementViewCount,
    addRating,
    getUserRating,
    addReview,
    getReviewsForTutorial,
    toggleBookmark,
    isBookmarked,
    toggleCompleted,
    isCompleted,
    voteFreshness,
    getFreshnessStatus,
    getUserFreshnessVote,
    followTag,
    unfollowTag,
    isTagFollowed,
  } = useTutorials();
  const { addToast } = useToast();

  const tutorial = getTutorialById(id);

  const relatedTutorials = useMemo(() => {
    if (!tutorial) return [];
    return allTutorials
      .filter((t) => t.category === tutorial.category && t.id !== tutorial.id)
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 4);
  }, [allTutorials, tutorial]);

  const prerequisiteTutorials = useMemo(() => {
    if (!tutorial || !tutorial.prerequisites) return [];
    return tutorial.prerequisites.map(prereqId => getTutorialById(prereqId)).filter(Boolean);
  }, [tutorial, getTutorialById]);

  const seriesInfo = useMemo(() => {
    if (!tutorial || !tutorial.seriesId) return null;
    const seriesTutorials = allTutorials.filter(t => t.seriesId === tutorial.seriesId)
      .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));
    
    const currentIndex = seriesTutorials.findIndex(t => t.id === tutorial.id);
    const prev = currentIndex > 0 ? seriesTutorials[currentIndex - 1] : null;
    const next = currentIndex < seriesTutorials.length - 1 ? seriesTutorials[currentIndex + 1] : null;
    
    return {
      seriesData: SERIES.find(s => s.id === tutorial.seriesId),
      total: seriesTutorials.length,
      current: tutorial.seriesOrder || 1,
      prev,
      next
    };
  }, [tutorial, allTutorials]);

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
  const completed = isAuthenticated && isCompleted(currentUser.id, tutorial.id);
  
  const freshnessStatus = getFreshnessStatus(tutorial.id);
  const userFreshnessVote = isAuthenticated ? getUserFreshnessVote(tutorial.id, currentUser.id) : null;

  const handleRate = (rating) => {
    if (isAuthenticated) {
      addRating(tutorial.id, currentUser.id, rating);
      addToast('Rating saved', 'success');
    }
  };

  const handleReview = (text) => {
    if (isAuthenticated) {
      addReview(tutorial.id, currentUser.id, currentUser.displayName, text);
      addToast('Review posted', 'success');
    }
  };

  const handleBookmark = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggleBookmark(currentUser.id, tutorial.id);
    addToast(bookmarked ? 'Bookmark removed' : 'Bookmark added', 'success');
  };

  const handleCompleted = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggleCompleted(currentUser.id, tutorial.id);
    addToast(completed ? 'Marked as uncompleted' : 'Marked as completed', 'success');
  };

  const handleFreshnessVote = (type) => {
    voteFreshness(tutorial.id, currentUser.id, type);
    addToast('Thanks for your feedback!', 'success');
  };

  const handleTagToggle = (tag) => {
    if (isTagFollowed(currentUser.id, tag)) {
      unfollowTag(currentUser.id, tag);
      addToast(`Unfollowed #${tag}`, 'info');
    } else {
      followTag(currentUser.id, tag);
      addToast(`Followed #${tag}`, 'success');
    }
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
        {seriesInfo && seriesInfo.seriesData && (
          <div className={styles.seriesNav}>
            <span className={styles.seriesTitle}>
              <strong>Series: {seriesInfo.seriesData.title}</strong> (Part {seriesInfo.current} of {seriesInfo.total})
            </span>
            <div className={styles.seriesLinks}>
              {seriesInfo.prev ? (
                <Link to={`/tutorial/${seriesInfo.prev.id}`} className={styles.seriesPrev}>
                  &laquo; Previous
                </Link>
              ) : <span className={styles.seriesPrevDisabled}>&laquo; Previous</span>}
              {seriesInfo.next ? (
                <Link to={`/tutorial/${seriesInfo.next.id}`} className={styles.seriesNext}>
                  Next &raquo;
                </Link>
              ) : <span className={styles.seriesNextDisabled}>Next &raquo;</span>}
            </div>
          </div>
        )}

        <div className={styles.titleRow}>
          <h1 className={styles.title}>{tutorial.title}</h1>
          <div className={styles.badges}>
            <DifficultyBadge difficulty={tutorial.difficulty} />
            <span className={styles.platformTag}>{tutorial.platform}</span>
            {tutorial.engineVersion && (
              <span className={styles.versionTag}>{tutorial.engineVersion}</span>
            )}
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
          <FreshnessBadge consensus={freshnessStatus.consensus} />
        </div>

        <PrerequisiteSection prerequisites={prerequisiteTutorials} />

        <p className={styles.description}>{tutorial.description}</p>

        <div className={styles.tags}>
          {tutorial.tags.map((tag) => (
            <FollowableTag 
              key={tag} 
              tag={tag} 
              isFollowed={isAuthenticated ? isTagFollowed(currentUser.id, tag) : false}
              onToggle={handleTagToggle}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>

        <div className={styles.actionsRow}>
          <button
            className={`${styles.completedBtn} ${completed ? styles.completedActive : ''}`}
            onClick={handleCompleted}
          >
            {completed ? '\u2713 Completed' : 'Mark as Completed'}
          </button>
          <button
            className={`${styles.bookmarkBtn} ${bookmarked ? styles.bookmarked : ''}`}
            onClick={handleBookmark}
          >
            {bookmarked ? '\u2605 Bookmarked' : '\u2606 Bookmark'}
          </button>
          <a
            href={sanitizeUrl(tutorial.url)}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.watchBtn}
          >
            Watch on {tutorial.url.includes('youtube') ? 'YouTube' : 'External Site'}
          </a>
          <ShareButtons title={tutorial.title} url={tutorial.url} />
        </div>

        <FreshnessVoter 
          status={freshnessStatus} 
          userVote={userFreshnessVote} 
          onVote={handleFreshnessVote} 
          isAuthenticated={isAuthenticated} 
        />

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

        {relatedTutorials.length > 0 && (
          <div className={styles.relatedSection}>
            <TutorialGallery
              tutorials={relatedTutorials}
              title="Related Tutorials"
            />
          </div>
        )}
      </div>
    </div>
  );
}