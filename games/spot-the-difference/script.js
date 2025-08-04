// Game state
let currentGame = {
    level: 1,
    differencesFound: 0,
    totalDifferences: 5,
    startTime: null,
    timerInterval: null,
    hintsUsed: 0,
    isGameActive: false
};

// Level configurations with NEW SCENE coordinates
const levelConfigs = {
    1: {
        differences: 5,
        name: "Colorful Village",
        differenceSpots: [
            { id: 'sun-color', x: 340, y: 50, description: 'Pink sun (bigger size)' },
            { id: 'cloud-position', x: 130, y: 70, description: 'Pink cloud moved right' },
            { id: 'flower-color', x: 226, y: 240, description: 'Green flower (bigger)' },
            { id: 'bird-position', x: 180, y: 127, description: 'Orange bird moved left' },
            { id: 'tree-color', x: 270, y: 120, description: 'Pink tree leaves (bigger)' }
        ]
    },
    2: {
        differences: 6,
        name: "Bright Scene",
        differenceSpots: [
            { id: 'sun-position', x: 80, y: 50, description: 'Green sun moved to left' },
            { id: 'cloud-size', x: 310, y: 65, description: 'Large pink cloud' },
            { id: 'flower-size', x: 226, y: 240, description: 'Large yellow flower' },
            { id: 'bird-rotate', x: 310, y: 127, description: 'Purple bird moved right' },
            { id: 'tree-size', x: 320, y: 70, description: 'Large orange tree' },
            { id: 'house-color', x: 100, y: 200, description: 'Pink house' }
        ]
    },
    3: {
        differences: 7,
        name: "Night Scene",
        differenceSpots: [
            { id: 'sun-missing', x: 340, y: 50, description: 'Missing sun' },
            { id: 'cloud-black', x: 130, y: 70, description: 'Black cloud (larger)' },
            { id: 'cloud-red', x: 280, y: 60, description: 'Red cloud moved up' },
            { id: 'flower-missing', x: 206, y: 240, description: 'Missing pink flower' },
            { id: 'house-purple', x: 110, y: 240, description: 'Purple house (bigger)' },
            { id: 'window-red', x: 82, y: 180, description: 'Red window (bigger)' },
            { id: 'bird-missing', x: 180, y: 127, description: 'Missing bird' }
        ]
    }
};

function goHome() {
    window.location.href = '../../index.html';
}

function showLevelSelector() {
    document.getElementById('levelSelector').classList.remove('hidden');
    document.getElementById('gamePlay').classList.add('hidden');
    document.getElementById('gameComplete').classList.add('hidden');
    clearInterval(currentGame.timerInterval);
}

function startLevel(level) {
    currentGame.level = level;
    currentGame.differencesFound = 0;
    currentGame.totalDifferences = levelConfigs[level].differences;
    currentGame.hintsUsed = 0;
    currentGame.isGameActive = true;
    
    document.getElementById('levelSelector').classList.add('hidden');
    document.getElementById('gamePlay').classList.remove('hidden');
    document.getElementById('gameComplete').classList.add('hidden');
    
    generateLevel(level);
    updateUI();
    startTimer();
}

function generateLevel(level) {
    const imageA = document.getElementById('imageA');
    const imageB = document.getElementById('imageB');
    
    // Clear previous content and classes
    imageA.innerHTML = '';
    imageB.innerHTML = '';
    
    // Clear all previous level classes
    imageA.className = 'game-image';
    imageB.className = 'game-image';
    
    // Create base scene for both images
    createBaseScene(imageA);
    createBaseScene(imageB);
    
    // Add level-specific class for CSS modifications to Image B only
    imageB.classList.add(`level-${level}`);
    
    // Add clickable difference spots to image B
    addDifferenceSpots(imageB, level);
    
    // Generate difference indicators
    generateDifferenceTracker();
}

function createBaseScene(container) {
    const elements = [
        { class: 'scene-element sun', id: 'sun' },
        { class: 'scene-element cloud1', id: 'cloud1' },
        { class: 'scene-element cloud2', id: 'cloud2' },
        { class: 'scene-element house', id: 'house' },
        { class: 'scene-element roof', id: 'roof' },
        { class: 'scene-element door', id: 'door' },
        { class: 'scene-element window1', id: 'window1' },
        { class: 'scene-element window2', id: 'window2' },
        { class: 'scene-element tree-trunk', id: 'tree-trunk' },
        { class: 'scene-element tree-leaves', id: 'tree-leaves' },
        { class: 'scene-element flower1', id: 'flower1' },
        { class: 'scene-element flower2', id: 'flower2' },
        { class: 'scene-element flower3', id: 'flower3' },
        { class: 'scene-element bird', id: 'bird' },
        { class: 'scene-element car', id: 'car' }
    ];
    
    elements.forEach(element => {
        const div = document.createElement('div');
        div.className = element.class;
        div.id = element.id;
        container.appendChild(div);
    });
}

