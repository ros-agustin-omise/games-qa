# 🎮 Playverse - Choose your adventure and dive in!

A web-based gaming platform featuring 6 different interactive games built with HTML, CSS, and JavaScript.

## 🎯 Games Included

### 1. 🕵️ Spot the Difference
- Find differences between two similar images
- 3 levels with increasing difficulty (5-7 differences)
- CSS-generated scenes with interactive elements
- Timer and hint system
- Progress tracking and best time records

### 2. 🎴 Memory Match
- Card matching memory game
- 3 difficulty levels (Easy, Medium, Hard)
- Timer and move counter
- Emoji-based cards
- Win statistics

### 3. ✊ Rock Paper Scissors
- Classic hand game vs computer
- Score tracking and game history
- "Best of 5" tournament mode
- Visual feedback and animations
- Win/loss statistics

### 4. 🎯 Number Guessing Game
- Guess the secret number
- 3 difficulty levels with different ranges
- Smart hints system
- Streak tracking
- Detailed game statistics

### 5. 🔤 Word Scramble
- Unscramble letter puzzles
- 3 difficulty levels (3-5, 6-8, 9+ letters)
- Progressive hint system
- Timer and scoring
- Word database with hints

### 6. 🧪 Test Case Designer
- Design comprehensive test cases for software features
- 3 difficulty levels (Beginner, Intermediate, Advanced)
- Test multiple categories: Positive, Negative, Boundary, Security
- Educational QA testing simulation
- Custom test case creation and scoring system

## 🚀 Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Local Storage**: Scores and statistics persist between sessions
- **Centralized Leaderboards**: Cross-game leaderboard system with persistent high scores
- **Modern UI**: Clean, colorful interface with animations
- **Cross-Game Navigation**: Easy switching between games
- **Performance Optimized**: Lightweight and fast loading

## 📁 Project Structure

```
games-qa/
├── index.html              # Main Playverse hub page
├── package.json            # Project configuration and scripts
├── puzzle.gif              # Animated logo for header
├── styles/
│   ├── main.css           # Global styles
│   └── leaderboard.css    # Leaderboard UI styles
├── js/
│   ├── main.js            # Main navigation and utilities
│   └── leaderboard.js     # Centralized leaderboard system
└── games/
    ├── spot-the-difference/
    │   ├── index.html
    │   ├── style.css
    │   └── script.js
    ├── memory-match/
    │   ├── index.html
    │   ├── style.css
    │   └── script.js
    ├── rock-paper-scissors/
    │   ├── index.html
    │   ├── style.css
    │   └── script.js
    ├── number-guessing/
    │   ├── index.html
    │   ├── style.css
    │   └── script.js
    ├── word-scramble/
    │   ├── index.html
    │   ├── style.css
    │   └── script.js
    └── test-case-designer/
        ├── index.html
        ├── style.css
        └── script.js
```

## 🎮 How to Play

1. **Open `index.html`** in your web browser
2. **Choose a game** from the main hub by clicking on any game card
3. **Follow the on-screen instructions** for each game
4. **Use navigation buttons** to return to the main hub or start new games
5. **Track your progress** with built-in scoring and statistics

## 💻 Technical Details

- **Pure HTML/CSS/JavaScript** - No external dependencies
- **Local Storage API** for persistent data and leaderboards
- **CSS Grid & Flexbox** for responsive layouts
- **CSS Animations** for visual feedback
- **Modern ES6+** JavaScript features
- **Centralized leaderboard system** with cross-game score tracking

## 🎨 Customization

Each game is self-contained and can be easily customized:

- **Colors**: Modify CSS variables in `main.css`
- **Difficulty**: Adjust game parameters in individual `script.js` files
- **Word Database**: Add new words to `word-scramble/script.js`
- **Test Scenarios**: Add new features to test in `test-case-designer/script.js`
- **Leaderboard Settings**: Modify max entries and display in `leaderboard.js`
- **Styling**: Update individual `style.css` files for each game

## 🌐 Browser Compatibility

- **Chrome** 60+
- **Firefox** 55+
- **Safari** 12+
- **Edge** 16+

## 📱 Mobile Features

- Touch-friendly controls
- Responsive design
- Mobile-optimized layouts
- Swipe navigation in Test Case Designer
- Tap and touch interactions for all games

## 🎯 Future Enhancements

Potential additions:
- More games (Tetris, Breakout, Puzzle games)
- Multiplayer capabilities
- Sound effects and music
- Achievement system and badges
- User profiles and statistics
- Game themes and customization
- Export test cases from Test Case Designer
- More complex testing scenarios

---

**Enjoy playing! 🎉**