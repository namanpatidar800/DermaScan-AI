<div align="center">
  
  # 🩺 DermaScan AI
  **An Intelligent, AI-Assisted Preliminary Skin Health Assessment Platform**

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)

  [View Live Demo](#live-link) • [Features](#-features) • [Installation](#-installation) • [Medical Disclaimer](#-important-medical-disclaimer)

</div>

---

## 🌐 Live Link
> **Try out DermaScan AI Live:**
> 👉 **[https://dermascan-ai-iwt7.onrender.com/](https://dermascan-ai-iwt7.onrender.com/)**

---

## 📖 Overview
**DermaScan AI** bridges the gap between everyday skin concerns and preliminary assessments. Built during a Hackathon, this full-stack application allows users to securely upload photos of skin lesions, submit a structured medical questionnaire, and dynamically receive an AI-generated preliminary report alongside interactive geolocations of nearby certified Dermatologists.

<div align="center">
  *(Add your beautiful dashboard/result screenshots here!)*
</div>

---

## ⚠️ Important Medical Disclaimer
**DermaScan AI is NOT a substitute for professional medical care.**
Results are strictly informational estimations provided by large language models (LLMs). The software **must never** be used to prescribe medication, start, stop, or alter a treatment plan, nor determine the absolute malignancy of lesions. Always consult a qualified healthcare professional.

---

## ✨ Features
- 🔐 **Secure Authentication:** JWT-based robust protection with bcrypt encryption and horizontal data scoping.
- 📸 **Smart Image Uploads:** Seamless Drag & Drop interface with mobile native-camera bridging and automatic `multer` bounds.
- 🤖 **AI Model Orchestration:** Selectable Abstract Factory pattern backend. Features a lightning-fast deterministic `Mock` provider for zero-cost demonstrations, cleanly swappable to `Real` AI Vision integration (e.g., OpenAI `gpt-4o`).
- 🏥 **Dermatologist Maps Discovery:** Real-time Geocoding and Interactive POI extraction via Mapbox GL JS integrations.
- 📊 **Responsive Dashboard History:** Dark-mode, glassmorphism-inspired UI detailing historical conditions and confidence matrices visually.

---

## 🛠️ Tech Stack
| Tier        | Technologies Used                                                                     |
|-------------|----------------------------------------------------------------------------------------|
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router DOM, Lucide React, Mapbox GL JS          |
| **Backend**  | Node.js, Express.js, MongoDB + Mongoose, JWT, bcryptjs, Multer, Express Rate Limit     |
| **AI Layer** | Configurable Vision JSON LLM Wrapper (`AI_PROVIDER=mock|real`)                       |

---

## 🚀 Installation & Local Setup

### 1. Prerequisites
- **Node.js**: v18 or newer
- **Database**: MongoDB Atlas Cluster URI
- **Mapping**: Mapbox Public API Token 
- **AI (Optional)**: OpenAI API Key (if switching to Live Model)

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/DermaScan-AI.git
cd DermaScan-AI
```

### 3. Install Dependencies
This project uses two partitioned layers.
```bash
# Terminal 1 - Backend
cd server
npm install

# Terminal 2 - Frontend
cd client
npm install
```

### 4. Environment Blueprint
Create an `.env` file inside **both** the `server` and `client` directories using the reference keys below:

**Client (`client/.env`)**:
```env
VITE_API_URL=/api
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

**Server (`server/.env`)**:
```env
PORT=5000
MONGODB_URI=your_mongodb_cluster_uri_here
JWT_SECRET=super_secret_cryptographic_string_here
CLIENT_URL=http://localhost:5174

# Choose 'mock' for free demo running, or 'real' for Live Vision
AI_PROVIDER=mock
AI_API_KEY=your_live_llm_key  
AI_API_URL=https://api.openai.com/v1/chat/completions
```

### 5. Fire it up!
Start both development servers concurrently.
```bash
# In your server terminal
npm run dev

# In your client terminal
npm run dev
```
Navigate to your provided Vite network URL (e.g., `http://localhost:5173` or `5174`) in your browser to begin exploring!

---

## ☁️ Deployment Guidelines
- **Frontend**: Effortlessly hosted on platforms like Vercel, Netlify, or Cloudflare pages. Simply point the Build Command to `npm run build` and directory to `dist`. Ensure to map the target Environmental Variables in their dashboard.
- **Backend**: Can be hosted on Railway, Render, or Fly.io as a standard Express application using `npm start`.

---

<div align="center">
  Made with ❤️ for Hackathons by [Your Name/Team].
</div>
