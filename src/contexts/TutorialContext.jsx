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
  engineVersions: [],
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
  
  // Feature 1
  const [completed, setCompleted] = useLocalStorage('kaz_completed', {});
  // Feature 2
  const [reviewVotes, setReviewVotes] = useLocalStorage('kaz_review_votes', {});
  // Feature 5
  const [freshnessVotes, setFreshnessVotes] = useLocalStorage('kaz_freshness_votes', {});
  // Feature 6
  const [followedTags, setFollowedTags] = useLocalStorage('kaz_followed_tags', {});
  const [playlists, setPlaylists] = useLocalStorage('kaz_playlists', {});

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

  // --- Feature 1 (Completed) functions ---
  const toggleCompleted = useCallback(
    (userId, tutorialId) => {
      setCompleted((prev) => {
        const userCompleted = prev[userId] || [];
        const isCurrentlyCompleted = userCompleted.includes(tutorialId);
        return {
          ...prev,
          [userId]: isCurrentlyCompleted
            ? userCompleted.filter((id) => id !== tutorialId)
            : [...userCompleted, tutorialId],
        };
      });
    },
    [setCompleted]
  );

  const isCompleted = useCallback(
    (userId, tutorialId) => {
      return (completed[userId] || []).includes(tutorialId);
    },
    [completed]
  );

  const getUserCompletedTutorials = useCallback(
    (userId) => {
      const ids = completed[userId] || [];
      return allTutorials.filter((t) => ids.includes(t.id));
    },
    [completed, allTutorials]
  );

  const getUserCompletedCount = useCallback(
    (userId) => {
      return (completed[userId] || []).length;
    },
    [completed]
  );

  // --- Feature 2 (Review Voting) functions ---
  const voteOnReview = useCallback(
    (reviewId, userId, voteType) => {
      setReviewVotes((prev) => {
        const reviewVotesForId = prev[reviewId] || {};
        const userVote = reviewVotesForId[userId];
        if (voteType === userVote) {
          // Toggle off
          return {
            ...prev,
            [reviewId]: {
              ...(prev[reviewId] || {}),
              [userId]: undefined,
            },
          };
        }
        return {
          ...prev,
          [reviewId]: {
            ...(prev[reviewId] || {}),
            [userId]: voteType,
          },
        };
      });
    },
    [setReviewVotes]
  );

  const getReviewVotes = useCallback(
    (reviewId) => {
      return reviewVotes[reviewId] || {};
    },
    [reviewVotes]
  );

  const getUserReviewVote = useCallback(
    (reviewId, userId) => {
      return reviewVotes[reviewId]?.[userId];
    },
    [reviewVotes]
  );

  const getReviewNetVotes = useCallback(
    (reviewId) => {
      const votes = reviewVotes[reviewId] || {};
      let upvotes = 0;
      let downvotes = 0;
      Object.values(votes).forEach((vote) => {
        if (vote === 'up') upvotes++;
        if (vote === 'down') downvotes++;
      });
      return upvotes - downvotes;
    },
    [reviewVotes]
  );

  // --- Feature 5 (Freshness) functions ---
  const voteFreshness = useCallback(
    (tutorialId, userId, type) => {
      setFreshnessVotes((prev) => {
        const votes = prev[tutorialId] || [];
        const existingIndex = votes.findIndex((v) => v.userId === userId);
        const newVotes = [...votes];
        if (existingIndex >= 0) {
          newVotes[existingIndex] = { userId, type, date: new Date().toISOString() };
        } else {
          newVotes.push({ userId, type, date: new Date().toISOString() });
        }
        return { ...prev, [tutorialId]: newVotes };
      });
    },
    [setFreshnessVotes]
  );

  const getFreshnessStatus = useCallback(
    (tutorialId) => {
      const votes = freshnessVotes[tutorialId] || [];
      const worksCount = votes.filter((v) => v.type === 'works').length;
      const outdatedCount = votes.filter((v) => v.type === 'outdated').length;
      let consensus = 'unknown';
      if (worksCount + outdatedCount >= 3) {
        if (outdatedCount > worksCount) consensus = 'outdated';
        else consensus = 'works';
      } else if (worksCount > 0 && outdatedCount === 0) {
         consensus = 'works';
      } else if (outdatedCount > 0 && worksCount === 0) {
         consensus = 'outdated';
      }
      return { worksCount, outdatedCount, consensus };
    },
    [freshnessVotes]
  );

  const getUserFreshnessVote = useCallback(
    (tutorialId, userId) => {
      const votes = freshnessVotes[tutorialId] || [];
      const vote = votes.find((v) => v.userId === userId);
      return vote ? vote.type : null;
    },
    [freshnessVotes]
  );

  // --- Feature 6 (Tags) functions ---
  const followTag = useCallback(
    (userId, tag) => {
      setFollowedTags((prev) => {
        const tags = prev[userId] || [];
        if (tags.includes(tag)) return prev;
        return { ...prev, [userId]: [...tags, tag] };
      });
    },
    [setFollowedTags]
  );

  const unfollowTag = useCallback(
    (userId, tag) => {
      setFollowedTags((prev) => {
        const tags = prev[userId] || [];
        return { ...prev, [userId]: tags.filter((t) => t !== tag) };
      });
    },
    [setFollowedTags]
  );

  const isTagFollowed = useCallback(
    (userId, tag) => {
      return (followedTags[userId] || []).includes(tag);
    },
    [followedTags]
  );

  const getFollowedTags = useCallback(
    (userId) => {
      return followedTags[userId] || [];
    },
    [followedTags]
  );

  const getForYouTutorials = useCallback(
    (userId) => {
      const tags = followedTags[userId] || [];
      if (tags.length === 0) return [];
      const matches = allTutorials.filter((t) => t.tags.some((tag) => tags.includes(tag)));
      return matches.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);
    },
    [followedTags, allTutorials]
  );


  // --- Feature: Custom Playlists ---
  const createPlaylist = useCallback((userId, name, description = '') => {
    const newPlaylist = {
      id: `pl-${Date.now()}`,
      name,
      description,
      tutorialIds: [],
      createdAt: new Date().toISOString()
    };

    setPlaylists(prev => {
      const userPlaylists = prev[userId] || [];
      return {
        ...prev,
        [userId]: [...userPlaylists, newPlaylist]
      };
    });
    return newPlaylist;
  }, [setPlaylists]);

  const getUserPlaylists = useCallback((userId) => {
    return playlists[userId] || [];
  }, [playlists]);

  const addTutorialToPlaylist = useCallback((userId, playlistId, tutorialId) => {
    setPlaylists(prev => {
      const userPlaylists = prev[userId] || [];
      return {
        ...prev,
        [userId]: userPlaylists.map(pl => {
          if (pl.id === playlistId) {
            if (!pl.tutorialIds.includes(tutorialId)) {
              return { ...pl, tutorialIds: [...pl.tutorialIds, tutorialId] };
            }
          }
          return pl;
        })
      };
    });
  }, [setPlaylists]);

  const removeTutorialFromPlaylist = useCallback((userId, playlistId, tutorialId) => {
    setPlaylists(prev => {
      const userPlaylists = prev[userId] || [];
      return {
        ...prev,
        [userId]: userPlaylists.map(pl => {
          if (pl.id === playlistId) {
            return { ...pl, tutorialIds: pl.tutorialIds.filter(id => id !== tutorialId) };
          }
          return pl;
        })
      };
    });
  }, [setPlaylists]);

  const deletePlaylist = useCallback((userId, playlistId) => {
    setPlaylists(prev => {
      const userPlaylists = prev[userId] || [];
      return {
        ...prev,
        [userId]: userPlaylists.filter(pl => pl.id !== playlistId)
      };
    });
  }, [setPlaylists]);


  // --- Standard functions ---

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

  const editSubmission = useCallback(
    (submissionId, updatedData, userId) => {
      const submission = submissions.find(
        (s) => s.id === submissionId && s.submittedBy === userId
      );
      if (!submission) {
        return { success: false, error: 'Not authorized' };
      }
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === submissionId
            ? {
                ...s,
                ...updatedData,
                id: s.id,
                submittedBy: s.submittedBy,
                status: s.status,
                createdAt: s.createdAt,
                viewCount: s.viewCount,
                averageRating: s.averageRating,
                ratingCount: s.ratingCount,
                isFeatured: s.isFeatured,
                updatedAt: new Date().toISOString(),
              }
            : s
        )
      );
      return { success: true };
    },
    [submissions, setSubmissions]
  );

  const deleteSubmission = useCallback(
    (submissionId, userId) => {
      const submission = submissions.find(
        (s) => s.id === submissionId && s.submittedBy === userId
      );
      if (!submission) {
        return { success: false, error: 'Not authorized' };
      }
      setSubmissions((prev) => prev.filter((s) => s.id !== submissionId));
      return { success: true };
    },
    [submissions, setSubmissions]
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
      toggleCompleted,
      isCompleted,
      getUserCompletedTutorials,
      getUserCompletedCount,
      voteOnReview,
      getReviewVotes,
      getUserReviewVote,
      getReviewNetVotes,
      voteFreshness,
      getFreshnessStatus,
      getUserFreshnessVote,
      followTag,
      unfollowTag,
      isTagFollowed,
      getFollowedTags,
      getForYouTutorials,
      submitTutorial,
      getUserSubmissions,
      editSubmission,
      deleteSubmission,
      incrementViewCount,
      createPlaylist,
      getUserPlaylists,
      addTutorialToPlaylist,
      removeTutorialFromPlaylist,
      deletePlaylist,
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
      toggleCompleted,
      isCompleted,
      getUserCompletedTutorials,
      getUserCompletedCount,
      voteOnReview,
      getReviewVotes,
      getUserReviewVote,
      getReviewNetVotes,
      voteFreshness,
      getFreshnessStatus,
      getUserFreshnessVote,
      followTag,
      unfollowTag,
      isTagFollowed,
      getFollowedTags,
      getForYouTutorials,
      submitTutorial,
      getUserSubmissions,
      editSubmission,
      deleteSubmission,
      incrementViewCount,
      createPlaylist,
      getUserPlaylists,
      addTutorialToPlaylist,
      removeTutorialFromPlaylist,
      deletePlaylist,
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
