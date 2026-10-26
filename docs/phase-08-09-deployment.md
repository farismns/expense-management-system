# Phase 8–9 — Deployment Preparation

## Production topology

Vercel hosts `frontend` as a Vite SPA. Render hosts `backend` as a Node web
service using `render.yaml`. Neon hosts PostgreSQL; the Render service receives
its pooled Neon connection string as `DATABASE_URL`.

## Deploy

1. Create a Neon database and apply the existing project schema and constraints.
2. In Render, create a Blueprint from this repository and provide `DATABASE_URL`
   plus Gmail App Password variables. After Render provides its HTTPS URL, set
   `FRONTEND_ORIGIN` and `FRONTEND_APP_URL` after the Vercel URL is known.
3. In Vercel, import the same GitHub repository with Root Directory `frontend`.
   Set `VITE_API_BASE_URL` to `https://<render-service>.onrender.com/api` and
   deploy. The SPA rewrite in `frontend/vercel.json` supports direct route links.
4. Copy the final Vercel URL into Render's `FRONTEND_ORIGIN` and
   `FRONTEND_APP_URL`, then redeploy Render.

Secrets are intentionally not committed. Verify `/api/health`, registration,
login, profile update, transactions, and password-reset email after deployment.
