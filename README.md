# Dermascan AI

## Overview
Dermascan AI is an AI-assisted skin assessment platform that allows users to upload a skin image, provide symptom information, receive an AI-assisted preliminary assessment, review previous analyses, and locate nearby healthcare facilities.

> **IMPORTANT MEDICAL DISCLAIMER:**
> This project is for informational/demo purposes and is **not** a medical diagnosis system. Results are strictly informational estimations provided by large language models. The software must not be used to prescribe medication, start, stop, or change a medical treatment, nor determine the malignancy of lesions. Always consult a qualified healthcare professional.

## Features
* **Authentication**: Secure JWT-based backend protection with `bcryptjs` encryption.
* **Skin image upload**: Seamless Drag & Drop interface with a 10MB memory limit enforced by Multer. Contains support for native mobile camera capture (`capture="environment"`).
* **Symptom questionnaire**: An intuitive multi-step form logging location, duration, and boolean modifiers to guide the AI pipeline.
* **AI-assisted analysis**: Supports deterministic `mock` demonstrations out-of-the-box for Hackathons, or can be toggled to a Live Vision AI endpoint (like OpenAI `gpt-4o`). 
* **Analysis history**: Filtered Dashboard and History tabs bound safely to horizontal authorization contexts preventing data leaks.
* **Nearby dermatologist discovery**: Mapbox Integration utilizing the browser's native Geolocation API or manual ZIP querying to reveal clustering of local verified POIs.
* **Responsive UI**: A sleek, dark-mode, glassmorphism design optimized fluidly from 320px mobile vis-ports up to 1440px desktop resolutions using Tailwind CSS.

## Tech Stack
**Frontend:**
* React, Vite, Tailwind CSS, React Router, Axios, Lucide React, Mapbox GL JS 

**Backend:**
* Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Multer

**AI:**
* Mock JSON deterministic provider
* Configurable real AI provider (Generic Chat Completions schema)

## Project Structure
* `client/` - Contains the React Vite SPA. Includes reusable components, Context models (AuthContext), protected routes, API proxying, and page styling.
* `server/` - Contains the Node Express REST API. Utilizes an MVC structure dividing Routes, Controllers, Mongoose Models, reusable Services, and API Middlewares.

## Prerequisites
* Node.js (v18+ recommended)
* MongoDB Database URI Cluster
* Mapbox Public API Token 
* AI Provider Credentials (when `AI_PROVIDER=real` mode is engaged)

## Installation

1. **Clone repository** 
   ```bash
   git clone <repo-url>
   cd DermaScan-AI
   ```

2. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Create environment files**
   Copy the example environment files into active secrets.
   ```bash
   cp client/.env.example client/.env
   cp server/.env.example server/.env
   ```

5. **Configure variables**
   Ensure `client/.env` possesses your keys.
   Ensure `server/.env` contains your active MongoDB cluster URI string and a complex randomized `JWT_SECRET`. 

6. **Start components locally**
   *Terminal 1 (Backend)*:
   ```bash
   cd server
   npm run dev
   ```
   *Terminal 2 (Frontend)*:
   ```bash
   cd client
   npm run dev
   ```

## Environment Variables

**Frontend (`client/.env`)**:
* `VITE_API_URL`=http://localhost:5000/api
* `VITE_MAPBOX_TOKEN`=your_mapbox_public_token

**Backend (`server/.env`)**:
* `PORT`=5000
* `MONGODB_URI`=your_atlas_connection_string
* `JWT_SECRET`=randomized_cryptographic_string 
* `CLIENT_URL`=http://localhost:5173
* `AI_PROVIDER`=mock
* `AI_API_KEY`=your_live_llm_vision_key
* `AI_MODEL`=gpt-4o
* `AI_TIMEOUT_MS`=30000

## AI Provider Modes

### AI_PROVIDER=mock
This is the default configuration designed strictly for Hackathon presentations and localized development where LLM billing costs are unnecessary. It parses incoming image queues instantaneously and yields one of several structurally valid but deterministic medical archetypes safely.

### AI_PROVIDER=real
This commands the application's Abstracted Strategy architecture to switch routing targets to the `AI_API_URL` utilizing the `AI_API_KEY`. Real provider credentials must **always** remain sequestered server-side under `server/.env` logic. 

## Security Notes
* **Secrets belong in environment variables.** By default, `.gitignore` absolutely denies tracing of `.env` configurations. Never bypass this.
* Deployments must be encapsulated under SSL / HTTPS parameters before going public.
* Remember to cycle `JWT_SECRET` keys intermittently to expire all lingering active authentication tokens forcefully.

## Deployment 
The system utilizes two detached environments cleanly. 

1. **Frontend**: Point a provider (like Vercel, Netlify, or Cloudflare Pages) to the `client/` subdirectory. Use `npm run build` as the Build Command, and point the Publish Directory to `dist`. Populate the environmental overrides through their web portals.
2. **Backend**: Host the Express service on a PAAS (Render, Railway, or Fly.io). Point it to `server/`. Use `npm start` (which hooks into `node server.js`). Manually copy all production database and authentication variables into the container environment.
