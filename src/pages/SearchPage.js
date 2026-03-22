import React, { useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
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

  const [searchParams, setSearchParams] = useSearchParams();
  const initializedRef = useRef(false);

  // On mount: read URL params and push into context
  useEffect(() => {
    const parsed = {};
    const q = searchParams.get('q');
    const cat = searchParams.get('cat');
    const diff = searchParams.get('diff');
    const plat = searchParams.get('plat');
    const dur = searchParams.get('dur');
    const rating = searchParams.get('rating');
    const sort = searchParams.get('sort');

    if (q) parsed.searchQuery = q;
    if (cat) parsed.categories = cat.split(',').filter(Boolean);
    if (diff) parsed.difficulties = diff.split(',').filter(Boolean);
    if (plat) parsed.platforms = plat.split(',').filter(Boolean);
    if (dur) parsed.durationRange = dur;
    if (rating) parsed.minRating = parseFloat(rating) || 0;

    if (Object.keys(parsed).length > 0) {
      updateFilters(parsed);
    }
    if (sort) {
      setSortBy(sort);
    }

    // Small delay to let context settle before enabling URL sync
    requestAnimationFrame(() => {
      initializedRef.current = true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On filter/sort change: sync to URL
  useEffect(() => {
    if (!initializedRef.current) return;

    const params = new URLSearchParams();

    if (filters.searchQuery) params.set('q', filters.searchQuery);
    if (filters.categories?.length > 0)
      params.set('cat', filters.categories.join(','));
    if (filters.difficulties?.length > 0)
      params.set('diff', filters.difficulties.join(','));
    if (filters.platforms?.length > 0)
      params.set('plat', filters.platforms.join(','));
    if (filters.durationRange && filters.durationRange !== 'any')
      params.set('dur', filters.durationRange);
    if (filters.minRating && filters.minRating > 0)
      params.set('rating', String(filters.minRating));
    if (sortBy && sortBy !== 'newest') params.set('sort', sortBy);

    setSearchParams(params, { replace: true });
  }, [filters, sortBy, setSearchParams]);

  const filterCount = getActiveFilterCount(filters);

  const handleResetFilters = useCallback(() => {
    resetFilters();
    if (initializedRef.current) {
      setSearchParams({}, { replace: true });
    }
  }, [resetFilters, setSearchParams]);

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
            onReset={handleResetFilters}
          />
        </Sidebar>

        <div className={styles.content}>
          <div className={styles.toolbar}>
            <div className={styles.chipsRow}>
              <FilterChips
                filters={filters}
                onRemoveFilter={handleRemoveFilter}
                onClearAll={handleResetFilters}
              />
            </div>
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>

          <TutorialGallery
            tutorials={filteredTutorials}
            showCount
            pageSize={12}
            onClearFilters={filterCount > 0 ? handleResetFilters : undefined}
          />
        </div>
      </div>
    </div>
  );
}
