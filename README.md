# ReportScan

ReportScan is a Next.js frontend and standalone Express backend for educational
medical-report analysis with Google Gemini. It does not diagnose conditions or
replace professional medical advice.

## Structure

```text
frontend/
  app/ components/ public/ package.json next.config.ts tsconfig.json
backend/
  src/api/analyze/ src/api/health/ src/database/ src/services/ src/utils/
  package.json server.js
```

The frontend contains no API routes or server-only modules. The backend owns
Gemini, MongoDB, upload validation, and the `/api/analyze` and `/api/health`
endpoints.

## Setup

Prerequisites: Node.js 18+, npm, MongoDB (optional for non-persistent
analysis), and a Google Gemini API key.

Copy `.env.example` to `.env` at the repository root and fill in the backend
values. Keep secrets server-side; `NEXT_PUBLIC_API_URL` is the only value
intended for browser configuration.

```bash
cd backend
npm install
npm start
```

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at http://localhost:3000 and calls
`NEXT_PUBLIC_API_URL` (default `http://localhost:5000`). The backend health
check is available at http://localhost:5000/api/health.

## Frontend checks

```bash
cd frontend
npm run lint
npm run typecheck
npm run build
```

Supported uploads are JPG, PNG, and PDF, subject to `MAX_UPLOAD_MB`.
