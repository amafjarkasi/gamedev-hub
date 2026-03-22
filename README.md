# GameDevHub

A modern, feature-rich web application for discovering, sharing, and organizing game development video tutorials. Built with React and designed with a sleek dark theme tailored for game developers.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![CSS Modules](https://img.shields.io/badge/CSS_Modules-Scoped_Styles-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Tutorial Gallery** — Responsive card grid with YouTube thumbnails, metadata, difficulty badges, and platform tags
- **Advanced Search & Filtering** — Filter by category, difficulty, platform, duration, and rating with active filter chips and sort options
- **Tutorial Detail View** — Embedded video player, star ratings, user reviews, share buttons, and bookmarking
- **Tutorial Submission** — Authenticated users can submit YouTube/Vimeo tutorial links with full categorization
- **User Accounts** — Register, login, and manage a profile with bookmarks and submission history
- **Category Browsing** — Dedicated pages for 2D, 3D, Programming, Art, Audio, and Game Design
- **25 Mock Tutorials** — Realistic demo data spanning all categories, platforms, and difficulty levels
- **Dark Theme** — Gaming-inspired design with electric blue and purple accents
- **Fully Responsive** — Mobile hamburger menu, collapsible sidebar, adaptive 1-4 column grid

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 (Create React App) |
| Routing | React Router v6 |
| Styling | CSS Modules + CSS Custom Properties |
| State | React Context API |
| Persistence | localStorage |
| Fonts | Inter, Space Grotesk, JetBrains Mono |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

The app runs at `http://localhost:3000`.

## Project Structure

```
src/
├── data/            # Mock tutorials (25 entries) and constants
├── contexts/        # AuthContext and TutorialContext providers
├── hooks/           # useAuth, useTutorials, useLocalStorage, useDebounce
├── utils/           # Video URL parsing, filtering, formatting helpers
├── components/
│   ├── layout/      # Header, Footer, Sidebar
│   ├── TutorialCard, TutorialGallery, SearchFilter
│   ├── RatingWidget, ReviewSection, ShareButtons
│   ├── VideoEmbed, DifficultyBadge, StarDisplay
│   └── FilterChips, SortDropdown, Modal, EmptyState
└── pages/
    ├── HomePage         # Hero, featured, popular, category browse
    ├── SearchPage       # Sidebar filters + gallery
    ├── TutorialDetailPage  # Video embed, ratings, reviews
    ├── SubmitPage       # Tutorial submission form
    ├── CategoryPage     # Per-category listing
    ├── ProfilePage      # Bookmarks and submissions
    └── LoginPage, RegisterPage
```

## Demo Walkthrough

1. **Browse** the homepage to see featured and popular tutorials
2. **Search** using the Browse page — try filtering by "Godot" + "Beginner"
3. **View** a tutorial to see the embedded video, description, and metadata
4. **Register** an account to unlock rating, reviewing, bookmarking, and submission
5. **Submit** a YouTube or Vimeo tutorial link with category and difficulty tags
6. **Bookmark** tutorials and find them in your profile

## License

MIT
