// Main navigation function
function openGame(gameName) {
    window.location.href = `games/${gameName}/index.html`;
}

// Issue reporting functionality
function showReportIssue() {
    const modal = document.createElement('div');
    modal.className = 'leaderboard-modal';
    modal.innerHTML = `
        <div class="leaderboard-modal-content" style="max-width: 600px;">
            <div class="leaderboard-header">
                <h2>🐛 Report an Issue</h2>
                <p>Help us improve Playverse by reporting bugs or suggesting features</p>
            </div>
            
            <form id="issueForm">
                <div style="margin-bottom: 20px;">
                    <label for="issueTitle" style="display: block; margin-bottom: 5px; font-weight: bold;">Issue Title *</label>
                    <input type="text" id="issueTitle" required maxlength="100" 
                           placeholder="Brief description of the issue"
                           style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 5px; font-size: 1em;">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label for="issueGame" style="display: block; margin-bottom: 5px; font-weight: bold;">Related Game</label>
                    <select id="issueGame" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 5px; font-size: 1em;">
                        <option value="general">🎮 General / Website</option>
                        <option value="memory-match">🧠 Memory Match</option>
                        <option value="number-guessing">🎯 Number Guessing</option>
                        <option value="word-scramble">📝 Word Scramble</option>
                        <option value="rock-paper-scissors">✂️ Rock Paper Scissors</option>
                        <option value="spot-the-difference">🔍 Spot the Difference</option>
                        <option value="test-case-designer">🧪 Test Case Designer</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label for="issueType" style="display: block; margin-bottom: 5px; font-weight: bold;">Issue Type</label>
                    <select id="issueType" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 5px; font-size: 1em;">
                        <option value="bug">🐛 Bug Report</option>
                        <option value="feature">✨ Feature Request</option>
                        <option value="improvement">🔧 Improvement</option>
                        <option value="other">❓ Other</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label for="issueDescription" style="display: block; margin-bottom: 5px; font-weight: bold;">Description *</label>
                    <textarea id="issueDescription" required rows="5" maxlength="1000"
                              placeholder="Please describe the issue in detail. Include steps to reproduce if it's a bug."
                              style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 5px; font-size: 1em; resize: vertical;"></textarea>
                    <div style="text-align: right; font-size: 0.8em; color: #666; margin-top: 5px;">
                        <span id="charCount">0</span>/1000 characters
                    </div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label for="reporterName" style="display: block; margin-bottom: 5px; font-weight: bold;">Your Name (Optional)</label>
                    <input type="text" id="reporterName" maxlength="50" 
                           placeholder="Your name (optional)"
                           style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 5px; font-size: 1em;">
                </div>
            </form>
            
            <div class="modal-buttons">
                <button class="modal-btn primary" id="submitIssue">🚀 Submit Issue</button>
                <button class="modal-btn secondary" id="cancelIssue">Cancel</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    
    // Character counter
    const descriptionField = document.getElementById('issueDescription');
    const charCount = document.getElementById('charCount');
    
    descriptionField.addEventListener('input', () => {
        charCount.textContent = descriptionField.value.length;
    });
    
    // Focus on title field
    setTimeout(() => document.getElementById('issueTitle').focus(), 100);

    // Submit handler
    document.getElementById('submitIssue').addEventListener('click', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('issueTitle').value.trim();
        const description = document.getElementById('issueDescription').value.trim();
        const game = document.getElementById('issueGame').value;
        const type = document.getElementById('issueType').value;
        const reporterName = document.getElementById('reporterName').value.trim() || 'Anonymous';
        
        if (!title || !description) {
            alert('Please fill in all required fields (Title and Description).');
            return;
        }
        
        // Disable button and show loading
        const submitBtn = document.getElementById('submitIssue');
        submitBtn.disabled = true;
        submitBtn.textContent = '🔄 Submitting...';
        
        try {
            // Submit to Firebase using existing Firebase connection
            if (window.firebaseGlobalLeaderboard && window.firebaseGlobalLeaderboard.database) {
                const issueRef = window.firebaseGlobalLeaderboard.database.ref('issues').push();
                const issue = {
                    title,
                    description,
                    game,
                    type,
                    status: 'open',
                    reportedBy: reporterName,
                    timestamp: Date.now(),
                    createdAt: new Date().toISOString(),
                    deviceInfo: {
                        userAgent: navigator.userAgent,
                        platform: navigator.platform,
                        language: navigator.language
                    }
                };
                
                await issueRef.set(issue);
                
                // Track analytics
                if (window.analytics) {
                    window.analytics.trackEvent('issue_reported', {
                        game: game,
                        type: type
                    });
                }
                
                // Show success message
                modal.innerHTML = `
                    <div class="leaderboard-modal-content" style="max-width: 500px; text-align: center;">
                        <div class="leaderboard-header">
                            <h2 style="color: #27ae60;">✅ Issue Submitted!</h2>
                            <p>Thank you for helping us improve Playverse!</p>
                        </div>
                        <div style="padding: 20px;">
                            <p>Your issue has been successfully submitted and will be reviewed by our team.</p>
                            <p style="color: #666; font-size: 0.9em;">Issue ID: ${issueRef.key}</p>
                        </div>
                        <div class="modal-buttons">
                            <button class="modal-btn primary" onclick="window.location.href='issues.html'">📋 View All Issues</button>
                            <button class="modal-btn secondary" onclick="document.body.removeChild(this.closest('.leaderboard-modal'))">Close</button>
                        </div>
                    </div>
                `;
            } else {
                throw new Error('Firebase not initialized');
            }
            
        } catch (error) {
            console.error('Error submitting issue:', error);
            alert('Failed to submit issue: ' + error.message);
            
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.textContent = '🚀 Submit Issue';
        }
    });

    // Cancel handler
    document.getElementById('cancelIssue').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Initialize Firebase Global Leaderboard
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase Global Leaderboard
    if (typeof FirebaseGlobalLeaderboard !== 'undefined') {
        window.firebaseGlobalLeaderboard = new FirebaseGlobalLeaderboard();
        console.log('✅ Firebase Global Leaderboard initialized on home page');
    } else {
        console.log('⚠️ Firebase Global Leaderboard not available, falling back to local leaderboards');
    }
    
    // Initialize local leaderboard as fallback
    if (typeof Leaderboard !== 'undefined') {
        window.gameLeaderboard = new Leaderboard();
    }
    // Add hover sound effect (optional)
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click animation
        card.addEventListener('click', function() {
            this.style.transform = 'translateY(-2px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            }, 150);
        });
    });
    
    // Add fade-in animation for cards
    gameCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });
});

// Utility functions for games
const GameUtils = {
    // Generate random number between min and max
    randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    
    // Shuffle array
    shuffleArray: (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },
    
    // Play sound (if audio files are available)
    playSound: (soundName) => {
        try {
            const audio = new Audio(`../sounds/${soundName}.mp3`);
            audio.play().catch(() => {}); // Ignore errors if no sound files
        } catch (e) {
            // Ignore sound errors
        }
    },
    
    // Save high score to localStorage
    saveHighScore: (gameName, score) => {
        const key = `highScore_${gameName}`;
        const currentHigh = localStorage.getItem(key) || 0;
        if (score > currentHigh) {
            localStorage.setItem(key, score);
            return true; // New high score!
        }
        return false;
    },
    
    // Get high score from localStorage
    getHighScore: (gameName) => {
        return parseInt(localStorage.getItem(`highScore_${gameName}`)) || 0;
    }
};

// Show all leaderboards
function showAllLeaderboards() {
    const games = [
        'spot-the-difference',
        'memory-match', 
        'rock-paper-scissors',
        'number-guessing',
        'word-scramble',
        'test-case-designer'
    ];
    
    const modal = document.createElement('div');
    modal.className = 'leaderboard-modal';
    modal.innerHTML = `
        <div class="leaderboard-modal-content large">
            <div class="leaderboard-header">
                <h2>🏆 All Game Leaderboards</h2>
                <p>Select a game to view its leaderboard</p>
            </div>
            <div class="game-selector">
                ${games.map(game => `
                    <button class="game-selector-btn" onclick="selectGameLeaderboard('${game}')">
                        ${window.firebaseGlobalLeaderboard ? window.firebaseGlobalLeaderboard.getGameTitle(game) : game.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </button>
                `).join('')}
            </div>
            <div class="modal-buttons">
                <button class="modal-btn primary" onclick="closeAllLeaderboards()">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Store modal reference for closing
    window.currentLeaderboardModal = modal;
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeAllLeaderboards();
        }
    });
}

function selectGameLeaderboard(gameName) {
    closeAllLeaderboards();
    if (window.firebaseGlobalLeaderboard) {
        window.firebaseGlobalLeaderboard.showLeaderboard(gameName);
    } else if (window.gameLeaderboard) {
        // Fallback to local leaderboard if Firebase not available
        window.gameLeaderboard.showLeaderboard(gameName);
    } else {
        alert('Leaderboard system not available. Please refresh the page and try again.');
    }
}

function closeAllLeaderboards() {
    if (window.currentLeaderboardModal) {
        document.body.removeChild(window.currentLeaderboardModal);
        window.currentLeaderboardModal = null;
    }
}