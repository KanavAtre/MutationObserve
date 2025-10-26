# Credify Website

This is the demonstration website for Credify, built with Next.js, Three.js, and modern web technologies.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Three.js** - 3D graphics
- **React Three Fiber** - React renderer for Three.js
- **Framer Motion** - Animations
- **Lucide React** - Icons

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run start
```

### Deploy to GitHub Pages

The website is configured to automatically deploy to GitHub Pages when you push to the main branch.

1. Enable GitHub Pages in your repository settings
2. Set the source to "GitHub Actions"
3. Push your changes to the main branch
4. The workflow will automatically build and deploy

The site will be available at: `https://yourusername.github.io/MutationObserve/`

## Features

- 🎨 3D animated hero section with Three.js
- ✨ Smooth animations with Framer Motion
- 📱 Fully responsive design
- 🎭 Interactive demo of the extension
- 🚀 Optimized for performance
- 🎯 SEO friendly

## Project Structure

```
website/
├── app/
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/
│   ├── HeroSection.tsx       # 3D hero with Three.js
│   ├── FeatureCard.tsx       # Feature cards
│   ├── HowItWorks.tsx        # How it works section
│   ├── DemoSection.tsx       # Interactive demo
│   └── InstallationSection.tsx # Installation guide
├── .github/workflows/
│   └── deploy.yml        # GitHub Actions workflow
└── next.config.ts        # Next.js configuration
```

## Customization

### Update GitHub Repository URL

Replace `yourusername` with your actual GitHub username in:
- `app/page.tsx`
- `components/InstallationSection.tsx`

### Modify 3D Effects

Edit `components/HeroSection.tsx` to customize:
- Particle count
- Animation speed
- Colors and materials
- Camera position

### Change Color Scheme

Update Tailwind colors in:
- `app/globals.css`
- Component files

## License

MIT

