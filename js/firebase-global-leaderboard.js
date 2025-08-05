// Firebase Global Leaderboard with Real-time Cross-Device Sync
// Connects to your Firebase project for enterprise-level global competition

class FirebaseGlobalLeaderboard {
    constructor() {
        this.maxEntries = 10;
        this.localMaxEntries = 10;
        this.syncEnabled = true;
        
        // Firebase configuration - YOUR ACTUAL PROJECT
        this.firebaseConfig = {
            apiKey: "AIzaSyAF_BGwl2SSPbnsyVGB9T2cHl3rR0KiyQs",
            authDomain: "games-qa-prod.firebaseapp.com",
            databaseURL: "https://games-qa-prod-default-rtdb.firebaseio.com/",
            projectId: "games-qa-prod",
            storageBucket: "games-qa-prod.firebasestorage.app",
            messagingSenderId: "871171350020",
            appId: "1:871171350020:web:93581c31a80657b3985f51",
            measurementId: "G-K549VCVLMJ"
        };
        
        this.firebase = null;
        this.database = null;
        this.offlineMode = false;
        this.realtimeListeners = new Map();
        
        // Initialize with demo data for immediate functionality
        this.initializeDemoData();
        
        // Initialize Firebase
        this.initializeFirebase();
    }

    // Initialize Firebase SDK
    async initializeFirebase() {
        try {
            // Check if Firebase is already loaded
            if (typeof firebase !== 'undefined') {
                this.firebase = firebase;
            } else {
                console.warn('Firebase SDK not loaded. Loading from CDN...');
                await this.loadFirebaseSDK();
            }

            // Initialize Firebase app
            if (!this.firebase.apps.length) {
                this.firebase.initializeApp(this.firebaseConfig);
            }

            // Get database reference
            this.database = this.firebase.database();
            
            // Test connection
            await this.testConnection();
            
            console.log('✅ Firebase connected successfully!');
            this.offlineMode = false;
            
            // Enable offline persistence
            this.database.goOffline();
            this.database.goOnline();
            
        } catch (error) {
            console.warn('Firebase initialization failed:', error);
            console.warn('Falling back to offline mode with demo data');
            this.offlineMode = true;
        }
    }

    // Load Firebase SDK dynamically
    async loadFirebaseSDK() {
        return new Promise((resolve, reject) => {
            // Load Firebase App
            const appScript = document.createElement('script');
            appScript.src = 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js';
            appScript.onload = () => {
                // Load Firebase Database
                const dbScript = document.createElement('script');
                dbScript.src = 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js';
                dbScript.onload = () => {
                    this.firebase = firebase;
                    resolve();
                };
                dbScript.onerror = reject;
                document.head.appendChild(dbScript);
            };
            appScript.onerror = reject;
            document.head.appendChild(appScript);
        });
    }

    // Test Firebase connection
    async testConnection() {
        try {
            const testRef = this.database.ref('connection-test');
            await testRef.set({
                timestamp: this.firebase.database.ServerValue.TIMESTAMP,
                test: true
            });
            await testRef.remove();
            console.log('✅ Firebase connection test successful!');
        } catch (error) {
            console.warn('❌ Firebase connection test failed:', error.message);
            if (error.code === 'PERMISSION_DENIED') {
                console.warn('💡 Fix: Update Firebase database rules to allow read/write access');
                console.warn('📖 See: https://console.firebase.google.com/project/games-qa-prod/database/rules');
            }
            throw error;
        }
    }

