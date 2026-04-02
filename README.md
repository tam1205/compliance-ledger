# Compliance Ledger

A transaction compliance tracker — log, filter and review flagged transactions.

Stack: React + Vite (frontend) · Express + SQLite (backend)

---

## Project structure

```
compliance-ledger/
├── client/        # React frontend (deploys to GitHub Pages)
└── server/        # Express API (deploys to Render)
```

---

## Local development

### 1. Server

```bash
cd server
npm install
cp .env.example .env
npm run setup      # creates table + seeds data
npm run dev        # runs on http://localhost:3001
```

### 2. Client

```bash
cd client
npm install
npm run dev        # runs on http://localhost:5173
```

The Vite dev server proxies `/api` to `localhost:3001` automatically.

---

## Deployment

### Backend → Railway or Render

1. Create a new Web Service pointed at the `server/` folder
2. Set start command: `npm start`
3. Add environment variable: `CLIENT_ORIGIN=https://<your-github-username>.github.io`
4. Deploy — copy the service URL (e.g. `https://compliance-ledger.railway.app`)

**First run:** SSH into the service or add a one-off startup command:

```bash
npm run setup
```

### Frontend → GitHub Pages

1. In your repo settings, enable GitHub Pages with **GitHub Actions** as the source
2. Add a repository secret: `VITE_API_URL=https://<your-backend>.railway.app/api`
3. Update `base` in `client/vite.config.js` to match your repo name
4. Push to `main` — the workflow in `.github/workflows/deploy.yml` handles the rest

---

## API endpoints

| Method | Path                           | Description                                          |
| ------ | ------------------------------ | ---------------------------------------------------- |
| GET    | `/api/transactions`            | List all (supports `?status=`, `?risk=`, `?search=`) |
| POST   | `/api/transactions`            | Create a new transaction                             |
| PATCH  | `/api/transactions/:id/status` | Update transaction status                            |
| GET    | `/health`                      | Health check                                         |
