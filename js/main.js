// Main navigation function
function openGame(gameName) {
    window.location.href = `games/${gameName}/index.html`;
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