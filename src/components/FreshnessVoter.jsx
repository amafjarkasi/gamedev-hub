import React from 'react';
import PropTypes from 'prop-types';
import styles from './FreshnessVoter.module.css';

export default function FreshnessVoter({
  status,
  userVote,
  onVote,
  isAuthenticated,
}) {
  const { worksCount, outdatedCount } = status;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4 className={styles.title}>Does this tutorial still work?</h4>
        <span className={styles.subtitle}>
          Engines update often. Help the community by verifying if this tutorial is still accurate.
        </span>
      </div>
      
      <div className={styles.actions}>
        <button
          className={`${styles.voteBtn} ${styles.worksBtn} ${userVote === 'works' ? styles.activeWorks : ''}`}
          onClick={() => isAuthenticated && onVote('works')}
          disabled={!isAuthenticated}
        >
          <span className={styles.icon}>✓</span> Yes, Still Works ({worksCount})
        </button>
        <button
          className={`${styles.voteBtn} ${styles.outdatedBtn} ${userVote === 'outdated' ? styles.activeOutdated : ''}`}
          onClick={() => isAuthenticated && onVote('outdated')}
          disabled={!isAuthenticated}
        >
          <span className={styles.icon}>⚠️</span> No, Outdated ({outdatedCount})
        </button>
      </div>

      {!isAuthenticated && (
        <p className={styles.loginPrompt}>Log in to vote</p>
      )}
    </div>
  );
}

FreshnessVoter.propTypes = {
  status: PropTypes.shape({
    worksCount: PropTypes.number,
    outdatedCount: PropTypes.number,
    consensus: PropTypes.string,
  }).isRequired,
  userVote: PropTypes.string,
  onVote: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};