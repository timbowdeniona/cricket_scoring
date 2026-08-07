'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { trackEvent } from './GoogleAnalytics';

export function WebVitalsReporter() {
  useReportWebVitals(metric => {
    trackEvent(metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  });

  return null;
}
