import PropTypes from 'prop-types';
import { filterShape } from '../utils/propTypeShapes';
import styles from './FilterChips.module.css';

export default function FilterChips({ filters, onRemoveFilter, onClearAll }) {
  const chips = [];

  if (filters.searchQuery) {
    chips.push({ key: 'search', label: `"${filters.searchQuery}"`, type: 'searchQuery' });
  }

  (filters.categories || []).forEach((cat) => {
    chips.push({ key: `cat-${cat}`, label: cat, type: 'categories', value: cat });
  });

  (filters.difficulties || []).forEach((diff) => {
    chips.push({ key: `diff-${diff}`, label: diff, type: 'difficulties', value: diff });
  });

  (filters.platforms || []).forEach((plat) => {
    chips.push({ key: `plat-${plat}`, label: plat, type: 'platforms', value: plat });
  });

  (filters.engineVersions || []).forEach((ver) => {
    chips.push({ key: `ver-${ver}`, label: ver, type: 'engineVersions', value: ver });
  });

  if (filters.durationRange && filters.durationRange !== 'any') {
    const labels = { short: '<15 min', medium: '15-60 min', long: '1-3 hrs', 'extra-long': '>3 hrs' };
    chips.push({
      key: 'duration',
      label: labels[filters.durationRange] || filters.durationRange,
      type: 'durationRange',
    });
  }

  if (filters.minRating > 0) {
    chips.push({
      key: 'rating',
      label: `${filters.minRating}+ stars`,
      type: 'minRating',
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className={styles.chips}>
      {chips.map((chip) => (
        <span key={chip.key} className={styles.chip}>
          {chip.label}
          <button
            className={styles.chipRemove}
            onClick={() => onRemoveFilter(chip.type, chip.value)}
            aria-label={`Remove ${chip.label} filter`}
          >
            &times;
          </button>
        </span>
      ))}
      {chips.length > 1 && (
        <button className={styles.clearAll} onClick={onClearAll}>
          Clear all
        </button>
      )}
    </div>
  );
}

FilterChips.propTypes = {
  filters: filterShape.isRequired,
  onRemoveFilter: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired,
};
