# Kemena Army

A polished fan experience portal for Kemena, combining immersive UI, trivia engagement, leaderboard tracking, and Firebase-backed content management.

## Overview

This repository contains a React-based single-page application powered by Vite and served through an Express development server.
The app features a home experience, trivia quiz flow, leaderboard, and admin section for managing live announcements.

## Key Features

- Responsive React application with a futuristic themed UI
- Trivia quiz flow with user score capture and leaderboard persistence
- Admin news management for dynamic announcements
- Firebase Firestore-powered content and leaderboard storage
- Express server with Vite middleware for fast local development

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Firebase Firestore
- Express
- React Router DOM
- GSAP, Framer Motion, Swiper, Three.js

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm 10 or newer

### Install dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

By default, the server starts on port `3000`. If that port is in use, the app will automatically try the next available port.

To force a specific port:

```bash
PORT=3001 npm run dev
```

Open the application at the URL shown in the console output.

### Production build

```bash
npm run build
npm run preview
```

## Available Scripts

- `npm run dev` — start the local Express + Vite development server
- `npm run build` — produce a production build with Vite
- `npm run preview` — serve the production build locally
- `npm run clean` — delete the `dist` output directory
- `npm run lint` — run TypeScript type checking

## Configuration

- `firebase-applet-config.json` contains Firebase project credentials used by the app
- `server.ts` is the Express entry point
- `vite.config.ts` configures Vite and project aliases
- React routing and page composition are handled in `src/App.tsx`

## Project Structure

- `src/main.tsx` — application bootstrap
- `src/App.tsx` — app shell, routing, and layout
- `src/components/` — UI and page components
- `src/context/ThemeContext.tsx` — color theme provider
- `src/lib/firebase.ts` — Firebase initialization and helper utilities
- `src/assets/` — static media assets
- `server.ts` — development/production server logic

## Notes

- The Express server is used during development and serves the built SPA in production.
- Verify Firebase credentials in `firebase-applet-config.json` before running the app.
- The app uses client-side routing with React Router DOM.
