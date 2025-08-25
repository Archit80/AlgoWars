
## CodeClash

CodeClash is a full-stack, real-time coding battle and quiz platform designed for competitive programming, learning, and fun. Players compete in head-to-head matches, climb leaderboards, and unlock achievements by solving algorithmic challenges in a secure, scalable environment.

---

### 🏗️ Architecture & System Overview

CodeClash consists of:
- **Frontend:** Built with Next.js 15 and React 19, styled using Tailwind CSS. State management uses Zustand and React Query for efficient data fetching and caching. Real-time updates are powered by the Socket.IO client. The UI includes battle, quiz, leaderboard, profile, and practice modes.
- **Backend:** Node.js (ESM) with Express 5 provides REST APIs and real-time Socket.IO endpoints. Prisma ORM manages PostgreSQL database operations. Redis is used for matchmaking queues and scalable event distribution. The backend handles authentication, anti-cheat logic, achievement tracking, and match state management.
- **Database:** PostgreSQL (via Prisma migrations) stores users, matches, questions, achievements, and stats. Redis supports fast matchmaking and socket event scaling.
- **Other Integrations:**
	- **Supabase:** Handles authentication and user management.
	- **Google Generative AI (Gemini):** Experimental integration for automatic question generation from LeetCode problems.
	- **Security:** bcrypt for password hashing, helmet for HTTP security headers, zod for schema validation.

---

### ⚡ Main Features
- Real-time matchmaking and competitive battles with live timers and synchronized state
- Randomized, fair question selection per match (database-side sampling)
- Achievements, streaks, and leaderboards with XP and level system
- Secure authentication (Supabase) and anti-cheat logic
- Scalable queueing and event system (Redis + Socket.IO)
- Practice mode, solo quizzes, and friend matches
- AI-powered question generation (Gemini integration)

---

### 🔌 Real-Time System
- **Socket.IO** enables persistent connections for live battles, timer sync, and event-driven UI updates.
- **Redis** supports scalable matchmaking and cross-server socket event distribution.
- **Room-based messaging** ensures only match participants receive relevant updates.
- **JWT authentication** secures socket connections and API requests.

---

### 🗂️ Backend API & Services
- RESTful endpoints for leaderboard, user stats, match creation/joining, question retrieval, and achievement tracking
- Prisma ORM for type-safe database access
- Express middleware for rate limiting, validation, and security
- AchievementService for tracking and awarding badges

---

### 🎨 Frontend UI
- Modular React components for battle, quiz, leaderboard, profile, and onboarding
- Zustand and React Query for state and data management
- Optimized for performance (see PERFORMANCE_OPTIMIZATION_SUMMARY.md)
- Socket.IO client for real-time updates

---

### 🤖 AI Integration
- Gemini AI generates new quiz questions from LeetCode problems, mapped to CodeClash categories
- Automated quality control and database integration for generated questions

---

### 🏆 Achievements System
- Earn badges for quiz performance, streaks, battle wins, and speed
- XP and level system for progression

---

### 📦 Tech Stack
- **Frontend:** Next.js 15, React 19, Tailwind CSS, Zustand, React Query, Socket.IO client
- **Backend:** Node.js (ESM), Express 5, Prisma ORM (PostgreSQL), Redis, Socket.IO server
- **Database:** PostgreSQL, Redis
- **Other:** Supabase (auth), bcrypt, helmet, zod, Google Generative AI (experimental)

---

For more details, see:
- `SOCKET_DOCUMENTATION.md` for real-time system architecture
- `GEMINI_INTEGRATION.md` for AI question generation
- `PERFORMANCE_OPTIMIZATION_SUMMARY.md` for frontend optimizations

---

### Main Features
- Real-time matchmaking and battles with live timers
- Randomized, fair question selection per match (DB-side sampling)
- Achievements, streaks, and leaderboards
- Secure authentication and anti-cheat logic
- Scalable queueing and event system (Redis + Socket.IO)

---

| Name              | Emoji | Condition                        | Goal Value   |
| ----------------- | ----- | -------------------------------- | ------------ |
| **Big Brain**     | 🧠    | Score 100% in quizzes            | 5 quizzes    |
| **Streak God**    | 🔥    | Daily login streak               | 30 days      |
| **Battle Royale** | ⚔️    | Win total battles                | 25 battles   |
| **Speed Demon**   | ⚡️    | Solve questions under 30 seconds | 10 questions |
