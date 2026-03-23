import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as Sentry from '@sentry/react';

// Initialize Sentry (configure with your DSN)
// Sentry.init({
//   dsn: import.meta.env.VITE_SENTRY_DSN,
//   environment: import.meta.env.MODE,
//   integrations: [
//     Sentry.browserTracingIntegration(),
//     Sentry.replayIntegration({
//       maskAllText: true,
//       blockAllMedia: true,
//     }),
//   ],
//   tracesSampleRate: 1.0,
//   replaysSessionSampleRate: 0.1,
//   replaysOnErrorSampleRate: 1.0,
// });

/**
 * Report error to monitoring service
 * @param {Error} error - Error object
 * @param {object} context - Additional context
 */
export function reportError(error, context = {}) {
  console.error('Error reported:', error, context);
  
  if (typeof Sentry !== 'undefined' && Sentry.captureException) {
    Sentry.withScope((scope) => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
      Sentry.captureException(error);
    });
  }
}

/**
 * Set user context for error tracking
 * @param {object} user - User object with id, email, username
 */
export function setUserContext(user) {
  if (typeof Sentry !== 'undefined' && Sentry.setUser) {
    Sentry.setUser(user);
  }
}

/**
 * Clear user context on logout
 */
export function clearUserContext() {
  if (typeof Sentry !== 'undefined' && Sentry.setUser) {
    Sentry.setUser(null);
  }
}

/**
 * Track page view for analytics
 * @param {string} path - Page path
 * @param {string} title - Page title
 */
export function trackPageView(path, title) {
  console.log('Page view tracked:', { path, title });
  
  // Send to analytics endpoint if configured
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', import.meta.env.VITE_GA_TRACKING_ID, {
      page_path: path,
      page_title: title,
    });
  }
}

/**
 * Track custom event for analytics
 * @param {string} eventName - Event name
 * @param {object} params - Event parameters
 */
export function trackEvent(eventName, params = {}) {
  console.log('Event tracked:', eventName, params);
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}

/**
 * Hook to track page views automatically
 */
export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname) {
      trackPageView(location.pathname, document.title);
    }
  }, [location]);
}