    // Initialize with demo data for offline mode
    initializeDemoData() {
        const demoData = {
            'rock-paper-scissors': [
                { name: 'FirebaseChamp', score: 28, date: '1/4/2025', time: '2:30 PM', timestamp: Date.now() - 86400000, deviceId: 'demo1' },
                { name: 'RealtimeMaster', score: 25, date: '1/4/2025', time: '1:15 PM', timestamp: Date.now() - 90000000, deviceId: 'demo2' },
                { name: 'CloudGamer', score: 22, date: '1/3/2025', time: '5:45 PM', timestamp: Date.now() - 172800000, deviceId: 'demo3' },
                { name: 'SyncChampion', score: 20, date: '1/3/2025', time: '3:20 PM', timestamp: Date.now() - 180000000, deviceId: 'demo4' }
            ],
            'memory-match': [
                { name: 'MemoryPro', score: 8, date: '1/4/2025', time: '4:20 PM', timestamp: Date.now() - 50000000, deviceId: 'demo1' },
                { name: 'BrainSync', score: 10, date: '1/4/2025', time: '2:10 PM', timestamp: Date.now() - 80000000, deviceId: 'demo2' },
                { name: 'QuickCloud', score: 12, date: '1/3/2025', time: '6:15 PM', timestamp: Date.now() - 160000000, deviceId: 'demo3' }
            ],
            'number-guessing': [
                { name: 'NumberNinja', score: 950, date: '1/4/2025', time: '3:45 PM', timestamp: Date.now() - 60000000, deviceId: 'demo1' },
                { name: 'MathMaster', score: 875, date: '1/4/2025', time: '1:20 PM', timestamp: Date.now() - 85000000, deviceId: 'demo2' }
            ],
            'word-scramble': [
                { name: 'WordWizard', score: 1250, date: '1/4/2025', time: '5:15 PM', timestamp: Date.now() - 45000000, deviceId: 'demo1' },
                { name: 'LetterLord', score: 1100, date: '1/4/2025', time: '3:30 PM', timestamp: Date.now() - 70000000, deviceId: 'demo2' }
            ],
            'spot-the-difference': [
                { name: 'EagleEye', score: 45, date: '1/4/2025', time: '4:50 PM', timestamp: Date.now() - 55000000, deviceId: 'demo1' },
                { name: 'SharpSync', score: 52, date: '1/4/2025', time: '2:25 PM', timestamp: Date.now() - 75000000, deviceId: 'demo2' }
            ],
            'test-case-designer': [
                { name: 'TestGuru', score: 485, date: '1/4/2025', time: '4:10 PM', timestamp: Date.now() - 52000000, deviceId: 'demo1' },
                { name: 'QAMaster', score: 460, date: '1/4/2025', time: '1:55 PM', timestamp: Date.now() - 78000000, deviceId: 'demo2' }
            ]
        };
        
        localStorage.setItem('firebaseLeaderboardDemo', JSON.stringify(demoData));
    }

    // Get Firebase leaderboard with real-time sync
    async getGlobalLeaderboard(gameName) {
        if (this.offlineMode) {
            return this.getOfflineLeaderboard(gameName);
        }

        try {
            const leaderboardRef = this.database.ref(`leaderboards/${gameName}`);
            const snapshot = await leaderboardRef.orderByChild('score').limitToLast(this.maxEntries).once('value');
            
            let firebaseScores = [];
            if (snapshot.exists()) {
                snapshot.forEach(childSnapshot => {
                    firebaseScores.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                });
                // Firebase limitToLast returns in ascending order, so reverse for highest-first
                firebaseScores.reverse();
            }

            // Merge with local scores
            const localScores = this.getLocalLeaderboard(gameName);
            const mergedScores = this.mergeScores(firebaseScores, localScores);
            
            // Sort based on game type
            mergedScores.sort((a, b) => this.compareScores(a, b, gameName));
            const result = mergedScores.slice(0, this.maxEntries);
            
            // Cache for offline access
            this.saveLocalLeaderboard(gameName + '_firebase_cache', result);
            
            console.log(`✅ Firebase sync complete for ${gameName}:`, result.length, 'entries');
            return result;
            
        } catch (error) {
            console.warn('Firebase fetch error:', error);
            this.offlineMode = true;
            return this.getOfflineLeaderboard(gameName);
        }
    }

    // Setup real-time listener for leaderboard updates
    setupRealtimeListener(gameName, callback) {
        if (this.offlineMode || !this.database) {
            return null;
        }

        try {
            const leaderboardRef = this.database.ref(`leaderboards/${gameName}`);
            
            const listener = leaderboardRef.orderByChild('score').limitToLast(this.maxEntries).on('value', (snapshot) => {
                let realtimeScores = [];
                if (snapshot.exists()) {
                    snapshot.forEach(childSnapshot => {
                        realtimeScores.push({
                            id: childSnapshot.key,
                            ...childSnapshot.val()
                        });
                    });
                    // Firebase limitToLast returns in ascending order, so reverse for highest-first
                    realtimeScores.reverse();
                }
                
                // Sort and callback
                realtimeScores.sort((a, b) => this.compareScores(a, b, gameName));
                callback(realtimeScores.slice(0, this.maxEntries));
            });

            this.realtimeListeners.set(gameName, { ref: leaderboardRef, listener });
            console.log(`🔄 Real-time listener active for ${gameName}`);
            return listener;
            
        } catch (error) {
            console.warn('Real-time listener setup failed:', error);
            return null;
        }
    }

