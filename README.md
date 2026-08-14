# Fitness Tracker — Frontend

React app (built with Vite) that talks to the Express backend.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Make sure your backend is running locally at `http://localhost:5000` (see the backend repo's README).

3. Start the dev server:
   ```
   npm run dev
   ```

4. Open the URL Vite prints (usually `http://localhost:5173`). You should see the Fitness Tracker UI, able to add and delete workouts.

## Project structure

```
src/
├── main.jsx              # React entry point
├── App.jsx                # top-level component, holds workout state
├── api.js                 # all fetch() calls to the backend live here
├── index.css               # all styling
└── components/
    ├── WorkoutForm.jsx      # form to add a new workout
    └── WorkoutList.jsx      # displays the list, handles delete
```

## Deploying to GitHub Pages

1. In `vite.config.js`, set `base` to match your GitHub repo name exactly, e.g. `/fitness-tracker-frontend/`.
2. Once your backend is deployed to Render, copy `.env.example` to `.env` and set `VITE_API_URL` to your live Render URL (must end in `/api/workouts`).
3. Run:
   ```
   npm run deploy
   ```
   This builds the app and pushes the `dist` folder to a `gh-pages` branch.
4. In your GitHub repo settings, under Pages, set the source to the `gh-pages` branch.
5. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

Remember: your Render backend must have `CLIENT_ORIGIN` set to this GitHub Pages URL, or CORS will block the requests.
