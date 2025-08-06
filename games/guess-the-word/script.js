// Guess the Word Game Logic

// Game state
let currentGame = {
    difficulty: '',
    currentRound: 0,
    totalRounds: 10,
    score: 0,
    wordsGuessed: 0,
    currentWord: null,
    revealedClues: 0,
    timeLeft: 60,
    timerInterval: null,
    startTime: null,
    totalCluesUsed: 0,
    isPaused: false,
    usedWords: [],
    availableWords: []
};

// Word database with clues
const wordDatabase = {
    easy: [
        {
            word: "HOUSE",
            category: "Home & Living",
            clues: [
                "A place where people live",
                "Has rooms like kitchen and bedroom",
                "Usually has a roof and walls",
                "You might have a key to enter this",
                "Rhymes with 'mouse'"
            ]
        },
        {
            word: "APPLE",
            category: "Food & Fruits",
            clues: [
                "A popular red or green fruit",
                "Often used in pies and juice",
                "Grows on trees in orchards",
                "An _____ a day keeps the doctor away",
                "Has seeds in its core"
            ]
        },
        {
            word: "OCEAN",
            category: "Nature & Geography",
            clues: [
                "A large body of salt water",
                "Home to whales and dolphins",
                "Covers most of Earth's surface",
                "Has waves and tides",
                "The Pacific is the largest one"
            ]
        },
        {
            word: "MUSIC",
            category: "Arts & Entertainment",
            clues: [
                "Made up of sounds and rhythms",
                "Can be played on instruments",
                "Has melody and harmony",
                "People dance and sing to this",
                "Mozart and Bach created this"
            ]
        },
        {
            word: "HAPPY",
            category: "Emotions & Feelings",
            clues: [
                "A positive emotion or feeling",
                "Opposite of sad",
                "Often shown with a smile",
                "People feel this on their birthday",
                "Rhymes with 'snappy'"
            ]
        },
        {
            word: "CHAIR",
            category: "Furniture & Objects",
            clues: [
                "Something you sit on",
                "Has a back and usually four legs",
                "Found at dining tables",
                "Can be made of wood or plastic",
                "Smaller than a couch"
            ]
        },
        {
            word: "PHONE",
            category: "Technology",
            clues: [
                "Used to make calls",
                "Can be smart or landline",
                "Has numbers and buttons",
                "Rings when someone calls you",
                "Most people carry one today"
            ]
        },
        {
            word: "SMILE",
            category: "Emotions & Expressions",
            clues: [
                "A happy facial expression",
                "Shows your teeth",
                "People do this when they're pleased",
                "Can be contagious",
                "Opposite of frown"
            ]
        }
    ],
    medium: [
        {
            word: "BUTTERFLY",
            category: "Animals & Insects",
            clues: [
                "A colorful flying insect",
                "Starts life as a caterpillar",
                "Has wings with beautiful patterns",
                "Goes through metamorphosis",
                "Drinks nectar from flowers"
            ]
        },
        {
            word: "RAINBOW",
            category: "Weather & Nature",
            clues: [
                "Appears after rain with sunlight",
                "Has seven colors in order",
                "Forms an arc in the sky",
                "Red, orange, yellow, green...",
                "Symbol of hope and diversity"
            ]
        },
        {
            word: "LIBRARY",
            category: "Places & Buildings",
            clues: [
                "A place full of books",
                "People go here to read and study",
                "Has a librarian who helps visitors",
                "You can borrow items from here",
                "Usually very quiet inside"
            ]
        },
        {
            word: "VOLCANO",
            category: "Geography & Nature",
            clues: [
                "A mountain that can erupt",
                "Spews out lava and ash",
                "Found along tectonic plate edges",
                "Can be active or dormant",
                "Pompeii was destroyed by one"
            ]
        },
        {
            word: "TREASURE",
            category: "Adventure & Mystery",
            clues: [
                "Something very valuable",
                "Pirates often searched for this",
                "Usually hidden or buried",
                "Can be gold, jewels, or artifacts",
                "X marks the spot on maps"
            ]
        },
        {
            word: "SANDWICH",
            category: "Food & Meals",
            clues: [
                "Food between two pieces of bread",
                "Can have meat, cheese, or vegetables",
                "Popular lunch item",
                "Named after an English Earl",
                "Can be grilled or cold"
            ]
        },
        {
            word: "ELEPHANT",
            category: "Animals & Wildlife",
            clues: [
                "Largest land mammal",
                "Has a long trunk and big ears",
                "Lives in Africa and Asia",
                "Never forgets, according to saying",
                "Uses trunk to grab things"
            ]
        },
        {
            word: "CALENDAR",
            category: "Time & Organization",
            clues: [
                "Shows days, weeks, and months",
                "Helps people track dates",
                "Has 12 sections for the year",
                "Can be on wall or digital",
                "February has the fewest days"
            ]
        }
    ],
    hard: [
        {
            word: "PHILOSOPHY",
            category: "Academic & Intellectual",
            clues: [
                "The study of knowledge and existence",
                "Socrates and Plato were famous in this field",
                "Asks questions about life and reality"
            ]
        },
        {
            word: "ARCHAEOLOGY",
            category: "Science & History",
            clues: [
                "Study of human history through excavation",
                "Involves digging up ancient artifacts",
                "Indiana Jones practiced this profession"
            ]
        },
        {
            word: "CONSTELLATION",
            category: "Astronomy & Space",
            clues: [
                "A group of stars forming a pattern",
                "Examples include Orion and Big Dipper",
                "Used for navigation in ancient times"
            ]
        },
        {
            word: "METAMORPHOSIS",
            category: "Biology & Science",
            clues: [
                "A complete change of form",
                "What caterpillars undergo to become butterflies",
                "Also the title of a famous Kafka story"
            ]
        },
        {
            word: "ENTREPRENEUR",
            category: "Business & Economics",
            clues: [
                "Someone who starts their own business",
                "Takes financial risks for profit",
                "Examples include Steve Jobs and Elon Musk"
            ]
        },
        {
            word: "PHOTOSYNTHESIS",
            category: "Biology & Science",
            clues: [
                "Process plants use to make food from sunlight",
                "Converts carbon dioxide and water to glucose",
                "Produces oxygen as a byproduct"
            ]
        },
        {
            word: "ARCHITECTURE",
            category: "Art & Design",
            clues: [
                "The design and construction of buildings",
                "Frank Lloyd Wright was famous in this field",
                "Combines art, science, and engineering"
            ]
        },
        {
            word: "REFRIGERATOR",
            category: "Appliances & Technology",
            clues: [
                "A large appliance that keeps food cold",
                "Found in most modern kitchens",
                "Uses refrigeration to preserve food"
            ]
        }
    ]
};

