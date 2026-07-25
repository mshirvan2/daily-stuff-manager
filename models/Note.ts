import mongoose, { Schema, model, models } from "mongoose";

export interface INote {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  title: string;
  content: string;
  pinned: boolean;
  favorite: boolean;
  createdAt: number;
  updatedAt: number;
}

const NoteSchema = new Schema<INote>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, default: "" },
  content: { type: String, default: "" },
  pinned: { type: Boolean, default: false },
  favorite: { type: Boolean, default: false },
  createdAt: { type: Number, default: () => Date.now() },
  updatedAt: { type: Number, default: () => Date.now() },
});

export const Note = models.Note || model<INote>("Note", NoteSchema);
