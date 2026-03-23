/**
 * Web Vitals Performance Monitoring
 * Tracks Core Web Vitals and other performance metrics
 */

// Report Web Vitals to analytics
export function reportWebVitals(metric) {
  // Log to console in development
  if (import.meta.env.DEV) {
    console.log('Web Vitals:', metric);
  }

  // Send to analytics endpoint
  const analyticsId = import.meta.env.VITE_GA_TRACKING_ID;
  if (analyticsId && typeof window !== 'undefined' && window.gtag) {
    // Use web-vitals library format for Google Analytics
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }

  // Optionally send to your own backend
  // fetch('/api/analytics', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     name: metric.name,
  //     value: metric.value,
  //     delta: metric.delta,
  //     rating: metric.rating,
  //     id: metric.id,
  //     navigationType: metric.navigationType,
  //   }),
  // });
}
