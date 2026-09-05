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

## Deployment Configuration

For the deployed frontend, set `VITE_API_URL` in Vercel to your Render API URL including `/api`:

```ini
VITE_API_URL=https://boardme-lk.onrender.com/api
```

Set `CORS_ORIGINS` in Render to the Vercel deployment URL. Separate multiple domains with commas:

```ini
CORS_ORIGINS=https://mini-hackathon-gold.vercel.app
```

Render's root URL does not serve a web page. Use `https://boardme-lk.onrender.com/api/health` to verify the API.

Start the backend:

```bash
npm run dev
```

The health check is available at `http://localhost:5000/api/health`.

## Boarding data and matching

Run `supabase/schema.sql` in the Supabase SQL Editor, then run `supabase/seed.sql` to load 20 fictional Sri Lankan listings. The schema enforces positive rent, non-negative distance, facility defaults, and automatic creation timestamps.

Member 4's services can be used before wiring an endpoint:

```js
const { searchBoardings } = require('./services/searchService');
const { rankBoardings } = require('./services/matchingService');

const filtered = searchBoardings(boardings, req.query);
const results = rankBoardings(filtered, req.query);
```

Supported filters are `location`, `maxBudget`, `roomType`, `gender`, `wifi`, and `kitchen`. Matching also accepts `maxDistance` and adds a `match_score` from 0 to 100.

Run the focused service tests from the repository root with `node --test server/services/member4Services.test.js`.

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

## AI Tools

ChatGPT – Assisted with project planning, React component generation, backend API structure, database schema design, search and filtering logic, debugging, and report preparation. Generated outputs were reviewed, tested, and modified before integration.

Microsoft Copilot – Assisted with code completion, component generation, refactoring, debugging suggestions, and implementation of frontend and backend features. Generated outputs were reviewed and tested before use.

## Team Members

IT24103228 - Fonseka N H D K
IT24102811 - Jayasinghe P K A
IT24102346 - Dewanarayana S D W	
IT24102701 - Abeywardena W A A U	


## Team Contributions

Member 1 - IT24102701
•	Developed Home Page
•	Developed Find Boarding Page
•	Created Navbar Component
•	Created Boarding Card Component
•	Implemented Search UI
•	Connected Frontend API Services


Member 2 - IT24102346
•	Developed Add Boarding Page
•	Developed Boarding Form Component
•	Implemented Form Validation
•	Developed Boarding Details Page
•	Created Facility Badge Components


Member 3 – IT24103228
•	Developed Express Backend
•	Implemented Boarding APIs
•	Configured Supabase Integration
•	Added Backend Validation
•	Managed API Response Handling


Member 4 – IT24102811
•	Designed Database Schema 
•	Created Sri Lankan Sample Boarding Data 
•	Implemented Search and Filtering Service 
•	Developed Match Score Algorithm 
•	Assisted with Search Result Ranking

