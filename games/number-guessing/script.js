let currentGame = {
    min: 1,
    max: 10,
    maxGuesses: 3,
    secretNumber: 0,
    guessesLeft: 0,
    guessHistory: [],
    gameActive: false,
    startTime: null,
    timerInterval: null,
    totalTime: 0
};

let gameStats = {
    gamesWon: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalGames: 0
};

function goHome() {
    window.location.href = '../../index.html';
}

function loadStats() {
    const saved = localStorage.getItem('numberGuessingStats');
    if (saved) {
        gameStats = { ...gameStats, ...JSON.parse(saved) };
        updateStatsDisplay();
    }
}

function saveStats() {
    localStorage.setItem('numberGuessingStats', JSON.stringify(gameStats));
}

function updateStatsDisplay() {
    document.getElementById('gamesWon').textContent = gameStats.gamesWon;
    document.getElementById('currentStreak').textContent = gameStats.currentStreak;
    document.getElementById('bestStreak').textContent = gameStats.bestStreak;
}

function showDifficultySelector() {
    document.getElementById('difficultySelector').classList.remove('hidden');
    document.getElementById('gamePlay').classList.add('hidden');
    document.getElementById('gameOver').classList.add('hidden');
}

function startGame(min, max, maxGuesses) {
    currentGame = {
        min: min,
        max: max,
        maxGuesses: maxGuesses,
        secretNumber: Math.floor(Math.random() * (max - min + 1)) + min,
        guessesLeft: maxGuesses,
        guessHistory: [],
        gameActive: true,
        startTime: Date.now(),
        timerInterval: null,
        totalTime: 0
    };
    
    // Update UI
    document.getElementById('difficultySelector').classList.add('hidden');
    document.getElementById('gamePlay').classList.remove('hidden');
    document.getElementById('gameOver').classList.add('hidden');
    
    document.getElementById('gameRange').textContent = `Guess a number between ${min} and ${max}`;
    document.getElementById('guessesLeft').textContent = maxGuesses;
    document.getElementById('guessInput').min = min;
    document.getElementById('guessInput').max = max;
    document.getElementById('guessInput').value = '';
    document.getElementById('feedbackMessage').textContent = 'Make your first guess!';
    
    // Start timer
    startTimer();
    document.getElementById('hint').textContent = '';
    document.getElementById('hint').className = 'hint';
    document.getElementById('guessHistory').innerHTML = '';
    
    // Focus on input
    document.getElementById('guessInput').focus();
}

function makeGuess() {
    if (!currentGame.gameActive) return;
    
    const guessInput = document.getElementById('guessInput');
    const guess = parseInt(guessInput.value);
    
    // Validate input
    if (isNaN(guess) || guess < currentGame.min || guess > currentGame.max) {
        alert(`Please enter a number between ${currentGame.min} and ${currentGame.max}`);
        return;
    }
    
    // Check if already guessed
    if (currentGame.guessHistory.some(g => g.number === guess)) {
        alert('You already guessed that number!');
        return;
    }
    
    // Process guess
    currentGame.guessesLeft--;
    
    let result;
    let hintClass;
    let feedbackMessage;
    
    if (guess === currentGame.secretNumber) {
        result = 'correct';
        hintClass = 'correct';
        feedbackMessage = '🎉 Correct! You won!';
        endGame(true);
    } else if (guess < currentGame.secretNumber) {
        result = 'too-low';
        hintClass = 'too-low';
        feedbackMessage = 'Too low! Try a higher number.';
    } else {
        result = 'too-high';
        hintClass = 'too-high';
        feedbackMessage = 'Too high! Try a lower number.';
    }
    
    // Add to history
    currentGame.guessHistory.push({
        number: guess,
        result: result
    });
    
    // Update UI
    updateGuessHistory();
    
    if (currentGame.gameActive) {
        document.getElementById('feedbackMessage').textContent = feedbackMessage;
        document.getElementById('hint').textContent = getSmartHint(guess);
        document.getElementById('hint').className = `hint ${hintClass}`;
        document.getElementById('guessesLeft').textContent = currentGame.guessesLeft;
        
        if (currentGame.guessesLeft === 0) {
            endGame(false);
        }
    }
    
    // Clear input
    guessInput.value = '';
    guessInput.focus();
}

function getSmartHint(guess) {
    const diff = Math.abs(guess - currentGame.secretNumber);
    const range = currentGame.max - currentGame.min;
    
    if (diff === 0) return 'Perfect!';
    
    if (range <= 10) {
        if (diff === 1) return 'Very close!';
        if (diff <= 2) return 'Close!';
        return 'Keep trying!';
    } else if (range <= 50) {
        if (diff <= 2) return 'Very close!';
        if (diff <= 5) return 'Close!';
        if (diff <= 10) return 'Getting warmer!';
        return 'Keep trying!';
    } else {
        if (diff <= 3) return 'Very close!';
        if (diff <= 8) return 'Close!';
        if (diff <= 15) return 'Getting warmer!';
        if (diff <= 25) return 'Getting colder...';
        return 'Way off!';
    }
}

function updateGuessHistory() {
    const historyDiv = document.getElementById('guessHistory');
    historyDiv.innerHTML = currentGame.guessHistory.map(guess => 
        `<div class="history-item ${guess.result}">${guess.number}</div>`
    ).join('');
}

