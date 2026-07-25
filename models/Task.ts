import mongoose, { Schema, model, models } from "mongoose";

export interface ITask {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate: string | null;
  color: string;
  createdAt: number;
}

const TaskSchema = new Schema<ITask>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  status: {
    type: String,
    enum: ["todo", "in-progress", "done"],
    default: "todo",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  dueDate: { type: String, default: null },
  color: { type: String, default: "#6366f1" },
  createdAt: { type: Number, default: () => Date.now() },
});

export const Task = models.Task || model<ITask>("Task", TaskSchema);