// Initialize game
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase Global Leaderboard
    if (window.firebaseGlobalLeaderboard) {
        console.log('Firebase Global Leaderboard available');
        // Check if init method exists before calling
        if (typeof window.firebaseGlobalLeaderboard.init === 'function') {
            window.firebaseGlobalLeaderboard.init();
        } else {
            console.log('Firebase Global Leaderboard init method not found, may already be initialized');
        }
    } else {
        console.log('Firebase Global Leaderboard not available');
    }
    
    // Track page view
    if (window.analytics) {
        window.analytics.trackPageView('Guess the Word');
    }
    
    // Setup input event listeners
    setupInputListeners();
});

function setupInputListeners() {
    const guessInput = document.getElementById('guessInput');
    if (guessInput) {
        guessInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitGuess();
            }
        });
        
        guessInput.addEventListener('input', function(e) {
            // Convert to uppercase and filter only letters
            e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
        });
    }
}

function startGame(difficulty) {
    // Reset all game state with proper defaults
    currentGame = {
        difficulty: difficulty,
        currentRound: 0,
        totalRounds: 0,
        score: 0, // Explicitly initialize score
        wordsGuessed: 0,
        currentWord: null,
        revealedClues: 0,
        timeLeft: 60,
        timerInterval: null,
        startTime: Date.now(),
        totalCluesUsed: 0,
        isPaused: false,
        usedWords: [],
        availableWords: []
    };
    
    // Set total rounds based on difficulty
    const roundsPerDifficulty = {
        'easy': 5,
        'medium': 3,
        'hard': 1
    };
    currentGame.totalRounds = roundsPerDifficulty[difficulty];
    
    // Initialize available words (copy of the word database for this difficulty)
    currentGame.availableWords = [...wordDatabase[difficulty]];
    
    console.log('Game started - Initial score:', currentGame.score);
    
    // Track game start
    if (window.analytics) {
        window.analytics.trackGameStart('Guess the Word', { 
            difficulty: difficulty,
            total_rounds: currentGame.totalRounds
        });
    }
    
    document.getElementById('gameSetup').classList.add('hidden');
    document.getElementById('gamePlay').classList.remove('hidden');
    
    nextRound();
}

