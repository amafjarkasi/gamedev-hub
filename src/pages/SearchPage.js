import React from 'react';
import { useTutorials } from '../hooks/useTutorials';
import { getActiveFilterCount } from '../utils/filterUtils';
import Sidebar from '../components/layout/Sidebar';
import SearchFilter from '../components/SearchFilter';
import FilterChips from '../components/FilterChips';
import SortDropdown from '../components/SortDropdown';
import TutorialGallery from '../components/TutorialGallery';
import styles from './SearchPage.module.css';

export default function SearchPage() {
  const {
    filteredTutorials,
    filters,
    sortBy,
    updateFilters,
    resetFilters,
    setSortBy,
  } = useTutorials();

  const filterCount = getActiveFilterCount(filters);

  const handleRemoveFilter = (type, value) => {
    if (type === 'searchQuery') {
      updateFilters({ searchQuery: '' });
    } else if (type === 'durationRange') {
      updateFilters({ durationRange: 'any' });
    } else if (type === 'minRating') {
      updateFilters({ minRating: 0 });
    } else {
      const current = filters[type] || [];
      updateFilters({ [type]: current.filter((v) => v !== value) });
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Browse Tutorials</h1>

      <div className={styles.layout}>
        <Sidebar filterCount={filterCount}>
          <SearchFilter
            filters={filters}
            onFilterChange={updateFilters}
            onReset={resetFilters}
          />
        </Sidebar>

        <div className={styles.content}>
          <div className={styles.toolbar}>
            <div className={styles.chipsRow}>
              <FilterChips
                filters={filters}
                onRemoveFilter={handleRemoveFilter}
                onClearAll={resetFilters}
              />
            </div>
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>

          <TutorialGallery
            tutorials={filteredTutorials}
            showCount
            onClearFilters={filterCount > 0 ? resetFilters : undefined}
          />
        </div>
      </div>
    </div>
  );
}
