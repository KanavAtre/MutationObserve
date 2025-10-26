# Deployment Guide

## Quick Start

Your Credify demonstration website is ready to deploy to GitHub Pages!

## Local Development

```bash
cd website
npm install
npm run dev
```

Visit `http://localhost:3000` to see the site locally.

## Deploy to GitHub Pages

### Option 1: Automatic Deployment (Recommended)

1. **Move the GitHub workflow to the repository root:**
   ```bash
   mkdir -p .github/workflows
   mv website/.github/workflows/deploy.yml .github/workflows/deploy-website.yml
   ```

2. **Enable GitHub Pages in your repository:**
   - Go to your repository settings
   - Navigate to "Pages" in the left sidebar
   - Under "Source", select "GitHub Actions"

3. **Push your changes:**
   ```bash
   git add .
   git commit -m "Add Credify demonstration website"
   git push origin main
   ```

4. **Wait for deployment:**
   - Go to the "Actions" tab in your repository
   - Watch the workflow run
   - Once complete, your site will be live at: `https://yourusername.github.io/MutationObserve/`

### Option 2: Manual Deployment

```bash
cd website
npm run build
# The static files are in the 'out' directory
# Upload these to your hosting service
```

## Configuration

### Update Repository Name

If your repository isn't named "MutationObserve", update `next.config.ts`:

```typescript
basePath: process.env.NODE_ENV === 'production' ? '/YOUR-REPO-NAME' : '',
assetPrefix: process.env.NODE_ENV === 'production' ? '/YOUR-REPO-NAME/' : '',
```

### Update GitHub Username

Replace `yourusername` in these files:
- `app/page.tsx` (GitHub links)
- `components/InstallationSection.tsx` (clone command)

## Troubleshooting

### Build Fails

1. Make sure all dependencies are installed:
   ```bash
   npm install
   ```

2. Clear the cache:
   ```bash
   rm -rf .next out node_modules
   npm install
   npm run build
   ```

### 404 on GitHub Pages

- Ensure GitHub Pages is enabled and set to "GitHub Actions"
- Check that `basePath` in `next.config.ts` matches your repository name
- Wait a few minutes after the workflow completes

### 3D Animation Not Working

The Three.js hero section is dynamically loaded on the client side. If it doesn't appear:
- Check browser console for errors
- Ensure you're using a modern browser
- Try disabling browser extensions

## Features

✅ Responsive design
✅ 3D animated hero with Three.js
✅ Interactive demo section
✅ Smooth animations with Framer Motion
✅ Dark theme optimized for the extension
✅ SEO optimized
✅ Static export ready for GitHub Pages

## Support

For issues or questions, open an issue on GitHub.