function nextRound() {
    if (currentGame.currentRound >= currentGame.totalRounds) {
        endGame();
        return;
    }
    
    // Check if we have available words left
    if (currentGame.availableWords.length === 0) {
        // If no words left, end the game early
        endGame();
        return;
    }
    
    currentGame.currentRound++;
    currentGame.revealedClues = 0;
    
    // Select random word from available words (no repeats)
    const randomIndex = Math.floor(Math.random() * currentGame.availableWords.length);
    currentGame.currentWord = currentGame.availableWords[randomIndex];
    
    // Remove the selected word from available words and add to used words
    currentGame.usedWords.push(currentGame.currentWord);
    currentGame.availableWords.splice(randomIndex, 1);
    
    // Update UI
    updateGameDisplay();
    resetTimer();
    startTimer();
    
    // Clear input and feedback
    document.getElementById('guessInput').value = '';
    document.getElementById('feedbackMessage').textContent = '';
    document.getElementById('feedbackMessage').className = 'feedback-message';
}

function updateGameDisplay() {
    // Update round info
    document.getElementById('currentRound').textContent = currentGame.currentRound;
    document.getElementById('totalRounds').textContent = currentGame.totalRounds;
    document.getElementById('score').textContent = currentGame.score;
    document.getElementById('category').textContent = currentGame.currentWord.category;
    
    // Create word blanks
    const wordBlanks = document.getElementById('wordBlanks');
    wordBlanks.innerHTML = '';
    for (let i = 0; i < currentGame.currentWord.word.length; i++) {
        const blank = document.createElement('span');
        blank.className = 'word-blank';
        blank.textContent = '_';
        wordBlanks.appendChild(blank);
    }
    
    // Update word length
    document.getElementById('wordLength').textContent = currentGame.currentWord.word.length;
    
    // Reset clues display
    const cluesList = document.getElementById('cluesList');
    cluesList.innerHTML = '';
    
    // Show first clue automatically
    revealNextClue();
}

function revealNextClue() {
    if (currentGame.revealedClues >= currentGame.currentWord.clues.length) {
        return;
    }
    
    const cluesList = document.getElementById('cluesList');
    const clueItem = document.createElement('div');
    clueItem.className = 'clue-item';
    clueItem.innerHTML = `
        <span class="clue-number">${currentGame.revealedClues + 1}.</span>
        <span class="clue-text">${currentGame.currentWord.clues[currentGame.revealedClues]}</span>
    `;
    cluesList.appendChild(clueItem);
    
    currentGame.revealedClues++;
    currentGame.totalCluesUsed++;
    
    // Update button state
    const revealBtn = document.getElementById('revealClueBtn');
    if (currentGame.revealedClues >= currentGame.currentWord.clues.length) {
        revealBtn.disabled = true;
        revealBtn.textContent = '💡 All Clues Revealed';
    } else {
        revealBtn.textContent = `💡 Reveal Next Clue (${currentGame.revealedClues}/${currentGame.currentWord.clues.length})`;
    }
    
    // Track clue reveal
    if (window.analytics) {
        window.analytics.trackEvent('clue_revealed', {
            game: 'Guess the Word',
            clue_number: currentGame.revealedClues,
            word: currentGame.currentWord.word
        });
    }
}

function submitGuess() {
    const guessInput = document.getElementById('guessInput');
    const guess = guessInput.value.trim().toUpperCase();
    
    if (!guess) {
        showFeedback('Please enter a guess!', 'error');
        return;
    }
    
    const feedbackMessage = document.getElementById('feedbackMessage');
    
    if (guess === currentGame.currentWord.word) {
        // Correct guess!
        const points = calculatePoints();
        console.log('Points calculated:', points);
        currentGame.score += points;
        currentGame.wordsGuessed++;
        console.log('New total score:', currentGame.score);
        
        showFeedback(`Correct! +${points} points`, 'success');
        
        // Show the word
        revealWord();
        
        // Track correct guess
        if (window.analytics) {
            window.analytics.trackEvent('word_guessed_correctly', {
                game: 'Guess the Word',
                word: currentGame.currentWord.word,
                clues_used: currentGame.revealedClues,
                points_earned: points
            });
        }
        
        setTimeout(() => {
            nextRound();
        }, 2000);
        
    } else {
        // Wrong guess
        showFeedback('Not quite right. Try again!', 'error');
        guessInput.value = '';
        
        // Track wrong guess
        if (window.analytics) {
            window.analytics.trackEvent('word_guessed_incorrectly', {
                game: 'Guess the Word',
                word: currentGame.currentWord.word,
                guess: guess
            });
        }
    }
}

