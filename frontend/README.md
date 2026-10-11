# AI Interview Taker - Frontend

React + TypeScript + Vite + Tailwind CSS v4 + react-router.

## Run

```bash
cd frontend
npm install
cp .env.example .env   # optional; defaults to http://localhost:5000/api/v1
npm run dev            # http://localhost:5173
npm run build          # typecheck + production build
```

Set `VITE_API_URL` to point at a different backend. The backend must be running
with CORS allowing the dev origin (its default `CORS_ORIGIN=*` works).

## Flow

- `/` dashboard: paginated interview cards
- `/interview/new`: create form (role, level, focus, tech stack, 1-20 questions)
- `/interview/:id`: session. Questions are read aloud (SpeechSynthesis); answer by
  voice (Web Speech API, Chrome/Edge/Safari) or by typing. Finishing posts the
  transcript to `POST /feedback`.
- `/interview/:id/feedback`: overall + per-category scores, strengths, improvements

## Layout

`src/lib/api.ts` typed API client, `src/lib/speech.ts` browser speech helpers,
`src/pages/*` routes, `src/components/*` shared UI, `src/types` shared types.

## Backend gaps / assumptions

- `/feedback` has no handlers yet. The client assumes `POST /feedback`
  `{ interviewId, transcript: [{role, content}] }` returns the feedback object, and
  `GET /feedback/interview/:interviewId` returns the latest feedback (404 or null if none).
- List endpoint returns a bare array (no total), so pagination uses "Next" disabled when a page is short.
- Mongo docs serialise `_id`; the client maps it to `id`.
- `coverImage` is `/covers/<name>.png`; add those files to `public/covers/` or the card shows an initial.
