# PollBachchan Backend

## Overview
This is the backend service for **PollBachchan**, an interactive polling application. It is built using Node.js, Express, and MongoDB (via Mongoose). It exposes a set of RESTful APIs to handle user authentication, poll creation, response submission, and robust analytics extraction.

## Folder Structure Architecture

```text
Backend/
├── common/             # Shared utilities (DB connection, error handling, standardized responses, and DTO validators)
├── module/             # Modularized business logic layer
│   ├── auth/           # Auth controllers, DTOs, routes, and middlewares
│   ├── poll/           # Polling analytics controllers, routes, and Mongoose schemas
│   └── user/           # User's poll management actions (create, submit, delete)
├── package.json        # Dependencies and scripts (uses Node's native --watch flag)
└── server.js           # Express App entry point and global middleware setup
```

## Database Schemas

The application heavily utilizes MongoDB's features and Mongoose models under `module/poll/schemas/` & `module/user/user.schema.js`:

### 1. User Schema (`User`)
- **`name`**: String (Min length: 5)
- **`email`**: String (Unique, required)
- **`password`**: String (Hashed with `bcryptjs` before save)
- **`refreshToken`**: String (Stores JWT refresh token)

### 2. Poll Schema (`Poll`)
- **`ownerId`**: Reference to `User` making the poll.
- **`title`**: String (Required)
- **`description`**: String
- **`isAnonymous`**: Boolean (Defaults to `false`)
- **`isResultPublished`**: Boolean (Marks if results are public)
- **`questions`**: Array of sub-documents:
  - `content`: The question's prompt.
  - `options`: Array of strings (Validator enforces minimum of 2 options).
  - `isOptional`: Boolean.
- **`expiresAt`**: Date (Calculates absolute expiry time).

### 3. Response Schema (`Response`)
- **`pollId`**: Reference to `Poll`.
- **`qid`**: The specific Question ID this response is for.
- **`respondent`**: Reference to `User`.
- **`optionIndex`**: Number (Identifies which option the respondent selected).

> **Schema Workarounds & Statics**: 
> Instead of mapping an entire submission as one hefty document, the `ResponseSchema` saves each **question's answer uniquely**. For aggregation, `ResponseSchema.statics.getResult`, `getParticipants` and `getAnalytics` use heavily optimized MongoDB **`$aggregate` pipelines** to group by `qid` and `optionIndex`, easily summing up total responses and distributing charts safely.

---

## RESTful APIs

### Authentication (`/api/auth`)
*All inputs undergo Joi DTO validation via `validate.middleware.js`.*
- **`POST /register`**: Registers a new User (hashes password) based on `RegisterDto`.
- **`POST /login`**: Logs in the user and signs JWT tokens, returning cookies based on `LoginDto`.
- **`POST /logout`**: Clears the active session tokens. (Requires `authenticate` middleware).
- **`POST /refresh`**: Refreshes the short-lived access JWT using a valid refresh token.

### Poll Information & Analytics (`/api/poll`)
*Routes are protected with the `authenticate` middleware.*
- **`GET /form?id=<poll_id>`**: Returns the poll if valid and active. If expired but `isResultPublished` is true, automatically returns the public analytics workaround.
- **`GET /participants?id=<poll_id>`**: Evaluates and returns the total number of unique users who've participated.
- **`GET /analytics?id=<poll_id>`**: Retrieves calculated analytics (groupings of option selects counts).
- **`GET /summary?id=<poll_id>`**: Returns a unified summary of user interactions with the target poll.
- **`GET /getAll`**: Retrieves all polls created by the authenticated user.

### Poll Actions (`/api/user`)
*Handles creation & modifications. Requires `authenticate` middleware.*
- **`POST /create`**: Formats and triggers the generation of a new Poll (based on `PollDto`).
- **`POST /submit?id=<poll_id>`**: Expects array of responses (`ResponseDto`). Mass-inserts individual choice indexes referring directly to the question array (`insertMany` workaround to avoid loop timeouts).
- **`POST /delete?id=<poll_id>`**: Removes the targeted poll natively, and importantly performs a cascade `deleteMany` cleanup process on connected submissions inside the Response collection.
- **`POST /publish?id=<poll_id>`**: Toggles `isResultPublished: true` to make analytics viewable even post-expiration.

---

## Setup & Running Locally

The backend relies on the latest Node features (`v18.11+` recommended).

1. **Install Dependencies**:
   ```bash
   cd Backend
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the root `Backend` directory containing mapping parameters similar to:
   ```env
   PORT=3000
   FRONTEND_URL=http://localhost:5173
   # Important DB & JWT credentials (referenced by db.js & jwt utilities)
   MONGO_URI=your_cluster_uri
   ACCESS_TOKEN_SECRET=...
   REFRESH_TOKEN_SECRET=...
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   *Note: This utilizes Node's built-in native watcher feature (`node --watch server.js`) eliminating the need for `nodemon` package.*
