import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Task } from "@/models/Task";
import { getUserId } from "@/lib/auth";
import { serializeTask } from "@/lib/serialize";

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });
  return NextResponse.json({ tasks: tasks.map(serializeTask) });
}

export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    if (!body?.title || !String(body.title).trim()) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }

    await connectToDatabase();
    const task = await Task.create({
      user: userId,
      title: String(body.title).trim(),
      description: body.description ?? "",
      status: body.status ?? "todo",
      priority: body.priority ?? "medium",
      dueDate: body.dueDate ?? null,
      color: body.color ?? "#6366f1",
    });

    return NextResponse.json({ task: serializeTask(task) }, { status: 201 });
  } catch (err) {
    console.error("create task error", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
