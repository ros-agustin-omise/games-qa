// Word databases for different difficulties
const wordDatabase = {
    easy: [
        { word: 'MOON', hint: 'Earth\'s natural satellite' },
        { word: 'TREE', hint: 'Tall plant with branches' },
        { word: 'HOUSE', hint: 'A place where people live' },
        { word: 'WATER', hint: 'Essential liquid for life' },
        { word: 'HAPPY', hint: 'Feeling of joy' },
        { word: 'SMILE', hint: 'Facial expression of happiness' },
        { word: 'HEART', hint: 'Organ that pumps blood' },
        // Additional easy 5-letter words
        { word: 'APPLE', hint: 'Red or green fruit that grows on trees' },
        { word: 'BEACH', hint: 'Sandy shore by the ocean' },
        { word: 'CHAIR', hint: 'Furniture you sit on' },
        { word: 'DANCE', hint: 'Moving rhythmically to music' },
        { word: 'EAGLE', hint: 'Large bird of prey' },
        { word: 'FRESH', hint: 'Clean and new' },
        { word: 'LIGHT', hint: 'Brightness that helps you see' },
        { word: 'MUSIC', hint: 'Pleasant sounds and melodies' },
        { word: 'OCEAN', hint: 'Large body of salt water' },
        { word: 'PARTY', hint: 'Fun celebration with friends' },
        { word: 'QUIET', hint: 'Making little or no noise' },
        { word: 'ROUND', hint: 'Shaped like a circle' },
        { word: 'SLEEP', hint: 'Rest with your eyes closed' },
        { word: 'THANK', hint: 'Express gratitude' },
        { word: 'UNCLE', hint: 'Your parent\'s brother' }
    ],
    medium: [
        { word: 'RAINBOW', hint: 'Colorful arc in the sky after rain' },
        { word: 'ELEPHANT', hint: 'Large mammal with a trunk' },
        { word: 'BUTTERFLY', hint: 'Colorful insect with wings' },
        { word: 'COMPUTER', hint: 'Electronic device for processing data' },
        { word: 'MOUNTAIN', hint: 'Very high natural elevation' },
        { word: 'KITCHEN', hint: 'Room where food is prepared' },
        { word: 'FRIENDS', hint: 'People you enjoy spending time with' },
        { word: 'BICYCLE', hint: 'Two-wheeled vehicle you pedal' },
        { word: 'SUNSHINE', hint: 'Light and warmth from the sun' },
        { word: 'FOOTBALL', hint: 'Popular sport played with feet' }
    ],
    hard: [
        { word: 'HELICOPTER', hint: 'Aircraft with rotating blades' },
        { word: 'DEMOCRACY', hint: 'Government by the people' },
        { word: 'PHILOSOPHER', hint: 'Someone who studies wisdom and knowledge' },
        { word: 'ARCHITECTURE', hint: 'Art and science of building design' },
        { word: 'PERSONALITY', hint: 'Individual character and traits' },
        { word: 'REFRIGERATOR', hint: 'Appliance that keeps food cold' },
        { word: 'CELEBRATION', hint: 'Joyful event or festival' },
        { word: 'UNDERSTANDING', hint: 'Comprehension and empathy' },
        { word: 'PLAYGROUND', hint: 'Area with equipment for children to play' },
        { word: 'PHOTOGRAPHY', hint: 'Art of capturing images with a camera' }
    ]
};

let currentGame = {
    difficulty: 'easy',
    currentWord: null,
    scrambledWord: '',
    hintsUsed: 0,
    startTime: null,
    timerInterval: null,
    wordsCompleted: 0,
    currentStreak: 0,
    score: 0
};

let gameStats = {
    totalScore: 0,
    wordsSolved: 0,
    bestStreak: 0,
    avgTime: 0
};

function goHome() {
    window.location.href = '../../index.html';
}

function loadStats() {
    const saved = localStorage.getItem('wordScrambleStats');
    if (saved) {
        gameStats = { ...gameStats, ...JSON.parse(saved) };
        updateStatsDisplay();
    }
}

function saveStats() {
    localStorage.setItem('wordScrambleStats', JSON.stringify(gameStats));
}

function updateStatsDisplay() {
    document.getElementById('currentScore').textContent = currentGame.score;
    document.getElementById('wordsSolved').textContent = gameStats.wordsSolved;
    document.getElementById('bestStreak').textContent = gameStats.bestStreak;
    document.getElementById('currentStreak').textContent = currentGame.currentStreak;
}

function showDifficultySelector() {
    document.getElementById('difficultySelector').classList.remove('hidden');
    document.getElementById('gamePlay').classList.add('hidden');
    clearInterval(currentGame.timerInterval);
}

