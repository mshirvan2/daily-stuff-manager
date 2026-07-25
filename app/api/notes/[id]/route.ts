import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Note } from "@/models/Note";
import { getUserId } from "@/lib/auth";
import { serializeNote } from "@/lib/serialize";

const EDITABLE = ["title", "content", "pinned", "favorite"] as const;

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();

    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    for (const key of EDITABLE) {
      if (key in body) patch[key] = body[key];
    }

    await connectToDatabase();
    const note = await Note.findOneAndUpdate({ _id: id, user: userId }, patch, {
      new: true,
    });
    if (!note) return NextResponse.json({ error: "Note not found." }, { status: 404 });

    return NextResponse.json({ note: serializeNote(note) });
  } catch (err) {
    console.error("update note error", err);
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
  const result = await Note.findOneAndDelete({ _id: id, user: userId });
  if (!result) return NextResponse.json({ error: "Note not found." }, { status: 404 });

  return NextResponse.json({ ok: true });
}
