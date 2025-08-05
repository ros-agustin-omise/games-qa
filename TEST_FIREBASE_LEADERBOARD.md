# 🧪 Firebase Leaderboard Testing Guide

## 🎯 **How to Test Firebase Leaderboard Saving**

### **Step 1: Verify Firebase Database is Enabled**
1. Go to: https://console.firebase.google.com/project/games-qa-prod
2. Click **"Realtime Database"** in sidebar
3. You should see a database URL like: `https://games-qa-prod-default-rtdb.firebaseio.com/`
4. If you see "Create Database", click it and set to **"Start in test mode"**

### **Step 2: Test Firebase Connection**
1. **Visit your live site**: https://ros-agustin-omise.github.io/games-qa/games/rock-paper-scissors/
2. **Open Browser Console**: Press `F12` → `Console` tab
3. **Look for these messages**:
   ```
   ✅ Firebase connected successfully!
   🔄 Real-time listener active for rock-paper-scissors
   ```
4. **If you see errors**: Check your Firebase database is enabled

### **Step 3: Test Score Submission**
1. **Play Rock Paper Scissors** - Win at least 5 games
2. **You'll see the score submission modal**
3. **Enter test name**: `FirebaseTest1`
4. **Click "🔥 Submit to Firebase"**
5. **Watch for console messages**:
   ```
   ✅ Score synced to Firebase for rock-paper-scissors
   ```

### **Step 4: Verify in Firebase Console**
1. **Go to Firebase Console**: https://console.firebase.google.com/project/games-qa-prod
2. **Click "Realtime Database"** → **"Data" tab**
3. **You should see**:
   ```
   games-qa-prod-default-rtdb
   └── leaderboards
       └── rock-paper-scissors
           └── [auto-generated-id]
               ├── name: "FirebaseTest1"
               ├── score: 5
               ├── timestamp: [number]
               └── deviceId: "device_abc123"
   ```

### **Step 5: Test Cross-Device Sync**
1. **Different Device/Browser**: Open same game URL
2. **Click 🏆 Leaderboard button**
3. **You should see**: "FirebaseTest1" with 🔥 Firebase badge
4. **Submit another score**: "FirebaseTest2"
5. **Check first device**: Should show both scores

### **Step 6: Test Real-time Updates**
1. **Open game on 2 devices/browsers simultaneously**
2. **Both show leaderboard**: Click 🏆 on both
3. **Submit score on Device 1**: Watch Device 2's leaderboard
4. **Should update automatically**: No refresh needed

## 🔍 **What to Look For**

### **✅ Success Indicators:**
- **Console**: `✅ Firebase connected successfully!`
- **Score badges**: 🔥 next to synced scores
- **Firebase data**: Visible in Firebase Console
- **Cross-device**: Scores appear on other devices
- **Real-time**: Updates without refresh

### **❌ Failure Indicators:**
- **Console errors**: `Firebase initialization failed`
- **No 🔥 badges**: Only 📱 local badges
- **Empty Firebase**: No data in Firebase Console
- **No cross-device**: Scores only on submitting device

## 🛠️ **Troubleshooting**

### **If Connection Fails:**
1. **Check Firebase config**: Verify API key and project ID
2. **Enable database**: Create Realtime Database in Firebase Console
3. **Check rules**: Set database rules to allow read/write

### **If Scores Don't Save:**
1. **Console errors**: Check browser console for Firebase errors
2. **Database rules**: Ensure write permissions enabled
3. **Network**: Check internet connection

### **If Cross-Device Fails:**
1. **Same game**: Ensure testing same game on both devices
2. **Refresh**: Try manual refresh on second device
3. **Clear cache**: Clear browser cache if needed

## 📊 **Expected Firebase Data Structure**

```json
{
  "leaderboards": {
    "rock-paper-scissors": {
      "abc123": {
        "name": "FirebaseTest1",
        "score": 5,
        "date": "1/4/2025",
        "time": "2:30 PM",
        "timestamp": 1704394200000,
        "deviceId": "device_xyz789"
      },
      "def456": {
        "name": "FirebaseTest2", 
        "score": 8,
        "date": "1/4/2025",
        "time": "2:35 PM",
        "timestamp": 1704394500000,
        "deviceId": "device_abc123"
      }
    },
    "memory-match": {
      // Similar structure for other games
    }
  }
}
```

## 🎮 **Test All Games**

Test the same process for each game:
- https://ros-agustin-omise.github.io/games-qa/games/rock-paper-scissors/
- https://ros-agustin-omise.github.io/games-qa/games/memory-match/
- https://ros-agustin-omise.github.io/games-qa/games/number-guessing/
- https://ros-agustin-omise.github.io/games-qa/games/word-scramble/
- https://ros-agustin-omise.github.io/games-qa/games/spot-the-difference/
- https://ros-agustin-omise.github.io/games-qa/games/test-case-designer/

## 🚀 **Quick Test Summary**

1. **Open game** → Check console for Firebase connection
2. **Play and win** → Submit score with test name
3. **Check Firebase Console** → Verify data appears
4. **Open on another device** → Confirm score syncs
5. **Success** = Real-time global leaderboard working! 🔥

## 📝 **Test Results Checklist**

- [ ] Firebase connection successful (console message)
- [ ] Score submission shows "🔄 Syncing to Firebase..."
- [ ] Score appears in Firebase Console data
- [ ] Score has 🔥 Firebase badge in leaderboard
- [ ] Score visible on different device/browser
- [ ] Real-time updates work without refresh
- [ ] All games have Firebase integration working

**If all checkboxes pass = Firebase leaderboard is fully functional!** 🎉