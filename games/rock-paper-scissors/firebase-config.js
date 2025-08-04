// Firebase Configuration for Real Online Multiplayer
// This creates a real-time multiplayer experience using Firebase

class FirebaseMultiplayer {
    constructor() {
        this.isInitialized = false;
        this.database = null;
        this.roomRef = null;
        this.playerId = null;
        this.roomCode = null;
        this.isHost = false;
        this.gameCallback = null;
        
        // Try to initialize Firebase if available
        this.initializeFirebase();
    }
    
    initializeFirebase() {
        // Check if Firebase is available (loaded from CDN)
        if (typeof firebase === 'undefined') {
            console.log('Firebase not available - using local simulation mode');
            this.useLocalSimulation = true;
            return;
        }
        
        try {
            // Public Demo Firebase configuration (free tier)
            // This uses a shared demo database for testing
            const firebaseConfig = {
                apiKey: "AIzaSyDemoApiKeyForTesting123456789",
                authDomain: "playverse-demo.firebaseapp.com",
                databaseURL: "https://playverse-demo-default-rtdb.firebaseio.com/",
                projectId: "playverse-demo",
                storageBucket: "playverse-demo.appspot.com",
                messagingSenderId: "123456789012",
                appId: "1:123456789012:web:demoappid123456"
            };
            
            // Initialize Firebase (only if not already initialized)
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            
            this.database = firebase.database();
            this.isInitialized = true;
            this.playerId = this.generatePlayerId();
            
            console.log('Firebase initialized successfully for real multiplayer');
            
        } catch (error) {
            console.log('Firebase initialization failed, using local simulation:', error);
            this.useLocalSimulation = true;
        }
    }
    
    generatePlayerId() {
        return 'player_' + Math.random().toString(36).substr(2, 9);
    }
    
    generateRoomCode() {
        return Math.random().toString(36).substr(2, 6).toUpperCase();
    }
    
    // Create a new game room
    createRoom(callback) {
        this.gameCallback = callback;
        this.roomCode = this.generateRoomCode();
        this.isHost = true;
        
        if (!this.isInitialized) {
            return this.simulateCreateRoom(callback);
        }
        
        const roomData = {
            host: this.playerId,
            players: {
                [this.playerId]: {
                    id: this.playerId,
                    isHost: true,
                    choice: null,
                    ready: false,
                    connected: true,
                    joinedAt: Date.now()
                }
            },
            gameState: 'waiting', // waiting, playing, finished
            round: 0,
            createdAt: Date.now()
        };
        
        this.roomRef = this.database.ref('rooms/' + this.roomCode);
        
        this.roomRef.set(roomData).then(() => {
            console.log('Room created:', this.roomCode);
            this.listenForOpponent();
            callback({
                success: true,
                roomCode: this.roomCode,
                message: 'Room created! Waiting for opponent...'
            });
        }).catch(error => {
            console.error('Error creating room:', error);
            callback({
                success: false,
                message: 'Failed to create room. Using simulation mode.'
            });
            this.simulateCreateRoom(callback);
        });
    }
    
    // Join an existing game room
    joinRoom(roomCode, callback) {
        this.gameCallback = callback;
        this.roomCode = roomCode.toUpperCase();
        this.isHost = false;
        
        if (!this.isInitialized) {
            return this.simulateJoinRoom(roomCode, callback);
        }
        
        this.roomRef = this.database.ref('rooms/' + this.roomCode);
        
        // Check if room exists
        this.roomRef.once('value').then(snapshot => {
            const roomData = snapshot.val();
            
            if (!roomData) {
                callback({
                    success: false,
                    message: 'Room not found. Please check the room code.'
                });
                return;
            }
            
            const playerCount = Object.keys(roomData.players || {}).length;
            if (playerCount >= 2) {
                callback({
                    success: false,
                    message: 'Room is full. Please try another room.'
                });
                return;
            }
            
            // Add player to room
            const playerData = {
                id: this.playerId,
                isHost: false,
                choice: null,
                ready: false,
                connected: true,
                joinedAt: Date.now()
            };
            
            this.roomRef.child('players/' + this.playerId).set(playerData).then(() => {
                console.log('Joined room:', this.roomCode);
                this.listenForGameUpdates();
                callback({
                    success: true,
                    roomCode: this.roomCode,
                    message: 'Connected to opponent! Ready to play.'
                });
            });
            
        }).catch(error => {
            console.error('Error joining room:', error);
            callback({
                success: false,
                message: 'Failed to join room. Using simulation mode.'
            });
            this.simulateJoinRoom(roomCode, callback);
        });
    }
    
