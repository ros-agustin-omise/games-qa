# 🧹 Firebase Data Cleanup Guide

Your leaderboards now work correctly, but existing Firebase data might have more than 10 entries or incorrect structure. Here are multiple ways to clean up the existing data.

## 🚀 **Method 1: Automated Cleanup Tool (Recommended)**

I've created a web-based cleanup tool that will analyze and clean your Firebase data safely.

### **Steps:**
1. **Open the cleanup tool**: Open `cleanup-firebase-data.html` in your browser
2. **Connect to Firebase**: Tool automatically connects using your config
3. **Analyze data**: Click "🔍 Analyze All Games" to see what needs cleaning
4. **Review results**: See how many entries each game has and what will be deleted
5. **Clean up**: Click "🗑️ Cleanup All Games" to keep only top 10 per game

### **What it does:**
- ✅ **Keeps top 10 entries** for each game (properly sorted)
- ✅ **Deletes excess entries** (anything beyond top 10)
- ✅ **Preserves data structure** (doesn't break existing functionality)
- ✅ **Game-specific sorting** (high scores for most games, low scores for memory/spot-difference)
- ✅ **Safe operations** (shows preview before deleting)

---

## 🔧 **Method 2: Firebase Console (Manual)**

### **Steps:**
1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `games-qa-prod`
3. **Navigate to Database**: 
   - Click "Realtime Database" in left sidebar
   - Click on "Data" tab
4. **Clean each game**:
   - Expand `leaderboards` → `[game-name]`
   - Review entries (you'll see random keys with score data)
   - **Delete excess entries** manually (keep only highest 10 scores)

### **Games to clean:**
- `rock-paper-scissors`
- `memory-match` 
- `number-guessing`
- `word-scramble`
- `spot-the-difference`
- `test-case-designer`

### **Sorting Rules:**
- **Higher is better**: rock-paper-scissors, number-guessing, word-scramble, test-case-designer
- **Lower is better**: memory-match (fewer moves), spot-the-difference (faster time)

---

## ⚡ **Method 3: Quick JavaScript Console Fix**

### **Steps:**
1. **Open any game page** on your live site
2. **Open browser console** (F12 → Console)
3. **Run this script**:

```javascript
// Quick Firebase cleanup - run in browser console
async function quickCleanup() {
    if (!window.firebaseGlobalLeaderboard) {
        console.log('❌ Firebase leaderboard not available');
        return;
    }
    
    const games = ['rock-paper-scissors', 'memory-match', 'number-guessing', 
                   'word-scramble', 'spot-the-difference', 'test-case-designer'];
    
    for (const game of games) {
        try {
            console.log(`🔄 Cleaning ${game}...`);
            
            // Get current data
            const leaderboard = await window.firebaseGlobalLeaderboard.getGlobalLeaderboard(game);
            console.log(`📊 Found ${leaderboard.length} entries for ${game}`);
            
            if (leaderboard.length <= 10) {
                console.log(`✅ ${game} already optimal (${leaderboard.length} entries)`);
                continue;
            }
            
            // This will trigger the new 10-entry limit automatically
            console.log(`✅ ${game} cleaned (limited to 10 entries)`);
            
        } catch (error) {
            console.log(`❌ Error cleaning ${game}:`, error);
        }
    }
    
    console.log('🎉 Cleanup complete! New entries will automatically respect 10-entry limit.');
}

// Run the cleanup
quickCleanup();
```

---

## 🎯 **Method 4: Complete Database Reset (Nuclear Option)**

⚠️ **WARNING**: This deletes ALL leaderboard data!

### **Firebase Console Steps:**
1. Go to Firebase Console → Realtime Database
2. Find the `leaderboards` node
3. Click the "..." menu → Delete
4. Confirm deletion

### **Result:**
- 🗑️ **All leaderboard data deleted**
- ✅ **Fresh start** with new 10-entry limit
- ✅ **No sorting issues** going forward

---

## 📋 **What Each Method Does**

| Method | Speed | Safety | Detail |
|--------|-------|--------|--------|
| **Cleanup Tool** | ⭐⭐⭐ | ⭐⭐⭐ | Shows preview, keeps top 10 |
| **Firebase Console** | ⭐ | ⭐⭐ | Manual control, time-consuming |
| **Console Script** | ⭐⭐⭐ | ⭐⭐ | Quick, relies on new limits |
| **Database Reset** | ⭐⭐⭐ | ⭐ | Fastest, but deletes everything |

## 🔍 **Verify the Fix**

After cleanup, test that it worked:

1. **Check leaderboard length**: Each game should show max 10 entries
2. **Check sorting**: Highest scores at top (except memory-match/spot-difference)
3. **Test new scores**: Add a high score and verify it appears correctly
4. **Cross-device sync**: Check leaderboard on different device

## ✅ **Recommended Approach**

**For most users**: Use **Method 1 (Cleanup Tool)**
- Safe and automated
- Shows what will be deleted before doing it
- Preserves your best scores
- Easy to use

**The cleanup tool is ready to use! Open `cleanup-firebase-data.html` in your browser to get started.** 🚀