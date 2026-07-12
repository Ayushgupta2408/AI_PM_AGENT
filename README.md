# Spec/Agent — AI Product Manager 
#### Spec/Agent is an AI-powered product management platform that transforms a simple product idea into a complete technical product specification within seconds.

Users provide a short description of their idea, such as "Build a food delivery app", and the system automatically generates:

-Detailed product requirements
-User stories and feature lists
-Database schema design
-REST API specifications
-System architecture diagrams
-Sprint planning and development roadmap
-Technical documentation for developers

## DEMO - https://youtu.be/Ao-HROczTbU

- Requirements document
- Database schema (Mongoose)
- REST API design
- User stories with acceptance criteria
- Sprint plan
- Architecture diagram (Mermaid.js)

Every generation is saved to MongoDB so you can revisit past specs.

```
ai-pm-agent/
├── backend/     Express API + MongoDB (Mongoose) + Groq integration
└── frontend/    React (Vite) UI
```

## 1. Prerequisites

- Node.js 18+ (native `fetch` is used in the backend)
- MongoDB running locally, or a free MongoDB Atlas cluster
- A free Groq API key → https://console.groq.com/keys

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
GROQ_MODEL=llama-3.3-70b-versatile
MONGO_URI=mongodb://127.0.0.1:27017/ai_pm_agent
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

Run it:

```bash
npm run dev      # with nodemon, auto-restarts
# or
npm start
```

You should see:

```
MongoDB connected → 127.0.0.1/ai_pm_agent
AI PM Agent API running on http://localhost:5000
```

Sanity check: `GET http://localhost:5000/api/health` → `{"status":"ok","groqConfigured":true}`

## 3. Frontend setup

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env   # defaults already point at http://localhost:5000/api
npm run dev
```

Open **http://localhost:5173**.

## 4. Using it

1. Type a product idea (or click one of the example chips) and press **Draft the spec**.
2. The backend calls Groq once with a structured-JSON system prompt, gets back all six
   sections in one response, and stores the result in MongoDB.
3. Switch between the six tabs (Requirements, DB Schema, API Design, User Stories,
   Sprint Plan, Architecture) — the architecture tab renders a live Mermaid diagram.
4. Past generations appear as chips above the output — click one to reload it instantly
   (no new Groq call, just a MongoDB read).

## 5. API reference

| Method | Route                     | Description                                      |
|--------|---------------------------|---------------------------------------------------|
| POST   | `/api/projects/generate`  | `{ prompt }` → generates + saves a full spec       |
| GET    | `/api/projects`           | List saved specs (id, title, prompt, status)       |
| GET    | `/api/projects/:id`       | Full saved spec, including all six output sections |
| DELETE | `/api/projects/:id`       | Delete a saved spec                                |
| GET    | `/api/health`             | Health check + whether `GROQ_API_KEY` is set       |

## 6. How the Groq call is structured

`backend/services/groqService.js` sends one chat-completion request to
`https://api.groq.com/openai/v1/chat/completions` with:

- `response_format: { type: "json_object" }` so Groq returns strict JSON
- A system prompt that pins down exactly six keys: `title`, `requirements`, `schema`,
  `apiDesign`, `userStories`, `sprintPlan`, `architectureDiagram`
- `architectureDiagram` is raw Mermaid flowchart syntax, rendered client-side by the
  `mermaid` npm package — no image generation involved.

Swap `GROQ_MODEL` in `.env` to any current Groq-hosted model (check
https://console.groq.com/docs/models for what's live) — no other code changes needed.

## 7. Notes

- If Mongo isn't running, the backend will exit on boot with a clear error — start
  `mongod` (or point `MONGO_URI` at an Atlas connection string) first.
- If `GROQ_API_KEY` is missing, `/api/health` will report `groqConfigured: false` and
  generation requests return a 502 with the underlying error message.
- CORS is restricted to `CLIENT_ORIGIN` — update it if you deploy the frontend elsewhere.
