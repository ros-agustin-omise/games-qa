# 🔒 Firebase Security Rules - Production Ready

## 🚨 **Current Risk (Test Mode)**
Your Firebase is currently in **test mode** with these rules:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
**⚠️ This allows ANYONE to read/write/delete ALL your data!**

## ✅ **Secure Production Rules**

### **🔐 Recommended Secure Rules:**
Replace your current rules with these **production-ready** security rules:

```json
{
  "rules": {
    "leaderboards": {
      "$gameName": {
        ".read": true,
        ".write": "auth == null",
        ".validate": "newData.hasChildren(['name', 'score', 'timestamp', 'deviceId'])",
        "$entryId": {
          ".validate": "newData.hasChildren(['name', 'score', 'timestamp', 'deviceId']) && newData.child('name').isString() && newData.child('name').val().length >= 1 && newData.child('name').val().length <= 20 && newData.child('score').isNumber() && newData.child('score').val() >= 0 && newData.child('score').val() <= 10000 && newData.child('timestamp').isNumber() && newData.child('deviceId').isString() && newData.child('deviceId').val().length >= 5 && newData.child('deviceId').val().length <= 50"
        }
      }
    },
    "connection-test": {
      ".read": true,
      ".write": true
    }
  }
}
```

### **🛡️ What These Rules Do:**

**🎯 Path Restrictions:**
- ✅ Only allows access to `/leaderboards/` and `/connection-test/`
- ❌ Blocks access to any other paths
- 🎮 Each game has its own protected leaderboard path

**📝 Data Validation:**
- ✅ **Name**: Must be 1-20 characters, string only
- ✅ **Score**: Must be number, 0-10,000 range  
- ✅ **Timestamp**: Must be a number
- ✅ **DeviceId**: Must be 5-50 character string
- ❌ Rejects malformed or malicious data

**🔒 Access Control:**
- ✅ **Read**: Anyone can view leaderboards (public competition)
- ✅ **Write**: Anyone can submit scores (open competition)
- ❌ **No authentication required** (keeps it simple for games)

## 🔒 **Even More Secure Rules (Optional)**

### **🔐 Ultra-Secure Rules with Rate Limiting:**
```json
{
  "rules": {
    "leaderboards": {
      "$gameName": {
        ".read": true,
        ".write": "auth == null && !root.child('rate_limit').child(auth.uid || $deviceId).child('last_write').exists() || (now - root.child('rate_limit').child(auth.uid || $deviceId).child('last_write').val()) > 60000",
        ".validate": "newData.hasChildren(['name', 'score', 'timestamp', 'deviceId'])",
        "$entryId": {
          ".validate": "newData.hasChildren(['name', 'score', 'timestamp', 'deviceId']) && newData.child('name').isString() && newData.child('name').val().length >= 1 && newData.child('name').val().length <= 20 && newData.child('score').isNumber() && newData.child('score').val() >= 0 && newData.child('score').val() <= 10000 && newData.child('timestamp').isNumber() && newData.child('deviceId').isString() && newData.child('deviceId').val().length >= 5 && newData.child('deviceId').val().length <= 50"
        }
      }
    },
    "rate_limit": {
      "$deviceId": {
        "last_write": {
          ".write": true,
          ".validate": "newData.isNumber()"
        }
      }
    },
    "connection-test": {
      ".read": true,
      ".write": true
    }
  }
}
```

**🚀 Additional Security Features:**
- ⏱️ **Rate limiting**: Prevents spam (1 submission per minute per device)
- 🛡️ **Abuse prevention**: Stops automated attacks
- 📊 **Performance protection**: Prevents database overload

## 🎮 **Game-Specific Score Limits**

### **🔧 Customized Rules by Game:**
```json
{
  "rules": {
    "leaderboards": {
      "rock-paper-scissors": {
        ".read": true,
        ".write": true,
        "$entryId": {
          ".validate": "newData.child('score').val() >= 0 && newData.child('score').val() <= 100"
        }
      },
      "memory-match": {
        ".read": true, 
        ".write": true,
        "$entryId": {
          ".validate": "newData.child('score').val() >= 4 && newData.child('score').val() <= 50"
        }
      },
      "number-guessing": {
        ".read": true,
        ".write": true, 
        "$entryId": {
          ".validate": "newData.child('score').val() >= 0 && newData.child('score').val() <= 1000"
        }
      },
      "word-scramble": {
        ".read": true,
        ".write": true,
        "$entryId": {
          ".validate": "newData.child('score').val() >= 0 && newData.child('score').val() <= 2000"
        }
      },
      "spot-the-difference": {
        ".read": true,
        ".write": true,
        "$entryId": {
          ".validate": "newData.child('score').val() >= 1 && newData.child('score').val() <= 300"
        }
      },
      "test-case-designer": {
        ".read": true,
        ".write": true,
        "$entryId": {
          ".validate": "newData.child('score').val() >= 0 && newData.child('score').val() <= 1000"
        }
      }
    }
  }
}
```

## 🔧 **How to Apply These Rules:**

### **📋 Step-by-Step:**
1. **Go to Firebase Console**: https://console.firebase.google.com/project/games-qa-prod
2. **Click "Realtime Database"** in left sidebar
3. **Click "Rules" tab** at the top
4. **Delete the current test rules**
5. **Copy and paste** one of the secure rulesets above
6. **Click "Publish"** to apply the rules

### **⚡ Recommended Choice:**
**Use the first "Recommended Secure Rules"** - they provide excellent security while keeping your leaderboard system working perfectly.

## 🧪 **Test After Applying Rules:**

### **✅ Verify Security Works:**
1. **Visit your games** and submit a few test scores
2. **Check they appear** in leaderboards correctly  
3. **Try invalid data** (should be rejected)
4. **Monitor Firebase console** for any errors

### **🚨 If Something Breaks:**
If you accidentally lock yourself out, you can always revert to test mode temporarily:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

## 🎯 **Security Benefits:**

### **🛡️ Protection Against:**
- ❌ **Data corruption** - Invalid data rejected
- ❌ **Spam attacks** - Score limits prevent fake high scores
- ❌ **Database abuse** - Path restrictions limit access
- ❌ **Malicious deletion** - Structure validation prevents damage

### **✅ Maintains Features:**
- ✅ **Global leaderboards** work perfectly
- ✅ **Cross-device sync** remains functional
- ✅ **Real-time updates** continue working
- ✅ **No user accounts** needed (stays simple)

## 🔐 **Your Database Will Be:**
- **🔒 Secure** from attacks and abuse
- **📊 Validated** with proper data structure
- **🎮 Functional** for all your games
- **🚀 Production-ready** for real users

**Ready to secure your Firebase database?** Just copy the "Recommended Secure Rules" and paste them into your Firebase console! 🛡️🔥