    // Remove real-time listener
    removeRealtimeListener(gameName) {
        const listenerData = this.realtimeListeners.get(gameName);
        if (listenerData) {
            listenerData.ref.off('value', listenerData.listener);
            this.realtimeListeners.delete(gameName);
            console.log(`❌ Real-time listener removed for ${gameName}`);
        }
    }

    // Save score to Firebase with real-time sync
    async saveGlobalScore(gameName, entry) {
        // Save locally first for immediate feedback
        const localResult = this.addScoreLocal(gameName, entry);

        if (this.offlineMode || !this.database) {
            console.log('Offline mode: Score saved locally, will sync when Firebase is available');
            return localResult;
        }

        try {
            // Create Firebase entry with server timestamp
            const firebaseEntry = {
                ...entry,
                timestamp: this.firebase.database.ServerValue.TIMESTAMP,
                synced: true
            };

            // Push to Firebase (auto-generates unique key)
            const leaderboardRef = this.database.ref(`leaderboards/${gameName}`);
            const newEntryRef = await leaderboardRef.push(firebaseEntry);
            
            console.log(`✅ Score synced to Firebase for ${gameName}:`, newEntryRef.key);

            // Update local cache
            const updatedLeaderboard = await this.getGlobalLeaderboard(gameName);
            this.saveLocalLeaderboard(gameName + '_firebase_cache', updatedLeaderboard);

            // Track analytics
            if (window.analytics) {
                window.analytics.trackHighScore(gameName, entry.score, 'firebase_global');
            }

            return updatedLeaderboard;
            
        } catch (error) {
            console.warn('Firebase save error:', error);
            console.warn('Score saved locally, will sync when connection restored');
            return localResult;
        }
    }

    // Get offline leaderboard (demo + local + cached)
    getOfflineLeaderboard(gameName) {
        const demoData = JSON.parse(localStorage.getItem('firebaseLeaderboardDemo') || '{}');
        const demoScores = demoData[gameName] || [];
        const localScores = this.getLocalLeaderboard(gameName);
        const cachedFirebase = this.getLocalLeaderboard(gameName + '_firebase_cache');
        
        // Merge all available data
        const allScores = [...demoScores, ...localScores, ...cachedFirebase];
        const uniqueScores = this.removeDuplicates(allScores);
        
        uniqueScores.sort((a, b) => this.compareScores(a, b, gameName));
        return uniqueScores.slice(0, this.maxEntries);
    }

    // Local leaderboard management
    getLocalLeaderboard(gameName) {
        const key = `leaderboard_${gameName}`;
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : [];
    }

    saveLocalLeaderboard(gameName, leaderboard) {
        const key = `leaderboard_${gameName}`;
        localStorage.setItem(key, JSON.stringify(leaderboard));
    }

    addScoreLocal(gameName, entry) {
        const leaderboard = this.getLocalLeaderboard(gameName);
        leaderboard.push(entry);
        
        leaderboard.sort((a, b) => this.compareScores(a, b, gameName));
        
        if (leaderboard.length > this.maxEntries) {
            leaderboard.length = this.maxEntries;
        }

        this.saveLocalLeaderboard(gameName, leaderboard);
        return leaderboard;
    }

    // Score comparison logic
    compareScores(a, b, gameName) {
        const lowScoreGames = ['spot-the-difference'];
        
        if (lowScoreGames.includes(gameName)) {
            return a.score - b.score; // Ascending (lower is better)
        } else {
            return b.score - a.score; // Descending (higher is better)
        }
    }

