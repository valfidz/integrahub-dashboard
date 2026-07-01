<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Netlify-00C7B7?logo=netlify&logoColor=white" alt="Netlify" />
</p>

<h1 align="center">IntegraHub Dashboard</h1>
<p align="center"><strong>Real-time monitoring UI for the IntegraHub webhook ingestion service</strong></p>
<p align="center">
  A Next.js dashboard to monitor, filter, and test webhook events flowing through the IntegraHub backend — with live stats, time-series charts, and a built-in webhook tester.
</p>

---

##  Demo

| Service | URL |
|---------|-----|
| **Frontend (Dashboard)** | [https://val-integrahub.netlify.app](https://val-integrahub.netlify.app) |
| **Backend (API)** | [https://integrahub.onrender.com](https://integrahub.onrender.com) |

##  Overview

IntegraHub Dashboard is the frontend companion to [IntegraHub](https://github.com/valfidz/integrahub) — a centralized webhook ingestion service built with NestJS.

The dashboard reads from the backend's monitoring API (`/webhook/stats`, `/webhook/logs`, `/webhook/timeseries`) and provides a webhook tester that sends test payloads to `/webhook/receive`. This lets you explore the full event lifecycle without leaving the browser.

### What You Can Do

- **Monitor** — View real-time event stats, success rates, and 24-hour trends
- **Inspect** — Browse and filter integration logs with expandable rows showing raw payloads
- **Test** — Compose webhook payloads using presets (Shopify, Stripe, Auth0) or custom JSON, send them to the backend, and see the response
- **Debug** — Expand errored log entries to see error messages and full payload dumps

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **HTTP** | [Axios](https://axios-http.com/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Deployment** | [Netlify](https://netlify.com/) |

##  Project Structure

```
integrahub-dashboard/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout with Geist font
│   │   ├── page.tsx         # Main dashboard page
│   │   └── globals.css      # Tailwind imports + theme vars
│   ├── components/
│   │   ├── overview/
│   │   │   ├── Overview.tsx            # Stats grid + charts container
│   │   │   ├── StatCard.tsx            # Individual metric card
│   │   │   ├── TimeSeriesChart.tsx     # 24h success/error line chart
│   │   │   └── SourceBreakdownChart.tsx # Events-by-source bar chart
│   │   ├── logs/
│   │   │   ├── LogTable.tsx   # Filterable log table with expandable rows
│   │   │   └── StatusBadge.tsx
│   │   └── tester/
│   │       ├── WebhookTester.tsx # Send test payloads to backend
│   │       ├── JsonEditor.tsx
│   │       ├── ResultPanel.tsx
│   │       └── presets.ts     # Shopify, Stripe, Auth0 presets
│   └── lib/
│       └── api.ts        # Axios client + all API types/functions
├── .env.local.example
├── netlify.toml
├── next.config.ts
├── package.json
└── tsconfig.json
```

##  End-to-End Setup

Run the full stack locally in a few minutes.

### Prerequisites

- **Node.js** 20+ (the backend and frontend both use Node 20)
- **npm** (comes with Node)
- **PostgreSQL** — local or remote (e.g., [Neon](https://neon.tech), [Railway](https://railway.app), or a local Postgres instance)
- **Discord Webhook URL** (optional) — if you want event forwarding to a Discord channel

### 1. Backend — IntegraHub

Clone and run the API server first.

```bash
git clone https://github.com/valfidz/integrahub.git
cd integrahub

# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

Edit `.env` with your credentials:

```env
DATABASE_URL=postgresql://user:password@host:5432/integrahub
DIRECT_URL=postgresql://user:password@host:5432/integrahub
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...   # Optional
PORT=3000
```

Run database migrations and start the server:

```bash
npx prisma migrate dev
npm run start:dev
```

The API is now running at **http://localhost:3000**.

### 2. Frontend — IntegraHub Dashboard

In a separate terminal:

```bash
git clone https://github.com/valfidz/integrahub-dashboard.git
cd integrahub-dashboard

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
```

Edit `.env.local` to point to your local backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Start the development server:

```bash
npm run dev
```

The dashboard is now running at **http://localhost:3001**.

> The dev server runs on port 3001 by default to avoid conflict with the backend on port 3000.

### 3. Verify It Works

1. Open **http://localhost:3001** — you'll see the dashboard with empty stats
2. Test with curl (in a third terminal):
   ```bash
   curl -X POST http://localhost:3000/webhook/receive \
     -H "Content-Type: application/json" \
     -d '{"event": "order.created", "source": "shopify", "message": "New order #1042"}'
   ```
3. The dashboard's webhook tester also works — pick a preset and click **Send Webhook**
4. Stats and logs update immediately — click the **Overview** refresh or the stats will reload automatically

##  Using the Dashboard

### Overview Tab

- **Stat Cards** — Total events, Success count, Error count, Success rate
- **Events Over Time** — Line chart showing success vs error events across the last 24 hours
- **Events by Source** — Horizontal bar chart breaking down event volume per integration source

### Integration Logs

- **Filter by status** — Use the dropdown to show All / Success / Error
- **Filter by source** — Type a source name (e.g., `shopify`, `stripe`) to narrow results (400ms debounce)
- **Expand a row** — Click any log row to see the full error message (if any) and the complete raw JSON payload
- **Pagination** — Shows up to 50 logs per view

### Webhook Tester

- **Presets** — Pick from Shopify (order.created), Stripe (payment.success), Auth0 (user.signup), or Custom
- **JSON Editor** — Edit the payload directly; syntax validation highlights invalid JSON in real-time
- **Send** — Dispatches the payload to POST /webhook/receive
- **Response Panel** — Shows the sent payload and the backend response side-by-side

##  API Reference

The dashboard consumes these endpoints from the backend:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/webhook/receive` | POST | Ingest a webhook event |
| `/webhook/logs` | GET | Query logs with optional `status`, `source`, `limit` filters |
| `/webhook/stats` | GET | Aggregate event statistics (total, success, error, success rate, by source) |
| `/webhook/timeseries` | GET | Time-series data for charts (`hours` query param, default 24) |

##  Deployment

### Frontend (Netlify)

The dashboard is deployed on Netlify using the Next.js plugin:

1. Connect your GitHub repo to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://integrahub.onrender.com
   ```
5. Deploy

The `netlify.toml` in the repo handles the build config automatically.

### Backend (Render)

The backend is deployed on Render as a Web Service:

1. Connect the integrahub repo to Render
2. Set start command: `npm run start:prod`
3. Add environment variables: `DATABASE_URL`, `DIRECT_URL`, `DISCORD_WEBHOOK_URL`
4. Deploy

##  Repository Links

| Repo | Description |
|------|-------------|
| [IntegraHub (Backend)](https://github.com/valfidz/integrahub) | NestJS webhook ingestion service |
| [IntegraHub Dashboard (Frontend)](https://github.com/valfidz/integrahub-dashboard) | This repo — Next.js monitoring UI |

---

<p align="center">
  Built by <a href="https://github.com/valfidz">Naufal Hafizh Nugraha</a>
</p>
