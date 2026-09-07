# Skyline Weather

A modern, responsive weather app: live conditions, hourly outlook, a 24-hour
temperature chart and a 7-day forecast for any place in the world.

## Features

- City search with live suggestions (keyboard accessible)
- "Use my location" via browser geolocation, with graceful permission handling
- Current conditions, feels-like, high/low and a plain-language summary
- Detail cards: humidity, wind, pressure, visibility, UV, sunrise/sunset
- 24-hour hourly strip and a temperature trend chart (Recharts)
- 7-day forecast
- °C / °F switching, light & dark mode, weather-adaptive background
- Recent places saved in the browser
- Loading skeletons, friendly error states and retry

## Tech

React 19 · TypeScript · TanStack Start (Vite) · Tailwind CSS v4 · Lucide icons ·
Recharts · ESLint + Prettier

## Data source & keys

Weather comes from [Open-Meteo](https://open-meteo.com) and reverse geocoding
from BigDataCloud. **Both are free and require no API key**, so there is no
`.env` file to set up and no secret is shipped to the browser. If you later swap
in a keyed provider, put the call in a server function and keep the key in an
environment variable — never in client code.

## Run it in VS Code

1. Install [Node.js 20+](https://nodejs.org) and
   [VS Code](https://code.visualstudio.com).
2. Open the project folder in VS Code: **File → Open Folder…** and pick it.
3. Open the built-in terminal: **Terminal → New Terminal** (`Ctrl+`` ` `` ).
4. Install dependencies:
   ```sh
   npm install
   ```
5. Start the dev server:
   ```sh
   npm run dev
   ```
6. Open the printed URL (usually http://localhost:8080) — `Ctrl+Click` the link
   in the terminal. Edits reload automatically.

Recommended VS Code extensions: ESLint, Prettier, Tailwind CSS IntelliSense.

## Other commands

```sh
npm run build     # production build
npm run preview   # preview the production build
npm run lint      # lint
npm run format    # format with Prettier
```
