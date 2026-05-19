# PollBachchan 🗳️

A full-stack polling application that allows users to create, share, and analyze polls with real-time results and user responses.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Routes](#api-routes)
- [Usage Guide](#usage-guide)

---

## 📌 Project Overview

PollBachchan is a full-stack polling application where users can:
- Create and manage polls with multiple questions
- Share polls via unique links
- Track responses and view analytics
- Publish results for expired polls
- Delete polls and manage responses

The application supports both authenticated users and anonymous respondents, with role-based access control.

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Security**: bcryptjs for password hashing

### Frontend
- **Framework**: React 19
- **Router**: React Router v7
- **HTTP Client**: Axios
- **Form Handling**: TanStack React Form
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

---

## ✨ Features

### Core Features
- **User Authentication**
  - Register new accounts
  - Secure login with JWT tokens
  - Refresh token mechanism
  - Logout functionality

- **Poll Management**
  - Create polls with multiple questions
  - Support for optional questions
  - Multiple choice options per question
  - Anonymous or named poll modes
  - Poll expiration dates
  - Publish/hide results toggle

- **Polling & Analytics**
  - Submit responses to polls
  - View real-time analytics
  - Percentage calculations
  - Total participant tracking
  - User response summary (non-anonymous polls)

- **User Experience**
  - Dashboard for managing polls
  - Copy poll links to clipboard
  - View analytics for each poll
  - Redirect unauthenticated users to login
  - Auto-redirect after login to original poll

---

## 📁 Project Structure

```
PollBachchan/
├── Backend/
│   ├── common/
│   │   ├── db/
│   │   │   └── db.js                 # Database connection
│   │   ├── dto/
│   │   │   ├── baseDto.js
│   │   │   └── validate.middleware.js
│   │   └── utils/
│   │       ├── apiError.js
│   │       ├── jwt.utility.js
│   │       └── response.js
│   ├── module/
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.dto.js
│   │   │   ├── auth.middleware.js
│   │   │   └── auth.route.js
│   │   ├── poll/
│   │   │   ├── poll.controller.js
│   │   │   ├── poll.dto.js
│   │   │   ├── poll.route.js
│   │   │   └── schemas/
│   │   │       ├── poll.schema.js
│   │   │       └── response.schema.js
│   │   └── user/
│   │       ├── user.controller.js
│   │       ├── user.route.js
│   │       └── user.schema.js
│   ├── server.js
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── apiClient.js
│   │   │   ├── authApi.js
│   │   │   └── pollApi.js
│   │   ├── components/
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── RequireAuth.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── PollCard.jsx
│   │   │   │   ├── PollList.jsx
│   │   │   │   └── DashboardHeader.jsx
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── pages/
│   │   │   ├── AnalyticsPage.jsx
│   │   │   ├── CreatePollPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── PollFormPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   └── ...
│   │   ├── utils/
│   │   │   ├── authStorage.js
│   │   │   └── pollLinks.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. **Navigate to Backend directory**
   ```bash
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** in the Backend directory:
   ```env
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/pollbachchan
   JWT_SECRET=your_jwt_secret_key_here
   JWT_REFRESH_SECRET=your_refresh_secret_key_here
   FRONTEND_URL=http://localhost:5173
   JWT_EXPIRY=7d
   JWT_REFRESH_EXPIRY=30d
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to Frontend directory**
   ```bash
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** in the Frontend directory:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

---

## 🔌 API Routes

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth | Body |
|--------|----------|-------------|------|------|
| POST | `/register` | Register new user | ❌ | `{ name, email, password }` |
| POST | `/login` | Login user | ❌ | `{ email, password }` |
| POST | `/logout` | Logout user | ✅ | - |
| POST | `/refresh` | Refresh access token | ✅ (Refresh) | - |

**Response Format:**
```json
{
  "success": true,
  "message": "string",
  "data": {
    "name": "string",
    "accessToken": "string"
  }
}
```

---

### Poll Routes (`/api/poll`)

| Method | Endpoint | Description | Auth | Query Params |
|--------|----------|-------------|------|--------------|
| GET | `/getAll` | Get all user's polls | ✅ | - |
| GET | `/form` | Get poll form to fill | ✅ | `id` (pollId) |
| GET | `/details` | Get poll details | ✅ | `id` (pollId) |
| GET | `/participants` | Get total participants | ✅ | `id` (pollId) |
| GET | `/analytics` | Get poll analytics | ✅ | `id` (pollId) |
| GET | `/summary` | Get user responses summary | ✅ | `id` (pollId) |

**Analytics Response:**
```json
{
  "success": true,
  "data": {
    "analytics": {
      "totalParticipants": 10,
      "questions": [
        {
          "questionId": "string",
          "content": "string",
          "results": [
            {
              "optionIndex": 0,
              "optionText": "string",
              "count": 5,
              "percentage": 50
            }
          ]
        }
      ]
    }
  }
}
```

---

### User Routes (`/api/user`)

| Method | Endpoint | Description | Auth | Body/Params |
|--------|----------|-------------|------|-------------|
| POST | `/create` | Create new poll | ✅ | `{ title, description, isAnonymous, expiresAt, questions }` |
| POST | `/submit` | Submit poll responses | ✅ | `id` (pollId), `{ responses }` |
| POST | `/delete` | Delete a poll | ✅ | `id` (pollId) |
| POST | `/publish` | Publish/hide results | ✅ | `id` (pollId), `{ isPublished }` |

**Create Poll Body:**
```json
{
  "title": "string",
  "description": "string",
  "isAnonymous": boolean,
  "expiresAt": "ISO date string",
  "questions": [
    {
      "content": "string",
      "options": ["option1", "option2", ...],
      "isOptional": boolean
    }
  ]
}
```

**Submit Response Body:**
```json
{
  "responses": [
    {
      "questionId": "string",
      "selectedOption": 0
    }
  ]
}
```

---

## 📖 Usage Guide

### Creating a Poll

1. Login or Sign up
2. Navigate to Dashboard
3. Click "Create Poll"
4. Fill poll details:
   - Title and description
   - Choose anonymous or named mode
   - Set expiration date
   - Add questions with options
5. Click "Create Poll"

### Sharing a Poll

1. From Dashboard, click the copy button on any poll
2. Share the link with respondents

### Responding to a Poll

1. Open the poll link
2. If not authenticated, login/signup (redirects back to poll)
3. Answer all required questions
4. Click "Submit responses"

### Viewing Analytics

1. From Dashboard, click the analytics icon
2. View real-time results with:
   - Response counts and percentages
   - Total participants
   - User response summary (non-anonymous polls)

### Publishing Results

1. From Dashboard, toggle the publish switch
2. When poll expires:
   - If published: respondents see results
   - If not published: poll shows as expired

---

## 🔐 Authentication Flow

1. **Register/Login** → JWT token stored in cookies
2. **Access Protected Routes** → Token sent in Authorization header
3. **Token Expiry** → Refresh token used to get new access token
4. **Logout** → Token cleared from cookies

---

## 📝 Database Schema

### User Schema
- `name`: String
- `email`: String (unique)
- `password`: String (hashed)

### Poll Schema
- `title`: String
- `description`: String
- `ownerId`: ObjectId (ref: User)
- `isAnonymous`: Boolean
- `isResultPublished`: Boolean
- `expiresAt`: Date
- `questions`: Array of question objects
- `createdAt`, `updatedAt`: Timestamps

### Response Schema
- `pollId`: ObjectId (ref: Poll)
- `qid`: ObjectId (question ID)
- `respondent`: ObjectId (ref: User)
- `optionIndex`: Number
- `createdAt`, `updatedAt`: Timestamps

---

## 🐛 Troubleshooting

### Backend won't connect to MongoDB
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify connection string format

### Frontend can't reach backend
- Check `VITE_API_URL` in `.env`
- Ensure backend is running on correct port
- Check CORS settings in `server.js`

### JWT token errors
- Ensure `JWT_SECRET` is set in backend `.env`
- Check token expiry settings
- Clear browser cookies if needed

---

## 📧 Support

For issues or questions, refer to the code comments or create an issue in the repository.

---

