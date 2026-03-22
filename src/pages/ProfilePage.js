import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTutorials } from '../hooks/useTutorials';
import { formatDate } from '../utils/formatUtils';
import TutorialGallery from '../components/TutorialGallery';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { currentUser, isAuthenticated } = useAuth();
  const { getUserBookmarks, getUserSubmissions } = useTutorials();
  const [activeTab, setActiveTab] = useState('bookmarks');

  if (!isAuthenticated) {
    return (
      <div className={styles.page}>
        <p className={styles.loginPrompt}>
          <Link to="/login">Log in</Link> to view your profile
        </p>
      </div>
    );
  }

  const bookmarks = getUserBookmarks(currentUser.id);
  const submissions = getUserSubmissions(currentUser.id);

  return (
    <div className={styles.page}>
      <div className={styles.profileHeader}>
        <div className={styles.avatar}>
          {currentUser.displayName.charAt(0).toUpperCase()}
        </div>
        <div className={styles.userInfo}>
          <h1>{currentUser.displayName}</h1>
          <p className={styles.userMeta}>
            @{currentUser.username} &middot; Joined{' '}
            {formatDate(currentUser.createdAt)}
          </p>
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'bookmarks' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('bookmarks')}
        >
          Bookmarks ({bookmarks.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'submissions' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('submissions')}
        >
          My Submissions ({submissions.length})
        </button>
      </div>

      {activeTab === 'bookmarks' && (
        <TutorialGallery
          tutorials={bookmarks}
          emptyTitle="No bookmarks yet"
          emptyMessage="Browse tutorials and bookmark your favorites to find them here."
          icon="&#x2606;"
        />
      )}

      {activeTab === 'submissions' && (
        <TutorialGallery
          tutorials={submissions}
          emptyTitle="No submissions yet"
          emptyMessage="Share a great tutorial with the community!"
        />
      )}
    </div>
  );
}
