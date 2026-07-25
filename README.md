# Daily Stuff Manager

A full-stack tasks & notes manager built with **Next.js 15**, **TypeScript**, **MongoDB (Mongoose)**, and **JWT authentication**. Each user has their own account; all data lives in MongoDB (no localStorage). Features a Kanban board with drag & drop, rich notes, a live dashboard, command menu, dark/light mode, and a polished glassmorphism UI.

## Tech Stack

- **Frontend:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Framer Motion, lucide-react, sonner
- **Backend:** Next.js Route Handlers (`app/api/**`), MongoDB via Mongoose
- **Auth:** JWT stored in an httpOnly cookie, passwords hashed with bcrypt

## Prerequisites

- Node.js 20+
- A MongoDB database — local (`mongodb://127.0.0.1:27017/...`) or [MongoDB Atlas](https://www.mongodb.com/atlas)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment** — copy the example and fill in your values:

   ```bash
   cp .env.example .env.local
   ```

   ```env
   MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/daily-stuff-manager
   JWT_SECRET=<a long random string>
   ```

   Generate a secret with:

   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```

3. **Run**

   ```bash
   npm run dev        # http://localhost:3000
   ```

   ```bash
   npm run build      # production build
   npm run start      # serve production build
   ```

## Seeding Sample Data

Add sample tasks & notes to an existing user:

```bash
npm run seed <userId>
```

If `<userId>` is omitted, the default id in `scripts/seed.mjs` is used. Reads `MONGODB_URI` from `.env.local`.

## API

All backend code lives under [`app/api/`](app/api/). Every `/api/tasks` and `/api/notes` route requires a valid JWT cookie and is scoped to the authenticated user.

| Method | Endpoint              | Auth | Description                          |
| ------ | --------------------- | ---- | ------------------------------------ |
| POST   | `/api/auth/register`  | —    | Create account, sets JWT cookie      |
| POST   | `/api/auth/login`     | —    | Log in, sets JWT cookie              |
| POST   | `/api/auth/logout`    | ✓    | Clears the JWT cookie                |
| GET    | `/api/auth/me`        | ✓    | Returns the current user             |
| GET    | `/api/tasks`          | ✓    | List the user's tasks                |
| POST   | `/api/tasks`          | ✓    | Create a task                        |
| PATCH  | `/api/tasks/:id`      | ✓    | Update a task                        |
| DELETE | `/api/tasks/:id`      | ✓    | Delete a task                        |
| GET    | `/api/notes`          | ✓    | List the user's notes                |
| POST   | `/api/notes`          | ✓    | Create a note                        |
| PATCH  | `/api/notes/:id`      | ✓    | Update a note (pin/favorite/edit)    |
| DELETE | `/api/notes/:id`      | ✓    | Delete a note                        |

### Auth flow

- Register/login hash-verify the password (bcrypt) and issue a JWT signed with `JWT_SECRET`.
- The token is stored in an **httpOnly, sameSite=lax** cookie named `token` (7-day expiry) — never in localStorage.
- Protected routes read the cookie, verify the JWT, and resolve the user id server-side.

## Features

- **Accounts** — register, log in, log out; each user sees only their own data.
- **Kanban Board** — Todo / In Progress / Done, drag & drop, add/edit/delete, priority, due date, color label, per-column counter, search, priority filter.
- **Notes** — create, edit, delete, pin, favorite, search, created & updated timestamps.
- **Dashboard** — total tasks, completed, pending, notes count, completion progress bar.
- **Persistence** — everything stored in MongoDB, scoped per user, with optimistic UI updates.
- **UI** — glassmorphism, gradient accents, Framer Motion transitions, responsive, empty states, loading skeletons.
- **Extras** — dark/light mode, command menu (⌘/Ctrl + K), keyboard shortcuts, toast notifications, confirm-before-delete.

## Keyboard Shortcuts

| Key         | Action                    |
| ----------- | ------------------------- |
| ⌘/Ctrl + K  | Open command menu         |
| 1 / 2 / 3   | Dashboard / Board / Notes |
| N           | New task                  |
| Esc         | Close dialog / menu       |

## Folder Structure

```
.
├── app/
│   ├── api/                  # ── all backend code ──
│   │   ├── auth/
│   │   │   ├── register/route.ts
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── me/route.ts
│   │   ├── tasks/
│   │   │   ├── route.ts       # GET (list), POST (create)
│   │   │   └── [id]/route.ts  # PATCH, DELETE
│   │   └── notes/
│   │       ├── route.ts       # GET (list), POST (create)
│   │       └── [id]/route.ts  # PATCH, DELETE
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                   # button, input, card, dialog, ...
│   ├── tasks/                # kanban-board, kanban-column, task-card, task-dialog
│   ├── notes/                # notes-view, note-card, note-dialog
│   ├── dashboard/            # dashboard-view
│   ├── auth-provider.tsx     # client auth context (login/register/logout)
│   ├── auth-screen.tsx       # login / register UI
│   ├── app-shell.tsx         # gates the app behind auth
│   ├── store-provider.tsx
│   └── ...
├── hooks/
│   ├── useTasks.ts           # API-backed, optimistic updates
│   └── useNotes.ts           # API-backed, optimistic updates
├── lib/
│   ├── mongodb.ts            # cached Mongoose connection
│   ├── auth.ts               # JWT sign/verify + cookie helpers
│   ├── serialize.ts          # Mongo doc → client shape
│   └── utils.ts
├── models/                   # Mongoose schemas
│   ├── User.ts
│   ├── Task.ts
│   └── Note.ts
├── scripts/
│   └── seed.mjs              # sample-data seeder
├── types/
│   └── index.ts
├── .env.example
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```
