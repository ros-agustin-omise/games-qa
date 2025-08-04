#!/bin/bash

echo "🎮 Playverse Simple Deployment Script"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: Please run this script from your games-qa directory"
    exit 1
fi

echo "✅ Found Playverse files"

# Option 1: Try gh-pages deployment
echo ""
echo "🚀 Option 1: Attempting GitHub Pages deployment..."
if command -v npm &> /dev/null; then
    if npm run deploy; then
        echo "✅ GitHub Pages deployment successful!"
        echo "🌐 Your site should be available at: https://ros-agustin-omise.github.io/games-qa/"
        exit 0
    else
        echo "❌ GitHub Pages deployment failed"
    fi
else
    echo "❌ npm not found"
fi

# Option 2: Try surge.sh
echo ""
echo "🚀 Option 2: Checking for Surge.sh..."
if command -v surge &> /dev/null; then
    echo "📡 Surge found! Deploying..."
    surge . games-qa-playverse.surge.sh
    echo "✅ Deployed to: https://games-qa-playverse.surge.sh"
    exit 0
else
    echo "❌ Surge not installed"
    echo "💡 Install with: npm install -g surge"
fi

# Option 3: Local server
echo ""
echo "🚀 Option 3: Starting local server..."
echo "🌐 Your Playverse will be available at: http://localhost:8000"
echo "📱 Share on local network: http://$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}'):8000"
echo ""
echo "🎯 RECOMMENDED: Use Netlify for easy deployment!"
echo "   1. Go to https://netlify.com"
echo "   2. Drag your games-qa folder to deploy"
echo "   3. Done! Your site is live instantly"
echo ""

# Start local server
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    python -m http.server 8000
else
    echo "❌ Python not found. Please install Python or use Netlify deployment."
fi