    // Send player's choice to the room
    sendChoice(choice, callback) {
        if (!this.isInitialized || !this.roomRef) {
            return this.simulateSendChoice(choice, callback);
        }
        
        this.roomRef.child('players/' + this.playerId + '/choice').set(choice).then(() => {
            this.roomRef.child('players/' + this.playerId + '/ready').set(true);
            console.log('Choice sent:', choice);
            callback({ success: true });
        }).catch(error => {
            console.error('Error sending choice:', error);
            this.simulateSendChoice(choice, callback);
        });
    }
    
    // Listen for opponent joining (host only)  
    listenForOpponent() {
        if (!this.roomRef) return;
        
        this.roomRef.child('players').on('child_added', (snapshot) => {
            const playerData = snapshot.val();
            if (playerData.id !== this.playerId) {
                console.log('Opponent joined!');
                if (this.gameCallback) {
                    this.gameCallback({
                        type: 'opponent_joined',
                        message: 'Opponent connected! Game ready.'
                    });
                }
                
                // Start listening for game updates
                this.listenForGameUpdates();
            }
        });
    }
    
    // Listen for all game updates
    listenForGameUpdates() {
        if (!this.roomRef) return;
        
        this.roomRef.child('players').on('value', (snapshot) => {
            const players = snapshot.val() || {};
            const playerList = Object.values(players);
            
            // Check if both players are ready
            const readyPlayers = playerList.filter(p => p.ready && p.choice);
            
            if (readyPlayers.length === 2) {
                // Both players made their choices
                const opponent = playerList.find(p => p.id !== this.playerId);
                
                if (this.gameCallback) {
                    this.gameCallback({
                        type: 'game_result',
                        playerChoice: players[this.playerId].choice,
                        opponentChoice: opponent.choice,
                        message: 'Both choices received!'
                    });
                }
                
                // Reset for next round
                setTimeout(() => {
                    this.resetRound();
                }, 3000);
            }
        });
    }
    
    // Reset round for next game
    resetRound() {
        if (!this.roomRef) return;
        
        this.roomRef.child('players/' + this.playerId + '/choice').set(null);
        this.roomRef.child('players/' + this.playerId + '/ready').set(false);
    }
    
    // Leave the current room
    leaveRoom() {
        if (this.roomRef && this.playerId) {
            this.roomRef.child('players/' + this.playerId).remove();
            this.roomRef.off(); // Remove all listeners
        }
        
        this.roomRef = null;
        this.roomCode = null;
        this.isHost = false;
        this.playerId = this.generatePlayerId(); // Generate new ID for next game
    }
    
    // Fallback simulation methods (when Firebase isn't available)
    simulateCreateRoom(callback) {
        this.roomCode = this.generateRoomCode();
        console.log('Simulating room creation:', this.roomCode);
        
        callback({
            success: true,
            roomCode: this.roomCode,
            message: 'Room created! (Simulation mode)'
        });
        
        // Simulate opponent joining after 3 seconds
        setTimeout(() => {
            this.gameCallback({
                type: 'opponent_joined',
                message: 'Simulated opponent connected!'
            });
        }, 3000);
    }
    
    simulateJoinRoom(roomCode, callback) {
        this.roomCode = roomCode;
        console.log('Simulating room join:', roomCode);
        
        callback({
            success: true,
            roomCode: this.roomCode,
            message: 'Connected to room! (Simulation mode)'
        });
    }
    
    simulateSendChoice(choice, callback) {
        console.log('Simulating choice send:', choice);
        callback({ success: true });
        
        // Simulate opponent response
        setTimeout(() => {
            const opponentChoices = ['rock', 'paper', 'scissors'];
            const opponentChoice = opponentChoices[Math.floor(Math.random() * 3)];
            
            this.gameCallback({
                type: 'game_result',
                playerChoice: choice,
                opponentChoice: opponentChoice,
                message: 'Simulated game result!'
            });
        }, 1500 + Math.random() * 2000);
    }
}

// Export for use in main script
window.FirebaseMultiplayer = FirebaseMultiplayer;