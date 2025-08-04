// Rock Paper Scissors - Enhanced Multiplayer Game
class RockPaperScissorsGame {
    constructor() {
        // Game state
        this.gameMode = 'single'; // 'single', 'local', 'online'
        this.currentPlayer = 1;
        this.player1Choice = null;
        this.player2Choice = null;
        this.gameInProgress = false;
        
        // Scores
        this.player1Score = 0;
        this.player2Score = 0;
        this.drawScore = 0;
        this.gameHistory = [];
        
        // Online multiplayer
        this.roomCode = null;
        this.isHost = false;
        this.opponentConnected = false;
        this.firebaseMultiplayer = null;
        
        // Game choices
        this.choices = {
            rock: { icon: '🪨', beats: 'scissors' },
            paper: { icon: '📄', beats: 'rock' },
            scissors: { icon: '✂️', beats: 'paper' }
        };
        
        this.init();
    }
    
    init() {
        this.loadScores();
        this.setGameMode('single');
        this.updateUI();
        this.initializeOnlineMultiplayer();
    }
    
    initializeOnlineMultiplayer() {
        // Initialize Firebase multiplayer system
        if (typeof FirebaseMultiplayer !== 'undefined') {
            this.firebaseMultiplayer = new FirebaseMultiplayer();
            
            // Set up callback to handle Firebase events
            this.firebaseMultiplayer.gameCallback = (data) => {
                this.handleFirebaseEvent(data);
            };
            
            console.log('Online multiplayer system initialized');
        } else {
            console.log('Firebase multiplayer not available - online mode will use simulation');
        }
    }
    
    handleFirebaseEvent(data) {
        console.log('Firebase event received:', data);
        
        switch (data.type) {
            case 'opponent_joined':
                this.opponentConnected = true;
                document.getElementById('connectionStatus').textContent = data.message;
                this.updateGameStatus('Opponent connected! Make your choice.');
                break;
                
            case 'game_result':
                this.handleOnlineGameResult(data);
                break;
                
            default:
                console.log('Unknown Firebase event type:', data.type);
        }
    }
    
    // Game Mode Management
    setGameMode(mode) {
        this.gameMode = mode;
        this.resetGame();
        this.updateModeButtons();
        this.updateUI();
        
        // Hide/show appropriate UI elements
        document.getElementById('modeSelector').style.display = 'block';
        document.getElementById('turnIndicator').style.display = mode === 'local' ? 'block' : 'none';
        document.getElementById('onlineControls').style.display = mode === 'online' ? 'block' : 'none';
        
        // Update labels
        if (mode === 'single') {
            document.getElementById('player1Label').textContent = 'You';
            document.getElementById('player2Label').textContent = 'Computer';
            document.getElementById('gameStatus').textContent = 'Choose your move!';
        } else if (mode === 'local') {
            document.getElementById('player1Label').textContent = 'Player 1';
            document.getElementById('player2Label').textContent = 'Player 2';
            document.getElementById('gameStatus').textContent = 'Local Multiplayer Mode';
            this.updateTurnIndicator();
        } else if (mode === 'online') {
            document.getElementById('player1Label').textContent = 'You';
            document.getElementById('player2Label').textContent = 'Opponent';
            document.getElementById('gameStatus').textContent = 'Online Multiplayer Mode';
        }
    }
    