function calculatePoints() {
    let basePoints = 100;
    
    // Bonus for fewer clues used (first clue is free)
    const clueBonus = Math.max(0, (currentGame.currentWord.clues.length - currentGame.revealedClues) * 20);
    
    // Time bonus (more time left = more bonus)
    const timeBonus = Math.floor(currentGame.timeLeft / 10) * 5;
    
    // Difficulty multiplier
    const difficultyMultiplier = {
        'easy': 1,
        'medium': 1.5,
        'hard': 2
    };
    
    const totalPoints = Math.floor((basePoints + clueBonus + timeBonus) * difficultyMultiplier[currentGame.difficulty]);
    return Math.max(50, totalPoints); // Minimum 50 points
}

function revealWord() {
    const wordBlanks = document.getElementById('wordBlanks');
    const blanks = wordBlanks.querySelectorAll('.word-blank');
    
    for (let i = 0; i < currentGame.currentWord.word.length; i++) {
        blanks[i].textContent = currentGame.currentWord.word[i];
        blanks[i].classList.add('revealed');
    }
}

function skipWord() {
    currentGame.score = Math.max(0, currentGame.score - 5);
    
    showFeedback(`Skipped! The word was "${currentGame.currentWord.word}" (-5 points)`, 'warning');
    revealWord();
    
    // Track skip
    if (window.analytics) {
        window.analytics.trackEvent('word_skipped', {
            game: 'Guess the Word',
            word: currentGame.currentWord.word,
            clues_revealed: currentGame.revealedClues
        });
    }
    
    setTimeout(() => {
        nextRound();
    }, 3000);
}

function showFeedback(message, type) {
    const feedbackMessage = document.getElementById('feedbackMessage');
    feedbackMessage.textContent = message;
    feedbackMessage.className = `feedback-message ${type}`;
}

// Timer functions
function resetTimer() {
    const timeLimit = {
        'easy': 90,
        'medium': 75,
        'hard': 60
    };
    currentGame.timeLeft = timeLimit[currentGame.difficulty];
    updateTimerDisplay();
}

