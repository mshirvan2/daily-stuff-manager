import type { ITask } from "@/models/Task";
import type { INote } from "@/models/Note";
import type { Task, Note } from "@/types";

export function serializeTask(doc: ITask): Task {
  return {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    status: doc.status,
    priority: doc.priority,
    dueDate: doc.dueDate,
    color: doc.color,
    createdAt: doc.createdAt,
  };
}

export function serializeNote(doc: INote): Note {
  return {
    id: doc._id.toString(),
    title: doc.title,
    content: doc.content,
    pinned: doc.pinned,
    favorite: doc.favorite,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
