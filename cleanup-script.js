#!/usr/bin/env node

/**
 * Firebase Leaderboard Data Cleanup Script
 * Cleans up existing Firebase data to keep only top 10 entries per game
 */

// If you want to run this script via Node.js (alternative to the HTML tool):
// 1. Install Firebase Admin SDK: npm install firebase-admin
// 2. Download service account key from Firebase Console
// 3. Update the serviceAccount path below
// 4. Run: node cleanup-script.js

const admin = require('firebase-admin');

// You would need to download your service account key from Firebase Console
// and update this path:
// const serviceAccount = require('./path-to-your-service-account-key.json');

const firebaseConfig = {
    // If using service account (more secure for scripts):
    // credential: admin.credential.cert(serviceAccount),
    
    // For demo purposes, using web config (less secure):
    apiKey: "AIzaSyAF_BGwl2SSPbnsyVGB9T2cHl3rR0KiyQs",
    authDomain: "games-qa-prod.firebaseapp.com",
    databaseURL: "https://games-qa-prod-default-rtdb.firebaseio.com/",
    projectId: "games-qa-prod",
    storageBucket: "games-qa-prod.firebasestorage.app",
    messagingSenderId: "871171350020",
    appId: "1:871171350020:web:93581c31a80657b3985f51"
};

const games = [
    'rock-paper-scissors',
    'memory-match', 
    'number-guessing',
    'word-scramble',
    'spot-the-difference',
    'test-case-designer'
];

const lowScoreGames = ['memory-match', 'spot-the-difference'];

async function initializeFirebase() {
    try {
        // Initialize Firebase Admin
        admin.initializeApp({
            // credential: admin.credential.cert(serviceAccount),
            databaseURL: firebaseConfig.databaseURL
        });
        
        console.log('✅ Firebase initialized successfully');
        return admin.database();
    } catch (error) {
        console.error('❌ Firebase initialization failed:', error.message);
        console.log('\n📝 To use this script:');
        console.log('1. npm install firebase-admin');
        console.log('2. Download service account key from Firebase Console');
        console.log('3. Update the serviceAccount path in this script');
        console.log('4. Uncomment the credential lines');
        console.log('\n💡 Alternative: Use the cleanup-firebase-data.html tool instead!');
        process.exit(1);
    }
}

function compareScores(a, b, gameName) {
    if (lowScoreGames.includes(gameName)) {
        return a.score - b.score; // Ascending (lower is better)
    } else {
        return b.score - a.score; // Descending (higher is better)
    }
}

async function analyzeGame(database, gameName) {
    try {
        console.log(`\n🔍 Analyzing ${gameName}...`);
        
        const leaderboardRef = database.ref(`leaderboards/${gameName}`);
        const snapshot = await leaderboardRef.once('value');
        
        if (!snapshot.exists()) {
            console.log(`⚠️  No data found for ${gameName}`);
            return { totalEntries: 0, entriesToDelete: 0, entries: [] };
        }

        const data = snapshot.val();
        const entries = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value
        }));

        // Sort by score
        entries.sort((a, b) => compareScores(a, b, gameName));

        const totalEntries = entries.length;
        const entriesToKeep = Math.min(10, totalEntries);
        const entriesToDelete = Math.max(0, totalEntries - 10);

        console.log(`📊 Found ${totalEntries} entries`);
        console.log(`✅ Will keep: ${entriesToKeep} entries`);
        if (entriesToDelete > 0) {
            console.log(`🗑️  Will delete: ${entriesToDelete} entries`);
        } else {
            console.log(`✨ Already optimized!`);
        }

        // Show top 5 entries
        const topEntries = entries.slice(0, 5);
        console.log(`\n🏆 Top entries (will be kept):`);
        topEntries.forEach((entry, index) => {
            const date = entry.timestamp ? new Date(entry.timestamp).toLocaleDateString() : 'Unknown date';
            console.log(`   ${index + 1}. ${entry.name || 'Anonymous'}: ${entry.score} (${date})`);
        });

        return { totalEntries, entriesToDelete, entries };

    } catch (error) {
        console.error(`❌ Error analyzing ${gameName}:`, error.message);
        return { totalEntries: 0, entriesToDelete: 0, entries: [] };
    }
}

