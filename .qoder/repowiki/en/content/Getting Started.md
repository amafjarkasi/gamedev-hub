# Getting Started

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [package.json](file://package.json)
- [vite.config.js](file://vite.config.js)
- [src/index.jsx](file://src/index.jsx)
- [src/App.jsx](file://src/App.jsx)
- [src/pages/HomePage.jsx](file://src/pages/HomePage.jsx)
- [src/components/SearchFilter.jsx](file://src/components/SearchFilter.jsx)
- [src/hooks/useTutorials.js](file://src/hooks/useTutorials.js)
- [src/data/tutorials.js](file://src/data/tutorials.js)
- [src/utils/filterUtils.js](file://src/utils/filterUtils.js)
- [src/data/constants.js](file://src/data/constants.js)
- [src/setupTests.js](file://src/setupTests.js)
- [src/utils/__tests__/filterUtils.test.js](file://src/utils/__tests__/filterUtils.test.js)
- [src/utils/cryptoUtils.js](file://src/utils/cryptoUtils.js)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Development Environment](#development-environment)
5. [Project Structure](#project-structure)
6. [Basic Usage](#basic-usage)
7. [Testing](#testing)
8. [Build Process](#build-process)
9. [Troubleshooting](#troubleshooting)
10. [Conclusion](#conclusion)

## Introduction
GameDev Hub is a modern, feature-rich web application for discovering, sharing, and organizing game development video tutorials. Built with React and Vite, it features a dark theme tailored for game developers, advanced search and filtering, tutorial submission, user accounts, and responsive design. This guide helps you set up the development environment, understand the codebase, and start contributing quickly.

## Prerequisites
Before installing and running GameDev Hub, ensure your system meets the following requirements:

- Node.js: The project requires a modern Node.js version compatible with the dependencies declared in the project. Check the engines specification in the package configuration for exact versions.
- Package Manager: npm or yarn. The project uses npm scripts for development, testing, and building.
- Basic React Knowledge: Familiarity with React fundamentals (components, props, hooks, context) is essential for navigating and extending the codebase.
- Browser Compatibility: The project targets modern browsers. The browserslist configuration defines supported browsers for development and production builds.

Key points to note:
- The project uses React 19 and Vite for development.
- Testing is configured with Vitest and React Testing Library.
- The application runs on localhost:3000 by default during development.

**Section sources**
- [package.json:15-21](file://package.json#L15-L21)
- [package.json:29-40](file://package.json#L29-L40)
- [vite.config.js:6-9](file://vite.config.js#L6-L9)

## Installation
Follow these step-by-step instructions to set up the project locally:

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies using npm:
   - Command: npm install
4. Start the development server:
   - Command: npm run dev
   - The app will be available at http://localhost:3000

Optional commands:
- Run tests: npm test
- Build for production: npm run build
- Preview production build: npm run preview

Notes:
- The development server is configured to listen on port 3000 and automatically open the browser.
- Hot reload is enabled by default with Vite.

**Section sources**
- [README.md:66-82](file://README.md#L66-L82)
- [vite.config.js:6-9](file://vite.config.js#L6-L9)
- [package.json:15-21](file://package.json#L15-L21)

## Development Environment
The development environment is powered by Vite and React 19. Here’s what you need to know:

- Port Configuration: The development server listens on port 3000 and opens the browser automatically.
- Hot Reload: Changes to source files trigger instant updates in the browser.
- Browser Compatibility: The project targets modern browsers as defined in the browserslist configuration.

Additional configuration highlights:
- Test environment: Vitest runs with jsdom and a setup file for React Testing Library.
- Dependency optimization: Vite pre-bundles React-related packages for faster cold starts.

**Section sources**
- [vite.config.js:6-18](file://vite.config.js#L6-L18)
- [package.json:29-40](file://package.json#L29-L40)
- [src/setupTests.js:1-3](file://src/setupTests.js#L1-L3)

## Project Structure
The project follows a feature-based structure under src/, organized into logical layers:

- data/: Mock tutorial datasets and constants for categories, difficulties, platforms, and durations.
- contexts/: React Context providers for authentication, tutorials, and toast notifications.
- hooks/: Custom hooks for authentication, tutorials, storage, debouncing, and toast management.
- utils/: Utility functions for filtering, formatting, video parsing, cryptography, and PropTypes shapes.
- components/: Reusable UI components (layout, cards, modals, filters, etc.).
- pages/: Route-level pages (Home, Search, Tutorial Detail, Submit, Category, Profile, Login, Register, NotFound).
- Root entry: src/index.jsx bootstraps the React application with routing and providers.
- Application shell: src/App.jsx defines routes, lazy-loading, error boundaries, and global UI elements.

Navigation tips:
- Start with src/pages/ to understand route-driven UI.
- Explore src/components/ to learn reusable UI patterns.
- Check src/hooks/ and src/contexts/ to understand state management.
- Review src/utils/ to grasp filtering, formatting, and validation logic.

**Section sources**
- [README.md:84-115](file://README.md#L84-L115)
- [src/index.jsx:1-24](file://src/index.jsx#L1-L24)
- [src/App.jsx:1-51](file://src/App.jsx#L1-L51)

## Basic Usage
Once the development server is running, you can explore the application:

- Browse tutorials on the homepage, which showcases featured, popular, and personalized “For You” content.
- Use the search and filter panel to refine results by category, difficulty, platform, engine version, duration, and minimum rating.
- Click on a tutorial to view its details, embedded video, ratings, reviews, and related tutorials.
- Register an account to unlock features like rating, reviewing, bookmarking, and tutorial submission.
- Submit a tutorial by providing a valid YouTube or Vimeo URL along with category and difficulty tags.

How filtering works:
- The search box supports recent search suggestions persisted in localStorage.
- Filters are applied instantly and can be cleared with the reset button.
- Sorting options include newest, most popular, highest rated, and most viewed.

**Section sources**
- [src/pages/HomePage.jsx:1-95](file://src/pages/HomePage.jsx#L1-L95)
- [src/components/SearchFilter.jsx:1-237](file://src/components/SearchFilter.jsx#L1-L237)
- [src/utils/filterUtils.js:1-99](file://src/utils/filterUtils.js#L1-L99)
- [src/data/constants.js:1-71](file://src/data/constants.js#L1-L71)

## Testing
The project uses Vitest and React Testing Library for unit tests. Tests are located in src/utils/__tests__/ and cover utility functions like filtering, sorting, and duration bounds.

Running tests:
- Command: npm test
- The test runner executes all tests and reports coverage and results.

Test coverage highlights:
- filterUtils.test.js validates filtering logic across multiple criteria (search query, categories, difficulties, platforms, engine versions, duration ranges, and minimum ratings).
- Additional tests cover sorting and duration bounds calculations.

**Section sources**
- [package.json:19](file://package.json#L19)
- [src/setupTests.js:1-3](file://src/setupTests.js#L1-L3)
- [src/utils/__tests__/filterUtils.test.js:1-253](file://src/utils/__tests__/filterUtils.test.js#L1-L253)

## Build Process
To prepare the application for production:

- Build command: npm run build
- Preview production build: npm run preview

Build configuration:
- Vite handles bundling, code splitting, and asset optimization.
- The application uses route-level code splitting with React.lazy and Suspense for improved performance.

Security and validation:
- Password hashing uses Web Crypto API PBKDF2 with per-user salts.
- Video embed URLs are sanitized to prevent unsafe protocols.

**Section sources**
- [package.json:17-20](file://package.json#L17-L20)
- [vite.config.js:15-18](file://vite.config.js#L15-L18)
- [src/utils/cryptoUtils.js:1-70](file://src/utils/cryptoUtils.js#L1-L70)

## Troubleshooting
Common setup issues and resolutions:

- Port conflicts on localhost:3000
  - Symptom: Port already in use.
  - Resolution: Change the port in vite.config.js or kill the process using port 3000.
  - Reference: [vite.config.js:7](file://vite.config.js#L7)

- Node.js version mismatch
  - Symptom: Dependency installation fails or runtime errors.
  - Resolution: Ensure your Node.js version satisfies the engines requirement defined in package.json.
  - Reference: [package.json:15-21](file://package.json#L15-L21)

- Missing dependencies after clone
  - Symptom: npm run dev fails due to missing modules.
  - Resolution: Run npm install to install all dependencies.
  - Reference: [README.md:68-70](file://README.md#L68-L70)

- Browser compatibility issues
  - Symptom: Features not working in older browsers.
  - Resolution: The project targets modern browsers as defined in browserslist. Use a supported browser for development.
  - Reference: [package.json:29-40](file://package.json#L29-L40)

- Test failures
  - Symptom: npm test reports failing tests.
  - Resolution: Review the test output and fix the underlying logic or mocks. Ensure the testing environment is correctly configured.
  - Reference: [src/setupTests.js:1-3](file://src/setupTests.js#L1-L3)

- Hot reload not working
  - Symptom: Changes do not reflect in the browser.
  - Resolution: Verify Vite is running and check for syntax errors in the console. Restart the development server if needed.
  - Reference: [vite.config.js:6](file://vite.config.js#L6)

## Conclusion
You now have the essentials to install, run, and contribute to GameDev Hub. Use the development server to explore features, leverage the testing suite to validate changes, and follow the project structure to locate relevant code. For advanced customization, review the contexts, hooks, and utility modules that power the application’s functionality.