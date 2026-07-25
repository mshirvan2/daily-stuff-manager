import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Note } from "@/models/Note";
import { getUserId } from "@/lib/auth";
import { serializeNote } from "@/lib/serialize";

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const notes = await Note.find({ user: userId }).sort({ createdAt: -1 });
  return NextResponse.json({ notes: notes.map(serializeNote) });
}

export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const now = Date.now();
    await connectToDatabase();
    const note = await Note.create({
      user: userId,
      title: body.title ?? "",
      content: body.content ?? "",
      pinned: false,
      favorite: false,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ note: serializeNote(note) }, { status: 201 });
  } catch (err) {
    console.error("create note error", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