function startTimer() {
    if (currentGame.timerInterval) {
        clearInterval(currentGame.timerInterval);
    }
    
    currentGame.timerInterval = setInterval(() => {
        if (!currentGame.isPaused) {
            currentGame.timeLeft--;
            updateTimerDisplay();
            
            if (currentGame.timeLeft <= 0) {
                timeUp();
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timer = document.getElementById('timer');
    timer.textContent = `${currentGame.timeLeft}s`;
    
    // Add warning class when time is low
    if (currentGame.timeLeft <= 10) {
        timer.classList.add('timer-warning');
    } else {
        timer.classList.remove('timer-warning');
    }
}

function timeUp() {
    clearInterval(currentGame.timerInterval);
    showFeedback(`Time's up! The word was "${currentGame.currentWord.word}"`, 'error');
    revealWord();
    
    // Track timeout
    if (window.analytics) {
        window.analytics.trackEvent('word_timeout', {
            game: 'Guess the Word',
            word: currentGame.currentWord.word,
            clues_revealed: currentGame.revealedClues
        });
    }
    
    setTimeout(() => {
        nextRound();
    }, 3000);
}

// Game control functions
function pauseGame() {
    currentGame.isPaused = true;
    document.getElementById('pauseMenu').classList.remove('hidden');
    
    if (window.analytics) {
        window.analytics.trackEvent('game_paused', { game: 'Guess the Word' });
    }
}

function resumeGame() {
    currentGame.isPaused = false;
    document.getElementById('pauseMenu').classList.add('hidden');
    
    if (window.analytics) {
        window.analytics.trackEvent('game_resumed', { game: 'Guess the Word' });
    }
}

function quitGame() {
    if (currentGame.timerInterval) {
        clearInterval(currentGame.timerInterval);
    }
    
    // Track quit
    if (window.analytics) {
        window.analytics.trackEvent('game_quit', {
            game: 'Guess the Word',
            round: currentGame.currentRound,
            score: currentGame.score
        });
    }
    
    // Reset to setup
    document.getElementById('gamePlay').classList.add('hidden');
    document.getElementById('gameResults').classList.add('hidden');
    document.getElementById('pauseMenu').classList.add('hidden');
    document.getElementById('gameSetup').classList.remove('hidden');
}

function endGame() {
    if (currentGame.timerInterval) {
        clearInterval(currentGame.timerInterval);
    }
    
    const totalTime = Math.floor((Date.now() - currentGame.startTime) / 1000);
    const accuracy = Math.round((currentGame.wordsGuessed / currentGame.totalRounds) * 100);
    
    // Debug logging
    console.log('End game - Final score:', currentGame.score);
    console.log('Words guessed:', currentGame.wordsGuessed);
    console.log('Total rounds:', currentGame.totalRounds);
    
    // Update results display
    document.getElementById('finalScore').textContent = currentGame.score;
    document.getElementById('wordsGuessed').textContent = `${currentGame.wordsGuessed}/${currentGame.totalRounds}`;
    document.getElementById('accuracy').textContent = `${accuracy}%`;
    document.getElementById('timeTaken').textContent = formatTime(totalTime);
    document.getElementById('cluesUsed').textContent = currentGame.totalCluesUsed;
    
    // Show results
    document.getElementById('gamePlay').classList.add('hidden');
    document.getElementById('gameResults').classList.remove('hidden');
    
    // Track game completion
    if (window.analytics) {
        window.analytics.trackGameComplete('Guess the Word', {
            difficulty: currentGame.difficulty,
            final_score: currentGame.score,
            words_guessed: currentGame.wordsGuessed,
            accuracy: accuracy,
            total_time: totalTime,
            clues_used: currentGame.totalCluesUsed
        });
    }
    
    // Submit to leaderboard if score qualifies
    submitScore();
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

async function submitScore() {
    try {
        // Ensure score is a valid number
        const finalScore = Number(currentGame.score) || 0;
        console.log('Raw currentGame.score:', currentGame.score);
        console.log('Converted finalScore:', finalScore);
        console.log('Score type:', typeof finalScore);
        console.log('Is valid number:', !isNaN(finalScore) && isFinite(finalScore));
        console.log('Firebase available:', !!window.firebaseGlobalLeaderboard);
        
        // Validate all required fields
        const gameDetails = {
            difficulty: currentGame.difficulty || 'easy',
            words_guessed: currentGame.wordsGuessed || 0,
            total_rounds: currentGame.totalRounds || 1,
            accuracy: Math.round(((currentGame.wordsGuessed || 0) / (currentGame.totalRounds || 1)) * 100),
            clues_used: currentGame.totalCluesUsed || 0,
            time_taken: Math.floor((Date.now() - (currentGame.startTime || Date.now())) / 1000)
        };

        console.log('Game details:', gameDetails);

        // Only submit if we have a valid score
        if (finalScore <= 0 || isNaN(finalScore) || !isFinite(finalScore)) {
            console.log('Score is invalid, not submitting to leaderboard:', finalScore);
            return;
        }

        if (window.firebaseGlobalLeaderboard) {
            console.log('About to submit to Firebase:');
            console.log('- Game:', 'guess-the-word');
            console.log('- Score:', finalScore, 'Type:', typeof finalScore);
            console.log('- Details:', JSON.stringify(gameDetails, null, 2));
            
            const result = await window.firebaseGlobalLeaderboard.submitScore(
                'guess-the-word',
                {
                    score: finalScore,
                    details: gameDetails,
                    scoreType: 'high'
                }
            );
            
            console.log('Submit result:', result);
            
            if (result && result.submitted) {
                console.log('Score submitted to global leaderboard');
            }
        } else if (window.globalLeaderboard) {
            console.log('Using fallback leaderboard');
            await window.globalLeaderboard.submitScore(
                'guess-the-word',
                finalScore,
                gameDetails
            );
        } else {
            console.error('No leaderboard system available');
        }
    } catch (error) {
        console.error('Error submitting score:', error);
    }
}

function showGameLeaderboard() {
    if (window.firebaseGlobalLeaderboard) {
        window.firebaseGlobalLeaderboard.showLeaderboard('guess-the-word');
    } else if (window.globalLeaderboard) {
        window.globalLeaderboard.showLeaderboard('guess-the-word');
    }
}

function playAgain() {
    document.getElementById('gameResults').classList.add('hidden');
    document.getElementById('gameSetup').classList.remove('hidden');
}

function goHome() {
    window.location.href = '../../index.html';
}