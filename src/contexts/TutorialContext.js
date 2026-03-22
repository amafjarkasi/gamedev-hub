import React, { createContext, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import defaultTutorials from '../data/tutorials';
import { filterTutorials, sortTutorials } from '../utils/filterUtils';

export const TutorialContext = createContext(null);

const DEFAULT_FILTERS = {
  searchQuery: '',
  categories: [],
  difficulties: [],
  platforms: [],
  durationRange: 'any',
  minRating: 0,
};

export function TutorialProvider({ children }) {
  const [ratings, setRatings] = useLocalStorage('kaz_ratings', {});
  const [reviews, setReviews] = useLocalStorage('kaz_reviews', []);
  const [bookmarks, setBookmarks] = useLocalStorage('kaz_bookmarks', {});
  const [submissions, setSubmissions] = useLocalStorage('kaz_submissions', []);
  const [viewLog, setViewLog] = useLocalStorage('kaz_view_log', {});
  const [filters, setFilters] = useLocalStorage('kaz_filters', DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useLocalStorage('kaz_sort', 'newest');

  // Merge mock tutorials with approved submissions, overlay dynamic data
  const allTutorials = useMemo(() => {
    const approvedSubmissions = submissions.filter((s) => s.status === 'approved');
    const merged = [...defaultTutorials, ...approvedSubmissions];

    return merged.map((tutorial) => {
      const tutorialRatings = ratings[tutorial.id] || {};
      const ratingValues = Object.values(tutorialRatings);
      const additionalViews = viewLog[tutorial.id] || 0;

      let averageRating = tutorial.averageRating;
      let ratingCount = tutorial.ratingCount;

      if (ratingValues.length > 0) {
        const totalRatings = ratingValues.length + tutorial.ratingCount;
        const totalSum =
          tutorial.averageRating * tutorial.ratingCount +
          ratingValues.reduce((sum, r) => sum + r, 0);
        averageRating = totalSum / totalRatings;
        ratingCount = totalRatings;
      }

      return {
        ...tutorial,
        averageRating,
        ratingCount,
        viewCount: tutorial.viewCount + additionalViews,
      };
    });
  }, [submissions, ratings, viewLog]);

  // Filtered and sorted tutorials
  const filteredTutorials = useMemo(() => {
    const filtered = filterTutorials(allTutorials, filters);
    return sortTutorials(filtered, sortBy);
  }, [allTutorials, filters, sortBy]);

  // Featured tutorials
  const featuredTutorials = useMemo(() => {
    return allTutorials.filter((t) => t.isFeatured);
  }, [allTutorials]);

  // Popular tutorials (top 8 by view count)
  const popularTutorials = useMemo(() => {
    return [...allTutorials].sort((a, b) => b.viewCount - a.viewCount).slice(0, 8);
  }, [allTutorials]);

  const getTutorialById = useCallback(
    (id) => {
      return allTutorials.find((t) => t.id === id) || null;
    },
    [allTutorials]
  );

  const addRating = useCallback(
    (tutorialId, userId, rating) => {
      setRatings((prev) => ({
        ...prev,
        [tutorialId]: {
          ...(prev[tutorialId] || {}),
          [userId]: rating,
        },
      }));
    },
    [setRatings]
  );

  const getUserRating = useCallback(
    (tutorialId, userId) => {
      return ratings[tutorialId]?.[userId] || 0;
    },
    [ratings]
  );

  const addReview = useCallback(
    (tutorialId, userId, username, text) => {
      const newReview = {
        id: `review-${Date.now()}`,
        tutorialId,
        userId,
        username,
        text,
        createdAt: new Date().toISOString(),
      };
      setReviews((prev) => [newReview, ...prev]);
      return newReview;
    },
    [setReviews]
  );

  const getReviewsForTutorial = useCallback(
    (tutorialId) => {
      return reviews.filter((r) => r.tutorialId === tutorialId);
    },
    [reviews]
  );

  const toggleBookmark = useCallback(
    (userId, tutorialId) => {
      setBookmarks((prev) => {
        const userBookmarks = prev[userId] || [];
        const isBookmarked = userBookmarks.includes(tutorialId);
        return {
          ...prev,
          [userId]: isBookmarked
            ? userBookmarks.filter((id) => id !== tutorialId)
            : [...userBookmarks, tutorialId],
        };
      });
    },
    [setBookmarks]
  );

  const isBookmarked = useCallback(
    (userId, tutorialId) => {
      return (bookmarks[userId] || []).includes(tutorialId);
    },
    [bookmarks]
  );

  const getUserBookmarks = useCallback(
    (userId) => {
      const ids = bookmarks[userId] || [];
      return allTutorials.filter((t) => ids.includes(t.id));
    },
    [bookmarks, allTutorials]
  );

  const submitTutorial = useCallback(
    (tutorialData, userId) => {
      const newTutorial = {
        ...tutorialData,
        id: `sub-${Date.now()}`,
        submittedBy: userId,
        status: 'approved',
        viewCount: 0,
        averageRating: 0,
        ratingCount: 0,
        isFeatured: false,
        createdAt: new Date().toISOString(),
      };
      setSubmissions((prev) => [...prev, newTutorial]);
      return newTutorial;
    },
    [setSubmissions]
  );

  const getUserSubmissions = useCallback(
    (userId) => {
      return submissions.filter((s) => s.submittedBy === userId);
    },
    [submissions]
  );

  const incrementViewCount = useCallback(
    (tutorialId) => {
      setViewLog((prev) => ({
        ...prev,
        [tutorialId]: (prev[tutorialId] || 0) + 1,
      }));
    },
    [setViewLog]
  );

  const updateFilters = useCallback(
    (newFilters) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    [setFilters]
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, [setFilters]);

  const getTutorialsByCategory = useCallback(
    (category) => {
      return allTutorials.filter((t) => t.category === category);
    },
    [allTutorials]
  );

  const value = useMemo(
    () => ({
      allTutorials,
      filteredTutorials,
      featuredTutorials,
      popularTutorials,
      filters,
      sortBy,
      getTutorialById,
      addRating,
      getUserRating,
      addReview,
      getReviewsForTutorial,
      toggleBookmark,
      isBookmarked,
      getUserBookmarks,
      submitTutorial,
      getUserSubmissions,
      incrementViewCount,
      updateFilters,
      resetFilters,
      setSortBy,
      getTutorialsByCategory,
    }),
    [
      allTutorials,
      filteredTutorials,
      featuredTutorials,
      popularTutorials,
      filters,
      sortBy,
      getTutorialById,
      addRating,
      getUserRating,
      addReview,
      getReviewsForTutorial,
      toggleBookmark,
      isBookmarked,
      getUserBookmarks,
      submitTutorial,
      getUserSubmissions,
      incrementViewCount,
      updateFilters,
      resetFilters,
      setSortBy,
      getTutorialsByCategory,
    ]
  );

  return (
    <TutorialContext.Provider value={value}>{children}</TutorialContext.Provider>
  );
}
