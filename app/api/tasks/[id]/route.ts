import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Task } from "@/models/Task";
import { getUserId } from "@/lib/auth";
import { serializeTask } from "@/lib/serialize";

const EDITABLE = ["title", "description", "status", "priority", "dueDate", "color"] as const;

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();

    const patch: Record<string, unknown> = {};
    for (const key of EDITABLE) {
      if (key in body) patch[key] = body[key];
    }

    await connectToDatabase();
    const task = await Task.findOneAndUpdate({ _id: id, user: userId }, patch, {
      new: true,
    });
    if (!task) return NextResponse.json({ error: "Task not found." }, { status: 404 });

    return NextResponse.json({ task: serializeTask(task) });
  } catch (err) {
    console.error("update task error", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectToDatabase();
  const result = await Task.findOneAndDelete({ _id: id, user: userId });
  if (!result) return NextResponse.json({ error: "Task not found." }, { status: 404 });

  return NextResponse.json({ ok: true });
}
