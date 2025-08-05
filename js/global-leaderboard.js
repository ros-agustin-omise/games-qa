// Global Leaderboard System - Works across all devices
class GlobalLeaderboard {
    constructor() {
        this.maxEntries = 50; // Increased for global leaderboard
        this.localMaxEntries = 10; // Keep local display smaller
        this.apiEndpoint = 'https://api.jsonbin.io/v3/b'; // JSONBin.io API
        this.binId = null; // Will be set per game
        this.apiKey = '$2a$10$0VjFCKx7QjO5GkG2JxZjH.8rRN5c9Z0b0Z1zHrI8GqOL8pY6l7yXu'; // Public API key for demo
        this.syncEnabled = true;
        this.lastSyncTime = {};
        
        // Game-specific bin IDs (you can create these at jsonbin.io)
        this.binIds = {
            'memory-match': '67901234abcd1234567890ab',
            'rock-paper-scissors': '67901234abcd1234567890ac', 
            'number-guessing': '67901234abcd1234567890ad',
            'word-scramble': '67901234abcd1234567890ae',
            'spot-the-difference': '67901234abcd1234567890af',
            'test-case-designer': '67901234abcd1234567890ag'
        };
    }

    // Get local leaderboard (fallback)
    getLocalLeaderboard(gameName) {
        const key = `leaderboard_${gameName}`;
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : [];
    }

    // Save local leaderboard
    saveLocalLeaderboard(gameName, leaderboard) {
        const key = `leaderboard_${gameName}`;
        localStorage.setItem(key, JSON.stringify(leaderboard));
    }

