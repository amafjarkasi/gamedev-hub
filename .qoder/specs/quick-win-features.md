# Quick Win Features Implementation Plan

## Context

GameDevHub is a React game dev tutorial platform with 25 mock tutorials, dark theme, search/filter, bookmarks, ratings, reviews, and user accounts. Research on competing platforms (Unity Learn, itch.io, Udemy, roadmap.sh, etc.) identified 7 "quick win" features that add high value with relatively low effort. This plan implements all 7.

## Features Overview

| # | Feature | New Files | Key Modified Files |
|---|---------|-----------|-------------------|
| 1 | Mark as Completed | - | TutorialContext, TutorialCard, TutorialDetailPage, ProfilePage |
| 2 | Review Helpfulness Voting | - | TutorialContext, ReviewSection, TutorialDetailPage |
| 3 | Tutorial Series Grouping | - | constants.js, tutorials.js, TutorialCard, TutorialDetailPage |
| 4 | Engine Version Tags | - | constants.js, tutorials.js, SearchFilter, FilterChips, TutorialCard, TutorialDetailPage, SubmitPage, filterUtils |
| 5 | Outdated/"Still Works" Flags | FreshnessBadge.js+css, FreshnessVoter.js+css | TutorialContext, TutorialCard, TutorialDetailPage |
| 6 | Tag-Based Follow + "For You" | FollowableTag.js+css | TutorialContext, TutorialDetailPage, HomePage, ProfilePage |
| 7 | Prerequisite Links | PrerequisiteSection.js+css | tutorials.js, TutorialDetailPage, SubmitPage |

---

## Feature 1: Mark as Completed

**Goal:** Let users track which tutorials they've finished. Show completion on cards, detail page, and profile.

### State (TutorialContext.js)
- New `useLocalStorage('kaz_completed', {})` - shape: `{ [userId]: [tutorialId, ...] }`
- New functions (clone bookmark pattern):
  - `toggleCompleted(userId, tutorialId)` - add/remove from array
  - `isCompleted(userId, tutorialId)` - returns boolean
  - `getUserCompletedTutorials(userId)` - returns full tutorial objects
- Add all to context value + useMemo deps

### UI Changes
- **TutorialCard.js**: Add checkmark button in `thumbnailWrapper` (bottom-left position), green when active. Add subtle completed overlay on thumbnail when completed.
- **TutorialCard.module.css**: `.completedBtn` (absolute bottom-left), `.completedActive` (success color), `.completedOverlay` (semi-transparent green overlay with checkmark)
- **TutorialDetailPage.js**: Add "Mark as Completed" / "Completed" toggle button in `actionsRow` next to bookmark
- **TutorialDetailPage.module.css**: `.completedBtn` / `.completedActive` matching action button style
- **ProfilePage.js**: Add third tab "Completed (N)" using TutorialGallery, add completion count stat in profile header
- **ProfilePage.module.css**: `.userStats` row, `.statBadge` pill

---

## Feature 2: Review Helpfulness Voting

**Goal:** Let users vote reviews as helpful/unhelpful. Sort by helpfulness by default.

### State (TutorialContext.js)
- New `useLocalStorage('kaz_review_votes', {})` - shape: `{ [reviewId]: { [userId]: 'up' | 'down' } }`
- New functions:
  - `voteOnReview(reviewId, userId, voteType)` - toggle/switch/set vote
  - `getReviewVotes(reviewId)` - returns vote map
  - `getUserReviewVote(reviewId, userId)` - returns 'up'/'down'/null
  - `getReviewNetVotes(reviewId)` - returns number (ups - downs)
- Add all to context value + useMemo deps

### UI Changes
- **ReviewSection.js**:
  - Add `sortMode` state ('helpful' default, 'newest')
  - Add sort toggle buttons above review list
  - Sort reviews: helpful mode uses `getReviewNetVotes` descending, newest uses `createdAt`
  - Add vote bar to each review: thumbs-up button, net count, thumbs-down button
  - New props: `onVote`, `getReviewNetVotes`, `getUserReviewVote`