function startGame(difficulty) {
    currentGame.difficulty = difficulty;
    currentGame.score = 0;
    currentGame.wordsCompleted = 0;
    currentGame.currentStreak = 0;
    currentGame.hintsUsed = 0;
    
    document.getElementById('difficultySelector').classList.add('hidden');
    document.getElementById('gamePlay').classList.remove('hidden');
    
    loadNewWord();
    updateStatsDisplay();
}

function loadNewWord() {
    const words = wordDatabase[currentGame.difficulty];
    const randomIndex = Math.floor(Math.random() * words.length);
    currentGame.currentWord = words[randomIndex];
    
    scrambleWord();
    updateWordDisplay();
    startTimer();
    
    // Clear input and feedback
    const input = document.getElementById('answerInput');
    input.value = '';
    input.className = '';
    input.focus();
    
    document.getElementById('feedbackMessage').textContent = '';
    document.getElementById('feedbackMessage').className = 'feedback-message';
    
    // Reset hint button
    document.getElementById('gameControls').querySelector('button').disabled = false;
}

function scrambleWord() {
    const word = currentGame.currentWord.word;
    let scrambled;
    
    // Make sure scrambled word is different from original
    do {
        scrambled = word.split('').sort(() => Math.random() - 0.5).join('');
    } while (scrambled === word && word.length > 1);
    
    currentGame.scrambledWord = scrambled;
}

function updateWordDisplay() {
    const scrambledDiv = document.getElementById('scrambledWord');
    const hintDiv = document.getElementById('wordHint');
    
    // Animate letters
    scrambledDiv.innerHTML = currentGame.scrambledWord
        .split('')
        .map((letter, index) => 
            `<span class="letter-animation" style="animation-delay: ${index * 0.1}s">${letter}</span>`
        ).join('');
    
    // Initially hide hint
    hintDiv.style.display = 'none';
}

