import PropTypes from 'prop-types';
import styles from './FreshnessBadge.module.css';

export default function FreshnessBadge({ consensus, compact }) {
  if (!consensus || consensus === 'unknown') return null;

  const isWorks = consensus === 'works';
  const icon = isWorks ? '✓' : '⚠️';
  const label = isWorks ? 'Still Works' : 'Outdated';
  const className = isWorks ? styles.works : styles.outdated;

  if (compact) {
    return (
      <div className={`${styles.badge} ${styles.compact} ${className}`} title={label}>
        <span className={styles.icon}>{icon}</span>
      </div>
    );
  }

  return (
    <div className={`${styles.badge} ${className}`}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}

FreshnessBadge.propTypes = {
  consensus: PropTypes.oneOf(['works', 'outdated', 'unknown']),
  compact: PropTypes.bool,
};