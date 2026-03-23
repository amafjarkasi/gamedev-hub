import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { tutorialShape } from '../utils/propTypeShapes';
import DifficultyBadge from './DifficultyBadge';
import { formatDuration } from '../utils/formatUtils';
import styles from './PrerequisiteSection.module.css';

export default function PrerequisiteSection({ prerequisites }) {
  if (!prerequisites || prerequisites.length === 0) return null;

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>Watch These First</h3>
      <p className={styles.subtitle}>
        To get the most out of this tutorial, we recommend completing these prerequisites:
      </p>
      <div className={styles.list}>
        {prerequisites.map((tut) => (
          <Link to={`/tutorial/${tut.id}`} key={tut.id} className={styles.card}>
            <div className={styles.thumbnailWrapper}>
              <img src={tut.thumbnailUrl} alt={tut.title} className={styles.thumbnail} />
              <span className={styles.duration}>{formatDuration(tut.estimatedDuration)}</span>
            </div>
            <div className={styles.info}>
              <h4 className={styles.tutTitle}>{tut.title}</h4>
              <div className={styles.meta}>
                <DifficultyBadge difficulty={tut.difficulty} />
                <span className={styles.platform}>{tut.platform}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

PrerequisiteSection.propTypes = {
  prerequisites: PropTypes.arrayOf(tutorialShape),
};