import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTutorials } from '../hooks/useTutorials';
import { useToast } from '../hooks/useToast';
import { isValidVideoUrl, getThumbnailUrl, extractVideoId, checkVideoAvailability } from '../utils/videoUtils';
import { CATEGORIES, DIFFICULTIES, PLATFORMS, ENGINE_VERSIONS } from '../data/constants';
import styles from './SubmitPage.module.css';

export default function SubmitPage() {
  const { currentUser, isAuthenticated } = useAuth();
  const { submitTutorial, allTutorials, getTutorialById } = useTutorials();
  const { addToast } = useToast();
  const [error, setError] = useState('');
  const [validating, setValidating] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    url: '',
    category: '',
    difficulty: '',
    platform: '',
    engineVersion: '',
    tags: '',
    estimatedDuration: '',
  });

  const [prereqs, setPrereqs] = useState([]);
  const [prereqInput, setPrereqInput] = useState('');
  const [showPrereqDropdown, setShowPrereqDropdown] = useState(false);
  const prereqRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (prereqRef.current && !prereqRef.current.contains(event.target)) {
        setShowPrereqDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Submit a Tutorial</h1>
        <p className={styles.loginPrompt}>
          You need to <Link to="/login">log in</Link> to submit tutorials.
        </p>
      </div>
    );
  }

  const filteredTutorialsForPrereq = allTutorials.filter((t) => 
    t.title.toLowerCase().includes(prereqInput.toLowerCase()) && 
    !prereqs.includes(t.id)
  ).slice(0, 5);

  const handleAddPrereq = (tutId) => {
    if (prereqs.length >= 5) {
      setError('Maximum 5 prerequisites allowed');
      return;
    }
    setPrereqs([...prereqs, tutId]);
    setPrereqInput('');
    setShowPrereqDropdown(false);
  };

  const handleRemovePrereq = (tutId) => {
    setPrereqs(prereqs.filter((id) => id !== tutId));
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.title.trim().length < 5 || form.title.trim().length > 100) {
      setError('Title must be 5-100 characters');
      return;
    }
    if (form.description.trim().length < 20 || form.description.trim().length > 500) {
      setError('Description must be 20-500 characters');
      return;
    }
    if (!isValidVideoUrl(form.url.trim())) {
      setError('Please enter a valid YouTube or Vimeo URL');
      return;
    }
    if (!form.category) {
      setError('Please select a category');
      return;
    }
    if (!form.difficulty) {
      setError('Please select a difficulty level');
      return;
    }
    if (!form.platform) {
      setError('Please select a platform');
      return;
    }
    const duration = parseInt(form.estimatedDuration, 10);
    if (!duration || duration < 1 || duration > 600) {
      setError('Duration must be between 1 and 600 minutes');
      return;
    }

    setValidating(true);
    try {
      const availability = await checkVideoAvailability(form.url.trim());
      if (!availability.available) {
        setError(
          availability.error ||
            'The video at this URL is unavailable. Please check the link and try again.'
        );
        setValidating(false);
        return;
      }
    } catch {
      // ignore
    }
    setValidating(false);

    const tags = form.tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0)
      .slice(0, 5);

    const videoInfo = extractVideoId(form.url.trim());
    const thumbnailUrl = getThumbnailUrl(form.url.trim());

    submitTutorial(
      {
        title: form.title.trim(),
        description: form.description.trim(),
        url: form.url.trim(),
        videoId: videoInfo?.videoId || '',
        thumbnailUrl: thumbnailUrl || '',
        category: form.category,
        difficulty: form.difficulty,
        platform: form.platform,
        engineVersion: form.engineVersion || undefined,
        tags,
        estimatedDuration: duration,
        prerequisites: prereqs.length > 0 ? prereqs : undefined,
        author: {
          id: currentUser.id,
          name: currentUser.displayName,
          avatarUrl: '',
        },
      },
      currentUser.id
    );

    addToast('Tutorial submitted successfully!', 'success');
    setForm({
      title: '',
      description: '',
      url: '',
      category: '',
      difficulty: '',
      platform: '',
      engineVersion: '',
      tags: '',
      estimatedDuration: '',
    });
    setPrereqs([]);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Submit a Tutorial</h1>
      <p className={styles.subtitle}>
        Share a great game development tutorial with the community
      </p>

      {error && <div className={styles.error}>{error}</div>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>
            Title <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="e.g., Building a Platformer in Godot 4"
            value={form.title}
            onChange={handleChange('title')}
            maxLength={100}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Video URL <span className={styles.required}>*</span>
          </label>
          <input
            type="url"
            className={styles.input}
            placeholder="https://www.youtube.com/watch?v=..."
            value={form.url}
            onChange={handleChange('url')}
          />
          <span className={styles.hint}>
            YouTube or Vimeo links supported. Video availability will be verified on submit.
          </span>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Description <span className={styles.required}>*</span>
          </label>
          <textarea
            className={styles.textarea}
            placeholder="Describe what viewers will learn..."
            value={form.description}
            onChange={handleChange('description')}
            maxLength={500}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>
              Category <span className={styles.required}>*</span>
            </label>
            <select
              className={styles.select}
              value={form.category}
              onChange={handleChange('category')}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Difficulty <span className={styles.required}>*</span>
            </label>
            <select
              className={styles.select}
              value={form.difficulty}
              onChange={handleChange('difficulty')}
            >
              <option value="">Select level</option>
              {DIFFICULTIES.map((diff) => (
                <option key={diff.value} value={diff.value}>
                  {diff.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>
              Platform <span className={styles.required}>*</span>
            </label>
            <select
              className={styles.select}
              value={form.platform}
              onChange={handleChange('platform')}
            >
              <option value="">Select platform</option>
              {PLATFORMS.map((plat) => (
                <option key={plat.value} value={plat.value}>
                  {plat.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Engine Version (Optional)
            </label>
            <select
              className={styles.select}
              value={form.engineVersion}
              onChange={handleChange('engineVersion')}
            >
              <option value="">Select version</option>
              {ENGINE_VERSIONS.map((ver) => (
                <option key={ver.value} value={ver.value}>
                  {ver.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>
              Duration (minutes) <span className={styles.required}>*</span>
            </label>
            <input
              type="number"
              className={styles.input}
              placeholder="e.g., 45"
              value={form.estimatedDuration}
              onChange={handleChange('estimatedDuration')}
              min={1}
              max={600}
            />
          </div>
          
          <div className={styles.field}>
            <label className={styles.label}>Tags</label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g., platformer, physics, beginner"
              value={form.tags}
              onChange={handleChange('tags')}
            />
            <span className={styles.hint}>Comma-separated, max 5 tags</span>
          </div>
        </div>

        <div className={styles.field} ref={prereqRef}>
          <label className={styles.label}>Prerequisites (Optional)</label>
          <div className={styles.prereqContainer}>
            {prereqs.length > 0 && (
              <div className={styles.prereqChips}>
                {prereqs.map(id => {
                  const tut = getTutorialById(id);
                  if (!tut) return null;
                  return (
                    <span key={id} className={styles.prereqChip}>
                      {tut.title}
                      <button type="button" onClick={() => handleRemovePrereq(id)}>&times;</button>
                    </span>
                  );
                })}
              </div>
            )}
            <input
              type="text"
              className={styles.input}
              placeholder="Search tutorials to add as prerequisites..."
              value={prereqInput}
              onChange={(e) => {
                setPrereqInput(e.target.value);
                setShowPrereqDropdown(true);
              }}
              onFocus={() => setShowPrereqDropdown(true)}
            />
            {showPrereqDropdown && prereqInput.trim().length > 0 && (
              <div className={styles.prereqDropdown}>
                {filteredTutorialsForPrereq.length === 0 ? (
                  <div className={styles.prereqDropdownEmpty}>No tutorials found</div>
                ) : (
                  filteredTutorialsForPrereq.map(t => (
                    <button 
                      key={t.id} 
                      type="button" 
                      className={styles.prereqDropdownItem}
                      onClick={() => handleAddPrereq(t.id)}
                    >
                      {t.title}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={validating}>
          {validating ? 'Verifying video...' : 'Submit Tutorial'}
        </button>
      </form>
    </div>
  );
}