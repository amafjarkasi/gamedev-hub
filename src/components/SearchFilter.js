import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { CATEGORIES, DIFFICULTIES, PLATFORMS, DURATION_RANGES } from '../data/constants';
import { useDebounce } from '../hooks/useDebounce';
import { filterShape } from '../utils/propTypeShapes';
import styles from './SearchFilter.module.css';

const RECENT_SEARCHES_KEY = 'kaz_recent_searches';
const MAX_RECENT = 8;

function loadRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY)) || [];
  } catch {
    return [];
  }
}

export default function SearchFilter({ filters, onFilterChange, onReset }) {
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState(loadRecentSearches);
  const debouncedQuery = useDebounce(filters.searchQuery || '', 500);
  const blurTimeoutRef = useRef(null);

  useEffect(() => {
    if (debouncedQuery.trim().length >= 3) {
      setRecentSearches((prev) => {
        const filtered = prev.filter(
          (s) => s.toLowerCase() !== debouncedQuery.trim().toLowerCase()
        );
        const next = [debouncedQuery.trim(), ...filtered].slice(0, MAX_RECENT);
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
        return next;
      });
    }
  }, [debouncedQuery]);

  const clearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  const selectSuggestion = (query) => {
    onFilterChange({ searchQuery: query });
    setIsFocused(false);
  };

  const handleBlur = () => {
    blurTimeoutRef.current = setTimeout(() => setIsFocused(false), 150);
  };

  const handleFocus = () => {
    clearTimeout(blurTimeoutRef.current);
    setIsFocused(true);
  };

  const currentQuery = (filters.searchQuery || '').toLowerCase();
  const filteredSuggestions = recentSearches.filter(
    (s) => !currentQuery || s.toLowerCase().includes(currentQuery)
  );
  const showSuggestions = isFocused && filteredSuggestions.length > 0;
  const handleSearchChange = (e) => {
    onFilterChange({ searchQuery: e.target.value });
  };

  const handleCheckboxToggle = (filterKey, value) => {
    const current = filters[filterKey] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange({ [filterKey]: updated });
  };

  const handleDurationChange = (e) => {
    onFilterChange({ durationRange: e.target.value });
  };

  const handleMinRating = (rating) => {
    onFilterChange({ minRating: filters.minRating === rating ? 0 : rating });
  };

  return (
    <div className={styles.filterPanel}>
      {/* Search */}
      <div className={styles.searchBox}>
        <span className={styles.searchIcon}>&#128269;</span>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search tutorials..."
          value={filters.searchQuery || ''}
          onChange={handleSearchChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {showSuggestions && (
          <div className={styles.suggestionsDropdown}>
            {filteredSuggestions.map((query) => (
              <button
                key={query}
                className={styles.suggestionItem}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectSuggestion(query)}
              >
                <span className={styles.suggestionIcon}>&#128336;</span>
                {query}
              </button>
            ))}
            <button
              className={styles.clearHistoryBtn}
              onMouseDown={(e) => e.preventDefault()}
              onClick={clearHistory}
            >
              Clear search history
            </button>
          </div>
        )}
      </div>

      {/* Category */}
      <div className={styles.filterGroup}>
        <span className={styles.filterLabel}>Category</span>
        <div className={styles.checkboxGroup}>
          {CATEGORIES.map((cat) => (
            <label key={cat.value} className={styles.checkbox}>
              <input
                type="checkbox"
                checked={(filters.categories || []).includes(cat.value)}
                onChange={() => handleCheckboxToggle('categories', cat.value)}
              />
              <span className={styles.checkboxLabel}>
                {cat.icon} {cat.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div className={styles.filterGroup}>
        <span className={styles.filterLabel}>Difficulty</span>
        <div className={styles.checkboxGroup}>
          {DIFFICULTIES.map((diff) => (
            <label key={diff.value} className={styles.checkbox}>
              <input
                type="checkbox"
                checked={(filters.difficulties || []).includes(diff.value)}
                onChange={() => handleCheckboxToggle('difficulties', diff.value)}
              />
              <span className={styles.checkboxLabel}>{diff.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Platform */}
      <div className={styles.filterGroup}>
        <span className={styles.filterLabel}>Platform</span>
        <div className={styles.checkboxGroup}>
          {PLATFORMS.map((plat) => (
            <label key={plat.value} className={styles.checkbox}>
              <input
                type="checkbox"
                checked={(filters.platforms || []).includes(plat.value)}
                onChange={() => handleCheckboxToggle('platforms', plat.value)}
              />
              <span className={styles.checkboxLabel}>{plat.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div className={styles.filterGroup}>
        <span className={styles.filterLabel}>Duration</span>
        <select
          className={styles.selectInput}
          value={filters.durationRange || 'any'}
          onChange={handleDurationChange}
        >
          {DURATION_RANGES.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {/* Minimum Rating */}
      <div className={styles.filterGroup}>
        <span className={styles.filterLabel}>Minimum Rating</span>
        <div className={styles.ratingFilter}>
          {[3, 3.5, 4, 4.5].map((rating) => (
            <button
              key={rating}
              className={`${styles.ratingBtn} ${
                filters.minRating === rating ? styles.ratingBtnActive : ''
              }`}
              onClick={() => handleMinRating(rating)}
            >
              {rating}+ &#9733;
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <button className={styles.resetBtn} onClick={onReset}>
        Clear All Filters
      </button>
    </div>
  );
}

SearchFilter.propTypes = {
  filters: filterShape.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};
