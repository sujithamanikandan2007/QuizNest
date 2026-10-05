# QuizNest – Online Quiz System

> **"Test your knowledge. Track your progress."**

QuizNest is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application designed with a clean, believable, real-world educational aesthetic. It features separate role-based experiences for **Students** and **Administrators**, secure JWT-based authentication with bcrypt password hashing, dynamic assessment scoring, question management, student progress tracking, and performance reporting.

---

## 🚀 Key Features

### 🎓 Student / User
- **Landing Page**: Real-world academic hero with clear call-to-actions, workflow overview ("Choose a Quiz" &rarr; "Answer Questions" &rarr; "View Your Result"), and category browsing.
- **Student Authentication**: Register with full name, email, password confirmation, and input validation.
- **Student Dashboard**: Welcome banner, active practice statistics (*Quizzes Attempted, Average Score, Highest Score*), and recently attempted quizzes.
- **Quiz Catalogue**: Searchable catalogue with filters for categories (*Programming, Web Development, Frontend, Databases, Networking*) and difficulty levels (*Easy, Medium, Hard*).
- **Quiz Assessment Experience**:
  - Live progress bar and question palette for quick navigation.
  - State preservation across questions (answers remain selected when toggling Previous/Next).
  - Anti-cheating security: Correct answers are stripped from API payloads delivered to quiz takers.
  - Explicit confirmation modal before final submission displaying unanswered count warning.
  - Automatic backend evaluation and instant score calculation.
- **Result & Review**:
  - Score summary card displaying accuracy percentage, correct count, and incorrect count.
  - Detailed Question Answer Review with visual green/red indicators comparing the student's selected answer against the correct answer.
- **My Attempts**: Complete historical record table of all submissions with scores, percentages, and dates.
- **Student Profile**: Overview of account details and accumulated performance statistics.

### 🛡️ Admin Panel
- **Protected Routing**: Role-based access control protecting all `/admin/*` routes. Non-admin students attempting to access admin URLs are redirected to the student dashboard.
- **Admin Dashboard**: Real-time aggregated metrics (*Total Quizzes, Total Questions, Total Students, Total Attempts*) and latest student submissions table.
- **Quiz Management (`/admin/quizzes`)**:
  - Create new quizzes with category, description, and difficulty.
  - Edit existing quiz metadata.
  - Dynamic question count aggregated directly from the database.
  - Delete quiz with confirmation modal (cascading removal of associated questions and attempt records).
- **Question Management (`/admin/quizzes/:quizId/questions`)**:
  - Dedicated question management table for each quiz.
  - Add question form with Question text, 4 options (A, B, C, D), and radio button for correct answer.
  - Edit question content and answer keys.
  - Delete question with confirmation dialog.
- **Student Management (`/admin/students`)**:
  - Table of all registered students with joined date and quiz participation counts.
  - Student detail modal showing historical performance. Student passwords are never exposed.
- **Results Management (`/admin/results`)**:
  - View all student quiz submissions across the platform.
  - Filter by quiz, student name/email, and completion date.

---

## 🎨 Design Philosophy & Color Palette

Designed strictly without artificial gradients, glassmorphism, floating blobs, or neon colors. The interface reflects a real college/university online examination and learning management portal:

- **Primary**: `#2563EB`
- **Dark Text**: `#1E293B`
- **Secondary Text**: `#64748B`
- **Background**: `#F8FAFC`
- **Surface / Cards**: `#FFFFFF`
- **Border**: `#E2E8F0`
- **Success**: `#16A34A`
- **Error**: `#DC2626`
- **Warning**: `#D97706`
- **Font**: Inter (`sans-serif`)

---

## 🛠️ Technology Stack

- **Frontend**: React.js 19, Vite, React Router v7, Axios, Vanilla CSS (CSS Variables)
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT (`jsonwebtoken`), `bcryptjs`, `cors`, `dotenv`
- **Language**: JavaScript (ES6+)

---

## 📂 Project Architecture

```
quiznest/
├── server/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   ├── authController.js     # Register, login, verify
│   │   ├── quizController.js     # Quiz CRUD & question count aggregation
│   │   ├── questionController.js # Question management & student sanitization
│   │   ├── resultController.js   # Score evaluation & results reporting
│   │   └── userController.js     # Student profile & admin analytics
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & optional auth
│   │   └── adminMiddleware.js    # Admin authorization guard
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt pre-save
│   │   ├── Quiz.js               # Quiz metadata schema
│   │   ├── Question.js           # 4-option question schema
│   │   └── Result.js             # Detailed quiz submission record
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── quizRoutes.js
│   │   ├── questionRoutes.js
│   │   ├── resultRoutes.js
│   │   ├── userRoutes.js
│   │   └── adminRoutes.js
│   ├── scripts/
│   │   └── seed.js               # Comprehensive 50-question database seeder
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── client/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── QuizCard.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── AdminRoute.jsx
│   │   │   ├── Button.jsx
│   │   │   └── Modal.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global auth state & token persistence
│   │   ├── pages/
│   │   │   ├── student/
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── QuizList.jsx
│   │   │   │   ├── Quiz.jsx
│   │   │   │   ├── Result.jsx
│   │   │   │   ├── AnswerReview.jsx
│   │   │   │   ├── MyAttempts.jsx
│   │   │   │   └── Profile.jsx
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── ManageQuizzes.jsx
│   │   │       ├── AddQuiz.jsx
│   │   │       ├── EditQuiz.jsx
│   │   │       ├── ManageQuestions.jsx
│   │   │       ├── AddQuestion.jsx
│   │   │       ├── EditQuestion.jsx
│   │   │       ├── ManageStudents.jsx
│   │   │       └── ManageResults.jsx
│   │   ├── services/
│   │   │   ├── api.js            # Axios client with interceptors
│   │   │   ├── authService.js
│   │   │   ├── quizService.js
│   │   │   ├── questionService.js
│   │   │   └── resultService.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── test_flow.js                  # 44-step automated end-to-end test suite
```

---

## ⚙️ Setup & Running Instructions

### 1. Database Seeding
To populate the database with the administrator account, a sample student account, and 5 quizzes with 10 questions each (50 total questions):

```bash
cd server
npm run seed
```

### 2. Start the Backend API
```bash
cd server
npm start
```
The server will run on `http://localhost:5000` and connect to MongoDB at `mongodb://127.0.0.1:27017/quiznest`.

### 3. Start the Frontend Client
```bash
cd client
npm run dev
```
The client will run on `http://localhost:3000` with automated proxying to the backend API.

---

## 🔑 Default Credentials

### Administrator Account
- **Email**: `admin@quiznest.com`
- **Password**: `Admin@123`
- **Role**: `admin`

### Demo Student Account
- **Email**: `student@quiznest.com`
- **Password**: `Student@123`
- **Role**: `student`

*(New students can also register freely on the `/register` page).*

---

## 🧪 Verification & Testing

An automated full-stack integration test suite is included in `test_flow.js`. Run:

```bash
node test_flow.js
```

**Results:**
- **44 PASSED / 0 FAILED** across health checks, registration, auth verification, sanitized quiz questions, result calculation, answer review, admin authorization guards, quiz CRUD, question CRUD, student roster inspection, and result filtering.
