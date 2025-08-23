# 🚀 Deployment Guide

This guide will help you deploy your DHL Shipping project to various free hosting platforms.

## 📋 Prerequisites

1. **GitHub Account**: For repository hosting
2. **Node.js**: Version 16 or higher
3. **Build the project**: Run `npm run build` to create production build

## 🎯 Quick Deploy Options

### Option 1: Vercel (Recommended)

**Steps:**
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts:
   - Link to existing project? → No
   - Project name → dhlshipping
   - Directory → ./
   - Override settings? → No

4. Your app will be live at: `https://dhlshipping.vercel.app`

### Option 2: Netlify

**Steps:**
1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
5. Click "Deploy site"

### Option 3: GitHub Pages

**Steps:**
1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Update `package.json` homepage:
   ```json
   "homepage": "https://yourusername.github.io/dhlshipping"
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

### Option 4: Render

**Steps:**
1. Go to [render.com](https://render.com)
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Configure:
   - Name: dhlshipping
   - Build Command: `npm run build`
   - Publish Directory: `build`
5. Click "Create Static Site"

## 🔧 Environment Variables

Update the API URL in your deployment platform:

**For Vercel:**
- Go to Project Settings → Environment Variables
- Add: `REACT_APP_API_URL` = `https://your-backend-url.vercel.app`

**For Netlify:**
- Go to Site Settings → Environment Variables
- Add: `REACT_APP_API_URL` = `https://your-backend-url.vercel.app`

## 🗄️ Backend Deployment

For the backend, you can deploy to:

### Vercel (Backend)
1. Create `vercel.json` in backend folder:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

2. Deploy backend:
```bash
cd backend
vercel
```

### Railway (Backend)
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Select the backend folder
4. Add environment variables from `.env`
5. Deploy

## 🔍 Troubleshooting

### Common Issues:

1. **Build fails**: Check Node.js version (use 16+)
2. **Routing issues**: Ensure redirects are configured
3. **API calls fail**: Check CORS settings and environment variables
4. **Images not loading**: Verify public folder structure

### Build Commands:
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Test build locally
npx serve -s build
```

## 📱 Mobile Testing

After deployment, test on:
- [ ] Desktop browsers
- [ ] Mobile browsers
- [ ] Different screen sizes
- [ ] Touch interactions

## 🔄 Continuous Deployment

For automatic deployments:
1. Connect your GitHub repository
2. Enable auto-deploy on push
3. Set up branch protection rules
4. Configure preview deployments

## 📊 Performance Optimization

1. **Enable compression** (gzip)
2. **Use CDN** for static assets
3. **Optimize images** (WebP format)
4. **Enable caching** headers
5. **Minimize bundle size**

## 🛡️ Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] API keys not exposed
- [ ] CORS properly configured
- [ ] Input validation on backend

## 📞 Support

If you encounter issues:
1. Check the platform's documentation
2. Review build logs
3. Test locally first
4. Check environment variables
5. Verify file paths and imports

---

**Happy Deploying! 🎉**
