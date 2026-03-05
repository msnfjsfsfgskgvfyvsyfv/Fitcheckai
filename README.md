# FitCheckAI

AI-powered outfit rating app. Upload your fit, get an honest score.

## Tech Stack
- React + Vite
- Tailwind CSS v4
- Claude API (Sonnet) for vision analysis
- Canvas API for share card generation
- Vercel hosting

## Setup

```bash
npm install
cp .env.example .env  # Add your Anthropic API key
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_ANTHROPIC_API_KEY` | Anthropic API key for Claude Sonnet |

## Build

```bash
npm run build
npm run preview
```

## Deploy

Connected to Vercel. Push to `main` to deploy.
