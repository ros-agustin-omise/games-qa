class PublicIssueTracker {
    constructor() {
        this.firebaseConfig = {
            apiKey: "AIzaSyAF_BGwl2SSPbnsyVGB9T2cHl3rR0KiyQs",
            authDomain: "games-qa-prod.firebaseapp.com",
            databaseURL: "https://games-qa-prod-default-rtdb.firebaseio.com/",
            projectId: "games-qa-prod",
            storageBucket: "games-qa-prod.firebasestorage.app",
            messagingSenderId: "871171350020",
            appId: "1:871171350020:web:93581c31a80657b3985f51",
            measurementId: "G-K549VCVLMJ"
        };
        
        this.database = null;
        this.currentFilter = 'all';
        this.issues = [];
        
        this.initializeFirebase();
    }

    async initializeFirebase() {
        try {
            if (!firebase.apps.length) {
                firebase.initializeApp(this.firebaseConfig);
            }
            
            this.database = firebase.database();
            console.log('✅ Firebase initialized for Public Issues');
            
            // Load issues
            this.loadIssues();
            
        } catch (error) {
            console.error('❌ Firebase initialization failed:', error);
            this.showError('Failed to connect to database');
        }
    }

    async loadIssues() {
        try {
            const issuesRef = this.database.ref('issues');
            const snapshot = await issuesRef.orderByChild('timestamp').once('value');
            
            this.issues = [];
            if (snapshot.exists()) {
                snapshot.forEach(childSnapshot => {
                    this.issues.unshift({ // Newest first
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                });
            }
            
            this.updateStats();
            this.renderIssues();
            
        } catch (error) {
            console.error('Error loading issues:', error);
            this.showError('Failed to load issues');
        }
    }

    updateStats() {
        const stats = {
            total: this.issues.length,
            open: this.issues.filter(issue => issue.status === 'open').length,
            fixed: this.issues.filter(issue => issue.status === 'fixed').length,
            rejected: this.issues.filter(issue => issue.status === 'rejected').length
        };

        document.getElementById('totalIssues').textContent = stats.total;
        document.getElementById('openIssues').textContent = stats.open;
        document.getElementById('fixedIssues').textContent = stats.fixed;
        document.getElementById('rejectedIssues').textContent = stats.rejected;
    }

    renderIssues() {
        const loading = document.getElementById('loading');
        const issuesList = document.getElementById('issuesList');
        const noIssues = document.getElementById('noIssues');
        
        loading.style.display = 'none';
        
        const filteredIssues = this.currentFilter === 'all' 
            ? this.issues 
            : this.issues.filter(issue => issue.status === this.currentFilter);
        
        if (filteredIssues.length === 0) {
            issuesList.style.display = 'none';
            noIssues.style.display = 'block';
            return;
        }
        
        noIssues.style.display = 'none';
        issuesList.style.display = 'block';
        
        issuesList.innerHTML = filteredIssues.map(issue => this.renderIssueCard(issue)).join('');
    }

    renderIssueCard(issue) {
        const createdDate = new Date(issue.createdAt || issue.timestamp).toLocaleDateString();
        const createdTime = new Date(issue.createdAt || issue.timestamp).toLocaleTimeString();
        
        const typeEmojis = {
            bug: '🐛',
            feature: '✨',
            improvement: '🔧',
            other: '❓'
        };
        
        const gameEmojis = {
            'memory-match': '🧠',
            'number-guessing': '🎯',
            'word-scramble': '📝',
            'rock-paper-scissors': '✂️',
            'spot-the-difference': '🔍',
            'test-case-designer': '🧪',
            'general': '🎮'
        };

        return `
            <div class="issue-card ${issue.status}">
                <div class="issue-header">
                    <h3 class="issue-title">
                        ${typeEmojis[issue.type] || '❓'} ${this.escapeHtml(issue.title)}
                    </h3>
                    <span class="issue-status status-${issue.status}">${issue.status}</span>
                </div>
                
                <div class="issue-meta">
                    <span>🎮 <strong>${gameEmojis[issue.game] || '🎮'} ${this.getGameTitle(issue.game)}</strong></span>
                    <span>👤 ${this.escapeHtml(issue.reportedBy)}</span>
                    <span>📅 ${createdDate} ${createdTime}</span>
                </div>
                
                <div class="issue-description">
                    ${this.escapeHtml(issue.description).replace(/\n/g, '<br>')}
                </div>
            </div>
        `;
    }

    filterIssues(filter) {
        this.currentFilter = filter;
        
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        this.renderIssues();
        
        // Track analytics
        if (window.analytics) {
            window.analytics.trackEvent('public_issues_filtered', { filter: filter });
        }
    }

    getGameTitle(gameId) {
        const gameTitles = {
            'memory-match': 'Memory Match',
            'number-guessing': 'Number Guessing',
            'word-scramble': 'Word Scramble',
            'rock-paper-scissors': 'Rock Paper Scissors',
            'spot-the-difference': 'Spot the Difference',
            'test-case-designer': 'Test Case Designer',
            'general': 'General'
        };
        return gameTitles[gameId] || gameId;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showError(message) {
        const loading = document.getElementById('loading');
        const issuesList = document.getElementById('issuesList');
        const noIssues = document.getElementById('noIssues');
        
        loading.style.display = 'none';
        issuesList.style.display = 'none';
        noIssues.innerHTML = `
            <div class="no-issues-icon">❌</div>
            <h3>Error Loading Issues</h3>
            <p>${message}</p>
            <button onclick="window.location.reload()" class="filter-btn">🔄 Retry</button>
        `;
        noIssues.style.display = 'block';
    }
}

// Global filter function
function filterIssues(filter) {
    if (window.publicIssueTracker) {
        window.publicIssueTracker.filterIssues(filter);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.publicIssueTracker = new PublicIssueTracker();
});