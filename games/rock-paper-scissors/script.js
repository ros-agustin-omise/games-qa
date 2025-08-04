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

function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'draw';
    }
    return choices[playerChoice].beats === computerChoice ? 'player' : 'computer';
}

function playGame(playerChoice) {
    if (bestOfFiveMode && tournamentWins.length >= 5) {
        return; // Tournament is complete
    }
    
    const computerChoice = getComputerChoice();
    const result = determineWinner(playerChoice, computerChoice);
    
    // Update displays
    document.getElementById('playerChoice').textContent = choices[playerChoice].icon;
    document.getElementById('computerChoice').textContent = choices[computerChoice].icon;
    
    // Add visual feedback
    const playerDisplay = document.getElementById('playerChoice');
    const computerDisplay = document.getElementById('computerChoice');
    
    // Reset classes
    playerDisplay.className = 'choice-display';
    computerDisplay.className = 'choice-display';
    
    // Add result classes
    setTimeout(() => {
        if (result === 'player') {
            playerDisplay.classList.add('winner');
            computerDisplay.classList.add('loser');
        } else if (result === 'computer') {
            playerDisplay.classList.add('loser');
            computerDisplay.classList.add('winner');
        } else {
            playerDisplay.classList.add('draw');
            computerDisplay.classList.add('draw');
        }
    }, 100);
    
    // Update scores and status
    let statusMessage = '';
    if (result === 'player') {
        playerScore++;
        statusMessage = `You win! ${choices[playerChoice].icon} beats ${choices[computerChoice].icon}`;
        // Check for milestone achievements only if not in tournament mode
        if (!bestOfFiveMode) {
            // Wait for UI updates to complete before checking milestones
            setTimeout(() => {
                checkMilestoneAchievements();
            }, 1500);
        }
    } else if (result === 'computer') {
        computerScore++;
        statusMessage = `Computer wins! ${choices[computerChoice].icon} beats ${choices[playerChoice].icon}`;
    } else {
        drawScore++;
        statusMessage = `It's a draw! Both chose ${choices[playerChoice].icon}`;
    }
    
    document.getElementById('gameStatus').textContent = statusMessage;
    updateScoreDisplay();
    
    // Add to history
    const historyItem = {
        player: playerChoice,
        computer: computerChoice,
        result: result,
        timestamp: new Date().toLocaleTimeString()
    };
    gameHistory.unshift(historyItem);
    
    // Keep only last 10 games in history
    if (gameHistory.length > 10) {
        gameHistory = gameHistory.slice(0, 10);
    }
    
    updateHistoryDisplay();
    saveScores();
    
    // Handle Best of Five mode
    if (bestOfFiveMode) {
        handleTournamentRound(result);
    }
}

function handleTournamentRound(result) {
    tournamentWins.push(result);
    updateTournamentDisplay();
    
    // Check if tournament is complete
    const playerWins = tournamentWins.filter(r => r === 'player').length;
    const computerWins = tournamentWins.filter(r => r === 'computer').length;
    
    if (playerWins === 3) {
        endTournament('You won the Best of 5! 🎉');
    } else if (computerWins === 3) {
        endTournament('Computer won the Best of 5! 😔');
    } else if (tournamentWins.length === 5) {
        if (playerWins > computerWins) {
            endTournament('You won the Best of 5! 🎉');
        } else if (computerWins > playerWins) {
            endTournament('Computer won the Best of 5! 😔');
        } else {
            endTournament('Best of 5 ended in a tie! 🤝');
        }
    }
}

function updateTournamentDisplay() {
    const progressDiv = document.querySelector('.tournament-progress');
    if (!progressDiv) return;
    
    progressDiv.innerHTML = '';
    
    for (let i = 0; i < 5; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'round-indicator';
        
        if (i < tournamentWins.length) {
            const result = tournamentWins[i];
            indicator.classList.add(result === 'player' ? 'win' : result === 'computer' ? 'lose' : 'draw');
            indicator.textContent = result === 'player' ? '✓' : result === 'computer' ? '✗' : '=';
        } else {
            indicator.textContent = i + 1;
        }
        
        progressDiv.appendChild(indicator);
    }
}

function endTournament(message) {
    document.getElementById('gameStatus').textContent = message;
    
    // Check for leaderboard qualification after tournament
    const playerWins = tournamentWins.filter(r => r === 'player').length;
    const computerWins = tournamentWins.filter(r => r === 'computer').length;
    
    if (playerWins >= 3) {
        // Player won the tournament - add to leaderboard
        const score = playerScore; // Use total career wins as score
        const totalGames = playerScore + computerScore;
        const winRatio = totalGames > 0 ? ((playerScore / totalGames) * 100).toFixed(1) + '%' : '0%';
        
        const gameDetails = {
            tournament_result: 'Won Best of 5',
            career_wins: playerScore,
            career_losses: computerScore,
            win_ratio: winRatio
        };
        
        // Only show leaderboard if player has a decent score (at least 3 wins)
        if (window.gameLeaderboard && playerScore >= 3 && window.gameLeaderboard.qualifiesForLeaderboard('rock-paper-scissors', score)) {
            setTimeout(() => {
                window.gameLeaderboard.showNameInput('rock-paper-scissors', score, gameDetails, 'high')
                    .then(result => {
                        if (result.submitted) {
                            document.getElementById('gameStatus').textContent = 
                                `${message} 🏆 Added to leaderboard as ${result.playerName}!`;
                        }
                    });
            }, 1000);
        }
    }
    
    setTimeout(() => {
        bestOfFiveMode = false;
        tournamentWins = [];
        const tournamentDiv = document.querySelector('.best-of-five');
        if (tournamentDiv) {
            tournamentDiv.remove();
        }
    }, 3000);
}

