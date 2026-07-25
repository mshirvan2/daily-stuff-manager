/**
 * Seed sample tasks & notes for a user.
 *
 * Usage:
 *   node --env-file=.env.local scripts/seed.mjs <userId>
 *
 * If <userId> is omitted, DEFAULT_USER_ID below is used.
 * Reads MONGODB_URI from the environment (.env.local).
 */
import mongoose from "mongoose";

const DEFAULT_USER_ID = "6a623073219911d27b30daa8";

const userId = process.argv[2] || DEFAULT_USER_ID;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI. Run with: node --env-file=.env.local scripts/seed.mjs");
  process.exit(1);
}
if (!mongoose.Types.ObjectId.isValid(userId)) {
  console.error(`Invalid user id: ${userId}`);
  process.exit(1);
}

const TaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: String,
  description: { type: String, default: "" },
  status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  dueDate: { type: String, default: null },
  color: { type: String, default: "#6366f1" },
  createdAt: { type: Number, default: () => Date.now() },
});

const NoteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, default: "" },
  content: { type: String, default: "" },
  pinned: { type: Boolean, default: false },
  favorite: { type: Boolean, default: false },
  createdAt: { type: Number, default: () => Date.now() },
  updatedAt: { type: Number, default: () => Date.now() },
});

const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);
const Note = mongoose.models.Note || mongoose.model("Note", NoteSchema);

const now = Date.now();
const day = 24 * 60 * 60 * 1000;
const iso = (offsetDays) => new Date(now + offsetDays * day).toISOString().slice(0, 10);

const sampleTasks = [
  { title: "Plan the week", description: "Outline top 3 priorities for the week.", status: "todo", priority: "high", dueDate: iso(1), color: "#6366f1" },
  { title: "Design review", description: "Review the new dashboard mockups with the team.", status: "todo", priority: "medium", dueDate: iso(2), color: "#ec4899" },
  { title: "Fix login bug", description: "Users report being logged out too early.", status: "in-progress", priority: "high", dueDate: iso(0), color: "#ef4444" },
  { title: "Write API docs", description: "Document the auth and tasks endpoints.", status: "in-progress", priority: "medium", dueDate: iso(3), color: "#f59e0b" },
  { title: "Grocery shopping", description: "Milk, eggs, coffee, fruit.", status: "todo", priority: "low", dueDate: iso(1), color: "#10b981" },
  { title: "Set up MongoDB Atlas", description: "Create a free cluster and connect the app.", status: "done", priority: "medium", dueDate: iso(-2), color: "#3b82f6" },
  { title: "Deploy to Vercel", description: "Push the first production build.", status: "done", priority: "high", dueDate: iso(-1), color: "#8b5cf6" },
];

const sampleNotes = [
  { title: "Welcome 👋", content: "This is your Daily Stuff Manager. Create tasks on the board and jot notes here.", pinned: true, favorite: true },
  { title: "Project ideas", content: "1. Habit tracker\n2. Reading list\n3. Weekly meal planner", pinned: false, favorite: true },
  { title: "Meeting notes", content: "Standup: shipping auth this week, notes feature next sprint.", pinned: false, favorite: false },
  { title: "Shortcuts", content: "Cmd/Ctrl+K for command menu. 1/2/3 to switch tabs. N for new task.", pinned: true, favorite: false },
];

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log(`Connected. Seeding data for user ${userId}...`);

  const tasks = await Task.insertMany(
    sampleTasks.map((t, i) => ({ ...t, user: userId, createdAt: now - i * 60000 }))
  );
  const notes = await Note.insertMany(
    sampleNotes.map((n, i) => ({
      ...n,
      user: userId,
      createdAt: now - i * 60000,
      updatedAt: now - i * 60000,
    }))
  );

  console.log(`✓ Inserted ${tasks.length} tasks and ${notes.length} notes.`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
