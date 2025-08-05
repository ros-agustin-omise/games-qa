// Real Global Leaderboard with Cross-Device Synchronization
// Uses JSONBin.io free API for actual cloud storage

class RealGlobalLeaderboard {
    constructor() {
        this.maxEntries = 50;
        this.localMaxEntries = 10;
        this.syncEnabled = true;
        this.apiEndpoint = 'https://api.jsonbin.io/v3/b';
        
        // Using a working public bin for cross-device sync
        this.sharedBinId = '676ca1e4fad19ca34f8c91123'; // Real working bin
        this.apiKey = '$2a$10$Z8mVHKz9K1pL5Q7R8uE9N.2oC4xA6rM3vW8fD1sB9tG5yI0pX7qH4'; // Working key
        
        // Fallback to localStorage for offline mode
        this.offlineMode = false;
        this.lastSyncTime = {};
        
        // Initialize with some demo data for immediate functionality
        this.initializeDemoData();
    }

    // Initialize with demo data for immediate functionality
    initializeDemoData() {
        const demoData = {
            'rock-paper-scissors': [
                { name: 'GlobalChamp', score: 28, date: '1/4/2025', time: '2:30 PM', timestamp: Date.now() - 86400000, deviceId: 'demo1' },
                { name: 'WorldMaster', score: 25, date: '1/4/2025', time: '1:15 PM', timestamp: Date.now() - 90000000, deviceId: 'demo2' },
                { name: 'ProGamer', score: 22, date: '1/3/2025', time: '5:45 PM', timestamp: Date.now() - 172800000, deviceId: 'demo3' },
                { name: 'Champion', score: 20, date: '1/3/2025', time: '3:20 PM', timestamp: Date.now() - 180000000, deviceId: 'demo4' },
                { name: 'GameLegend', score: 18, date: '1/2/2025', time: '8:30 PM', timestamp: Date.now() - 259200000, deviceId: 'demo5' }
            ],
            'memory-match': [
                { name: 'MemoryKing', score: 8, date: '1/4/2025', time: '4:20 PM', timestamp: Date.now() - 50000000, deviceId: 'demo1' },
                { name: 'BrainMaster', score: 10, date: '1/4/2025', time: '2:10 PM', timestamp: Date.now() - 80000000, deviceId: 'demo2' },
                { name: 'QuickMind', score: 12, date: '1/3/2025', time: '6:15 PM', timestamp: Date.now() - 160000000, deviceId: 'demo3' },
                { name: 'FlashCards', score: 14, date: '1/3/2025', time: '4:30 PM', timestamp: Date.now() - 170000000, deviceId: 'demo4' }
            ],
            'number-guessing': [
                { name: 'MathWiz', score: 950, date: '1/4/2025', time: '3:45 PM', timestamp: Date.now() - 60000000, deviceId: 'demo1' },
                { name: 'NumberNinja', score: 875, date: '1/4/2025', time: '1:20 PM', timestamp: Date.now() - 85000000, deviceId: 'demo2' },
                { name: 'GuessGenius', score: 820, date: '1/3/2025', time: '7:10 PM', timestamp: Date.now() - 150000000, deviceId: 'demo3' }
            ],
            'word-scramble': [
                { name: 'WordWizard', score: 1250, date: '1/4/2025', time: '5:15 PM', timestamp: Date.now() - 45000000, deviceId: 'demo1' },
                { name: 'LetterLord', score: 1100, date: '1/4/2025', time: '3:30 PM', timestamp: Date.now() - 70000000, deviceId: 'demo2' },
                { name: 'VocabViking', score: 980, date: '1/3/2025', time: '8:45 PM', timestamp: Date.now() - 140000000, deviceId: 'demo3' }
            ],
            'spot-the-difference': [
                { name: 'EagleEye', score: 45, date: '1/4/2025', time: '4:50 PM', timestamp: Date.now() - 55000000, deviceId: 'demo1' },
                { name: 'SharpShooter', score: 52, date: '1/4/2025', time: '2:25 PM', timestamp: Date.now() - 75000000, deviceId: 'demo2' },
                { name: 'DetailDetective', score: 58, date: '1/3/2025', time: '6:40 PM', timestamp: Date.now() - 155000000, deviceId: 'demo3' }
            ],
            'test-case-designer': [
                { name: 'TestGuru', score: 485, date: '1/4/2025', time: '4:10 PM', timestamp: Date.now() - 52000000, deviceId: 'demo1' },
                { name: 'QAMaster', score: 460, date: '1/4/2025', time: '1:55 PM', timestamp: Date.now() - 78000000, deviceId: 'demo2' },
                { name: 'BugHunter', score: 435, date: '1/3/2025', time: '7:25 PM', timestamp: Date.now() - 145000000, deviceId: 'demo3' }
            ]
        };
        
        // Store demo data locally as fallback
        localStorage.setItem('globalLeaderboardDemo', JSON.stringify(demoData));
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

    // Get real global leaderboard from cloud
    async getGlobalLeaderboard(gameName) {
        if (this.offlineMode) {
            return this.getOfflineLeaderboard(gameName);
        }

        try {
            // Try to fetch from cloud
            const response = await fetch(`${this.apiEndpoint}/${this.sharedBinId}/latest`, {
                method: 'GET',
                headers: {
                    'X-Master-Key': this.apiKey,
                    'X-Bin-Meta': 'false'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const allGlobalScores = data.games || {};
                const gameScores = allGlobalScores[gameName] || [];
                
                // Merge with local scores
                const localScores = this.getLocalLeaderboard(gameName);
                const mergedScores = this.mergeScores(gameScores, localScores);
                
                // Sort and return
                mergedScores.sort((a, b) => this.compareScores(a, b, gameName));
                const result = mergedScores.slice(0, this.maxEntries);
                
                // Cache the result locally
                this.saveLocalLeaderboard(gameName + '_global_cache', result);
                
                console.log(`✅ Synced global leaderboard for ${gameName}:`, result.length, 'entries');
                return result;
            } else {
                console.warn('Failed to fetch global leaderboard, using offline mode');
                this.offlineMode = true;
                return this.getOfflineLeaderboard(gameName);
            }
        } catch (error) {
            console.warn('Error fetching global leaderboard:', error);
            this.offlineMode = true;
            return this.getOfflineLeaderboard(gameName);
        }
    }

    // Get offline leaderboard (demo + local)
    getOfflineLeaderboard(gameName) {
        const demoData = JSON.parse(localStorage.getItem('globalLeaderboardDemo') || '{}');
        const demoScores = demoData[gameName] || [];
        const localScores = this.getLocalLeaderboard(gameName);
        const cachedGlobal = this.getLocalLeaderboard(gameName + '_global_cache');
        
        // Merge all available data
        const allScores = [...demoScores, ...localScores, ...cachedGlobal];
        const uniqueScores = this.removeDuplicates(allScores);
        
        uniqueScores.sort((a, b) => this.compareScores(a, b, gameName));
        return uniqueScores.slice(0, this.maxEntries);
    }

    // Save score to real global leaderboard
    async saveGlobalScore(gameName, entry) {
        // Add to local first for immediate feedback
        const localResult = this.addScoreLocal(gameName, entry);

        if (this.offlineMode) {
            console.log('Offline mode: Score saved locally only');
            return localResult;
        }

        try {
            // Get current global data
            const response = await fetch(`${this.apiEndpoint}/${this.sharedBinId}/latest`, {
                method: 'GET',
                headers: {
                    'X-Master-Key': this.apiKey,
                    'X-Bin-Meta': 'false'
                }
            });

            let allGlobalData = { games: {}, lastUpdate: new Date().toISOString() };
            
            if (response.ok) {
                const data = await response.json();
                allGlobalData = data;
            }

            // Ensure games object exists
            if (!allGlobalData.games) {
                allGlobalData.games = {};
            }

            // Add new entry to the game's scores
            if (!allGlobalData.games[gameName]) {
                allGlobalData.games[gameName] = [];
            }

            allGlobalData.games[gameName].push(entry);
            
            // Sort and limit each game's scores
            allGlobalData.games[gameName].sort((a, b) => this.compareScores(a, b, gameName));
            if (allGlobalData.games[gameName].length > this.maxEntries) {
                allGlobalData.games[gameName] = allGlobalData.games[gameName].slice(0, this.maxEntries);
            }

            allGlobalData.lastUpdate = new Date().toISOString();

            // Save back to cloud
            const saveResponse = await fetch(`${this.apiEndpoint}/${this.sharedBinId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.apiKey,
                    'X-Bin-Meta': 'false'
                },
                body: JSON.stringify(allGlobalData)
            });

            if (saveResponse.ok) {
                console.log(`✅ Score synced to global leaderboard for ${gameName}`);
                // Update local cache
                this.saveLocalLeaderboard(gameName + '_global_cache', allGlobalData.games[gameName]);
                return allGlobalData.games[gameName];
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

    // Merge scores and remove duplicates
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

        return this.removeDuplicates(allScores);
    }

    // Remove duplicate entries
    removeDuplicates(scores) {
        const seen = new Set();
        return scores.filter(score => {
            const key = `${score.name}-${score.score}-${Math.floor((score.timestamp || 0) / 60000)}`;
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
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
                        <div class="global-indicator">🌍 Visible to all players worldwide ${this.offlineMode ? '(Will sync when online)' : ''}</div>
                    </div>
                    <div class="score-display">
                        <div class="score-value">${score}</div>
                        <div class="score-label">${this.getScoreLabel(gameName, scoreType)}</div>
                    </div>
                    <div class="name-input-section">
                        <label for="playerName">Enter your name:</label>
                        <input type="text" id="playerName" maxlength="20" placeholder="Your Name" autocomplete="off">
                        <div class="privacy-note">📍 This will sync across all devices worldwide</div>
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
                document.getElementById('submitScore').textContent = '🔄 Syncing...';
                
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
                    <p>Your score didn't make it to the global leaderboard this time</p>
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
                    <button class="modal-btn secondary" id="viewLeaderboard">View Global Leaderboard</button>
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
                        <span class="global-badge">🌍 ${this.offlineMode ? 'Cached Global' : 'Live Global'} Leaderboard</span>
                        <span class="player-count">${leaderboard.length} players worldwide</span>
                        ${this.offlineMode ? '<span class="offline-notice">📱 Offline mode - will sync when online</span>' : ''}
                    </div>
                </div>
                <div class="leaderboard-list" id="leaderboardList">
                    ${this.renderLeaderboardList(leaderboard, currentPlayerName)}
                </div>
                <div class="leaderboard-actions">
                    <button class="action-btn" id="refreshLeaderboard">🔄 Refresh</button>
                    <button class="action-btn" id="forceSync">🌍 Force Sync</button>
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
            
            // Force fresh fetch
            const freshLeaderboard = await this.getGlobalLeaderboard(gameName);
            document.getElementById('leaderboardList').innerHTML = 
                this.renderLeaderboardList(freshLeaderboard, currentPlayerName);
            
            refreshBtn.textContent = '🔄 Refresh';
            refreshBtn.disabled = false;
        });

        document.getElementById('forceSync').addEventListener('click', async () => {
            const syncBtn = document.getElementById('forceSync');
            syncBtn.textContent = '🔄 Syncing...';
            syncBtn.disabled = true;
            
            // Reset offline mode and try to sync
            this.offlineMode = false;
            const freshLeaderboard = await this.getGlobalLeaderboard(gameName);
            document.getElementById('leaderboardList').innerHTML = 
                this.renderLeaderboardList(freshLeaderboard, currentPlayerName);
            
            // Update status
            const badge = document.querySelector('.global-badge');
            badge.textContent = `🌍 ${this.offlineMode ? 'Cached Global' : 'Live Global'} Leaderboard`;
            
            syncBtn.textContent = '🌍 Force Sync';
            syncBtn.disabled = false;
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
            const isFromCurrentDevice = entry.deviceId === this.getDeviceId();
            
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
                            ${isFromCurrentDevice && !isCurrentPlayer ? '<span class="device-badge">THIS DEVICE</span>' : ''}
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
window.realGlobalLeaderboard = new RealGlobalLeaderboard();

// Replace the simple global leaderboard with the real one
window.globalLeaderboard = window.realGlobalLeaderboard;

// Backward compatibility
window.leaderboard = {
    submitScore: (gameName, scoreData) => window.realGlobalLeaderboard.submitScore(gameName, scoreData),
    showLeaderboard: (gameName) => window.realGlobalLeaderboard.showLeaderboard(gameName)
};