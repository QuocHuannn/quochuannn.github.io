import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface GoogleAnalyticsProps {
  trackingId?: string;
  enableInDevelopment?: boolean;
}



const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({
  trackingId = import.meta.env.VITE_GA_TRACKING_ID || 'G-XXXXXXXXXX',
  enableInDevelopment = false
}) => {
  const isDevelopment = import.meta.env.DEV;
  const analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
  const shouldTrack = !isDevelopment && analyticsEnabled && trackingId && trackingId !== 'G-XXXXXXXXXX';

  useEffect(() => {
    if (!shouldTrack || !trackingId) {
      if (isDevelopment) {
        console.log('Google Analytics disabled:', {
          analyticsEnabled,
          isDevelopment,
          enableInDevelopment,
          trackingId,
          shouldTrack
        });
      }
      return;
    }

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // Define gtag function
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    // Configure Google Analytics
    window.gtag('js', new Date());
    window.gtag('config', trackingId, {
      page_title: document.title,
      page_location: window.location.href,
      send_page_view: true
    });

    // Track initial page view
    trackPageView(window.location.pathname + window.location.search);

    // Log initialization in development
    if (isDevelopment) {
      console.log('Google Analytics initialized with ID:', trackingId);
    }
  }, [trackingId, shouldTrack, isDevelopment, analyticsEnabled, enableInDevelopment]);

  // Don't render script tags if tracking is disabled
  if (!shouldTrack || !trackingId) {
    return null;
  }

  return (
    <Helmet>
      {/* Google Analytics Global Site Tag (gtag.js) */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
      />
    </Helmet>
  );
};

// Analytics utility functions
export const trackPageView = (path: string) => {
  // Skip tracking if analytics disabled or in development or with invalid tracking ID
  const analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
  if (typeof window !== 'undefined' && window.gtag && analyticsEnabled && !import.meta.env.DEV) {
    // Use actual tracking ID from environment or config
    const trackingId = import.meta.env.VITE_GA_TRACKING_ID || 'G-XXXXXXXXXX';
    if (trackingId !== 'G-XXXXXXXXXX') {
      window.gtag('config', trackingId, {
        page_path: path,
        page_title: document.title,
        page_location: window.location.href
      });
    }
  }
};

export const trackEvent = ({
  action,
  category,
  label,
  value
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  const analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
  if (typeof window !== 'undefined' && window.gtag && analyticsEnabled) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
};

export const trackTiming = ({
  name,
  value,
  category = 'Performance'
}: {
  name: string;
  value: number;
  category?: string;
}) => {
  const analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
  if (typeof window !== 'undefined' && window.gtag && analyticsEnabled) {
    window.gtag('event', 'timing_complete', {
      name,
      value: Math.round(value),
      event_category: category
    });
  }
};

export const trackException = ({
  description,
  fatal = false
}: {
  description: string;
  fatal?: boolean;
}) => {
  const analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
  if (typeof window !== 'undefined' && window.gtag && analyticsEnabled) {
    window.gtag('event', 'exception', {
      description,
      fatal
    });
  }
};

export const trackCustomEvent = (eventName: string, parameters: Record<string, any>) => {
  const analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
  if (typeof window !== 'undefined' && window.gtag && analyticsEnabled) {
    window.gtag('event', eventName, parameters);
  }
};

// Portfolio-specific tracking functions
export const trackProjectView = (projectName: string) => {
  trackEvent({
    action: 'view_project',
    category: 'Portfolio',
    label: projectName
  });
};

export const trackContactFormSubmit = () => {
  trackEvent({
    action: 'submit_contact_form',
    category: 'Contact',
    label: 'Contact Form'
  });
};

export const trackDownloadResume = () => {
  trackEvent({
    action: 'download_resume',
    category: 'Portfolio',
    label: 'Resume PDF'
  });
};

export const trackSocialClick = (platform: string) => {
  trackEvent({
    action: 'click_social_link',
    category: 'Social',
    label: platform
  });
};

export const trackSkillInteraction = (skillName: string) => {
  trackEvent({
    action: 'interact_skill',
    category: 'Skills',
    label: skillName
  });
};

export const trackThemeChange = (theme: string) => {
  trackEvent({
    action: 'change_theme',
    category: 'UI',
    label: theme
  });
};

export const trackScrollDepth = (percentage: number) => {
  trackEvent({
    action: 'scroll_depth',
    category: 'Engagement',
    label: `${percentage}%`,
    value: percentage
  });
};

// Hook for tracking scroll depth
export const useScrollTracking = () => {
  useEffect(() => {
    let maxScroll = 0;
    const milestones = [25, 50, 75, 100];
    const trackedMilestones = new Set<number>();

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        // Track milestones
        milestones.forEach(milestone => {
          if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
            trackedMilestones.add(milestone);
            trackScrollDepth(milestone);
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
};

export default GoogleAnalytics;