function playBestOfFive() {
    if (bestOfFiveMode) return;
    
    bestOfFiveMode = true;
    tournamentWins = [];
    
    const tournamentDiv = document.createElement('div');
    tournamentDiv.className = 'best-of-five';
    tournamentDiv.innerHTML = `
        <h3>Best of 5 Tournament</h3>
        <p>First to win 3 rounds wins the tournament!</p>
        <div class="tournament-progress"></div>
    `;
    
    document.querySelector('.game-area').insertBefore(
        tournamentDiv, 
        document.querySelector('.choices')
    );
    
    updateTournamentDisplay();
    document.getElementById('gameStatus').textContent = 'Best of 5 started! Make your first move!';
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    
    if (gameHistory.length === 0) {
        historyList.innerHTML = '<div class="history-item">No games played yet</div>';
        return;
    }
    
    historyList.innerHTML = gameHistory.map(game => {
        const playerIcon = choices[game.player].icon;
        const computerIcon = choices[game.computer].icon;
        let resultText = '';
        let resultClass = '';
        
        if (game.result === 'player') {
            resultText = 'You won';
            resultClass = 'win';
        } else if (game.result === 'computer') {
            resultText = 'Computer won';
            resultClass = 'lose';
        } else {
            resultText = 'Draw';
            resultClass = 'draw';
        }
        
        return `
            <div class="history-item ${resultClass}">
                ${game.timestamp}: ${playerIcon} vs ${computerIcon} - ${resultText}
            </div>
        `;
    }).join('');
}

function resetScores() {
    playerScore = 0;
    computerScore = 0;
    drawScore = 0;
    gameHistory = [];
    
    // Reset milestone tracking
    localStorage.removeItem('rps_lastMilestone');
    
    updateScoreDisplay();
    updateHistoryDisplay();
    saveScores();
    
    document.getElementById('gameStatus').textContent = 'Scores reset! Choose your move!';
    document.getElementById('playerChoice').textContent = '❓';
    document.getElementById('computerChoice').textContent = '❓';
    
    // Reset display classes
    document.getElementById('playerChoice').className = 'choice-display';
    document.getElementById('computerChoice').className = 'choice-display';
}

// Show leaderboard for this game
function showGameLeaderboard() {
    if (window.gameLeaderboard) {
        window.gameLeaderboard.showLeaderboard('rock-paper-scissors');
    }
}

// Check for milestone achievements
function checkMilestoneAchievements() {
    const milestones = [5, 10, 25, 50, 100, 250, 500];
    
    // Find the highest milestone reached
    let achievedMilestone = null;
    for (let i = milestones.length - 1; i >= 0; i--) {
        if (playerScore >= milestones[i]) {
            achievedMilestone = milestones[i];
            break;
        }
    }
    
    // Check if this is a new milestone (not previously achieved)
    const lastMilestone = parseInt(localStorage.getItem('rps_lastMilestone')) || 0;
    
    if (achievedMilestone && achievedMilestone > lastMilestone) {
        // Save the new milestone
        localStorage.setItem('rps_lastMilestone', achievedMilestone.toString());
        
        const totalGames = playerScore + computerScore;
        const winRatio = totalGames > 0 ? ((playerScore / totalGames) * 100).toFixed(1) + '%' : '0%';
        
        const gameDetails = {
            milestone: `${achievedMilestone} wins milestone reached!`,
            career_wins: playerScore,
            career_losses: computerScore,
            win_ratio: winRatio,
            total_games: totalGames
        };
        
        // Only show leaderboard for meaningful milestones (5+ wins)
        if (window.gameLeaderboard && achievedMilestone >= 5 && window.gameLeaderboard.qualifiesForLeaderboard('rock-paper-scissors', playerScore)) {
            // Delay to avoid conflicts with game UI updates
            setTimeout(() => {
                window.gameLeaderboard.showNameInput('rock-paper-scissors', playerScore, gameDetails, 'high')
                    .then(result => {
                        if (result.submitted) {
                            setTimeout(() => {
                                document.getElementById('gameStatus').textContent = 
                                    `🏆 ${achievedMilestone} wins milestone! Added to leaderboard as ${result.playerName}!`;
                            }, 500);
                        }
                    });
            }, 1500);
        }
    }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
    loadScores();
    
    // Add button hover effects
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});