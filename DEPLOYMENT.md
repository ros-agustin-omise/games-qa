# 🚀 Deployment Guide for Playverse

## Option 1: Automatic Deployment with GitHub Actions (Recommended)

Your project is already configured with GitHub Actions for automatic deployment. Here's how to set it up:

### 1. Create GitHub Repository
```bash
# If you haven't created the repository yet:
# Go to GitHub.com and create a new repository named 'games-qa'
# Don't initialize with README since you already have files

# Then push your local repository:
git remote set-url origin https://github.com/YOUR_USERNAME/games-qa.git
git push -u origin main
```

### 2. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. Save the changes

### 3. Automatic Deployment
- Every time you push to the `main` branch, GitHub Actions will automatically deploy your site
- Your site will be available at: `https://YOUR_USERNAME.github.io/games-qa/`

## Option 2: Manual Deployment with gh-pages

If you prefer manual deployment or GitHub Actions isn't working:

### 1. Deploy to gh-pages branch
```bash
npm run deploy
```

### 2. Enable GitHub Pages (Manual)
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **Deploy from a branch**
5. Select **gh-pages** branch and **/ (root)** folder
6. Save the changes

## Option 3: Simple Static Hosting

You can also host this on any static hosting service:

- **Netlify**: Drag and drop your project folder
- **Vercel**: Connect your GitHub repository
- **GitHub Codespaces**: Use the preview feature
- **Local Server**: Run `npm start` for local development

## 🔧 Troubleshooting

### Authentication Issues
If you get authentication errors:
```bash
# Use SSH instead
git remote set-url origin git@github.com:YOUR_USERNAME/games-qa.git

# Or configure GitHub CLI
gh auth login
```

### Repository Not Found
Make sure:
1. Repository exists on GitHub
2. Repository name matches exactly: `games-qa`
3. You have push permissions
4. URL is correct in package.json

### Deployment Failures
1. Check GitHub Actions logs in the "Actions" tab
2. Ensure repository has Pages enabled
3. Verify branch protection rules don't block deployment

## 📱 Your Live Site

Once deployed, your Playverse will be available at:
**https://YOUR_USERNAME.github.io/games-qa/**

Replace `YOUR_USERNAME` with your actual GitHub username.

## 🎮 Testing

Before deploying, test locally:
```bash
npm start
# Open http://localhost:8000
```

All games should work correctly and navigate properly between each other.