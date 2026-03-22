import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTutorials } from '../hooks/useTutorials';
import { useToast } from '../hooks/useToast';
import { formatDate } from '../utils/formatUtils';
import { isValidVideoUrl, getThumbnailUrl, extractVideoId } from '../utils/videoUtils';
import { CATEGORIES, DIFFICULTIES, PLATFORMS } from '../data/constants';
import TutorialGallery from '../components/TutorialGallery';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { currentUser, isAuthenticated } = useAuth();
  const { getUserBookmarks, getUserSubmissions, editSubmission, deleteSubmission } = useTutorials();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('bookmarks');
  const [deletingTutorial, setDeletingTutorial] = useState(null);
  const [editingTutorial, setEditingTutorial] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    if (editingTutorial) {
      setEditForm({
        title: editingTutorial.title,
        description: editingTutorial.description,
        url: editingTutorial.url,
        category: editingTutorial.category,
        difficulty: editingTutorial.difficulty,
        platform: editingTutorial.platform,
        tags: (editingTutorial.tags || []).join(', '),
        estimatedDuration: String(editingTutorial.estimatedDuration || ''),
      });
      setEditError('');
    } else {
      setEditForm(null);
    }
  }, [editingTutorial]);

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

  const handleDelete = () => {
    if (!deletingTutorial) return;
    deleteSubmission(deletingTutorial.id, currentUser.id);
    addToast('Tutorial deleted', 'success');
    setDeletingTutorial(null);
  };

  const handleEditChange = (field) => (e) => {
    setEditForm((prev) => ({ ...prev, [field]: e.target.value }));
    setEditError('');
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editForm || !editingTutorial) return;

    if (editForm.title.trim().length < 5 || editForm.title.trim().length > 100) {
      setEditError('Title must be 5-100 characters');
      return;
    }
    if (editForm.description.trim().length < 20 || editForm.description.trim().length > 500) {
      setEditError('Description must be 20-500 characters');
      return;
    }
    if (!isValidVideoUrl(editForm.url.trim())) {
      setEditError('Please enter a valid YouTube or Vimeo URL');
      return;
    }
    if (!editForm.category) {
      setEditError('Please select a category');
      return;
    }
    if (!editForm.difficulty) {
      setEditError('Please select a difficulty level');
      return;
    }
    if (!editForm.platform) {
      setEditError('Please select a platform');
      return;
    }
    const duration = parseInt(editForm.estimatedDuration, 10);
    if (!duration || duration < 1 || duration > 600) {
      setEditError('Duration must be between 1 and 600 minutes');
      return;
    }

    const tags = editForm.tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0)
      .slice(0, 5);

    const videoInfo = extractVideoId(editForm.url.trim());
    const thumbnailUrl = getThumbnailUrl(editForm.url.trim());

    editSubmission(
      editingTutorial.id,
      {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        url: editForm.url.trim(),
        videoId: videoInfo?.videoId || '',
        thumbnailUrl: thumbnailUrl || '',
        category: editForm.category,
        difficulty: editForm.difficulty,
        platform: editForm.platform,
        tags,
        estimatedDuration: duration,
      },
      currentUser.id
    );
    addToast('Tutorial updated', 'success');
    setEditingTutorial(null);
  };

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
          pageSize={12}
          emptyTitle="No bookmarks yet"
          emptyMessage="Browse tutorials and bookmark your favorites to find them here."
        />
      )}

      {activeTab === 'submissions' && (
        <>
          {submissions.length > 0 ? (
            <div className={styles.submissionGrid}>
              {submissions.map((tutorial) => (
                <div key={tutorial.id} className={styles.submissionCard}>
                  <h3 className={styles.submissionTitle}>{tutorial.title}</h3>
                  <p className={styles.submissionDesc}>{tutorial.description}</p>
                  <p className={styles.submissionMeta}>
                    {CATEGORIES.find((c) => c.value === tutorial.category)?.label || tutorial.category}
                    {' \u00B7 '}
                    {tutorial.difficulty}
                    {' \u00B7 '}
                    {tutorial.platform}
                  </p>
                  <div className={styles.submissionActions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => setEditingTutorial(tutorial)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => setDeletingTutorial(tutorial)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No submissions yet"
              message="Share a great tutorial with the community!"
            />
          )}
        </>
      )}

      {deletingTutorial && (
        <Modal title="Delete Tutorial" onClose={() => setDeletingTutorial(null)}>
          <p className={styles.confirmText}>
            Are you sure you want to delete &ldquo;{deletingTutorial.title}&rdquo;? This cannot be undone.
          </p>
          <div className={styles.modalActions}>
            <button className={styles.cancelBtn} onClick={() => setDeletingTutorial(null)}>
              Cancel
            </button>
            <button className={styles.confirmDeleteBtn} onClick={handleDelete}>
              Delete
            </button>
          </div>
        </Modal>
      )}

      {editingTutorial && editForm && (
        <Modal title="Edit Tutorial" onClose={() => setEditingTutorial(null)}>
          {editError && <div className={styles.editError}>{editError}</div>}
          <form className={styles.editForm} onSubmit={handleEditSubmit}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Title</label>
              <input
                type="text"
                className={styles.fieldInput}
                value={editForm.title}
                onChange={handleEditChange('title')}
                maxLength={100}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Video URL</label>
              <input
                type="url"
                className={styles.fieldInput}
                value={editForm.url}
                onChange={handleEditChange('url')}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Description</label>
              <textarea
                className={styles.fieldTextarea}
                value={editForm.description}
                onChange={handleEditChange('description')}
                maxLength={500}
              />
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Category</label>
                <select className={styles.fieldSelect} value={editForm.category} onChange={handleEditChange('category')}>
                  <option value="">Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Difficulty</label>
                <select className={styles.fieldSelect} value={editForm.difficulty} onChange={handleEditChange('difficulty')}>
                  <option value="">Select level</option>
                  {DIFFICULTIES.map((diff) => (
                    <option key={diff.value} value={diff.value}>{diff.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Platform</label>
                <select className={styles.fieldSelect} value={editForm.platform} onChange={handleEditChange('platform')}>
                  <option value="">Select platform</option>
                  {PLATFORMS.map((plat) => (
                    <option key={plat.value} value={plat.value}>{plat.label}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Duration (min)</label>
                <input
                  type="number"
                  className={styles.fieldInput}
                  value={editForm.estimatedDuration}
                  onChange={handleEditChange('estimatedDuration')}
                  min={1}
                  max={600}
                />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Tags</label>
              <input
                type="text"
                className={styles.fieldInput}
                value={editForm.tags}
                onChange={handleEditChange('tags')}
                placeholder="comma-separated, max 5"
              />
            </div>
            <div className={styles.modalActions}>
              <button type="button" className={styles.cancelBtn} onClick={() => setEditingTutorial(null)}>
                Cancel
              </button>
              <button type="submit" className={styles.saveBtn}>
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
