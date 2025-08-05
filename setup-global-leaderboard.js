// Setup script to create JSONBin.io bins for global leaderboards
// Run: node setup-global-leaderboard.js

const https = require('https');

const API_KEY = '$2a$10$0VjFCKx7QjO5GkG2JxZjH.8rRN5c9Z0b0Z1zHrI8GqOL8pY6l7yXu';
const GAMES = [
    'memory-match',
    'rock-paper-scissors', 
    'number-guessing',
    'word-scramble',
    'spot-the-difference',
    'test-case-designer'
];

async function createBin(gameName) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            scores: [],
            game: gameName,
            created: new Date().toISOString(),
            version: '1.0'
        });

        const options = {
            hostname: 'api.jsonbin.io',
            port: 443,
            path: '/v3/b',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY,
                'X-Bin-Name': `playverse-${gameName}-leaderboard`,
                'X-Bin-Private': 'false',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                try {
                    const response = JSON.parse(responseData);
                    if (response.metadata && response.metadata.id) {
                        console.log(`✅ Created bin for ${gameName}: ${response.metadata.id}`);
                        resolve({
                            game: gameName,
                            binId: response.metadata.id,
                            url: `https://api.jsonbin.io/v3/b/${response.metadata.id}`
                        });
                    } else {
                        console.error(`❌ Failed to create bin for ${gameName}:`, response);
                        reject(new Error(`Failed to create bin for ${gameName}`));
                    }
                } catch (error) {
                    console.error(`❌ Error parsing response for ${gameName}:`, error);
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            console.error(`❌ Request error for ${gameName}:`, error);
            reject(error);
        });

        req.write(data);
        req.end();
    });
}

async function setupGlobalLeaderboards() {
    console.log('🚀 Setting up global leaderboards for Playverse...\n');
    
    const results = [];
    
    for (const game of GAMES) {
        try {
            const result = await createBin(game);
            results.push(result);
            
            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(`Failed to create bin for ${game}:`, error.message);
        }
    }
    
    console.log('\n📋 Summary:');
    console.log('Copy these bin IDs into js/global-leaderboard.js:\n');
    
    console.log('this.binIds = {');
    results.forEach(result => {
        console.log(`    '${result.game}': '${result.binId}',`);
    });
    console.log('};');
    
    console.log('\n🎉 Global leaderboard setup complete!');
    console.log('Players can now compete globally across all devices!');
}

// Run the setup
setupGlobalLeaderboards().catch(error => {
    console.error('Setup failed:', error);
    process.exit(1);
});