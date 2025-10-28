# Cloudflare Pages Deployment Guide

This static React application is ready to deploy on Cloudflare Pages.

## Overview

This is a static event website with:
- Simple password-based content filtering (no authentication)
- Hard-coded event content
- Cloudinary integration for photos (client-side)
- No backend or database dependencies

## Deployment Steps

### 1. Build Configuration

When setting up in Cloudflare Pages, use these settings:

- **Framework preset**: Vite
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Node version**: 18.x or higher

### 2. Environment Variables

You'll need to set your Cloudinary cloud name in the code:

Edit `src/services/cloudinary.ts` and update:
```typescript
const CLOUDINARY_CLOUD_NAME = 'your-cloud-name-here';
```

**Note**: The Cloudinary cloud name is NOT a secret - it's publicly visible in all image URLs. This is why it's safe to hard-code it in the client-side code.

### 3. Cloudinary Setup

For the photo gallery to work, your Cloudinary account must allow public listing of images:

1. Log into your Cloudinary dashboard
2. Go to Settings → Security
3. Enable "Resource list" under "Restricted media types"
4. Ensure your folders are set to "Public" (default for most accounts)

The app uses Cloudinary's public image list API:
```
https://res.cloudinary.com/{cloud-name}/image/list/{folder}.json
```

### 4. Deploy

#### Option A: Git Integration (Recommended)
1. Push your code to GitHub/GitLab
2. Go to Cloudflare Pages dashboard
3. Click "Create a project"
4. Connect your Git repository
5. Configure build settings (see step 1 above)
6. Deploy!

Cloudflare will automatically rebuild and redeploy on every push to your main branch.

#### Option B: Direct Upload
1. Build locally: `npm run build`
2. Go to Cloudflare Pages dashboard
3. Click "Create a project" → "Direct upload"
4. Upload the `dist` folder

### 5. Custom Domain (Optional)

1. Go to your Cloudflare Pages project
2. Click "Custom domains"
3. Add your domain
4. Follow the DNS instructions

## Content Updates

Since this is a static site, to update content you'll need to:

1. Edit the content in `src/data/contentSections.ts`
2. Commit and push (for Git deployment) OR rebuild and re-upload (for direct upload)
3. Cloudflare will rebuild and deploy automatically (Git) or manually upload new build

## Passwords

The access passwords are hard-coded in `src/context/PasswordAuthContext.tsx`:

- Main event password: `main`
- Afterparty password: `after`

**To change passwords**: Edit the `PASSWORDS` constant in that file and redeploy.

## Photo Folders

Photo folders are configured in `src/components/event/PhotoGalleryTab.tsx` in the `FOLDERS` array. Update these if you add new Cloudinary folders.

## Troubleshooting

### Photos not loading
- Verify your Cloudinary cloud name is correct
- Check that "Resource list" is enabled in Cloudinary settings
- Ensure folder paths match exactly (case-sensitive)
- Check browser console for CORS errors

### Build fails
- Ensure Node version is 18.x or higher
- Run `npm install` to verify dependencies
- Check for TypeScript errors: `npm run type-check`

### Content not showing
- Verify the password in `PasswordAuthContext.tsx`
- Check that content sections in `contentSections.ts` have the correct `accessType`

## Performance

Cloudflare Pages provides:
- Global CDN distribution
- Automatic HTTPS
- Unlimited bandwidth (on free tier)
- Edge caching for fast load times

Your static assets are cached at Cloudflare's edge, providing excellent performance worldwide.

## Cost

Cloudflare Pages is **free** for:
- Unlimited static requests
- 500 builds per month
- Unlimited sites

Perfect for this use case!
