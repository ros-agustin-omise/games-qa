// Rock Paper Scissors - Simple vs Computer Game
let playerScore = 0;
let computerScore = 0;
let drawScore = 0;
let gameHistory = [];
let bestOfFiveMode = false;
let tournamentWins = [];

const choices = {
    rock: { icon: '🪨', beats: 'scissors' },
    paper: { icon: '📄', beats: 'rock' },
    scissors: { icon: '✂️', beats: 'paper' }
};

function goHome() {
    window.location.href = '../../index.html';
}

function loadScores() {
    const saved = localStorage.getItem('rpsScores');
    if (saved) {
        const scores = JSON.parse(saved);
        playerScore = scores.player || 0;
        computerScore = scores.computer || 0;
        drawScore = scores.draw || 0;
        updateScoreDisplay();
    }
    
    const savedHistory = localStorage.getItem('rpsHistory');
    if (savedHistory) {
        gameHistory = JSON.parse(savedHistory);
        updateHistoryDisplay();
    }
}

function saveScores() {
    localStorage.setItem('rpsScores', JSON.stringify({
        player: playerScore,
        computer: computerScore,
        draw: drawScore
    }));
    localStorage.setItem('rpsHistory', JSON.stringify(gameHistory));
}

function updateScoreDisplay() {
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('computerScore').textContent = computerScore;
    document.getElementById('drawScore').textContent = drawScore;
}

function getComputerChoice() {
    const choiceKeys = Object.keys(choices);
    return choiceKeys[Math.floor(Math.random() * choiceKeys.length)];
}

function playGame(playerChoice) {
    const computerChoice = getComputerChoice();
    
    // Track game interaction
    if (window.analytics) {
        window.analytics.trackInteraction('choice_made', 'rock-paper-scissors', {
            playerChoice: playerChoice,
            computerChoice: computerChoice
        });
    }
    
    // Show choices with animation
    showChoice('playerChoice', playerChoice);
    showChoice('computerChoice', computerChoice);
    
    // Determine winner
    let result;
    if (playerChoice === computerChoice) {
        result = 'draw';
        drawScore++;
        updateGameStatus("It's a draw!");
    } else if (choices[playerChoice].beats === computerChoice) {
        result = 'player';
        playerScore++;
        updateGameStatus("You win!");
    } else {
        result = 'computer';
        computerScore++;
        updateGameStatus("Computer wins!");
    }
    
    // Track game completion
    if (window.analytics) {
        window.analytics.trackGameComplete('rock-paper-scissors', playerScore, result);
    }
    
    // Update display
    updateScoreDisplay();
    addToHistory(playerChoice, computerChoice, result);
    saveScores();
    
    // Submit score to leaderboard if player wins
    if (result === 'player') {
        submitToLeaderboard();
    }
    
    // Reset after 3 seconds
    setTimeout(() => {
        resetChoices();
        updateGameStatus('Choose your move!');
    }, 3000);
}

function showChoice(elementId, choice) {
    const element = document.getElementById(elementId);
    element.textContent = choices[choice].icon;
    
    // Add animation
    element.style.transform = 'scale(1.2)';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 300);
}

function resetChoices() {
    document.getElementById('playerChoice').textContent = '❓';
    document.getElementById('computerChoice').textContent = '❓';
}

function updateGameStatus(message) {
    document.getElementById('gameStatus').textContent = message;
}

function resetScores() {
    playerScore = 0;
    computerScore = 0;
    drawScore = 0;
    gameHistory = [];
    updateScoreDisplay();
    saveScores();
    updateHistoryDisplay();
    updateGameStatus('Scores reset! Choose your move!');
}

function addToHistory(playerChoice, computerChoice, result) {
    const gameRecord = {
        player: playerChoice,
        computer: computerChoice,
        result: result,
        timestamp: new Date().toISOString()
    };
    
    gameHistory.unshift(gameRecord);
    if (gameHistory.length > 10) {
        gameHistory = gameHistory.slice(0, 10);
    }
    
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    historyList.innerHTML = '';
    
    gameHistory.forEach(game => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const resultText = game.result === 'draw' ? 'Draw' :
                         game.result === 'player' ? 'You Win' : 'Computer Wins';
        
        const resultClass = game.result === 'draw' ? 'draw' :
                          game.result === 'player' ? 'win' : 'lose';
        
        historyItem.innerHTML = `
            <span class="choices">${choices[game.player].icon} vs ${choices[game.computer].icon}</span>
            <span class="result ${resultClass}">${resultText}</span>
        `;
        
        historyList.appendChild(historyItem);
    });
}

function playBestOfFive() {
    bestOfFiveMode = true;
    alert('Best of 5 mode activated! First to win 3 games wins the tournament.');
    
    // Reset scores for tournament
    const tempHistory = [...gameHistory];
    resetScores();
    gameHistory = tempHistory;
    updateHistoryDisplay();
    
    updateGameStatus('Best of 5 Tournament - Choose your move!');
}

function checkTournamentEnd() {
    if (!bestOfFiveMode) return;
    
    if (playerScore >= 3) {
        alert('🏆 Congratulations! You won the Best of 5 tournament!');
        tournamentWins.push('player');
        bestOfFiveMode = false;
        updateGameStatus('Tournament complete! You are the champion!');
    } else if (computerScore >= 3) {
        alert('💻 Computer wins the Best of 5 tournament! Better luck next time.');
        tournamentWins.push('computer');
        bestOfFiveMode = false;
        updateGameStatus('Tournament complete! Computer is the champion.');
    }
}

function submitToLeaderboard() {
    if (typeof globalLeaderboard !== 'undefined') {
        const totalGames = playerScore + computerScore + drawScore;
        const winRate = totalGames > 0 ? Math.round((playerScore / totalGames) * 100) : 0;
        
        globalLeaderboard.submitScore('rock-paper-scissors', {
            score: playerScore,
            details: {
                wins: playerScore,
                losses: computerScore,
                draws: drawScore,
                winRate: winRate + '%',
                totalGames: totalGames
            }
        });
    }
}

function showGameLeaderboard() {
    if (typeof globalLeaderboard !== 'undefined') {
        globalLeaderboard.showLeaderboard('rock-paper-scissors');
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadScores();
    updateGameStatus('Choose your move!');
    
    // Track game view
    if (window.analytics) {
        window.analytics.trackGameView('rock-paper-scissors');
    }
    
    // Override the original playGame calls if they were bound elsewhere
    window.playGame = playGame;
});