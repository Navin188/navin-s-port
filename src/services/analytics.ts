// src/services/analytics.ts
// Unified Google Analytics 4 (GA4) + Microsoft Clarity Integration

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    clarity?: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID || '').trim();
export const CLARITY_PROJECT_ID = (import.meta.env.VITE_CLARITY_PROJECT_ID || '').trim();

/**
 * Initializes Google Analytics 4 and Microsoft Clarity asynchronously.
 * Safely loads the tracking scripts into document head.
 */
export const initAnalytics = () => {
  if (typeof window === 'undefined') return;

  // 1. Google Analytics 4 (gtag.js)
  if (GA_MEASUREMENT_ID && !window.gtag) {
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer?.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: true,
      page_path: window.location.pathname,
    });
  }

  // 2. Microsoft Clarity
  if (CLARITY_PROJECT_ID && !window.clarity) {
    (function (c: any, l: any, a: any, r: any, i: any, t?: any, y?: any) {
      c[a] =
        c[a] ||
        function () {
          (c[a].q = c[a].q || []).push(arguments);
        };
      t = l.createElement(r);
      t.async = 1;
      t.src = `https://www.clarity.ms/tag/${i}`;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_PROJECT_ID);
  }
};

/**
 * Universal Event Tracker: Sends custom events simultaneously to GA4 and Microsoft Clarity.
 */
export const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
  if (typeof window === 'undefined') return;

  // Google Analytics 4
  if (window.gtag) {
    window.gtag('event', eventName, params);
  }

  // Microsoft Clarity Custom Tag / Event
  if (window.clarity) {
    window.clarity('event', eventName);
    Object.entries(params).forEach(([key, val]) => {
      window.clarity?.('set', key, String(val));
    });
  }
};

/**
 * Helper to track resume downloads
 */
export const trackResumeDownload = () => {
  trackEvent('download_resume', {
    file_name: 'Navin_Boddhul_Resume.pdf',
    event_category: 'engagement',
  });
};

/**
 * Helper to track section navigation
 */
export const trackSectionView = (sectionId: string, sectionName: string) => {
  trackEvent('section_view', {
    section_id: sectionId,
    section_name: sectionName,
  });
};
