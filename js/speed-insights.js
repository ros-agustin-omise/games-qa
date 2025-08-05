// Vercel Speed Insights for Vanilla JavaScript
// Tracks Core Web Vitals and performance metrics

(function() {
    'use strict';

    // Initialize Speed Insights
    function initSpeedInsights() {
        try {
            // Check if we're in a supported environment
            if (typeof window === 'undefined' || typeof document === 'undefined') {
                console.warn('Speed Insights: Not supported in this environment');
                return;
            }

            // Load Vercel Speed Insights script
            loadSpeedInsightsScript();
            
            console.log('✅ Vercel Speed Insights initialized');
        } catch (error) {
            console.warn('Speed Insights initialization error:', error);
        }
    }

    // Load the Speed Insights script dynamically
    function loadSpeedInsightsScript() {
        const script = document.createElement('script');
        script.src = 'https://va.vercel-scripts.com/v1/speed-insights/script.js';
        script.async = true;
        script.defer = true;
        
        script.onload = function() {
            // Initialize speed insights tracking
            if (window.si) {
                console.log('✅ Speed Insights script loaded successfully');
                trackPageLoad();
            }
        };
        
        script.onerror = function() {
            console.warn('❌ Failed to load Speed Insights script');
        };
        
        document.head.appendChild(script);
    }

    // Track page load performance
    function trackPageLoad() {
        try {
            // Track initial page load
            if (window.si && typeof window.si === 'function') {
                window.si('track', 'pageload', {
                    path: window.location.pathname,
                    referrer: document.referrer || 'direct'
                });
            }

            // Track Core Web Vitals when available
            trackCoreWebVitals();
        } catch (error) {
            console.warn('Error tracking page load:', error);
        }
    }

    // Track Core Web Vitals (LCP, FID, CLS)
    function trackCoreWebVitals() {
        try {
            // Use Web Vitals library if available, otherwise use Performance Observer
            if ('PerformanceObserver' in window) {
                // Track Largest Contentful Paint (LCP)
                trackLCP();
                
                // Track First Input Delay (FID)
                trackFID();
                
                // Track Cumulative Layout Shift (CLS)
                trackCLS();
            }
        } catch (error) {
            console.warn('Error setting up Core Web Vitals tracking:', error);
        }
    }

    // Track Largest Contentful Paint
    function trackLCP() {
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                if (window.si) {
                    window.si('track', 'web-vital', {
                        name: 'LCP',
                        value: lastEntry.startTime,
                        path: window.location.pathname
                    });
                }
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (error) {
            console.warn('LCP tracking error:', error);
        }
    }

    // Track First Input Delay
    function trackFID() {
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    if (window.si) {
                        window.si('track', 'web-vital', {
                            name: 'FID',
                            value: entry.processingStart - entry.startTime,
                            path: window.location.pathname
                        });
                    }
                });
            });
            
            observer.observe({ entryTypes: ['first-input'] });
        } catch (error) {
            console.warn('FID tracking error:', error);
        }
    }

    // Track Cumulative Layout Shift
    function trackCLS() {
        try {
            let clsValue = 0;
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                
                if (window.si) {
                    window.si('track', 'web-vital', {
                        name: 'CLS',
                        value: clsValue,
                        path: window.location.pathname
                    });
                }
            });
            
            observer.observe({ entryTypes: ['layout-shift'] });
        } catch (error) {
            console.warn('CLS tracking error:', error);
        }
    }

    // Track game-specific performance metrics
    function trackGamePerformance(gameName, metrics) {
        try {
            if (window.si) {
                window.si('track', 'game-performance', {
                    game: gameName,
                    ...metrics,
                    path: window.location.pathname,
                    timestamp: Date.now()
                });
            }
        } catch (error) {
            console.warn('Game performance tracking error:', error);
        }
    }

    // Track loading times for game assets
    function trackGameLoadTime(gameName, startTime, endTime) {
        try {
            const loadTime = endTime - startTime;
            if (window.si) {
                window.si('track', 'game-load-time', {
                    game: gameName,
                    loadTime: loadTime,
                    path: window.location.pathname
                });
            }
        } catch (error) {
            console.warn('Game load time tracking error:', error);
        }
    }

    // Public API
    window.speedInsights = {
        init: initSpeedInsights,
        trackPageLoad: trackPageLoad,
        trackGamePerformance: trackGamePerformance,
        trackGameLoadTime: trackGameLoadTime
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSpeedInsights);
    } else {
        initSpeedInsights();
    }

})();