function endGame(won) {
    currentGame.gameActive = false;
    stopTimer(); // Stop and record timer
    
    gameStats.totalGames++;
    
    if (won) {
        gameStats.gamesWon++;
        gameStats.currentStreak++;
        if (gameStats.currentStreak > gameStats.bestStreak) {
            gameStats.bestStreak = gameStats.currentStreak;
        }
        
        // Check for leaderboard qualification
        checkLeaderboardQualification(won);
    } else {
        gameStats.currentStreak = 0;
    }
    
    updateStatsDisplay();
    saveStats();
    
    // Show game over screen
    setTimeout(() => {
        document.getElementById('gamePlay').classList.add('hidden');
        document.getElementById('gameOver').classList.remove('hidden');
        
        const resultDiv = document.getElementById('resultMessage');
        const statsDiv = document.getElementById('gameStats');
        
        if (won) {
            resultDiv.className = 'result-message win';
            resultDiv.innerHTML = `
                🎉 Congratulations! 🎉<br>
                You guessed ${currentGame.secretNumber} in ${currentGame.guessHistory.length} ${currentGame.guessHistory.length === 1 ? 'guess' : 'guesses'}!
            `;
        } else {
            resultDiv.className = 'result-message lose';
            resultDiv.innerHTML = `
                😔 Game Over!<br>
                The number was ${currentGame.secretNumber}
            `;
        }
        
        // Show detailed stats
        const efficiency = Math.round((currentGame.guessHistory.length / currentGame.maxGuesses) * 100);
        statsDiv.innerHTML = `
            <h4>Game Statistics</h4>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">${currentGame.guessHistory.length}</div>
                    <div class="stat-label">Guesses Used</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${currentGame.maxGuesses - currentGame.guessesLeft}</div>
                    <div class="stat-label">Max Guesses</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${won ? efficiency : 0}%</div>
                    <div class="stat-label">Efficiency</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${Math.round((gameStats.gamesWon / gameStats.totalGames) * 100) || 0}%</div>
                    <div class="stat-label">Win Rate</div>
                </div>
            </div>
        `;
    }, 1500);
}

function giveUp() {
    if (!currentGame.gameActive) return;
    
    if (confirm('Are you sure you want to give up?')) {
        document.getElementById('feedbackMessage').textContent = `The number was ${currentGame.secretNumber}`;
        document.getElementById('hint').textContent = 'Better luck next time!';
        document.getElementById('hint').className = 'hint';
        endGame(false);
    }
}

function startTimer() {
    document.getElementById('timer').textContent = '00:00';
    currentGame.timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - currentGame.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function stopTimer() {
    if (currentGame.timerInterval) {
        clearInterval(currentGame.timerInterval);
        currentGame.timerInterval = null;
        currentGame.totalTime = Math.floor((Date.now() - currentGame.startTime) / 1000);
    }
}

function playAgain() {
    stopTimer(); // Stop current timer
    startGame(currentGame.min, currentGame.max, currentGame.maxGuesses);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Show leaderboard for this game
function showGameLeaderboard() {
    if (window.firebaseGlobalLeaderboard) {
        window.firebaseGlobalLeaderboard.showLeaderboard('number-guessing');
    } else if (window.gameLeaderboard) {
        window.gameLeaderboard.showLeaderboard('number-guessing');
    }
}

// Check if player qualifies for leaderboard
function checkLeaderboardQualification(won) {
    // Calculate score based on difficulty, efficiency, and streak
    const difficultyMultiplier = getDifficultyMultiplier();
    const efficiency = Math.round(100 - ((currentGame.guessHistory.length / currentGame.maxGuesses) * 100));
    const streakBonus = Math.min(gameStats.currentStreak * 10, 100);
    const finalScore = Math.round((efficiency * difficultyMultiplier) + streakBonus);
    
    const gameDetails = {
        difficulty: getDifficultyName(),
        guesses_used: currentGame.guessHistory.length,
        max_guesses: currentGame.maxGuesses,
        efficiency: efficiency + '%',
        current_streak: gameStats.currentStreak,
        win_rate: Math.round((gameStats.gamesWon / gameStats.totalGames) * 100) + '%',
        time_taken: currentGame.totalTime,
        time_display: formatTime(currentGame.totalTime)
    };
    
    // Track game completion
    if (window.analytics) {
        window.analytics.trackGameComplete('number-guessing', finalScore, won ? 'won' : 'lost');
    }
    
            if (window.firebaseGlobalLeaderboard) {
            window.firebaseGlobalLeaderboard.submitScore('number-guessing', {
            score: finalScore,
            details: gameDetails
        })
            .then(result => {
                if (result && result.submitted) {
                    const resultDiv = document.getElementById('resultMessage');
                    resultDiv.innerHTML += `<br>🏆 Added to leaderboard as ${result.playerName}!`;
                }
            })
            .catch(error => {
                console.warn('Leaderboard submission error:', error);
            });
    }
}

// Get difficulty multiplier for scoring
function getDifficultyMultiplier() {
    const range = currentGame.max - currentGame.min;
    if (range <= 10) return 1.0;      // Easy
    if (range <= 50) return 1.5;      // Medium  
    return 2.0;                       // Hard
}

// Get difficulty name for display
function getDifficultyName() {
    const range = currentGame.max - currentGame.min;
    if (range <= 10) return 'Easy (1-10)';
    if (range <= 50) return 'Medium (1-50)';
    return 'Hard (1-100)';
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Track game view
    if (window.analytics) {
        window.analytics.trackGameView('number-guessing');
    }
    loadStats();
    
    // Allow Enter key to submit guess
    document.getElementById('guessInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            makeGuess();
        }
    });
    
    // Prevent invalid input
    document.getElementById('guessInput').addEventListener('input', function() {
        const value = parseInt(this.value);
        if (value < currentGame.min) this.value = currentGame.min;
        if (value > currentGame.max) this.value = currentGame.max;
    });
});