function addDifferenceSpots(container, level) {
    const spots = levelConfigs[level].differenceSpots;
    
    spots.forEach((spot, index) => {
        const spotElement = document.createElement('div');
        spotElement.className = 'difference-spot';
        spotElement.style.left = `${spot.x - 25}px`; // Center the 50px circle
        spotElement.style.top = `${spot.y - 25}px`;  // Center the 50px circle
        spotElement.dataset.id = spot.id;
        spotElement.dataset.description = spot.description;
        spotElement.addEventListener('click', () => handleDifferenceClick(spotElement, index));
        container.appendChild(spotElement);
        
        // Debug: Show clickable areas for 3 seconds
        spotElement.style.border = '2px dashed rgba(255, 0, 0, 0.5)';
        spotElement.style.background = 'rgba(255, 0, 0, 0.1)';
        setTimeout(() => {
            spotElement.style.border = '3px solid transparent';
            spotElement.style.background = 'transparent';
        }, 3000);
    });
}

function handleDifferenceClick(spotElement, index) {
    if (!currentGame.isGameActive || spotElement.classList.contains('found')) {
        return;
    }
    
    // Mark as found
    spotElement.classList.add('found');
    currentGame.differencesFound++;
    
    // Update difference indicator
    const indicators = document.querySelectorAll('.difference-indicator');
    if (indicators[index]) {
        indicators[index].classList.add('found');
        indicators[index].textContent = '✓';
    }
    
    // Show feedback
    showFeedback(`Found: ${spotElement.dataset.description}!`, 'success');
    
    updateUI();
    
    // Check if level is complete
    if (currentGame.differencesFound >= currentGame.totalDifferences) {
        completeLevel();
    }
}

function generateDifferenceTracker() {
    const tracker = document.getElementById('differencesTracker');
    tracker.innerHTML = '';
    
    for (let i = 0; i < currentGame.totalDifferences; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'difference-indicator';
        indicator.textContent = i + 1;
        tracker.appendChild(indicator);
    }
}

function updateUI() {
    document.getElementById('currentLevel').textContent = currentGame.level;
    document.getElementById('differencesFound').textContent = currentGame.differencesFound;
    document.getElementById('totalDifferences').textContent = currentGame.totalDifferences;
    document.getElementById('gameStatus').textContent = 
        `Find all ${currentGame.totalDifferences} differences! (${currentGame.differencesFound} found)`;
}

