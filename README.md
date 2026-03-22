# GameDevHub

A modern, feature-rich web application for discovering, sharing, and organizing game development video tutorials. Built with React and designed with a sleek dark theme tailored for game developers.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![CSS Modules](https://img.shields.io/badge/CSS_Modules-Scoped_Styles-blue)
![Tests](https://img.shields.io/badge/Tests-81_passing-brightgreen)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

### Core
- **Tutorial Gallery** — Responsive card grid with YouTube thumbnails, metadata, difficulty badges, and platform tags
- **Advanced Search & Filtering** — Filter by category, difficulty, platform, duration, and rating with active filter chips and sort options
- **URL-Synced Filters** — Search filters persist in the URL query string and localStorage, enabling shareable filtered views
- **Tutorial Detail View** — Embedded video player, star ratings, user reviews, share buttons, and bookmarking
- **Related Tutorials** — Each tutorial detail page shows up to 4 related tutorials from the same category, ranked by rating
- **Tutorial Submission** — Authenticated users can submit YouTube/Vimeo tutorial links with full categorization
- **User Accounts** — Register, login, and manage a profile with bookmarks and submission history
- **Category Browsing** — Dedicated pages for 2D, 3D, Programming, Art, Audio, and Game Design
- **25 Mock Tutorials** — Realistic demo data spanning all categories, platforms, and difficulty levels
- **Dark Theme** — Gaming-inspired design with electric blue and purple accents
- **Fully Responsive** — Mobile hamburger menu, collapsible sidebar, adaptive 1-4 column grid
- **404 Page** — Custom not-found page with navigation links for unmatched routes

### Security
- **Password Hashing** — User passwords are hashed using Web Crypto API PBKDF2 (100,000 iterations, SHA-256) with per-user salts, replacing the previous base64 encoding. Legacy hashes are transparently migrated on login.
- **URL Sanitization** — Video embed links are sanitized to block `javascript:`, `data:`, and other dangerous URI schemes, allowing only `http`/`https` protocols.
- **Error Boundary** — A React error boundary wraps the application routes, catching rendering errors gracefully and providing a recovery UI instead of a blank screen.

### Accessibility
- **Modal Focus Trap** — Modals trap keyboard focus within their content, cycle Tab between first and last focusable elements, and restore focus to the triggering element on close. Includes `aria-labelledby` association.
- **RatingWidget Keyboard Navigation** — Star ratings use the roving tabindex pattern with Arrow key navigation and proper ARIA `radiogroup`/`radio` roles.
- **Global Focus-Visible Styles** — All interactive elements display a visible cyan focus ring on keyboard navigation (`focus-visible`), replacing the previous blanket `outline: none` on buttons.

### Code Quality
- **PropTypes Validation** — Runtime prop validation with shared type shapes applied across 12 components (TutorialCard, TutorialGallery, SearchFilter, VideoEmbed, RatingWidget, Modal, ShareButtons, DifficultyBadge, StarDisplay, FilterChips, SortDropdown, ErrorBoundary).
- **Unit Tests** — 81 Jest tests covering utility functions: `filterUtils` (filtering, sorting, filter counting, duration bounds), `formatUtils` (duration, view count, date, rating, text truncation), and `videoUtils` (video ID extraction, embed URLs, thumbnails, URL validation, sanitization).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 (Create React App) |
| Routing | React Router v7 (lazy loading, code splitting) |
| Styling | CSS Modules + CSS Custom Properties |
| State | React Context API |
| Persistence | localStorage |
| Security | Web Crypto API (PBKDF2) |
| Validation | PropTypes |
| Testing | Jest |
| Fonts | Inter, Space Grotesk, JetBrains Mono |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

The app runs at `http://localhost:3000`.

## Project Structure

```
src/
├── data/            # Mock tutorials (25 entries) and constants
├── contexts/        # AuthContext, TutorialContext, ToastContext providers
├── hooks/           # useAuth, useTutorials, useLocalStorage, useDebounce, useToast
├── utils/
│   ├── cryptoUtils.js      # PBKDF2 password hashing and verification
│   ├── videoUtils.js       # Video URL parsing and sanitization
│   ├── filterUtils.js      # Tutorial filtering and sorting logic
│   ├── formatUtils.js      # Display formatting helpers
│   ├── propTypeShapes.js   # Shared PropTypes definitions
│   └── __tests__/          # Unit tests (81 tests)
├── components/
│   ├── layout/             # Header, Footer, Sidebar
│   ├── ErrorBoundary.js    # React error boundary with recovery UI
│   ├── LoadingSpinner.js   # Loading state component
│   ├── TutorialCard, TutorialGallery, SearchFilter
│   ├── RatingWidget, ReviewSection, ShareButtons
│   ├── VideoEmbed, DifficultyBadge, StarDisplay
│   └── FilterChips, SortDropdown, Modal, EmptyState, Toast
└── pages/
    ├── HomePage            # Hero, featured, popular, category browse
    ├── SearchPage          # Sidebar filters + gallery (URL-synced)
    ├── TutorialDetailPage  # Video embed, ratings, reviews, related tutorials
    ├── SubmitPage          # Tutorial submission form
    ├── CategoryPage        # Per-category listing
    ├── ProfilePage         # Bookmarks and submissions
    ├── NotFoundPage        # Custom 404 page
    └── LoginPage, RegisterPage
```

## Demo Walkthrough

1. **Browse** the homepage to see featured and popular tutorials
2. **Search** using the Browse page — try filtering by "Godot" + "Beginner"
3. **Share** a filtered search by copying the URL — filters are encoded in query params
4. **View** a tutorial to see the embedded video, description, and related tutorials
5. **Register** an account to unlock rating, reviewing, bookmarking, and submission
6. **Submit** a YouTube or Vimeo tutorial link with category and difficulty tags
7. **Bookmark** tutorials and find them in your profile
8. **Navigate** with keyboard — Tab through interactive elements, use Arrow keys on star ratings

## License

MIT