    updateModeButtons() {
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[onclick="setGameMode('${this.gameMode}')"]`).classList.add('active');
    }
    
    // Choice handling
    makeChoice(choice) {
        if (this.gameMode === 'single') {
            this.playSinglePlayer(choice);
        } else if (this.gameMode === 'local') {
            this.playLocalMultiplayer(choice);
        } else if (this.gameMode === 'online') {
            this.playOnlineMultiplayer(choice);
        }
    }
    
    // Single Player Mode (vs Computer)
    playSinglePlayer(playerChoice) {
        const computerChoice = this.getComputerChoice();
        
        this.player1Choice = playerChoice;
        this.player2Choice = computerChoice;
        
        this.showChoices();
        this.determineWinner();
        this.updateScores();
        this.addToHistory();
        this.saveScores();
        
        setTimeout(() => this.resetRound(), 3000);
    }
    
    // Local Multiplayer Mode
    playLocalMultiplayer(choice) {
        if (this.gameInProgress) return;
        
        if (this.currentPlayer === 1) {
            this.player1Choice = choice;
            this.currentPlayer = 2;
            this.updateTurnIndicator();
            this.showPlayerChoice(1, choice, true); // Hide choice initially
            
        } else if (this.currentPlayer === 2) {
            this.player2Choice = choice;
            this.gameInProgress = true;
            
            // Reveal both choices
            this.showChoices();
            this.determineWinner();
            this.updateScores();
            this.addToHistory();
            this.saveScores();
            
            setTimeout(() => this.resetRound(), 3000);
        }
    }
    
    // Online Multiplayer Mode
    playOnlineMultiplayer(choice) {
        if (!this.opponentConnected) {
            this.updateGameStatus('Waiting for opponent to connect...');
            return;
        }
        
        this.player1Choice = choice;
        this.showPlayerChoice(1, choice);
        this.updatePlayerStatus(1, 'Choice made - waiting for opponent...');
        
        // Send choice to opponent (simulated)
        this.sendChoiceToOpponent(choice);
        
        // Disable choices until opponent responds
        this.disableChoices();
    }
    
    // Computer AI
    getComputerChoice() {
        const choiceKeys = Object.keys(this.choices);
        return choiceKeys[Math.floor(Math.random() * choiceKeys.length)];
    }
    
    // Game Logic
    determineWinner() {
        if (this.player1Choice === this.player2Choice) {
            this.gameResult = 'draw';
            this.updateGameStatus("It's a draw!");
        } else if (this.choices[this.player1Choice].beats === this.player2Choice) {
            this.gameResult = 'player1';
            const p1Name = this.gameMode === 'single' ? 'You' : 'Player 1';
            this.updateGameStatus(`${p1Name} wins!`);
            this.updatePlayerStatus(1, 'Winner! 🏆');
        } else {
            this.gameResult = 'player2';
            const p2Name = this.gameMode === 'single' ? 'Computer' : 
                          this.gameMode === 'local' ? 'Player 2' : 'Opponent';
            this.updateGameStatus(`${p2Name} wins!`);
            this.updatePlayerStatus(2, 'Winner! 🏆');
        }
    }
    
    updateScores() {
        if (this.gameResult === 'player1') {
            this.player1Score++;
        } else if (this.gameResult === 'player2') {
            this.player2Score++;
        } else {
            this.drawScore++;
        }
        this.updateScoreDisplay();
    }
    
    // UI Updates
    updateUI() {
        this.updateScoreDisplay();
        this.updateGameStatus('Choose your move!');
        this.resetChoiceDisplays();
        this.clearPlayerStatuses();
    }
    
    updateScoreDisplay() {
        document.getElementById('player1Score').textContent = this.player1Score;
        document.getElementById('player2Score').textContent = this.player2Score;
        document.getElementById('drawScore').textContent = this.drawScore;
    }
    
    updateGameStatus(message) {
        document.getElementById('gameStatus').textContent = message;
    }
    
    updateTurnIndicator() {
        if (this.gameMode !== 'local') return;
        
        const turnText = document.getElementById('turnText');
        const turnInstruction = document.getElementById('turnInstruction');
        
        if (this.currentPlayer === 1) {
            turnText.textContent = "Player 1's Turn";
            turnInstruction.textContent = "Make your choice, then pass to Player 2";
        } else {
            turnText.textContent = "Player 2's Turn";
            turnInstruction.textContent = "Make your choice to see the results";
        }
    }
    
    updatePlayerStatus(player, status) {
        document.getElementById(`player${player}Status`).textContent = status;
    }
    
    clearPlayerStatuses() {
        document.getElementById('player1Status').textContent = '';
        document.getElementById('player2Status').textContent = '';
    }
    
    showChoices() {
        this.showPlayerChoice(1, this.player1Choice);
        this.showPlayerChoice(2, this.player2Choice);
    }
    
    showPlayerChoice(player, choice, hidden = false) {
        const choiceElement = document.getElementById(`player${player}Choice`);
        if (hidden) {
            choiceElement.textContent = '🤫'; // Hidden choice
        } else {
            choiceElement.textContent = this.choices[choice].icon;
        }
        
        // Add animation
        choiceElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            choiceElement.style.transform = 'scale(1)';
        }, 300);
    }
    
    resetChoiceDisplays() {
        document.getElementById('player1Choice').textContent = '❓';
        document.getElementById('player2Choice').textContent = '❓';
    }
    
    resetRound() {
        this.player1Choice = null;
        this.player2Choice = null;
        this.gameInProgress = false;
        this.currentPlayer = 1;
        
        this.resetChoiceDisplays();
        this.clearPlayerStatuses();
        this.enableChoices();
        
        if (this.gameMode === 'local') {
            this.updateTurnIndicator();
            document.getElementById('gameStatus').textContent = 'Next Round - Player 1 goes first';
        } else {
            document.getElementById('gameStatus').textContent = 'Choose your move!';
        }
    }
    
    resetGame() {
        this.resetRound();
        this.updateUI();
    }
    
    disableChoices() {
        document.getElementById('choiceButtons').classList.add('disabled');
    }
    
    enableChoices() {
        document.getElementById('choiceButtons').classList.remove('disabled');
    }
    
    // Score Management
    resetScores() {
        this.player1Score = 0;
        this.player2Score = 0;
        this.drawScore = 0;
        this.gameHistory = [];
        this.updateScoreDisplay();
        this.saveScores();
        this.updateHistoryDisplay();
        this.updateGameStatus('Scores reset! Choose your move!');
    }
    
    loadScores() {
        const saved = localStorage.getItem('rpsScores');
        if (saved) {
            const scores = JSON.parse(saved);
            this.player1Score = scores.player1 || 0;
            this.player2Score = scores.player2 || 0;
            this.drawScore = scores.draw || 0;
        }
        
        const savedHistory = localStorage.getItem('rpsHistory');
        if (savedHistory) {
            this.gameHistory = JSON.parse(savedHistory);
            this.updateHistoryDisplay();
        }
    }
    
    saveScores() {
        localStorage.setItem('rpsScores', JSON.stringify({
            player1: this.player1Score,
            player2: this.player2Score,
            draw: this.drawScore
        }));
        localStorage.setItem('rpsHistory', JSON.stringify(this.gameHistory));
    }
    
    addToHistory() {
        const gameRecord = {
            player1: this.player1Choice,
            player2: this.player2Choice,
            result: this.gameResult,
            timestamp: new Date().toISOString(),
            mode: this.gameMode
        };
        
        this.gameHistory.unshift(gameRecord);
        if (this.gameHistory.length > 10) {
            this.gameHistory = this.gameHistory.slice(0, 10);
        }
        
        this.updateHistoryDisplay();
    }
    
    updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        if (!historyList) return;
        
        historyList.innerHTML = '';
        
        this.gameHistory.forEach(game => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const resultText = game.result === 'draw' ? 'Draw' :
                             game.result === 'player1' ? 'P1 Wins' : 'P2 Wins';
            
            historyItem.innerHTML = `
                <span>${this.choices[game.player1].icon} vs ${this.choices[game.player2].icon}</span>
                <span class="result ${game.result}">${resultText}</span>
                <span class="mode">${game.mode}</span>
            `;
            
            historyList.appendChild(historyItem);
        });
    }
    
    // Tournament Mode
    playBestOfFive() {
        alert('Best of 5 tournament mode! First to win 3 games wins the tournament.');
    }
    
    // Online Multiplayer Functions
    createRoom() {
        if (!this.firebaseMultiplayer) {
            this.fallbackCreateRoom();
            return;
        }
        
        document.getElementById('roomSection').style.display = 'none';
        document.getElementById('roomInfo').style.display = 'block';
        document.getElementById('connectionStatus').textContent = 'Creating room...';
        
        this.firebaseMultiplayer.createRoom((result) => {
            if (result.success) {
                this.roomCode = result.roomCode;
                this.isHost = true;
                document.getElementById('currentRoomCode').textContent = this.roomCode;
                document.getElementById('connectionStatus').textContent = result.message;
            } else {
                document.getElementById('connectionStatus').textContent = result.message;
                // Fallback to simulation after 2 seconds
                setTimeout(() => this.fallbackCreateRoom(), 2000);
            }
        });
    }
    
    joinRoom() {
        const roomCode = document.getElementById('roomCode').value.toUpperCase();
        if (roomCode.length !== 6) {
            alert('Please enter a valid 6-character room code');
            return;
        }
        
        if (!this.firebaseMultiplayer) {
            this.fallbackJoinRoom(roomCode);
            return;
        }
        
        document.getElementById('roomSection').style.display = 'none';
        document.getElementById('roomInfo').style.display = 'block';
        document.getElementById('currentRoomCode').textContent = roomCode;
        document.getElementById('connectionStatus').textContent = 'Connecting to room...';
        
        this.firebaseMultiplayer.joinRoom(roomCode, (result) => {
            if (result.success) {
                this.roomCode = result.roomCode;
                this.isHost = false;
                this.opponentConnected = true;
                document.getElementById('connectionStatus').textContent = result.message;
                this.updateGameStatus('Connected! Make your choice to play.');
            } else {
                document.getElementById('connectionStatus').textContent = result.message;
                // Fallback to simulation after 2 seconds
                setTimeout(() => this.fallbackJoinRoom(roomCode), 2000);
            }
        });
    }
    
    leaveRoom() {
        if (this.firebaseMultiplayer) {
            this.firebaseMultiplayer.leaveRoom();
        }
        
        this.roomCode = null;
        this.isHost = false;
        this.opponentConnected = false;
        
        document.getElementById('roomSection').style.display = 'block';
        document.getElementById('roomInfo').style.display = 'none';
        document.getElementById('roomCode').value = '';
        
        this.updateGameStatus('Online Multiplayer Mode - Create or join a room');
    }
    
    generateRoomCode() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }
    
    simulateOpponentJoin() {
        this.opponentConnected = true;
        document.getElementById('connectionStatus').textContent = 'Opponent connected! Game ready.';
        this.updateGameStatus('Opponent connected! Make your choice.');
    }
    
    simulateOpponentConnection() {
        this.opponentConnected = true;
        document.getElementById('connectionStatus').textContent = 'Connected to opponent! Game ready.';
        this.updateGameStatus('Connected to opponent! Make your choice.');
    }
    
    sendChoiceToOpponent(choice) {
        if (!this.firebaseMultiplayer) {
            return this.fallbackSendChoice(choice);
        }
        
        this.firebaseMultiplayer.sendChoice(choice, (result) => {
            if (result.success) {
                console.log('Choice sent successfully to opponent');
            } else {
                console.log('Failed to send choice, using fallback');
                this.fallbackSendChoice(choice);
            }
        });
    }
    
    handleOnlineGameResult(data) {
        this.player1Choice = data.playerChoice;
        this.player2Choice = data.opponentChoice;
        
        this.showChoices();
        this.determineWinner();
        this.updateScores();
        this.addToHistory();
        this.saveScores();
        
        setTimeout(() => this.resetRound(), 3000);
    }
    
    // Fallback methods for when Firebase isn't available
    fallbackCreateRoom() {
        this.roomCode = this.generateRoomCode();
        this.isHost = true;
        
        document.getElementById('roomSection').style.display = 'none';
        document.getElementById('roomInfo').style.display = 'block';
        document.getElementById('currentRoomCode').textContent = this.roomCode;
        document.getElementById('connectionStatus').textContent = 'Waiting for opponent... (Simulation mode)';
        
        // Simulate opponent joining
        setTimeout(() => {
            this.simulateOpponentJoin();
        }, 3000);
    }
    
    fallbackJoinRoom(roomCode) {
        this.roomCode = roomCode;
        this.isHost = false;
        
        document.getElementById('roomSection').style.display = 'none';
        document.getElementById('roomInfo').style.display = 'block';
        document.getElementById('currentRoomCode').textContent = this.roomCode;
        document.getElementById('connectionStatus').textContent = 'Connecting... (Simulation mode)';
        
        // Simulate connection
        setTimeout(() => {
            this.simulateOpponentConnection();
        }, 2000);
    }
    
    fallbackSendChoice(choice) {
        console.log(`Simulating choice send: ${choice}`);
        
        // Simulate opponent response
        setTimeout(() => {
            const opponentChoice = this.getComputerChoice();
            this.handleOnlineGameResult({
                playerChoice: choice,
                opponentChoice: opponentChoice
            });
        }, 1000 + Math.random() * 2000);
    }
}

// Global game instance
let game;

// Global functions for HTML onclick events
function goHome() {
    window.location.href = '../../index.html';
}

function setGameMode(mode) {
    game.setGameMode(mode);
}

function makeChoice(choice) {
    game.makeChoice(choice);
}

function resetScores() {
    game.resetScores();
}

function playBestOfFive() {
    game.playBestOfFive();
}

function createRoom() {
    game.createRoom();
}

function joinRoom() {
    game.joinRoom();
}

function leaveRoom() {
    game.leaveRoom();
}

function showGameLeaderboard() {
    if (typeof leaderboard !== 'undefined') {
        leaderboard.showLeaderboard('rock-paper-scissors');
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    game = new RockPaperScissorsGame();
});