    // Get global leaderboard from server
    async getGlobalLeaderboard(gameName) {
        if (!this.syncEnabled || !this.binIds[gameName]) {
            return this.getLocalLeaderboard(gameName);
        }

        try {
            const response = await fetch(`${this.apiEndpoint}/${this.binIds[gameName]}/latest`, {
                method: 'GET',
                headers: {
                    'X-Master-Key': this.apiKey,
                    'X-Bin-Meta': 'false'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const globalScores = data.scores || [];
                
                // Merge with local scores and save locally as cache
                const localScores = this.getLocalLeaderboard(gameName);
                const mergedScores = this.mergeScores(globalScores, localScores);
                this.saveLocalLeaderboard(gameName, mergedScores);
                
                return mergedScores;
            } else {
                console.warn('Failed to fetch global leaderboard, using local');
                return this.getLocalLeaderboard(gameName);
            }
        } catch (error) {
            console.warn('Error fetching global leaderboard:', error);
            return this.getLocalLeaderboard(gameName);
        }
    }

    // Save score to global leaderboard
    async saveGlobalScore(gameName, entry) {
        if (!this.syncEnabled || !this.binIds[gameName]) {
            return this.addScoreLocal(gameName, entry);
        }

        // Add to local first (immediate feedback)
        const localResult = this.addScoreLocal(gameName, entry);

        try {
            // Get current global scores
            const currentGlobal = await this.getGlobalLeaderboard(gameName);
            
            // Add new entry
            currentGlobal.push(entry);
            
            // Sort and limit
            currentGlobal.sort((a, b) => this.compareScores(a, b, gameName));
            if (currentGlobal.length > this.maxEntries) {
                currentGlobal.length = this.maxEntries;
            }

            // Save to server
            const response = await fetch(`${this.apiEndpoint}/${this.binIds[gameName]}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.apiKey,
                    'X-Bin-Meta': 'false'
                },
                body: JSON.stringify({
                    scores: currentGlobal,
                    lastUpdate: new Date().toISOString(),
                    game: gameName
                })
            });

            if (response.ok) {
                console.log('Score synced to global leaderboard');
                // Update local cache with latest global data
                this.saveLocalLeaderboard(gameName, currentGlobal);
                return currentGlobal;
            } else {
                console.warn('Failed to sync score to global leaderboard');
                return localResult;
            }
        } catch (error) {
            console.warn('Error syncing score:', error);
            return localResult;
        }
    }

    // Add score locally only
    addScoreLocal(gameName, entry) {
        const leaderboard = this.getLocalLeaderboard(gameName);
        leaderboard.push(entry);
        
        // Sort based on game type
        leaderboard.sort((a, b) => this.compareScores(a, b, gameName));
        
        // Keep only top entries for local display
        if (leaderboard.length > this.localMaxEntries) {
            leaderboard.length = this.localMaxEntries;
        }

        this.saveLocalLeaderboard(gameName, leaderboard);
        return leaderboard;
    }

    // Compare scores based on game type
    compareScores(a, b, gameName) {
        const lowScoreGames = ['memory-match', 'spot-the-difference']; // Games where lower is better
        
        if (lowScoreGames.includes(gameName)) {
            return a.score - b.score; // Ascending (lower is better)
        } else {
            return b.score - a.score; // Descending (higher is better)
        }
    }

    // Merge local and global scores, removing duplicates
    mergeScores(globalScores, localScores) {
        const allScores = [...globalScores];
        
        // Add local scores that aren't already in global
        localScores.forEach(localScore => {
            const exists = globalScores.some(globalScore => 
                globalScore.name === localScore.name && 
                globalScore.score === localScore.score &&
                globalScore.date === localScore.date
            );
            
            if (!exists) {
                allScores.push(localScore);
            }
        });

        return allScores;
    }

    // Check if score qualifies for leaderboard
    async qualifiesForLeaderboard(gameName, score, scoreType = 'high') {
        const leaderboard = await this.getGlobalLeaderboard(gameName);
        
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

    // Submit score with name input
    async submitScore(gameName, scoreData) {
        const { score, details = {}, scoreType = 'high' } = scoreData;
        
        // Check if qualifies
        const qualifies = await this.qualifiesForLeaderboard(gameName, score, scoreType);
        
        if (!qualifies && (await this.getGlobalLeaderboard(gameName)).length >= this.localMaxEntries) {
            // Show "score not high enough" message
            this.showScoreTooLow(score, this.getScoreLabel(gameName, scoreType));
            return null;
        }

        // Show name input
        return new Promise(async (resolve) => {
            const modal = document.createElement('div');
            modal.className = 'leaderboard-modal';
            modal.innerHTML = `
                <div class="leaderboard-modal-content">
                    <div class="leaderboard-header">
                        <h2>🎉 Great Score!</h2>
                        <p>Submit to Global Leaderboard</p>
                        <div class="global-indicator">🌍 Visible to all players worldwide</div>
                    </div>
                    <div class="score-display">
                        <div class="score-value">${score}</div>
                        <div class="score-label">${this.getScoreLabel(gameName, scoreType)}</div>
                    </div>
                    <div class="name-input-section">
                        <label for="playerName">Enter your name:</label>
                        <input type="text" id="playerName" maxlength="20" placeholder="Your Name" autocomplete="off">
                        <div class="privacy-note">📍 This will be visible on the global leaderboard</div>
                    </div>
                    <div class="modal-buttons">
                        <button class="modal-btn primary" id="submitScore">🌍 Submit Globally</button>
                        <button class="modal-btn secondary" id="submitLocal">💾 Save Locally Only</button>
                        <button class="modal-btn tertiary" id="skipScore">Skip</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Focus on input
            setTimeout(() => {
                document.getElementById('playerName').focus();
            }, 100);

            // Create entry object
            const createEntry = (playerName) => ({
                name: playerName,
                score: score,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                timestamp: Date.now(),
                deviceId: this.getDeviceId(),
                ...details
            });

            // Handle global submit
            const submitGlobalHandler = async () => {
                const nameInput = document.getElementById('playerName');
                const playerName = nameInput.value.trim() || 'Anonymous';
                const entry = createEntry(playerName);
                
                // Show loading
                nameInput.disabled = true;
                document.getElementById('submitScore').textContent = '🔄 Submitting...';
                
                const leaderboard = await this.saveGlobalScore(gameName, entry);
                document.body.removeChild(modal);
                
                // Track analytics
                if (window.analytics) {
                    window.analytics.trackHighScore(gameName, score, 'global');
                }
                
                resolve({ submitted: true, global: true, leaderboard, playerName, entry });
            };

            // Handle local submit
            const submitLocalHandler = () => {
                const nameInput = document.getElementById('playerName');
                const playerName = nameInput.value.trim() || 'Anonymous';
                const entry = createEntry(playerName);
                
                const leaderboard = this.addScoreLocal(gameName, entry);
                document.body.removeChild(modal);
                
                resolve({ submitted: true, global: false, leaderboard, playerName, entry });
            };

            // Handle skip
            const skipHandler = () => {
                document.body.removeChild(modal);
                resolve({ submitted: false });
            };

            // Event listeners
            document.getElementById('submitScore').addEventListener('click', submitGlobalHandler);
            document.getElementById('submitLocal').addEventListener('click', submitLocalHandler);
            document.getElementById('skipScore').addEventListener('click', skipHandler);
            
            // Enter key to submit globally
            document.getElementById('playerName').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    submitGlobalHandler();
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

    // Show score too low message
    showScoreTooLow(score, label) {
        const modal = document.createElement('div');
        modal.className = 'leaderboard-modal';
        modal.innerHTML = `
            <div class="leaderboard-modal-content">
                <div class="leaderboard-header">
                    <h2>🎯 Keep Trying!</h2>
                    <p>Your score didn't make it to the leaderboard this time</p>
                </div>
                <div class="score-display">
                    <div class="score-value">${score}</div>
                    <div class="score-label">${label}</div>
                </div>
                <div class="encouragement">
                    <p>💪 Practice makes perfect!</p>
                    <p>🎮 Play again to improve your score</p>
                </div>
                <div class="modal-buttons">
                    <button class="modal-btn primary" id="closeModal">Try Again</button>
                    <button class="modal-btn secondary" id="viewLeaderboard">View Leaderboard</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('closeModal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.getElementById('viewLeaderboard').addEventListener('click', () => {
            document.body.removeChild(modal);
            this.showLeaderboard(gameName);
        });
    }

    // Show leaderboard display
    async showLeaderboard(gameName, currentPlayerName = null) {
        const leaderboard = await this.getGlobalLeaderboard(gameName);
        
        const modal = document.createElement('div');
        modal.className = 'leaderboard-modal';
        modal.innerHTML = `
            <div class="leaderboard-modal-content large">
                <div class="leaderboard-header">
                    <h2>🏆 ${this.getGameTitle(gameName)} Leaderboard</h2>
                    <div class="leaderboard-type">
                        <span class="global-badge">🌍 Global Leaderboard</span>
                        <span class="player-count">${leaderboard.length} players worldwide</span>
                    </div>
                </div>
                <div class="leaderboard-list" id="leaderboardList">
                    ${this.renderLeaderboardList(leaderboard, currentPlayerName)}
                </div>
                <div class="leaderboard-actions">
                    <button class="action-btn" id="refreshLeaderboard">🔄 Refresh</button>
                    <button class="action-btn" id="syncScores">🌍 Sync Local Scores</button>
                </div>
                <div class="modal-buttons">
                    <button class="modal-btn primary" id="closeLeaderboard">Close</button>
                    <button class="modal-btn secondary" id="clearLocal">Clear Local Only</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        document.getElementById('closeLeaderboard').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.getElementById('refreshLeaderboard').addEventListener('click', async () => {
            const refreshBtn = document.getElementById('refreshLeaderboard');
            refreshBtn.textContent = '🔄 Refreshing...';
            refreshBtn.disabled = true;
            
            const freshLeaderboard = await this.getGlobalLeaderboard(gameName);
            document.getElementById('leaderboardList').innerHTML = 
                this.renderLeaderboardList(freshLeaderboard, currentPlayerName);
            
            refreshBtn.textContent = '🔄 Refresh';
            refreshBtn.disabled = false;
        });

        document.getElementById('syncScores').addEventListener('click', async () => {
            await this.syncLocalScores(gameName);
            // Refresh display
            const freshLeaderboard = await this.getGlobalLeaderboard(gameName);
            document.getElementById('leaderboardList').innerHTML = 
                this.renderLeaderboardList(freshLeaderboard, currentPlayerName);
        });

        document.getElementById('clearLocal').addEventListener('click', () => {
            if (confirm('Clear your local scores only? (Global scores will remain)')) {
                localStorage.removeItem(`leaderboard_${gameName}`);
                document.body.removeChild(modal);
            }
        });

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    // Sync local scores to global
    async syncLocalScores(gameName) {
        const localScores = this.getLocalLeaderboard(gameName);
        
        for (const score of localScores) {
            // Add sync flag to avoid duplicates
            if (!score.synced) {
                score.synced = true;
                await this.saveGlobalScore(gameName, score);
            }
        }
    }

    // Generate device ID for duplicate detection
    getDeviceId() {
        let deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
            deviceId = 'device_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('deviceId', deviceId);
        }
        return deviceId;
    }

    // Render leaderboard list
    renderLeaderboardList(leaderboard, currentPlayerName = null) {
        if (leaderboard.length === 0) {
            return '<div class="empty-leaderboard">🎯 No scores yet. Be the first to make history!</div>';
        }

        return leaderboard.slice(0, this.maxEntries).map((entry, index) => {
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
                        <div class="player-name">
                            ${entry.name}
                            ${isCurrentPlayer ? '<span class="you-badge">YOU</span>' : ''}
                        </div>
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
        let details = `${entry.date}`;
        if (entry.level) details += ` • Level ${entry.level}`;
        if (entry.moves) details += ` • ${entry.moves} moves`;
        if (entry.time_taken) details += ` • ${entry.time_taken}`;
        if (entry.difficulty) details += ` • ${entry.difficulty}`;
        return details;
    }
}

// Create global instance
window.globalLeaderboard = new GlobalLeaderboard();

// Backward compatibility - redirect old calls to new system
window.leaderboard = {
    submitScore: (gameName, scoreData) => window.globalLeaderboard.submitScore(gameName, scoreData),
    showLeaderboard: (gameName) => window.globalLeaderboard.showLeaderboard(gameName)
};