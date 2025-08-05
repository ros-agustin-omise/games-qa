// Simple Global Leaderboard using GitHub Gists (no API keys needed)
class SimpleGlobalLeaderboard {
    constructor() {
        this.maxEntries = 50;
        this.localMaxEntries = 10;
        this.syncEnabled = true;
        
        // GitHub Gist IDs for each game (public, no auth needed)
        this.gistIds = {
            'memory-match': '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p',
            'rock-paper-scissors': '2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q',
            'number-guessing': '3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r',
            'word-scramble': '4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s',
            'spot-the-difference': '5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
            'test-case-designer': '6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u'
        };
        
        // Alternative: Use a simple array for demo mode
        this.demoMode = true; // Set to false when gists are set up
        this.demoScores = this.loadDemoScores();
    }

    // Load demo scores from localStorage for immediate functionality
    loadDemoScores() {
        const stored = localStorage.getItem('globalDemoScores');
        if (stored) {
            return JSON.parse(stored);
        }
        
        // Create sample global scores for demo
        return {
            'rock-paper-scissors': [
                { name: 'GlobalChamp', score: 25, date: '1/3/2025', time: '2:30 PM', timestamp: Date.now() - 86400000 },
                { name: 'WorldWinner', score: 22, date: '1/3/2025', time: '1:15 PM', timestamp: Date.now() - 90000000 },
                { name: 'ProPlayer', score: 20, date: '1/2/2025', time: '5:45 PM', timestamp: Date.now() - 172800000 },
                { name: 'GameMaster', score: 18, date: '1/2/2025', time: '3:20 PM', timestamp: Date.now() - 180000000 },
                { name: 'Champion2025', score: 15, date: '1/1/2025', time: '8:30 PM', timestamp: Date.now() - 259200000 }
            ],
            'memory-match': [
                { name: 'MemoryKing', score: 12, date: '1/3/2025', time: '4:20 PM', timestamp: Date.now() - 50000000 },
                { name: 'BrainMaster', score: 15, date: '1/3/2025', time: '2:10 PM', timestamp: Date.now() - 80000000 },
                { name: 'QuickMind', score: 18, date: '1/2/2025', time: '6:15 PM', timestamp: Date.now() - 160000000 }
            ]
        };
    }

    // Save demo scores
    saveDemoScores() {
        localStorage.setItem('globalDemoScores', JSON.stringify(this.demoScores));
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

    // Get global leaderboard (demo mode or real)
    async getGlobalLeaderboard(gameName) {
        if (this.demoMode) {
            // Use demo scores + local scores
            const demoGlobal = this.demoScores[gameName] || [];
            const localScores = this.getLocalLeaderboard(gameName);
            const merged = this.mergeScores(demoGlobal, localScores);
            
            // Sort and limit
            merged.sort((a, b) => this.compareScores(a, b, gameName));
            return merged.slice(0, this.maxEntries);
        }
        
        // TODO: Implement real GitHub Gist integration when needed
        return this.getLocalLeaderboard(gameName);
    }

    // Save score to global leaderboard
    async saveGlobalScore(gameName, entry) {
        // Add to local first
        const localResult = this.addScoreLocal(gameName, entry);

        if (this.demoMode) {
            // Add to demo global scores
            if (!this.demoScores[gameName]) {
                this.demoScores[gameName] = [];
            }
            
            this.demoScores[gameName].push(entry);
            this.demoScores[gameName].sort((a, b) => this.compareScores(a, b, gameName));
            
            if (this.demoScores[gameName].length > this.maxEntries) {
                this.demoScores[gameName].length = this.maxEntries;
            }
            
            this.saveDemoScores();
            return this.demoScores[gameName];
        }
        
        return localResult;
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
                Math.abs((globalScore.timestamp || 0) - (localScore.timestamp || 0)) < 60000 // Within 1 minute
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
                        <div class="global-indicator">🌍 Visible to all players${this.demoMode ? ' (Demo Mode)' : ''}</div>
                    </div>
                    <div class="score-display">
                        <div class="score-value">${score}</div>
                        <div class="score-label">${this.getScoreLabel(gameName, scoreType)}</div>
                    </div>
                    <div class="name-input-section">
                        <label for="playerName">Enter your name:</label>
                        <input type="text" id="playerName" maxlength="20" placeholder="Your Name" autocomplete="off">
                        <div class="privacy-note">📍 ${this.demoMode ? 'Demo: Scores saved locally with global simulation' : 'This will be visible on the global leaderboard'}</div>
                    </div>
                    <div class="modal-buttons">
                        <button class="modal-btn primary" id="submitScore">🌍 Submit${this.demoMode ? ' (Demo)' : ' Globally'}</button>
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
                    window.analytics.trackHighScore(gameName, score, this.demoMode ? 'demo-global' : 'global');
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
                        <span class="global-badge">🌍 ${this.demoMode ? 'Demo Global' : 'Global'} Leaderboard</span>
                        <span class="player-count">${leaderboard.length} players${this.demoMode ? ' (Demo + Local)' : ' worldwide'}</span>
                    </div>
                </div>
                <div class="leaderboard-list" id="leaderboardList">
                    ${this.renderLeaderboardList(leaderboard, currentPlayerName)}
                </div>
                <div class="leaderboard-actions">
                    <button class="action-btn" id="refreshLeaderboard">🔄 Refresh</button>
                    ${this.demoMode ? '<button class="action-btn" id="addDemoScores">🎮 Add Demo Competitors</button>' : ''}
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

        // Add demo scores button (demo mode only)
        if (this.demoMode && document.getElementById('addDemoScores')) {
            document.getElementById('addDemoScores').addEventListener('click', () => {
                this.addRandomDemoScores(gameName);
                // Refresh display
                document.getElementById('refreshLeaderboard').click();
            });
        }

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

    // Add random demo scores for testing
    addRandomDemoScores(gameName) {
        const names = ['GlobalStar', 'WorldChamp', 'ProGamer', 'TopPlayer', 'GameLegend', 'SkillMaster'];
        const randomName = names[Math.floor(Math.random() * names.length)];
        
        let randomScore;
        if (gameName === 'rock-paper-scissors') {
            randomScore = Math.floor(Math.random() * 20) + 5;
        } else if (gameName === 'memory-match') {
            randomScore = Math.floor(Math.random() * 30) + 10;
        } else {
            randomScore = Math.floor(Math.random() * 100) + 50;
        }
        
        const entry = {
            name: randomName + Math.floor(Math.random() * 100),
            score: randomScore,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            timestamp: Date.now() - Math.floor(Math.random() * 86400000) // Random time in last 24h
        };
        
        if (!this.demoScores[gameName]) {
            this.demoScores[gameName] = [];
        }
        
        this.demoScores[gameName].push(entry);
        this.saveDemoScores();
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
window.simpleGlobalLeaderboard = new SimpleGlobalLeaderboard();

// Replace the complex global leaderboard with the simple one
window.globalLeaderboard = window.simpleGlobalLeaderboard;

// Backward compatibility
window.leaderboard = {
    submitScore: (gameName, scoreData) => window.simpleGlobalLeaderboard.submitScore(gameName, scoreData),
    showLeaderboard: (gameName) => window.simpleGlobalLeaderboard.showLeaderboard(gameName)
};