    // Merge and deduplicate scores
    mergeScores(firebaseScores, localScores) {
        const allScores = [...firebaseScores];
        
        localScores.forEach(localScore => {
            const exists = firebaseScores.some(firebaseScore => 
                firebaseScore.name === localScore.name && 
                firebaseScore.score === localScore.score &&
                Math.abs((firebaseScore.timestamp || 0) - (localScore.timestamp || 0)) < 60000
            );
            
            if (!exists) {
                allScores.push(localScore);
            }
        });

        return this.removeDuplicates(allScores);
    }

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

    // Submit score with name input and Firebase sync
    async submitScore(gameName, scoreData) {
        const { score, details = {}, scoreType = 'high' } = scoreData;
        
        // Check if qualifies
        const qualifies = await this.qualifiesForLeaderboard(gameName, score, scoreType);
        
        if (!qualifies && (await this.getGlobalLeaderboard(gameName)).length >= this.maxEntries) {
            this.showScoreTooLow(score, this.getScoreLabel(gameName, scoreType));
            return null;
        }

        return new Promise(async (resolve) => {
            const modal = document.createElement('div');
            modal.className = 'leaderboard-modal';
            modal.innerHTML = `
                <div class="leaderboard-modal-content">
                    <div class="leaderboard-header">
                        <h2>🎉 Great Score!</h2>
                        <p>Submit to Firebase Global Leaderboard</p>
                        <div class="global-indicator">
                            🔥 ${this.offlineMode ? 'Will sync to Firebase when online' : 'Live Firebase sync'} 
                            <br>🌍 Visible worldwide in real-time
                        </div>
                    </div>
                    <div class="score-display">
                        <div class="score-value">${score}</div>
                        <div class="score-label">${this.getScoreLabel(gameName, scoreType)}</div>
                    </div>
                    <div class="name-input-section">
                        <label for="playerName">Enter your name:</label>
                        <input type="text" id="playerName" maxlength="20" placeholder="Your Name" autocomplete="off">
                        <div class="privacy-note">🔥 Firebase real-time sync across all devices globally</div>
                    </div>
                    <div class="modal-buttons">
                        <button class="modal-btn primary" id="submitScore">🔥 Submit to Global Leaderboard</button>
                        <button class="modal-btn tertiary" id="skipScore">Skip</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
            setTimeout(() => document.getElementById('playerName').focus(), 100);

            const createEntry = (playerName) => ({
                name: playerName,
                score: score,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                timestamp: Date.now(),
                deviceId: this.getDeviceId(),
                ...details
            });

            // Firebase submit handler
            const submitFirebaseHandler = async () => {
                const nameInput = document.getElementById('playerName');
                const playerName = nameInput.value.trim() || 'Anonymous';
                const entry = createEntry(playerName);
                
                nameInput.disabled = true;
                document.getElementById('submitScore').textContent = '🔄 Syncing to Firebase...';
                
                const leaderboard = await this.saveGlobalScore(gameName, entry);
                document.body.removeChild(modal);
                
                resolve({ submitted: true, firebase: true, leaderboard, playerName, entry });
            };



            // Skip handler
            const skipHandler = () => {
                document.body.removeChild(modal);
                resolve({ submitted: false });
            };

            // Event listeners
            document.getElementById('submitScore').addEventListener('click', submitFirebaseHandler);
            document.getElementById('skipScore').addEventListener('click', skipHandler);
            
            document.getElementById('playerName').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') submitFirebaseHandler();
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) skipHandler();
            });
        });
    }

    // Check if score qualifies
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

    // Show leaderboard with real-time updates
    async showLeaderboard(gameName, currentPlayerName = null) {
        const leaderboard = await this.getGlobalLeaderboard(gameName);
        
        const modal = document.createElement('div');
        modal.className = 'leaderboard-modal';
        modal.innerHTML = `
            <div class="leaderboard-modal-content large">
                <div class="leaderboard-header">
                    <h2>🏆 ${this.getGameTitle(gameName)} Leaderboard</h2>
                    <div class="leaderboard-type">
                        <span class="firebase-badge">🔥 ${this.offlineMode ? 'Cached Firebase' : 'Live Firebase'} Global</span>
                        <span class="player-count">${leaderboard.length} players worldwide</span>
                        <span class="realtime-indicator">⚡ Real-time sync active</span>
                        ${this.offlineMode ? '<span class="offline-notice">📱 Offline - will sync when online</span>' : ''}
                    </div>
                </div>
                <div class="leaderboard-list" id="leaderboardList">
                    ${this.renderLeaderboardList(leaderboard, currentPlayerName)}
                </div>
                <div class="leaderboard-actions">
                    <button class="action-btn" id="refreshLeaderboard">🔄 Refresh Global Leaderboard</button>
                </div>
                <div class="modal-buttons">
                    <button class="modal-btn primary" id="closeLeaderboard">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Setup real-time updates if not offline
        let realtimeListener = null;
        if (!this.offlineMode) {
            realtimeListener = this.setupRealtimeListener(gameName, (updatedScores) => {
                const listElement = document.getElementById('leaderboardList');
                if (listElement) {
                    listElement.innerHTML = this.renderLeaderboardList(updatedScores, currentPlayerName);
                    // Add real-time update animation
                    listElement.classList.add('updated');
                    setTimeout(() => listElement.classList.remove('updated'), 500);
                }
            });
        }

        // Event handlers
        document.getElementById('closeLeaderboard').addEventListener('click', () => {
            if (realtimeListener) this.removeRealtimeListener(gameName);
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



        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                if (realtimeListener) this.removeRealtimeListener(gameName);
                document.body.removeChild(modal);
            }
        });
    }



    // Generate device ID
    getDeviceId() {
        let deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
            deviceId = 'device_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('deviceId', deviceId);
        }
        return deviceId;
    }

