import {
  filterTutorials,
  sortTutorials,
  getActiveFilterCount,
  getDurationBounds,
} from '../filterUtils';

const mockTutorials = [
  {
    id: '1',
    title: 'Unity 2D Platformer',
    description: 'Build a platformer in Unity',
    category: '2D Game Development',
    difficulty: 'Beginner',
    platform: 'Unity',
    engineVersion: 'Unity 2022 LTS',
    tags: ['unity', 'platformer', '2d'],
    author: { id: 'a1', name: 'Alice' },
    estimatedDuration: 30,
    averageRating: 4.5,
    viewCount: 1000,
    createdAt: '2025-01-15T00:00:00Z',
  },
  {
    id: '2',
    title: 'Godot RPG Tutorial',
    description: 'Create an RPG with Godot',
    category: 'Game Programming',
    difficulty: 'Intermediate',
    platform: 'Godot',
    engineVersion: 'Godot 4.2',
    tags: ['godot', 'rpg', 'gd-script'],
    author: { id: 'a2', name: 'Bob' },
    estimatedDuration: 90,
    averageRating: 4.0,
    viewCount: 5000,
    createdAt: '2025-03-01T00:00:00Z',
  },
  {
    id: '3',
    title: 'Unreal 3D Shooter',
    description: 'Build a shooter with Unreal Engine',
    category: '3D Game Development',
    difficulty: 'Advanced',
    platform: 'Unreal Engine',
    engineVersion: 'Unreal 5.3',
    tags: ['unreal', 'shooter', '3d', 'blueprints'],
    author: { id: 'a3', name: 'Charlie' },
    estimatedDuration: 200,
    averageRating: 4.8,
    viewCount: 8000,
    createdAt: '2025-02-10T00:00:00Z',
  },
];

describe('filterTutorials', () => {
  test('returns all tutorials with empty/default filters', () => {
    const result = filterTutorials(mockTutorials, {});
    expect(result).toHaveLength(3);
  });

  test('filters by search query matching title', () => {
    const result = filterTutorials(mockTutorials, { searchQuery: 'unity' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  test('filters by search query matching description', () => {
    const result = filterTutorials(mockTutorials, { searchQuery: 'RPG' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  test('filters by search query matching tag', () => {
    const result = filterTutorials(mockTutorials, { searchQuery: 'blueprints' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  test('filters by search query matching author', () => {
    const result = filterTutorials(mockTutorials, { searchQuery: 'Alice' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  test('filters by single category', () => {
    const result = filterTutorials(mockTutorials, {
      categories: ['Game Programming'],
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  test('filters by multiple categories', () => {
    const result = filterTutorials(mockTutorials, {
      categories: ['2D Game Development', '3D Game Development'],
    });
    expect(result).toHaveLength(2);
  });

  test('filters by difficulty', () => {
    const result = filterTutorials(mockTutorials, {
      difficulties: ['Advanced'],
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  test('filters by platform', () => {
    const result = filterTutorials(mockTutorials, {
      platforms: ['Godot'],
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  test('filters by engine version', () => {
    const result = filterTutorials(mockTutorials, {
      engineVersions: ['Unity 2022 LTS'],
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  test('filters by duration range - short', () => {
    const result = filterTutorials(mockTutorials, { durationRange: 'short' });
    expect(result).toHaveLength(0); // 30 > 15
  });

  test('filters by duration range - medium', () => {
    const result = filterTutorials(mockTutorials, { durationRange: 'medium' });
    expect(result).toHaveLength(1); // 30 is in 15-60
    expect(result[0].id).toBe('1');
  });

  test('filters by duration range - long', () => {
    const result = filterTutorials(mockTutorials, { durationRange: 'long' });
    expect(result).toHaveLength(1); // 90 is in 60-180
    expect(result[0].id).toBe('2');
  });

  test('filters by minimum rating', () => {
    const result = filterTutorials(mockTutorials, { minRating: 4.5 });
    expect(result).toHaveLength(2);
    expect(result.map((t) => t.id).sort()).toEqual(['1', '3']);
  });

  test('applies combined filters', () => {
    const result = filterTutorials(mockTutorials, {
      searchQuery: 'build',
      difficulties: ['Beginner', 'Advanced'],
    });
    expect(result).toHaveLength(2);
  });

  test('ignores durationRange "any"', () => {
    const result = filterTutorials(mockTutorials, { durationRange: 'any' });
    expect(result).toHaveLength(3);
  });
});

describe('sortTutorials', () => {
  test('sorts by newest (createdAt descending)', () => {
    const sorted = sortTutorials(mockTutorials, 'newest');
    expect(sorted[0].id).toBe('2');
    expect(sorted[1].id).toBe('3');
    expect(sorted[2].id).toBe('1');
  });

  test('sorts by popular (viewCount descending)', () => {
    const sorted = sortTutorials(mockTutorials, 'popular');
    expect(sorted[0].id).toBe('3');
    expect(sorted[1].id).toBe('2');
    expect(sorted[2].id).toBe('1');
  });

  test('sorts by highest-rated', () => {
    const sorted = sortTutorials(mockTutorials, 'highest-rated');
    expect(sorted[0].id).toBe('3');
    expect(sorted[1].id).toBe('1');
    expect(sorted[2].id).toBe('2');
  });

  test('sorts by most-viewed', () => {
    const sorted = sortTutorials(mockTutorials, 'most-viewed');
    expect(sorted[0].id).toBe('3');
  });

  test('returns copy for unknown sort', () => {
    const sorted = sortTutorials(mockTutorials, 'unknown');
    expect(sorted).toHaveLength(3);
    expect(sorted).not.toBe(mockTutorials);
  });
});

describe('getActiveFilterCount', () => {
  test('returns 0 for default filters', () => {
    expect(getActiveFilterCount({})).toBe(0);
  });

  test('counts search query as 1', () => {
    expect(getActiveFilterCount({ searchQuery: 'unity' })).toBe(1);
  });

  test('counts each category individually', () => {
    expect(
      getActiveFilterCount({ categories: ['2D', '3D'] })
    ).toBe(2);
  });

  test('counts combined filters correctly', () => {
    expect(
      getActiveFilterCount({
        searchQuery: 'test',
        categories: ['2D'],
        difficulties: ['Beginner', 'Advanced'],
        durationRange: 'short',
        minRating: 4,
      })
    ).toBe(6);
  });

  test('ignores durationRange "any"', () => {
    expect(getActiveFilterCount({ durationRange: 'any' })).toBe(0);
  });

  test('ignores minRating 0', () => {
    expect(getActiveFilterCount({ minRating: 0 })).toBe(0);
  });
});

describe('getDurationBounds', () => {
  test('returns bounds for short', () => {
    expect(getDurationBounds('short')).toEqual({ min: 0, max: 15 });
  });

  test('returns bounds for medium', () => {
    expect(getDurationBounds('medium')).toEqual({ min: 15, max: 60 });
  });

  test('returns bounds for long', () => {
    expect(getDurationBounds('long')).toEqual({ min: 60, max: 180 });
  });

  test('returns bounds for extra-long', () => {
    expect(getDurationBounds('extra-long')).toEqual({ min: 180, max: Infinity });
  });

  test('returns full range for unknown value', () => {
    expect(getDurationBounds('unknown')).toEqual({ min: 0, max: Infinity });
  });
});
