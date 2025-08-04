# 🔧 GitHub Pages Setup Troubleshooting

## Error: "Get Pages site failed"

This error means GitHub Pages isn't properly configured. Here's how to fix it:

## ✅ **Step-by-Step Solution:**

### **Step 1: Manual GitHub Pages Setup**
1. **Go to your repository on GitHub.com**
   - Navigate to: `https://github.com/ros-agustin-omise/games-qa`

2. **Click the "Settings" tab** (at the top of your repository)

3. **Scroll down to "Pages" section** (left sidebar)

4. **Configure Pages Source:**
   - Under **"Source"**, select **"GitHub Actions"**
   - **DO NOT** select "Deploy from a branch" 
   - Save the settings

5. **Verify Permissions:**
   - Go to **Settings** → **Actions** → **General**
   - Under **"Workflow permissions"**, select **"Read and write permissions"**
   - Check **"Allow GitHub Actions to create and approve pull requests"**
   - Save

### **Step 2: Push Updated Workflow**
```bash
# Commit the updated workflow file
git add .github/workflows/deploy.yml
git commit -m "fix: add enablement parameter for GitHub Pages setup"
git push origin main
```

### **Step 3: Trigger Deployment**
After pushing, the GitHub Action should run automatically. Check:
- Go to **Actions** tab in your repository
- Watch for the "Deploy to GitHub Pages" workflow
- If it fails, check the logs for specific errors

## 🔄 **Alternative: Manual Deployment Method**

If GitHub Actions continues to fail, use manual deployment:

### **Option A: Using gh-pages package**
```bash
# Deploy directly to gh-pages branch
npm run deploy
```

Then in GitHub Settings → Pages:
- Source: **"Deploy from a branch"**
- Branch: **"gh-pages"**
- Folder: **"/ (root)"**

### **Option B: Simple Upload**
1. Create a new repository on GitHub named `games-qa`
2. Make it public
3. Upload all your files directly through GitHub's web interface
4. Enable Pages with source as "Deploy from a branch" → main

## 🚨 **Common Issues & Solutions:**

### **Issue 1: Repository Not Found**
```bash
# Fix remote URL
git remote -v
git remote set-url origin https://github.com/ros-agustin-omise/games-qa.git
```

### **Issue 2: Permission Denied**
```bash
# Use GitHub CLI for authentication
gh auth login
# Or use SSH
git remote set-url origin git@github.com:ros-agustin-omise/games-qa.git
```

### **Issue 3: Workflow File Not Found**
Make sure the file path is exactly:
```
.github/workflows/deploy.yml
```

### **Issue 4: Still Getting Errors**
Try the simple approach:
1. Create a new public repository on GitHub
2. Upload your files via drag-and-drop
3. Go to Settings → Pages
4. Select "Deploy from a branch" → main branch
5. Your site will be at: `https://ros-agustin-omise.github.io/games-qa/`

## ✨ **Final Check:**

Once working, your Playverse will be live at:
**https://ros-agustin-omise.github.io/games-qa/**

Test all games to ensure they work correctly on the live site!

## 📞 **Need Help?**

If you're still having issues:
1. Share the exact error message from GitHub Actions
2. Confirm your repository is public
3. Check if you have admin access to the repository
4. Try the manual upload method as a backup