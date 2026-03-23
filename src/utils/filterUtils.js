export function filterTutorials(tutorials, filters) {
  return tutorials.filter((tutorial) => {
    // Text search
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesTitle = tutorial.title.toLowerCase().includes(query);
      const matchesDesc = tutorial.description.toLowerCase().includes(query);
      const matchesTags = tutorial.tags.some((tag) => tag.toLowerCase().includes(query));
      const matchesAuthor = tutorial.author.name.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDesc && !matchesTags && !matchesAuthor) {
        return false;
      }
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      if (!filters.categories.includes(tutorial.category)) {
        return false;
      }
    }

    // Difficulty filter
    if (filters.difficulties && filters.difficulties.length > 0) {
      if (!filters.difficulties.includes(tutorial.difficulty)) {
        return false;
      }
    }

    // Platform filter
    if (filters.platforms && filters.platforms.length > 0) {
      if (!filters.platforms.includes(tutorial.platform)) {
        return false;
      }
    }

    // Engine Version filter
    if (filters.engineVersions && filters.engineVersions.length > 0) {
      if (!filters.engineVersions.includes(tutorial.engineVersion)) {
        return false;
      }
    }

    // Duration filter
    if (filters.durationRange && filters.durationRange !== 'any') {
      const { min, max } = getDurationBounds(filters.durationRange);
      if (tutorial.estimatedDuration < min || tutorial.estimatedDuration > max) {
        return false;
      }
    }

    // Minimum rating filter
    if (filters.minRating && filters.minRating > 0) {
      if (tutorial.averageRating < filters.minRating) {
        return false;
      }
    }

    return true;
  });
}

export function getDurationBounds(rangeValue) {
  const ranges = {
    short: { min: 0, max: 15 },
    medium: { min: 15, max: 60 },
    long: { min: 60, max: 180 },
    'extra-long': { min: 180, max: Infinity },
  };
  return ranges[rangeValue] || { min: 0, max: Infinity };
}

export function sortTutorials(tutorials, sortBy) {
  const sorted = [...tutorials];
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'popular':
      return sorted.sort((a, b) => b.viewCount - a.viewCount);
    case 'highest-rated':
      return sorted.sort((a, b) => b.averageRating - a.averageRating);
    case 'most-viewed':
      return sorted.sort((a, b) => b.viewCount - a.viewCount);
    default:
      return sorted;
  }
}

export function getActiveFilterCount(filters) {
  let count = 0;
  if (filters.searchQuery) count++;
  if (filters.categories?.length > 0) count += filters.categories.length;
  if (filters.difficulties?.length > 0) count += filters.difficulties.length;
  if (filters.platforms?.length > 0) count += filters.platforms.length;
  if (filters.engineVersions?.length > 0) count += filters.engineVersions.length;
  if (filters.durationRange && filters.durationRange !== 'any') count++;
  if (filters.minRating && filters.minRating > 0) count++;
  return count;
}
