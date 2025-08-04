let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let gameActive = false;
let startTime;
let timerInterval;
let totalPairs = 0;

// Card symbols for different difficulty levels
const symbols = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐸', '🐵', '🐧', '🐦', '🦋', '🐛', '🐝', '🦄', '🐴', '🐺', '🦔', '🦇', '🐙', '🦀', '🐠', '🐡', '🦈', '🐳', '🐋', '🦭', '🐘'];

function goHome() {
    window.location.href = '../../index.html';
}

function showDifficultySelector() {
    document.getElementById('difficultySelector').classList.remove('hidden');
    document.getElementById('gameBoard').innerHTML = '';
    document.getElementById('gameBoard').className = 'game-board';
    resetStats();
}

function resetStats() {
    moves = 0;
    matchedPairs = 0;
    gameActive = false;
    clearInterval(timerInterval);
    
    document.getElementById('moves').textContent = moves;
    document.getElementById('matches').textContent = matchedPairs;
    document.getElementById('timer').textContent = '00:00';
    document.getElementById('gameStatus').textContent = 'Click cards to find matching pairs!';
    
    // Remove any win message
    const winMessage = document.querySelector('.win-message');
    if (winMessage) {
        winMessage.remove();
    }
}

function startGame(totalCards) {
    totalPairs = totalCards / 2;
    
    // Hide difficulty selector
    document.getElementById('difficultySelector').classList.add('hidden');
    
    resetStats();
    createBoard(totalCards);
    gameActive = true;
    startTimer();
    
    // Set board class for styling
    const board = document.getElementById('gameBoard');
    if (totalCards === 8) board.classList.add('easy');
    else if (totalCards === 18) board.classList.add('medium');
    else if (totalCards === 32) board.classList.add('hard');
}

function createBoard(totalCards) {
    cards = [];
    flippedCards = [];
    
    // Create pairs of symbols
    const gameSymbols = symbols.slice(0, totalPairs);
    const cardSymbols = [...gameSymbols, ...gameSymbols];
    
    // Shuffle the cards
    cardSymbols.sort(() => Math.random() - 0.5);
    
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    
    cardSymbols.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        card.addEventListener('click', flipCard);
        card.textContent = '?';
        
        gameBoard.appendChild(card);
        cards.push(card);
    });
}

function flipCard(event) {
    if (!gameActive) return;
    
    const card = event.target;
    
    // Prevent flipping already flipped or matched cards
    if (card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    // Prevent flipping more than 2 cards
    if (flippedCards.length >= 2) {
        return;
    }
    
    // Flip the card
    card.classList.add('flipped');
    card.textContent = card.dataset.symbol;
    flippedCards.push(card);
    
    // Check for match when 2 cards are flipped
    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moves').textContent = moves;
        
        setTimeout(checkMatch, 600);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.dataset.symbol === card2.dataset.symbol) {
        // It's a match!
        card1.classList.add('matched');
        card2.classList.add('matched');
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        
        matchedPairs++;
        document.getElementById('matches').textContent = matchedPairs;
        
        // Check for win
        if (matchedPairs === totalPairs) {
            gameWon();
        }
    } else {
        // Not a match
        card1.classList.add('wrong');
        card2.classList.add('wrong');
        
        setTimeout(() => {
            card1.classList.remove('flipped', 'wrong');
            card2.classList.remove('flipped', 'wrong');
            card1.textContent = '?';
            card2.textContent = '?';
        }, 500);
    }
    
    flippedCards = [];
}

function gameWon() {
    gameActive = false;
    clearInterval(timerInterval);
    
    const finalTime = document.getElementById('timer').textContent;
    
    // Calculate score (lower moves = higher score)
    const maxPossibleMoves = totalPairs * 3; // Assume max 3 moves per pair
    const efficiency = Math.max(0, (maxPossibleMoves - moves) / maxPossibleMoves);
    const timeBonus = Math.max(0, 300 - Math.floor(timerInterval / 1000)); // Up to 5 minutes
    const finalScore = Math.round((efficiency * 1000) + (timeBonus * 2));
    
    const gameDetails = {
        moves: moves,
        time_taken: finalTime,
        difficulty: totalPairs === 4 ? 'Easy' : totalPairs === 9 ? 'Medium' : 'Hard',
        pairs: totalPairs
    };
    
    // Check for leaderboard qualification (higher score is better)
    if (window.gameLeaderboard && window.gameLeaderboard.qualifiesForLeaderboard('memory-match', finalScore)) {
        window.gameLeaderboard.showNameInput('memory-match', finalScore, gameDetails, 'high')
            .then(result => {
                showWinMessage(moves, finalTime, result.submitted ? result.playerName : null);
            });
    } else {
        showWinMessage(moves, finalTime);
    }
    
    // Save best time (optional feature)
    saveBestTime(moves, finalTime);
}

function showWinMessage(moves, finalTime, playerName = null) {
    const winMessage = document.createElement('div');
    winMessage.className = 'win-message';
    winMessage.innerHTML = `
        🎉 Congratulations! 🎉<br>
        You won in ${moves} moves and ${finalTime}!
        ${playerName ? `<br>🏆 Added to leaderboard as ${playerName}!` : ''}
    `;
    
    document.querySelector('.game-area').insertBefore(
        winMessage, 
        document.getElementById('gameBoard')
    );
    
    document.getElementById('gameStatus').textContent = 'Game Complete! Start a new game?';
}

function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const currentTime = new Date();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('timer').textContent = formattedTime;
}

function resetGame() {
    if (cards.length === 0) {
        showDifficultySelector();
        return;
    }
    
    // Reset all cards
    cards.forEach(card => {
        card.classList.remove('flipped', 'matched', 'wrong');
        card.textContent = '?';
    });
    
    // Shuffle cards again
    const symbols = cards.map(card => card.dataset.symbol);
    symbols.sort(() => Math.random() - 0.5);
    
    cards.forEach((card, index) => {
        card.dataset.symbol = symbols[index];
    });
    
    resetStats();
    gameActive = true;
    startTimer();
}

function saveBestTime(moves, time) {
    const difficulty = totalPairs === 4 ? 'easy' : totalPairs === 9 ? 'medium' : 'hard';
    const key = `memoryMatch_${difficulty}_bestMoves`;
    const currentBest = localStorage.getItem(key);
    
    if (!currentBest || moves < parseInt(currentBest)) {
        localStorage.setItem(key, moves);
        localStorage.setItem(`memoryMatch_${difficulty}_bestTime`, time);
    }
}

// Show leaderboard for this game
function showGameLeaderboard() {
    if (window.gameLeaderboard) {
        window.gameLeaderboard.showLeaderboard('memory-match');
    }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
    showDifficultySelector();
});