- **ReviewSection.module.css**: `.voteBar`, `.voteBtn`, `.voteBtnUp`/`.voteBtnDown` (active states), `.voteCount`, `.sortControls`, `.sortBtn`/`.sortBtnActive`
- **TutorialDetailPage.js**: Pass new vote props to ReviewSection

---

## Feature 3: Tutorial Series Grouping

**Goal:** Group related tutorials into series with prev/next navigation.

### Data Changes
- **constants.js**: Add `SERIES` array:
  ```
  [
    { id: 'series-godot-beginner', title: 'Godot 4 Beginner Series' },
    { id: 'series-game-design', title: 'Game Design Fundamentals' },
    { id: 'series-gamemaker', title: 'GameMaker Masterclass' }
  ]
  ```
- **tutorials.js**: Add `seriesId` and `seriesOrder` to grouped tutorials:
  - series-godot-beginner: tut-001 (order 1), tut-012 (order 2), tut-022 (order 3)
  - series-game-design: tut-010 (order 1), tut-014 (order 2), tut-019 (order 3), tut-025 (order 4)
  - series-gamemaker: tut-007 (order 1), tut-018 (order 2), tut-024 (order 3)
- **propTypeShapes.js**: Add `seriesId: PropTypes.string`, `seriesOrder: PropTypes.number` to tutorialShape

### UI Changes
- **TutorialCard.js**: If `tutorial.seriesId`, show a small series badge in `cardBody` between header and description. Look up series name from SERIES constant.
- **TutorialCard.module.css**: `.seriesBadge` - inline pill, accent-secondary color
- **TutorialDetailPage.js**: Compute series info (prev/next tutorials), render series navigation bar below title showing "Series: X - Part N of M" with prev/next links
- **TutorialDetailPage.module.css**: `.seriesNav`, `.seriesTitle`, `.seriesLinks`, `.seriesPrev`, `.seriesNext`

---

## Feature 4: Engine Version Tags

**Goal:** Show engine version on tutorials, allow filtering by version.

### Data Changes
- **constants.js**: Add `ENGINE_VERSIONS` array with values like 'Unity 2022 LTS', 'Unity 6', 'Unreal 5.3', 'Unreal 5.4', 'Godot 4.2', 'Godot 4.3', 'GameMaker 2024'
- **tutorials.js**: Add `engineVersion` to engine-specific tutorials (15 of 25)
- **propTypeShapes.js**: Add `engineVersion: PropTypes.string` to tutorialShape, `engineVersions: PropTypes.arrayOf(PropTypes.string)` to filterShape

### Filter Changes
- **TutorialContext.js DEFAULT_FILTERS**: Add `engineVersions: []`
- **filterUtils.js**: Add engineVersions filter after platforms filter - if filter active, include only tutorials with matching engineVersion
- **filterUtils.test.js**: Add test cases for engineVersions filter
- **getActiveFilterCount**: Count engineVersions entries

### UI Changes
- **SearchFilter.js**: Add Engine Version checkbox group (after Platform, before Duration)
- **FilterChips.js**: Add chips for active engine version filters
- **TutorialCard.js**: Show version badge in `cardHeader` when `tutorial.engineVersion` exists
- **TutorialCard.module.css**: `.versionBadge` - warning color pill
- **TutorialDetailPage.js**: Show version badge in badges area
- **TutorialDetailPage.module.css**: `.versionTag`
- **SubmitPage.js**: Add optional Engine Version select dropdown
- **SearchPage.js**: Sync `ver` URL param for engine versions
- **ProfilePage.js**: Add engineVersion to edit modal form

---

## Feature 5: Outdated/"Still Works" Flags

**Goal:** Community-driven tutorial freshness verification.

### State (TutorialContext.js)
- New `useLocalStorage('kaz_freshness_votes', {})` - shape: `{ [tutorialId]: [{ userId, type: 'works'|'outdated', date }] }`
- New functions:
  - `voteFreshness(tutorialId, userId, type)` - replaces user's previous vote
  - `getFreshnessStatus(tutorialId)` - returns `{ worksCount, outdatedCount, consensus: 'works'|'outdated'|'unknown' }`
  - `getUserFreshnessVote(tutorialId, userId)` - returns vote type or null

