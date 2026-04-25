# 🎓 Elimu AI — STEM Tutor for Kenyan Secondary Students

> **Bridging the 1:58 Teacher-Student Gap Through AI** · Built for the AI for Education Hackathon 2026

[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)
[![Tech Stack](https://img.shields.io/badge/Tech-MERN%2BVercel%2BRender-blueviolet)](https://github.com)

---

## 📋 Table of Contents

- [The Problem](#-the-problem)
- [The Solution](#-the-solution)
- [Architecture](#-architecture)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Local Development](#-local-development-setup)
- [Deployment](#-deployment-guide)
- [File Structure](#-file-structure)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚨 The Problem

### Educational Crisis in Kenya

Kenya faces a critical STEM education challenge:

- **1:58 Teacher-to-Student Ratio** — Average public secondary school has ~1,800 students with only ~30 teachers
- **Language Barrier** — All STEM materials are in formal English, but many students learn best in Swahili/Sheng
- **Limited Resources** — Rural schools lack qualified STEM teachers and learning materials
- **Inconsistent Quality** — Student outcomes depend heavily on which school/teacher they're assigned to
- **No Personalized Learning** — Teachers can't provide individual attention due to overcrowding

**Impact:** Students struggle with abstract concepts, fall behind, and lose interest in STEM careers.

---

## 💡 The Solution

### What is Elimu AI?

**Elimu AI** ("Elimu" = "Education" in Swahili) is an AI-powered STEM tutor designed specifically for the Kenyan secondary school context. It bridges the gap between students and qualified teachers through:

#### Core Features

1. **🗣️ Natural Code-Switching**
   - Seamlessly switches between **Formal English**, **Kiswahili**, and **Sheng** (Nairobi youth slang)
   - Students learn in the language they think in
   - Maintains scientific accuracy while being culturally authentic

2. **🇰🇪 Localized Analogies**
   - Explains abstract concepts using everyday Kenyan contexts
   - Example: Newton's First Law → matatu behavior on Thika Road
   - Example: Chemical reactions → cooking ugali (mixing ingredients, applying heat)
   - Example: Probability → KCSE exam pass rates in your school

3. **📚 Subject Coverage**
   - **Mathematics** (Form 1-4)
   - **Physics** (Form 1-4)
   - **Chemistry** (Form 1-4)
   - **Biology** (Form 1-4)
   - **Computer Science** (Form 3-4)

4. **📝 Instant Quizzes**
   - AI generates 5-question multiple-choice quizzes aligned with KCSE standards
   - Covers any topic discussed
   - Instant grading with detailed explanations for wrong answers
   - Helps reinforce learning through practice

5. **💬 Real-Time Streaming**
   - Responses stream token-by-token via Server-Sent Events (SSE)
   - No waiting for full responses — students see thinking in real-time
   - Feels like natural conversation with a tutor

6. **📚 Persistent Chat History**
   - All conversations saved to MongoDB
   - Students can continue learning across sessions
   - No need to re-explain context

---

## 🏗️ Architecture

### System Design

```
┌──────────────────────────────────────────────────┐
│           Frontend Layer (Vercel)                │
│  React 18 + Vite + Tailwind CSS                 │
│  ┌──────────────┬──────────────┬───────────────┐│
│  │WelcomeScreen │ ChatWindow   │ QuizPanel    ││
│  │(subject/lang)│(SSE Stream)  │(KCSE quiz)   ││
│  └──────────────┴──────────────┴───────────────┘│
└─────────────────────┬──────────────────────────┘
                      │ HTTP + SSE
                      │
┌─────────────────────▼──────────────────────────┐
│         Backend Layer (Render)                  │
│    Node.js + Express.js (ES Modules)           │
│  ┌────────────────────────────────────────────┐│
│  │  REST API Routes                           ││
│  │  • POST   /api/chat/stream  (SSE stream)   ││
│  │  • GET    /api/sessions      (fetch chats) ││
│  │  • POST   /api/quiz          (generate)    ││
│  │  • DELETE /api/sessions/:id  (clear)       ││
│  └────────────────────────────────────────────┘│
└─────────────┬──────────────────┬──────────────┘
              │                  │
     ┌────────▼────────┐  ┌──────▼──────────┐
     │  Gemini 2.5     │  │  MongoDB Atlas  │
     │  Flash API      │  │                 │
     │  (via Google    │  │  Collections:   │
     │   AI Studio)    │  │  • sessions     │
     │                 │  │  • messages     │
     │ Responsibilities:    │                 │
     │ • AI explanations    │                 │
     │ • Quiz generation    │                 │
     │ • Code-switching     │                 │
     │ • Analogies          │                 │
     └─────────────────┘  └─────────────────┘
```

### Data Flow

1. **Student asks question** → Client sends to server
2. **Server validates** → Checks session exists, adds to history
3. **Gemini processes** → AI generates response with system prompt
4. **Streaming response** → SSE sends chunks to client as they arrive
5. **Client displays** → Real-time text appearing in chat
6. **Database saves** → Full response persisted to MongoDB
7. **Student can continue** → Query stored session for future interactions

---

## ✨ Features Deep Dive

### 1. Multi-Language Code-Switching

The system uses a sophisticated prompt engineering approach:

**System Instruction Includes:**

```
"You are Elimu AI, a brilliant tutor for Kenyan secondary students.

For English mode:
  - Use formal, academic language
  - Align with Form 1-4 curriculum

For Kiswahili mode:
  - Use clear Swahili (not English with Swahili words)
  - Use scientific terms where Swahili equivalents don't exist

For Sheng mode:
  - Mix English, Swahili, and authentic Nairobi Sheng
  - Examples: 'Sawa fam', 'unaelewa?', 'poa sana'
  - Keep scientific accuracy
```

**Example Response:**

```
"Sawa boss, let me explain velocity. Basically, ni distance divided by time, right?

Think of a matatu on Thika Road:
- Ikiwa inahama 100 km in 2 hours
- Velocity = 100/2 = 50 km/h

But poa — velocity has DIRECTION. So si ka speed tu.
Ikiwa driver anajazamuka East at 50 km/h, hiyo ni velocity.

Unaelewa the difference? Speed = scalar, velocity = vector. Sawa?
```

### 2. Localized Analogies System

For each subject, the system includes context:

```javascript
const SUBJECT_CONTEXTS = {
  physics: "Use matatus, bodabodas, football, water flow",
  chemistry: "Use cooking ugali, M-Pesa transactions, farm reactions",
  biology: "Use shamba ecosystems, human body like a farm",
  mathematics: "Use market pricing, M-Pesa, KCSE statistics",
};
```

When explaining concepts, Gemini pulls from this context to create relatable examples.

### 3. Real-Time Streaming via SSE

**Server Implementation:**

```javascript
export async function streamChat(messages, subject, languageMode) {
  const stream = await chat.sendMessageStream(lastMessage);
  // Streams chunks as they arrive from Gemini API
  for await (const chunk of stream) {
    res.write(`data: ${JSON.stringify({ text: chunk.text() })}\n\n`);
  }
}
```

**Client Implementation:**

```javascript
const reader = response.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  // Append each chunk to display in real-time
  fullMessage += decoder.decode(value);
}
```

**Benefits:**

- ⚡ No waiting for full response
- 🎯 Engages students faster
- 📱 Better for slow internet (shows progress)

### 4. Quiz Generation

**Flow:**

1. User clicks "📝 Generate Quiz" on any topic
2. Server sends topic + subject to Gemini
3. AI generates 5 KCSE-aligned multiple-choice questions
4. Returns as JSON with explanations
5. Client displays with instant grading

**Gemini Prompt:**

```
"Generate a 5-question KCSE-aligned quiz on [TOPIC] for Form [LEVEL] students.
Return JSON with:
  - question (in chosen language)
  - options (A, B, C, D)
  - correctAnswer
  - explanation (using local Kenyan context)"
```

---

## 🛠️ Tech Stack

### Frontend

- **React 18** — UI framework with hooks
- **Vite** — Lightning-fast build tool & dev server
- **Tailwind CSS v4** — Utility-first styling
- **Zustand** — Lightweight state management
- **Lucide Icons** — Beautiful, consistent icons
- **Vite API URL** — Environment-aware API configuration

### Backend

- **Node.js 20+** — Runtime
- **Express.js** — Minimal, unopinionated web framework
- **ES Modules (ESM)** — Modern JavaScript modules
- **dotenv** — Environment variable management

### AI & LLM

- **Google Gemini 2.5 Flash** — Latest, fastest Gemini model
- **@google/generative-ai SDK** — Official Google client library
- **Server-Sent Events (SSE)** — For real-time streaming

### Database

- **MongoDB Atlas** — Cloud MongoDB
- **Mongoose** — Object modeling for Node.js
- **Automatic indexing** — On sessionId, createdAt

### DevOps & Deployment

- **Docker** — Containerization for consistent deployments
- **Render** — Backend deployment (Node.js service)
- **Vercel** — Frontend deployment (React app)
- **pnpm** — Fast, disk-space-efficient package manager

### Development Tools

- **ESLint** — Code linting
- **Vite Config** — For both dev and production builds
- **Morgan** — HTTP logging

---

## 🚀 Local Development Setup

### Prerequisites

Before starting, ensure you have:

```bash
# Check Node.js version (need 20+)
node --version  # v20.x.x or higher

# Install pnpm globally
npm install -g pnpm

# Verify pnpm
pnpm --version  # 9.x.x or higher
```

### Step 1: Clone Repository

```bash
git clone https://github.com/your-username/elimu-ai.git
cd elimu-ai
```

### Step 2: Get API Keys

1. **Gemini API Key** (Free)
   - Visit [Google AI Studio](https://aistudio.google.com/apikey)
   - Click "Create API Key"
   - Copy the key
   - Add to `.env`

2. **MongoDB Connection String** (Free tier available)
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create free cluster
   - Get connection string
   - Add to `.env`

### Step 3: Setup Server

```bash
cd server

# Install dependencies
pnpm install

# Create .env file
cat > .env << EOF
GEMINI_API_KEY=your_api_key_here
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/elimu-ai
PORT=8080
NODE_ENV=development
CLIENT_URL=http://localhost:5173
EOF

# Start development server (with auto-reload)
pnpm dev
```

The server will run at `http://localhost:8080`

**Expected Output:**

```
✅ MongoDB connected
🚀 Elimu AI Server running on port 8080
🤖 Gemini model: gemini-2.5-flash
```

### Step 4: Setup Client

```bash
cd ../client

# Install dependencies
pnpm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:8080
EOF

# Start development server
pnpm dev
```

The client will run at `http://localhost:5173`

**Visit:** Open browser to `http://localhost:5173` and test! 🎉

---

## ☁️ Deployment Guide

### Option 1: Vercel (Client) + Render (Server)

This is the **recommended** approach for this hackathon.

#### Deploy Backend to Render

1. **Push to GitHub**

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub
   - Authorize repository access

3. **Deploy Server**
   - Click **New +** → **Web Service**
   - Select your GitHub repository
   - Fill in:
     - **Name:** `elimu-ai-server`
     - **Environment:** `Node`
     - **Build Command:** `cd server && pnpm install`
     - **Start Command:** `cd server && node src/server.js`
     - **Plan:** Free tier is fine

4. **Add Environment Variables** (in Render dashboard)

   ```
   GEMINI_API_KEY = your_api_key
   MONGODB_URI = your_mongo_connection_string
   NODE_ENV = production
   ```

5. **Deploy** — Click "Create Web Service"
   - Wait 3-5 minutes for build/deploy
   - Copy the service URL (e.g., `https://elimu-ai-server.onrender.com`)

#### Deploy Frontend to Vercel

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Authorize repository access

2. **Import Project**
   - Click **New Project**
   - Select your GitHub repository
   - Configure:
     - **Framework:** Vite
     - **Root Directory:** `./client`
     - **Build Command:** `pnpm build`
     - **Output Directory:** `dist`

3. **Add Environment Variables**

   ```
   VITE_API_URL = https://elimu-ai-server.onrender.com
   ```

   (Use the Render server URL from previous step)

4. **Deploy** — Click "Deploy"
   - Wait 2-3 minutes
   - Get your Vercel URL (e.g., `https://elimu-ai.vercel.app`)

5. **Update Server's CLIENT_URL**
   - Go back to Render dashboard
   - Select `elimu-ai-server`
   - Update environment variable:
     ```
     CLIENT_URL = https://elimu-ai.vercel.app
     ```
   - Render auto-redeploys

#### Test Deployment

1. Open your Vercel URL
2. Select subject and language
3. Send a test message
4. Verify chat works end-to-end ✅

---

## 📁 File Structure

```
elimu-ai/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat/
│   │   │   │   ├── ChatWindow.jsx   # Main chat interface
│   │   │   │   ├── InputBar.jsx     # Message input
│   │   │   │   ├── MessageBubble.jsx # Chat bubble component
│   │   │   │   ├── TypingIndicator.jsx
│   │   │   │   └── WelcomeScreen.jsx # Initial screen
│   │   │   ├── Quiz/
│   │   │   │   └── QuizPanel.jsx    # Quiz interface
│   │   │   ├── Sidebar/
│   │   │   │   └── Sidebar.jsx      # Subject selector
│   │   │   └── UI/
│   │   │       └── Navbar.jsx       # Top navbar
│   │   ├── hooks/
│   │   │   └── useChat.js           # Chat logic hook
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx      # Marketing page
│   │   │   └── TutorPage.jsx        # Main tutor interface
│   │   ├── store/
│   │   │   └── useTutorStore.js     # Zustand state
│   │   ├── utils/
│   │   │   └── api.js               # API client
│   │   ├── App.jsx                  # Router
│   │   ├── App.css                  # Global styles
│   │   ├── index.css                # Tailwind import
│   │   └── main.jsx                 # Entry point
│   ├── index.html
│   ├── Dockerfile                   # Container build
│   ├── nginx.conf                   # Web server config
│   ├── package.json
│   ├── pnpm-lock.yaml
│   └── vite.config.js
│
├── server/                          # Express backend
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── chat.controller.js   # Chat endpoint handler
│   │   │   ├── quiz.controller.js   # Quiz generation
│   │   │   └── session.controller.js # Session management
│   │   ├── models/
│   │   │   └── Session.model.js     # MongoDB schema
│   │   ├── routes/
│   │   │   ├── chat.routes.js
│   │   │   ├── quiz.routes.js
│   │   │   └── session.routes.js
│   │   ├── services/
│   │   │   └── gemini.service.js    # AI logic
│   │   └── server.js                # Express app
│   ├── Dockerfile                   # Container build
│   ├── package.json
│   ├── pnpm-lock.yaml
│   └── .env                         # Config (gitignored)
│
├── docker-compose.yml               # Local dev orchestration
├── render.yaml                      # Render deployment config
├── DEPLOYMENT.md                    # GCP deployment guide
├── DEPLOY_VERCEL_RENDER.md          # Vercel+Render guide
├── README.md                        # This file
├── .gitignore
└── package.json                     # Root workspace
```

---

## 🔌 API Documentation

### Base URL

- **Local:** `http://localhost:8080`
- **Production:** `https://elimu-ai-server.onrender.com`

### Endpoints

#### POST /api/chat/stream

**Streams AI responses via Server-Sent Events**

**Request Body:**

```json
{
  "sessionId": "optional-session-id",
  "message": "Explain momentum",
  "subject": "physics",
  "languageMode": "sheng"
}
```

**Subject Options:** `mathematics`, `physics`, `chemistry`, `biology`, `computer_science`

**Language Options:** `english`, `swahili`, `sheng`

**Response:** Server-Sent Events stream

```
data: {"text":"Sawa "}
data: {"text":"boss"}
data: {"text":", let"}
...
data: {"done":true,"sessionId":"62a...","fullText":"Sawa boss, let me explain momentum..."}
```

**Example cURL:**

```bash
curl -X POST http://localhost:8080/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is photosynthesis?",
    "subject": "biology",
    "languageMode": "sheng"
  }'
```

---

#### GET /api/sessions

**Fetch all sessions for a user**

**Query Parameters:**

- `limit` (optional, default: 10) — Number of sessions to return
- `skip` (optional, default: 0) — Pagination offset

**Response:**

```json
[
  {
    "_id": "62a...",
    "subject": "biology",
    "languageMode": "sheng",
    "createdAt": "2026-04-25T10:30:00Z",
    "messages": [
      {
        "role": "user",
        "content": "What is photosynthesis?"
      },
      {
        "role": "model",
        "content": "Sawa boss, photosynthesis ni process..."
      }
    ]
  }
]
```

---

#### POST /api/quiz/generate

**Generate a quiz on a topic**

**Request Body:**

```json
{
  "topic": "Newton's Laws of Motion",
  "subject": "physics",
  "languageMode": "english"
}
```

**Response:**

```json
{
  "topic": "Newton's Laws of Motion",
  "questions": [
    {
      "id": 1,
      "question": "What does Newton's First Law state?",
      "options": [
        "A. F = ma",
        "B. An object at rest stays at rest...",
        "C. For every action...",
        "D. Energy cannot be created..."
      ],
      "correctAnswer": "B",
      "explanation": "Newton's First Law is about inertia... (using Kenyan analogy)"
    }
  ]
}
```

---

#### DELETE /api/sessions/:id

**Delete a chat session**

**Response:**

```json
{
  "message": "Session deleted successfully",
  "deletedId": "62a..."
}
```

---

## 🤝 Contributing

### Bug Reports

Found a bug? Please create an issue with:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable

### Feature Requests

Have an idea? Open an issue with label `enhancement` and describe:

- Problem it solves
- How it works
- Why it's needed

### Code Contributions

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write/update tests
5. Commit (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Standards

- Use ESLint for code style
- Write meaningful commit messages
- Test locally before pushing
- Add comments for complex logic

---

## 📄 License

This project is licensed under the **MIT License** — See [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini 2.5 Flash** — Powering the AI tutor
- **MongoDB Atlas** — Database hosting
- **Vercel & Render** — Cloud hosting
- **Kenyan Secondary School Curriculum** — KCSE guidelines
- **AI for Education Hackathon 2026** — For hosting this challenge

---

## 📞 Support

- **Email:** support@elimu-ai.app
- **GitHub Issues:** [Report bugs here](https://github.com/your-username/elimu-ai/issues)
- **Documentation:** This README + `/DEPLOYMENT.md`

---

**Made with ❤️ for Kenyan Students** 🇰🇪
export PROJECT_ID=your-gcp-project-id
export REGION=us-central1

# Configure Docker for GCP

gcloud auth configure-docker ${REGION}-docker.pkg.dev

# Create Artifact Registry repo

gcloud artifacts repositories create elimu-ai \
 --repository-format=docker \
 --location=$REGION

# Build & push server

docker build -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/elimu-ai/server ./server
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/elimu-ai/server

# Build & push client

docker build \
 --build-arg VITE_API_URL=https://elimu-server-XXXX-uc.a.run.app \
 -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/elimu-ai/client ./client
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/elimu-ai/client

````

### Step 2 — Deploy Server

```bash
gcloud run deploy elimu-server \
  --image=${REGION}-docker.pkg.dev/${PROJECT_ID}/elimu-ai/server \
  --region=$REGION \
  --platform=managed \
  --allow-unauthenticated \
  --port=8080 \
  --set-env-vars="GEMINI_API_KEY=your_key,MONGODB_URI=your_uri,NODE_ENV=production,CLIENT_URL=https://elimu-client-XXXX-uc.a.run.app"
````

### Step 3 — Deploy Client

```bash
gcloud run deploy elimu-client \
  --image=${REGION}-docker.pkg.dev/${PROJECT_ID}/elimu-ai/client \
  --region=$REGION \
  --platform=managed \
  --allow-unauthenticated \
  --port=8080
```

---

## 📁 Project Structure

```
Buildathon/
├── client/                 # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/     # Chat, Quiz, Sidebar, UI
│   │   ├── hooks/          # useChat
│   │   ├── pages/          # TutorPage
│   │   ├── store/          # Zustand global state
│   │   └── utils/          # API calls (SSE + REST)
│   ├── Dockerfile
│   └── nginx.conf
└── server/                 # Express.js API
    ├── src/
    │   ├── controllers/    # chat, quiz, session
    │   ├── models/         # Session (MongoDB)
    │   ├── routes/         # /api/chat, /api/quiz, /api/sessions
    │   └── services/       # gemini.service.js ← core AI logic
    └── Dockerfile
```

---

## 🎯 Judging Criteria

| Metric                | Our Approach                                                              |
| --------------------- | ------------------------------------------------------------------------- |
| **Originality**       | Code-switching + localized Kenyan analogies is unique in African EdTech   |
| **Execution**         | Full MERN stack, SSE streaming, MongoDB persistence, Dockerized Cloud Run |
| **Real-world Impact** | Directly addresses 1:58 teacher-student ratio with 24/7 AI availability   |
| **Google Cloud / AI** | Gemini 2.0 Flash (AI Studio), Cloud Run, Artifact Registry                |

---

## 👥 Team

Built with ❤️ for Kenya at the **AI for Education Hackathon 2026**

_"Elimu ni ufunguo wa maisha"_ — Education is the key to life 🇰🇪
