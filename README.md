# Chris & Nate 10th Anniversary Event Site

A static React application for Chris and Nate's 10th anniversary celebration, featuring password-based content filtering and Cloudinary photo galleries.

## Features

- **Password-based Access**: Two access levels (main event / afterparty) with simple password filtering
- **Static Content**: All event information hard-coded for historical archiving
- **Photo Galleries**: Direct Cloudinary integration for event photos
- **No Backend**: Fully static site, perfect for Cloudflare Pages deployment
- **Responsive Design**: Beautiful UI that works on all devices

## Technology Stack

- React 18 with TypeScript
- Vite for building
- Tailwind CSS for styling
- Cloudinary for photo hosting
- Yet Another React Lightbox for photo viewing

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

See [CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md) for detailed deployment instructions to Cloudflare Pages.

Quick start:
1. Push to GitHub/GitLab
2. Connect to Cloudflare Pages
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy!

## Configuration

### Passwords

Edit `src/context/PasswordAuthContext.tsx`:
```typescript
const PASSWORDS = {
  MAIN_EVENT: 'your-main-password',
  AFTERPARTY: 'your-after-password'
};
```

### Content

Edit `src/data/contentSections.ts` to update event information.

### Cloudinary

Update your cloud name in `src/services/cloudinary.ts`:
```typescript
const CLOUDINARY_CLOUD_NAME = 'your-cloud-name';
```

## Project Structure

```
src/
├── components/
│   ├── event/          # Event-related components
│   ├── ui/             # Reusable UI components (shadcn)
│   └── AuthForm.tsx    # Password entry form
├── context/
│   └── PasswordAuthContext.tsx  # Password state management
├── data/
│   └── contentSections.ts       # Hard-coded event content
├── services/
│   └── cloudinary.ts            # Cloudinary API integration
├── pages/
│   ├── Index.tsx       # Main page
│   └── NotFound.tsx    # 404 page
└── types/
    └── index.ts        # TypeScript types
```

## License

Private project - All rights reserved

---

# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/ec50b70e-b095-4876-a6d3-e53c227a389f

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/ec50b70e-b095-4876-a6d3-e53c227a389f) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/ec50b70e-b095-4876-a6d3-e53c227a389f) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