### New Components
- **FreshnessBadge.js + .module.css**: Presentational badge. Props: `consensus`, `compact`. Shows green checkmark for 'works', amber warning for 'outdated', nothing for 'unknown'. Follows DifficultyBadge pattern.
- **FreshnessVoter.js + .module.css**: Voting widget for detail page. Two toggle buttons ("Still Works" / "Outdated"), status breakdown text. Requires auth.

### Integration
- **TutorialCard.js**: Render `<FreshnessBadge compact>` in thumbnailWrapper (bottom-left, only when consensus is not 'unknown')
- **TutorialDetailPage.js**: Render `<FreshnessBadge>` in metaRow, render `<FreshnessVoter>` as new section between actions and rating

---

## Feature 6: Tag-Based Follow + "For You"

**Goal:** Personalized home feed based on followed tags.

### State (TutorialContext.js)
- New `useLocalStorage('kaz_followed_tags', {})` - shape: `{ [userId]: [tag, ...] }`
- New functions:
  - `followTag(userId, tag)` - add to followed list
  - `unfollowTag(userId, tag)` - remove from followed list
  - `isTagFollowed(userId, tag)` - returns boolean
  - `getFollowedTags(userId)` - returns tag array
  - `getForYouTutorials(userId)` - returns tutorials matching any followed tag, sorted by newest, max 8

### New Component
- **FollowableTag.js + .module.css**: Tag chip with follow toggle. Props: `tag`, `isFollowed`, `onToggle`, `isAuthenticated`. Shows +/- icon on hover. Followed state gets accent border.

### Integration
- **TutorialDetailPage.js**: Replace static tag `<span>` elements with `<FollowableTag>` components
- **HomePage.js**: Add "For You" TutorialGallery section above Featured (only when authenticated + has followed tags + results exist)
- **ProfilePage.js**: Add "Tags" tab showing followed tags with unfollow toggle, plus browseable list of all available tags

---

## Feature 7: Prerequisite Links

**Goal:** Show "Watch these first" recommendations on tutorials.

### Data Changes
- **tutorials.js**: Add optional `prerequisites` array of tutorial IDs to relevant tutorials:
  - tut-006 (Shaders): ['tut-003'] (C# Fundamentals)
  - tut-011 (Multiplayer): ['tut-003']
  - tut-012 (Godot FPS): ['tut-001'] (Godot Platformer)
  - tut-013 (FMOD Audio): ['tut-005'] (Audio Design)
  - tut-017 (AI Pathfinding): ['tut-003']
  - tut-022 (Godot Multiplayer): ['tut-001']
  - tut-024 (Roguelike): ['tut-007'] (RPG)
  - tut-019 (Economy): ['tut-010'] (GDD)
- **propTypeShapes.js**: Add `prerequisites: PropTypes.arrayOf(PropTypes.string)`

### New Component
- **PrerequisiteSection.js + .module.css**: Renders "Watch These First" with compact horizontal tutorial cards. Props: `prerequisites` (array of tutorial objects). Returns null if empty. Each card: small thumbnail, title, difficulty badge, duration, clickable link.

### Integration
- **TutorialDetailPage.js**: Compute `prerequisiteTutorials` via `useMemo` mapping IDs to `getTutorialById`. Render `<PrerequisiteSection>` between video and info sections.
- **SubmitPage.js**: Add optional prerequisites field - autocomplete text input with dropdown of existing tutorials, selected items shown as removable chips, max 5

---

## Implementation Order

1. Feature 1 (Completed) - clones bookmark pattern, lowest risk
2. Feature 2 (Review Votes) - self-contained in ReviewSection
3. Feature 3 (Series) - data + UI, no new state stores
4. Feature 4 (Engine Versions) - broadest touch surface but simple additions
5. Feature 5 (Freshness) - new state + 2 new components
6. Feature 6 (Tag Follow) - widest cross-cutting (4 pages)
7. Feature 7 (Prerequisites) - new component + data changes

## Verification

1. Run `npm test -- --watchAll=false` - all existing + new tests pass
2. Run `npx react-scripts build` - production build succeeds
3. Manual smoke test: complete a tutorial, vote on review, navigate series, filter by engine version, flag freshness, follow tags, check prerequisites
