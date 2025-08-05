// Build script to bundle Vercel Analytics for vanilla JS
const fs = require('fs');
const path = require('path');

// Create a bundled analytics file that can be used directly in the browser
const analyticsBundle = `
// Vercel Analytics Bundle for Vanilla JS
(function() {
    'use strict';
    
    // Initialize Vercel Analytics
    function initAnalytics() {
        if (typeof window !== 'undefined') {
            window.va = window.va || function () { 
                (window.vaq = window.vaq || []).push(arguments); 
            };
            console.log('Vercel Analytics initialized');
            return true;
        }
        return false;
    }

    // Track game start events
    function trackGameStart(gameName) {
        if (window.va) {
            window.va('track', 'Game Started', {
                game: gameName,
                timestamp: new Date().toISOString()
            });
        }
    }

    // Track game completion events
    function trackGameComplete(gameName, score, result) {
        if (window.va) {
            window.va('track', 'Game Completed', {
                game: gameName,
                score: score,
                result: result,
                timestamp: new Date().toISOString()
            });
        }
    }

    // Track high score achievements
    function trackHighScore(gameName, score, rank) {
        if (window.va) {
            window.va('track', 'High Score', {
                game: gameName,
                score: score,
                rank: rank,
                timestamp: new Date().toISOString()
            });
        }
    }

    // Track page views for games
    function trackGameView(gameName) {
        if (window.va) {
            window.va('track', 'Game View', {
                game: gameName,
                page: window.location.pathname,
                timestamp: new Date().toISOString()
            });
        }
    }

    // Track user interactions
    function trackInteraction(action, gameName, details = {}) {
        if (window.va) {
            window.va('track', 'User Interaction', {
                action: action,
                game: gameName,
                details: details,
                timestamp: new Date().toISOString()
            });
        }
    }

    // Track leaderboard views
    function trackLeaderboardView(gameName) {
        if (window.va) {
            window.va('track', 'Leaderboard View', {
                game: gameName,
                timestamp: new Date().toISOString()
            });
        }
    }

    // Export functions to global scope
    window.analytics = {
        init: initAnalytics,
        trackGameStart: trackGameStart,
        trackGameComplete: trackGameComplete,
        trackHighScore: trackHighScore,
        trackGameView: trackGameView,
        trackInteraction: trackInteraction,
        trackLeaderboardView: trackLeaderboardView
    };

    // Auto-initialize when script loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnalytics);
    } else {
        initAnalytics();
    }
})();
`;

// Write the bundled file
fs.writeFileSync(path.join(__dirname, 'js', 'analytics.js'), analyticsBundle);
console.log('✅ Analytics bundle created successfully!');