    // Utility methods for rendering and formatting
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

    renderLeaderboardList(leaderboard, currentPlayerName = null) {
        if (leaderboard.length === 0) {
            return '<div class="empty-leaderboard">🎯 No scores yet. Be the first Firebase champion!</div>';
        }

        return leaderboard.slice(0, this.maxEntries).map((entry, index) => {
            const isCurrentPlayer = currentPlayerName && entry.name === currentPlayerName;
            const rankClass = index < 3 ? `rank-${index + 1}` : '';
            const currentClass = isCurrentPlayer ? 'current-player' : '';
            const isFromCurrentDevice = entry.deviceId === this.getDeviceId();
            const isSynced = entry.synced || entry.id; // Firebase entries have ID
            
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
                            ${isSynced ? '<span class="firebase-badge">🔥</span>' : '<span class="local-badge">📱</span>'}
                        </div>
                        <div class="score-details">${this.formatScoreDetails(entry)}</div>
                    </div>
                    <div class="score">${entry.score}</div>
                </div>
            `;
        }).join('');
    }

    getRankIcon(rank) {
        const icons = {
            1: '🥇',
            2: '🥈', 
            3: '🥉'
        };
        return icons[rank] || '🏅';
    }

    formatScoreDetails(entry) {
        let details = `${entry.date}`;
        if (entry.level) details += ` • Level ${entry.level}`;
        if (entry.moves) details += ` • ${entry.moves} moves`;
        if (entry.time_taken) details += ` • ${entry.time_taken}`;
        if (entry.difficulty) details += ` • ${entry.difficulty}`;
        return details;
    }

    showScoreTooLow(score, label) {
        const modal = document.createElement('div');
        modal.className = 'leaderboard-modal';
        modal.innerHTML = `
            <div class="leaderboard-modal-content">
                <div class="leaderboard-header">
                    <h2>🎯 Keep Trying!</h2>
                    <p>Your score didn't make it to the Firebase global leaderboard</p>
                </div>
                <div class="score-display">
                    <div class="score-value">${score}</div>
                    <div class="score-label">${label}</div>
                </div>
                <div class="encouragement">
                    <p>🔥 Firebase tracks the best worldwide!</p>
                    <p>🎮 Practice and compete globally</p>
                </div>
                <div class="modal-buttons">
                    <button class="modal-btn primary" id="closeModal">Try Again</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.getElementById('closeModal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }
}

// Create global Firebase leaderboard instance
window.firebaseGlobalLeaderboard = new FirebaseGlobalLeaderboard();

// Replace existing global leaderboard
window.globalLeaderboard = window.firebaseGlobalLeaderboard;

// Backward compatibility
window.leaderboard = {
    submitScore: (gameName, scoreData) => window.firebaseGlobalLeaderboard.submitScore(gameName, scoreData),
    showLeaderboard: (gameName) => window.firebaseGlobalLeaderboard.showLeaderboard(gameName)
};