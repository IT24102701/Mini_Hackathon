# BoardMe LK - Smart Boarding Finder for Sri Lanka

BoardMe LK is a hackathon project that will help people find boarding places in Sri Lanka. This repository currently provides the shared frontend and backend foundation for the team.

## Tech Stack

- Frontend: React with Vite
- Backend: Node.js with Express
- Database: Supabase PostgreSQL
- Frontend API client: Axios
- Routing: React Router

## Folder Structure

```text
boardme-lk/
├── client/                 # React application
│   └── src/
│       ├── components/     # Shared UI components
│       ├── pages/          # Route pages
│       └── services/       # API client configuration
├── server/                 # Express API
│   ├── controllers/        # Request handlers
│   ├── routes/             # API route definitions
│   └── services/           # External service clients
├── .gitignore
└── README.md
```

## Frontend Setup

```bash
cd client
npm install
```

Create `client/.env` from `client/.env.example`:

```bash
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

## Backend Setup

```bash
cd server
npm install
```

Create `server/.env` from `server/.env.example` and provide the Supabase values:

```ini
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

Start the backend:

```bash
npm run dev
```

The health check is available at `http://localhost:5000/api/health`.

## Running Both Projects

Use two terminals:

```bash
cd client
npm run dev
```

```bash
cd server
npm run dev
```

Supabase credentials are used only by the backend. Never add `SUPABASE_KEY` to frontend environment files.
