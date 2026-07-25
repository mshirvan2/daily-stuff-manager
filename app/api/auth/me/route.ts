import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { getUserId } from "@/lib/auth";

export async function GET() {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  await connectToDatabase();
  const user = await User.findById(userId).select("name email");
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user: { id: user._id.toString(), name: user.name, email: user.email },
  });
}
