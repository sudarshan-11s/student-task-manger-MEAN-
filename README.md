# Student Task Manager

A simple MEAN stack task manager with signup, login, JWT authentication, searchable tasks, editing, deleting, and completed/pending status toggles.

## Project Structure

```text
backend/   Node.js + Express + MongoDB + Mongoose API
frontend/  Angular + TypeScript UI
```

## Prerequisites

Install these first:

- Node.js
- MongoDB running locally, or a MongoDB Atlas connection string
- Angular CLI, or use `npx ng`

## Backend Setup

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Update `backend/.env` if needed:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/student-task-manager
JWT_SECRET=change_this_secret
```

The API runs at:

```text
http://localhost:5000
```

## Backend API

Auth:

```text
POST /api/auth/signup
POST /api/auth/login
```

Tasks require a JWT bearer token:

```text
GET    /api/tasks?search=math
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

Task schema:

```js
{
  title: String,
  completed: Boolean,
  user: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
npm start
```

The Angular app runs at:

```text
http://localhost:4200
```

## How To Use

1. Start MongoDB.
2. Start the backend with `npm run dev`.
3. Start the frontend with `npm start`.
4. Sign up, then add, search, edit, complete, and delete tasks.

## Main Files

Backend:

- `backend/server.js`
- `backend/models/User.js`
- `backend/models/Task.js`
- `backend/routes/authRoutes.js`
- `backend/routes/taskRoutes.js`
- `backend/middleware/authMiddleware.js`

Frontend:

- `frontend/src/app/app.module.ts`
- `frontend/src/app/models/task.ts`
- `frontend/src/app/models/user.ts`
- `frontend/src/app/services/auth.service.ts`
- `frontend/src/app/services/task.service.ts`
- `frontend/src/app/interceptors/auth.interceptor.ts`
- `frontend/src/app/components/task-manager/task-manager.component.ts`
- `frontend/src/app/components/task-manager/task-manager.component.html`
- `frontend/src/app/components/task-manager/task-manager.component.css`