async function cleanupGame(database, gameName, entries) {
    try {
        console.log(`\n🔄 Cleaning up ${gameName}...`);
        
        const leaderboardRef = database.ref(`leaderboards/${gameName}`);
        
        // Sort entries
        entries.sort((a, b) => compareScores(a, b, gameName));
        
        const entriesToKeep = entries.slice(0, 10);
        const entriesToDelete = entries.slice(10);

        if (entriesToDelete.length === 0) {
            console.log(`✅ ${gameName} already optimized, no cleanup needed`);
            return;
        }

        // Delete old data
        await leaderboardRef.remove();

        // Add back only top 10 entries
        const updates = {};
        entriesToKeep.forEach(entry => {
            const { id, ...entryData } = entry;
            updates[id] = entryData;
        });

        if (Object.keys(updates).length > 0) {
            await leaderboardRef.update(updates);
        }

        console.log(`✅ Cleanup completed for ${gameName}!`);
        console.log(`📊 Kept: ${entriesToKeep.length} entries`);
        console.log(`🗑️  Deleted: ${entriesToDelete.length} entries`);

    } catch (error) {
        console.error(`❌ Cleanup failed for ${gameName}:`, error.message);
    }
}

async function main() {
    console.log('🧹 Firebase Leaderboard Data Cleanup Script');
    console.log('==========================================\n');
    
    const database = await initializeFirebase();
    
    // Analyze all games first
    console.log('📊 ANALYSIS PHASE');
    console.log('================');
    
    const gameData = {};
    let totalEntriesAcrossGames = 0;
    let totalEntriesToDelete = 0;
    
    for (const game of games) {
        const analysis = await analyzeGame(database, game);
        gameData[game] = analysis;
        totalEntriesAcrossGames += analysis.totalEntries;
        totalEntriesToDelete += analysis.entriesToDelete;
        
        // Small delay to avoid overwhelming Firebase
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log('\n📋 SUMMARY');
    console.log('=========');
    console.log(`Total entries across all games: ${totalEntriesAcrossGames}`);
    console.log(`Total entries to delete: ${totalEntriesToDelete}`);
    console.log(`Entries to keep: ${totalEntriesAcrossGames - totalEntriesToDelete}`);
    
    if (totalEntriesToDelete === 0) {
        console.log('\n🎉 All games are already optimized! No cleanup needed.');
        process.exit(0);
    }
    
    // Ask for confirmation
    console.log(`\n⚠️  WARNING: This will delete ${totalEntriesToDelete} entries permanently!`);
    console.log('This action cannot be undone.');
    
    // In a real Node.js environment, you'd use readline for user input
    // For this demo script, we'll just log the action that would be taken
    console.log('\n🔄 CLEANUP PHASE (would run with user confirmation)');
    console.log('===============================');
    
    for (const game of games) {
        if (gameData[game].entriesToDelete > 0) {
            // await cleanupGame(database, game, gameData[game].entries);
            console.log(`📝 Would cleanup ${game}: delete ${gameData[game].entriesToDelete} entries`);
        }
        
        // Small delay between games
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\n✅ Cleanup simulation complete!');
    console.log('\n💡 To actually perform the cleanup:');
    console.log('   1. Uncomment the cleanupGame() call above');
    console.log('   2. Add proper user confirmation logic');
    console.log('   3. Set up Firebase Admin SDK with service account');
    console.log('\n🌐 Or use the cleanup-firebase-data.html tool for a safer GUI approach!');
}

// Run the script
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { compareScores, analyzeGame, cleanupGame };