function startTimer() {
    currentGame.startTime = new Date();
    clearInterval(currentGame.timerInterval);
    
    currentGame.timerInterval = setInterval(() => {
        if (!currentGame.isGameActive) return;
        
        const elapsed = Math.floor((new Date() - currentGame.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function getHint() {
    if (!currentGame.isGameActive) return;
    
    const unfoundSpots = document.querySelectorAll('.difference-spot:not(.found)');
    if (unfoundSpots.length === 0) return;
    
    // Get a random unfound spot
    const randomSpot = unfoundSpots[Math.floor(Math.random() * unfoundSpots.length)];
    
    // Highlight it temporarily
    randomSpot.classList.add('hint-highlight');
    showFeedback(`💡 Hint: Look for changes in the ${randomSpot.dataset.description}!`, 'hint');
    
    currentGame.hintsUsed++;
    
    setTimeout(() => {
        randomSpot.classList.remove('hint-highlight');
    }, 6000);
}

function showFeedback(message, type) {
    const statusElement = document.getElementById('gameStatus');
    const originalMessage = statusElement.textContent;
    
    statusElement.textContent = message;
    statusElement.style.color = type === 'success' ? '#2ecc71' : type === 'hint' ? '#f39c12' : '#333';
    
    setTimeout(() => {
        statusElement.textContent = originalMessage;
        statusElement.style.color = '#333';
    }, 2000);
}

function resetLevel() {
    if (confirm('Are you sure you want to reset this level?')) {
        startLevel(currentGame.level);
    }
}

function completeLevel() {
    currentGame.isGameActive = false;
    clearInterval(currentGame.timerInterval);
    
    const endTime = new Date();
    const totalTime = Math.floor((endTime - currentGame.startTime) / 1000);
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    
    // Calculate score
    const baseScore = currentGame.totalDifferences * 100;
    const timeBonus = Math.max(0, 300 - totalTime); // Bonus for completing under 5 minutes
    const hintPenalty = currentGame.hintsUsed * 10;
    const finalScore = Math.max(0, baseScore + timeBonus - hintPenalty);
    
    // Save best time
    const storageKey = `spotDifference_level${currentGame.level}_bestTime`;
    const currentBest = localStorage.getItem(storageKey);
    const isNewRecord = !currentBest || totalTime < parseInt(currentBest);
    
    if (isNewRecord) {
        localStorage.setItem(storageKey, totalTime);
    }
    
    // Check for leaderboard qualification
    const gameDetails = {
        level: currentGame.level,
        time_taken: `${minutes}:${seconds.toString().padStart(2, '0')}`,
        hints_used: currentGame.hintsUsed,
        difficulty: levelConfigs[currentGame.level].name
    };
    
    if (window.gameLeaderboard && window.gameLeaderboard.qualifiesForLeaderboard('spot-the-difference', finalScore)) {
        // Show name input for leaderboard
        window.gameLeaderboard.showNameInput('spot-the-difference', finalScore, gameDetails, 'high')
            .then(result => {
                showCompletionScreen(finalScore, minutes, seconds, isNewRecord, result.submitted ? result.playerName : null);
            });
    } else {
        showCompletionScreen(finalScore, minutes, seconds, isNewRecord);
    }
}

function showCompletionScreen(finalScore, minutes, seconds, isNewRecord, playerName = null) {
    // Show completion screen
    document.getElementById('gamePlay').classList.add('hidden');
    document.getElementById('gameComplete').classList.remove('hidden');
    
    const statsDiv = document.getElementById('completionStats');
    statsDiv.innerHTML = `
        <div class="completion-stat">
            <strong>Time:</strong> ${minutes}:${seconds.toString().padStart(2, '0')}
            ${isNewRecord ? ' 🏆 New Record!' : ''}
        </div>
        <div class="completion-stat">
            <strong>Hints Used:</strong> ${currentGame.hintsUsed}
        </div>
        <div class="completion-stat">
            <strong>Score:</strong> ${finalScore} points
            ${playerName ? ` 🏆 Added to leaderboard as ${playerName}!` : ''}
        </div>
        <div class="completion-stat">
            <strong>Level:</strong> ${levelConfigs[currentGame.level].name}
        </div>
    `;
    
    showFeedback('🎉 Level Complete!', 'success');
}

function nextLevel() {
    const nextLevelNum = currentGame.level + 1;
    if (levelConfigs[nextLevelNum]) {
        startLevel(nextLevelNum);
    } else {
        showFeedback('🎉 Congratulations! You\'ve completed all levels!', 'success');
        setTimeout(() => {
            showLevelSelector();
        }, 3000);
    }
}

// Handle clicks outside difference spots (for user feedback)
document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers to game images for wrong clicks
    document.getElementById('imageA').addEventListener('click', handleWrongClick);
    document.getElementById('imageB').addEventListener('click', function(e) {
        // Only handle wrong clicks if not clicking on a difference spot
        if (!e.target.classList.contains('difference-spot')) {
            handleWrongClick(e);
        }
    });
});

function handleWrongClick(e) {
    if (!currentGame.isGameActive) return;
    
    // Create temporary "miss" indicator
    const miss = document.createElement('div');
    miss.style.position = 'absolute';
    miss.style.left = `${e.offsetX - 15}px`;
    miss.style.top = `${e.offsetY - 15}px`;
    miss.style.width = '30px';
    miss.style.height = '30px';
    miss.style.border = '2px solid #e74c3c';
    miss.style.borderRadius = '50%';
    miss.style.pointerEvents = 'none';
    miss.style.animation = 'fadeOut 1s ease-out forwards';
    
    e.target.appendChild(miss);
    
    setTimeout(() => {
        if (miss.parentNode) {
            miss.parentNode.removeChild(miss);
        }
    }, 1000);
}

// Show leaderboard for this game
function showGameLeaderboard() {
    if (window.gameLeaderboard) {
        window.gameLeaderboard.showLeaderboard('spot-the-difference');
    }
}

// Add CSS animation for miss indicator
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(1.5); }
    }
`;
document.head.appendChild(style);