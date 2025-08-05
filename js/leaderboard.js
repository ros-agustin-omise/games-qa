// Centralized Leaderboard System for All Games
class Leaderboard {
    constructor() {
        this.maxEntries = 10;
    }

    // Get leaderboard for a specific game
    getLeaderboard(gameName) {
        const key = `leaderboard_${gameName}`;
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : [];
    }

    // Save leaderboard for a specific game
    saveLeaderboard(gameName, leaderboard) {
        const key = `leaderboard_${gameName}`;
        localStorage.setItem(key, JSON.stringify(leaderboard));
    }

    // Check if score qualifies for leaderboard
    qualifiesForLeaderboard(gameName, score, scoreType = 'high') {
        const leaderboard = this.getLeaderboard(gameName);
        
        if (leaderboard.length < this.maxEntries) {
            return true;
        }

        const worstScore = leaderboard[leaderboard.length - 1].score;
        
        if (scoreType === 'high') {
            return score > worstScore;
        } else if (scoreType === 'low') {
            return score < worstScore;
        }
        
        return false;
    }

    // Add score to leaderboard
    addScore(gameName, playerName, score, details = {}, scoreType = 'high') {
        const leaderboard = this.getLeaderboard(gameName);
        
        const entry = {
            name: playerName,
            score: score,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            ...details
        };

        leaderboard.push(entry);

        // Sort based on score type
        if (scoreType === 'high') {
            leaderboard.sort((a, b) => b.score - a.score);
        } else if (scoreType === 'low') {
            leaderboard.sort((a, b) => a.score - b.score);
        }

        // Keep only top 10
        if (leaderboard.length > this.maxEntries) {
            leaderboard.length = this.maxEntries;
        }

        this.saveLeaderboard(gameName, leaderboard);
        return leaderboard;
    }

    // Show name input modal
    showNameInput(gameName, score, details = {}, scoreType = 'high') {
        return new Promise((resolve) => {
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'leaderboard-modal';
            modal.innerHTML = `
                <div class="leaderboard-modal-content">
                    <div class="leaderboard-header">
                        <h2>🎉 Great Score!</h2>
                        <p>You made it to the leaderboard!</p>
                    </div>
                    <div class="score-display">
                        <div class="score-value">${score}</div>
                        <div class="score-label">${this.getScoreLabel(gameName, scoreType)}</div>
                    </div>
                    <div class="name-input-section">
                        <label for="playerName">Enter your name:</label>
                        <input type="text" id="playerName" maxlength="20" placeholder="Your Name" autocomplete="off">
                    </div>
                    <div class="modal-buttons">
                        <button class="modal-btn primary" id="submitScore">Save Score</button>
                        <button class="modal-btn secondary" id="skipScore">Skip</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Focus on input
            setTimeout(() => {
                document.getElementById('playerName').focus();
            }, 100);

            // Handle submit
            const submitHandler = () => {
                const nameInput = document.getElementById('playerName');
                const playerName = nameInput.value.trim() || 'Anonymous';
                
                const leaderboard = this.addScore(gameName, playerName, score, details, scoreType);
                document.body.removeChild(modal);
                resolve({ submitted: true, leaderboard, playerName });
            };

            // Handle skip
            const skipHandler = () => {
                document.body.removeChild(modal);
                resolve({ submitted: false });
            };

            // Event listeners
            document.getElementById('submitScore').addEventListener('click', submitHandler);
            document.getElementById('skipScore').addEventListener('click', skipHandler);
            
            // Enter key to submit
            document.getElementById('playerName').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    submitHandler();
                }
            });

            // Close on background click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    skipHandler();
                }
            });
        });
    }

    // Show leaderboard display
    showLeaderboard(gameName, currentPlayerName = null) {
        const leaderboard = this.getLeaderboard(gameName);
        
        const modal = document.createElement('div');
        modal.className = 'leaderboard-modal';
        modal.innerHTML = `
            <div class="leaderboard-modal-content large">
                <div class="leaderboard-header">
                    <h2>🏆 ${this.getGameTitle(gameName)} Leaderboard</h2>
                </div>
                <div class="leaderboard-list">
                    ${this.renderLeaderboardList(leaderboard, currentPlayerName)}
                </div>
                <div class="modal-buttons">
                    <button class="modal-btn primary" id="closeLeaderboard">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        document.getElementById('closeLeaderboard').addEventListener('click', () => {
            document.body.removeChild(modal);
        });



        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    // Render leaderboard list
    renderLeaderboardList(leaderboard, currentPlayerName = null) {
        if (leaderboard.length === 0) {
            return '<div class="empty-leaderboard">No scores yet. Be the first!</div>';
        }

        return leaderboard.map((entry, index) => {
            const isCurrentPlayer = currentPlayerName && entry.name === currentPlayerName;
            const rankClass = index < 3 ? `rank-${index + 1}` : '';
            const currentClass = isCurrentPlayer ? 'current-player' : '';
            
            return `
                <div class="leaderboard-entry ${rankClass} ${currentClass}">
                    <div class="rank">
                        ${this.getRankIcon(index + 1)}
                        <span class="rank-number">${index + 1}</span>
                    </div>
                    <div class="player-info">
                        <div class="player-name">${entry.name}</div>
                        <div class="score-details">${this.formatScoreDetails(entry)}</div>
                    </div>
                    <div class="score">${entry.score}</div>
                </div>
            `;
        }).join('');
    }

    // Get rank icon
    getRankIcon(rank) {
        const icons = {
            1: '🥇',
            2: '🥈', 
            3: '🥉'
        };
        return icons[rank] || '🏅';
    }

    // Get game title
    getGameTitle(gameName) {
        const titles = {
            'memory-match': 'Memory Match',
            'rock-paper-scissors': 'Rock Paper Scissors',
            'number-guessing': 'Number Guessing',
            'word-scramble': 'Word Scramble',
            'spot-the-difference': 'Spot the Difference',
            'test-case-designer': 'Test Case Designer'
        };
        return titles[gameName] || gameName;
    }

    // Get score label
    getScoreLabel(gameName, scoreType) {
        const labels = {
            'memory-match': scoreType === 'low' ? 'moves' : 'points',
            'rock-paper-scissors': 'wins',
            'number-guessing': 'points', 
            'word-scramble': 'points',
            'spot-the-difference': scoreType === 'low' ? 'seconds' : 'points',
            'test-case-designer': 'points'
        };
        return labels[gameName] || 'points';
    }

    // Format score details
    formatScoreDetails(entry) {
        let details = `${entry.date} at ${entry.time}`;
        if (entry.level) details += ` | Level ${entry.level}`;
        if (entry.moves) details += ` | ${entry.moves} moves`;
        if (entry.time_taken) details += ` | ${entry.time_taken}`;
        if (entry.difficulty) details += ` | ${entry.difficulty}`;
        return details;
    }
}

// Create global leaderboard instance
window.gameLeaderboard = new Leaderboard();