import React from 'react';
import PropTypes from 'prop-types';
import { SORT_OPTIONS } from '../data/constants';
import styles from './SortDropdown.module.css';

export default function SortDropdown({ value, onChange }) {
  return (
    <div className={styles.sortWrapper}>
      <span className={styles.sortLabel}>Sort by:</span>
      <select
        className={styles.sortSelect}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

SortDropdown.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