function startTimer() {
    currentGame.startTime = new Date();
    clearInterval(currentGame.timerInterval);
    
    currentGame.timerInterval = setInterval(() => {
        const elapsed = Math.floor((new Date() - currentGame.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function checkAnswer() {
    const input = document.getElementById('answerInput');
    const answer = input.value.trim().toUpperCase();
    const correctAnswer = currentGame.currentWord.word.toUpperCase();
    
    if (!answer) return;
    
    if (answer === correctAnswer) {
        handleCorrectAnswer();
    } else {
        handleIncorrectAnswer();
    }
}

function handleCorrectAnswer() {
    const input = document.getElementById('answerInput');
    const feedback = document.getElementById('feedbackMessage');
    
    input.className = 'correct';
    feedback.textContent = '🎉 Correct! Well done!';
    feedback.className = 'feedback-message correct';
    
    // Calculate score
    const timeBonus = Math.max(0, 60 - Math.floor((new Date() - currentGame.startTime) / 1000));
    const difficultyMultiplier = currentGame.difficulty === 'easy' ? 1 : currentGame.difficulty === 'medium' ? 2 : 3;
    const hintPenalty = currentGame.hintsUsed * 5;
    const streakBonus = currentGame.currentStreak * 2;
    
    const points = Math.max(1, (10 * difficultyMultiplier + timeBonus + streakBonus - hintPenalty));
    currentGame.score += points;
    currentGame.currentStreak++;
    currentGame.wordsCompleted++;
    
    // Update global stats
    gameStats.wordsSolved++;
    gameStats.totalScore += points;
    if (currentGame.currentStreak > gameStats.bestStreak) {
        gameStats.bestStreak = currentGame.currentStreak;
    }
    
    updateStatsDisplay();
    saveStats();
    
    // Check for leaderboard qualification
    checkLeaderboardQualification();
    
    // Load next word after delay
    setTimeout(() => {
        loadNewWord();
        currentGame.hintsUsed = 0; // Reset hints for new word
    }, 2000);
}

function handleIncorrectAnswer() {
    const input = document.getElementById('answerInput');
    const feedback = document.getElementById('feedbackMessage');
    
    input.className = 'incorrect';
    feedback.textContent = '❌ Not quite right. Try again!';
    feedback.className = 'feedback-message incorrect';
    
    // Reset streak on wrong answer
    currentGame.currentStreak = 0;
    updateStatsDisplay();
    
    setTimeout(() => {
        input.className = '';
        feedback.textContent = '';
        feedback.className = 'feedback-message'; // Reset the class to remove red styling
    }, 2000);
}

function getHint() {
    const hintDiv = document.getElementById('wordHint');
    const feedback = document.getElementById('feedbackMessage');
    const hintButton = event.target;
    
    if (currentGame.hintsUsed === 0) {
        // First hint: show the hint text
        hintDiv.textContent = `Hint: ${currentGame.currentWord.hint}`;
        hintDiv.style.display = 'block';
        currentGame.hintsUsed++;
        hintButton.textContent = '💡 More Hint';
    } else if (currentGame.hintsUsed === 1) {
        // Second hint: show first letter
        const firstLetter = currentGame.currentWord.word[0];
        feedback.textContent = `💡 The word starts with: ${firstLetter}`;
        feedback.className = 'feedback-message hint';
        currentGame.hintsUsed++;
        hintButton.textContent = '💡 Last Hint';
    } else if (currentGame.hintsUsed === 2) {
        // Third hint: show word length and some letters
        const word = currentGame.currentWord.word;
        const revealed = word.split('').map((letter, index) => 
            index === 0 || index === word.length - 1 || Math.random() < 0.3 ? letter : '_'
        ).join(' ');
        feedback.textContent = `💡 Pattern: ${revealed} (${word.length} letters)`;
        feedback.className = 'feedback-message hint';
        currentGame.hintsUsed++;
        hintButton.disabled = true;
        hintButton.textContent = '💡 No More Hints';
    }
}

function scrambleAgain() {
    scrambleWord();
    updateWordDisplay();
    
    const feedback = document.getElementById('feedbackMessage');
    feedback.textContent = '🔄 Word scrambled again!';
    feedback.className = 'feedback-message hint';
    
    setTimeout(() => {
        feedback.textContent = '';
        feedback.className = 'feedback-message'; // Reset the class to remove styling
    }, 1500);
}

function skipWord() {
    if (confirm('Are you sure you want to skip this word? You won\'t get any points.')) {
        const feedback = document.getElementById('feedbackMessage');
        feedback.textContent = `⏭️ Skipped! The word was: ${currentGame.currentWord.word}`;
        feedback.className = 'feedback-message incorrect';
        
        // Reset streak on skip
        currentGame.currentStreak = 0;
        updateStatsDisplay();
        
        setTimeout(() => {
            loadNewWord();
            currentGame.hintsUsed = 0;
        }, 2000);
    }
}

// Show leaderboard for this game
function showGameLeaderboard() {
    if (window.globalLeaderboard) {
        window.globalLeaderboard.showLeaderboard('word-scramble');
    }
}

// Check if player qualifies for leaderboard
function checkLeaderboardQualification() {
    // Check for score milestones
    const scoreMilestones = [100, 250, 500, 1000, 2500, 5000, 10000];
    const streakMilestones = [5, 10, 15, 25, 50, 100];
    
    const qualifiesForScoreMilestone = scoreMilestones.includes(currentGame.score);
    const qualifiesForStreakMilestone = streakMilestones.includes(currentGame.currentStreak);
    
    if (qualifiesForScoreMilestone || qualifiesForStreakMilestone) {
        const gameDetails = {
            current_score: currentGame.score,
            words_completed: currentGame.wordsCompleted,
            current_streak: currentGame.currentStreak,
            difficulty: currentGame.difficulty,
            hints_used: currentGame.hintsUsed,
            total_words_solved: gameStats.wordsSolved,
            best_streak: gameStats.bestStreak
        };
        
        let achievementText = '';
        if (qualifiesForScoreMilestone) {
            achievementText = `${currentGame.score} points reached!`;
        } else if (qualifiesForStreakMilestone) {
            achievementText = `${currentGame.currentStreak} word streak!`;
        }
        
        gameDetails.achievement = achievementText;
        
        // Track achievement
        if (window.analytics && achievementText) {
            window.analytics.trackInteraction('achievement', 'word-scramble', { achievement: achievementText });
        }
        
        if (window.globalLeaderboard) {
            window.globalLeaderboard.submitScore('word-scramble', {
                score: currentGame.score,
                details: gameDetails
            })
                .then(result => {
                    if (result.submitted) {
                        const feedback = document.getElementById('feedbackMessage');
                        feedback.textContent = `🏆 Achievement unlocked! Added to leaderboard as ${result.playerName}!`;
                        feedback.className = 'feedback-message correct';
                    }
                });
        }
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Track game view
    if (window.analytics) {
        window.analytics.trackGameView('word-scramble');
    }
    loadStats();
    
    // Allow Enter key to submit answer
    document.getElementById('answerInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });
    
    // Auto-convert to uppercase
    document.getElementById('answerInput').addEventListener('input', function() {
        this.value = this.value.toUpperCase();
    });
});