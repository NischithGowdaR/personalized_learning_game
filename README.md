# Personalized Learning Game Generator (EduPlay AI)

EduPlay AI is a complete, fully functional MERN stack (MongoDB, Express, React, Node) educational web application powered by Groq AI. It dynamically generates personalized multiple-choice quizzes that adapt in difficulty based on the student's historical accuracy.

---

## Features

1.  **AI Quiz Generation**: Integrates the Groq SDK (`llama-3.3-70b-versatile`) to generate high-quality educational questions on any custom subject/topic in milliseconds.
2.  **Adaptive Learning Engine**:
    *   **Accuracy >= 80%** $\rightarrow$ Increments the difficulty level for the topic.
    *   **Accuracy 50% - 79%** $\rightarrow$ Maintains current difficulty level.
    *   **Accuracy < 50%** $\rightarrow$ Decreases difficulty to Beginner to enforce remedial learning.
3.  **Analytics Dashboard**: Visualizes score logs over time and accuracy breakdowns per topic using **Recharts**.
4.  **Gamification**: Integrates automatic level-up criteria (Level 1 to 5) and achievements (Badges like `🎯 First Game`, `🔥 5 Games Completed`, `🏆 10 Games Completed`, `🧠 90% Accuracy`, and `⚡ Fast Learner`).
5.  **Smart Recommendations**: Examines MongoDB records, identifies the student's weakest topic, and provides a quick CTA to generate a remedial game configuration.
6.  **Interactive Gameplay**: Employs interactive selection feedback with highlighted correct/incorrect answers, custom countdown timers, automatic submission on timeout, and detailed AI explanations.

---

## MERN Architecture

```
React (Vite) <---> Express (Node.js) <---> MongoDB Atlas
                        |
                        +---> Groq AI (Inference SDK)
```

1.  **Client (React)**: Uses Axios and React Router DOM. All authentication routes are protected by a JWT auth context wrapper.
2.  **Server (Express)**: Manages authentication, progress aggregation, and game generation. All endpoints (except login/register) are guarded by JWT middleware.
3.  **Database (MongoDB)**: Saves profiles, games, and topic progresses using Mongoose schemas.
4.  **AI Layer (Groq)**: The backend securely contacts Groq AI using custom system instructions that inject student history profiles.

---

## Folder Structure

```
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # Route logic (Auth, Game, Progress, User)
│   ├── models/          # Mongoose Schemas (User, Game, UserProgress)
│   ├── middleware/      # JWT guards & error handers
│   ├── routes/          # REST Endpoint routes
│   ├── services/        # Groq SDK & recommendation engine
│   ├── utils/           # Adaptive level scaling logic
│   └── server.js        # Entry server script
├── frontend/
│   ├── src/
│   │   ├── components/  # Layouts & UI card modules
│   │   ├── pages/       # Screen views (Dashboard, Game, Progress, Profile, etc.)
│   │   ├── context/     # Auth Context session managers
│   │   ├── services/    # Fetch API client
│   │   └── App.jsx      # Router entry
│   └── tailwind.config.js
└── README.md
```

---

## Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   MongoDB local instance or MongoDB Atlas account
*   Groq API Key (get one from [Groq Console](https://console.groq.com/))

### 1. Backend Setup
1.  Navigate to the backend:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables in `.env` (copy from `.env.example`):
    ```env
    PORT=5000
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/dbname
    GROQ_API_KEY=gsk_...
    JWT_SECRET=your_super_secret_jwt_key
    CLIENT_URL=http://localhost:5173
    ```
4.  Start server:
    ```bash
    npm run dev
    ```

### 2. Frontend Setup
1.  Navigate to the frontend:
    ```bash
    cd ../frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start React dev server:
    ```bash
    npm run dev
    ```

---

## API Endpoints

### Authentication
*   `POST /api/auth/register` - Create user and receive JWT.
*   `POST /api/auth/login` - Authenticate credentials and receive JWT.
*   `GET /api/auth/me` - [Private] Retrieve logged-in session data.

### Games
*   `POST /api/games/generate` - [Private] Generate custom quiz questions using Groq.
*   `GET /api/games` - [Private] Fetch completed games.
*   `GET /api/games/:id` - [Private] Retrieve quiz parameters and questions.
*   `POST /api/games/:id/submit` - [Private] Submit answers, calculate score, update stats, levels, and badges.

### Progress & Analytics
*   `GET /api/progress` - [Private] Retrieve score history logs, strong/weak items, levels, and badges.
*   `GET /api/progress/topics` - [Private] Fetch detailed topic breakdowns.
*   `GET /api/progress/recommendations` - [Private] Get dynamic AI study recommendation.

### User Profiles
*   `GET /api/users/profile` - [Private] Retrieve profile details.
*   `PUT /api/users/profile` - [Private] Update full name or email (with checks).
*   `GET /api/users/badges` - [Private] Fetch earned badge names.

---

## Deployment Guidelines
*   **Backend (Render)**: Set env variables (`MONGODB_URI`, `GROQ_API_KEY`, `JWT_SECRET`, `CLIENT_URL`) inside Render Dashboards, configure start command to `npm start`.
*   **Frontend (Vercel)**: Set `VITE_API_URL` to your live backend domain. Add Vercel redirects config for React routing.
