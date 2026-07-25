import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { signToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const valid = await bcrypt.compare(String(password), user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = signToken({ userId: user._id.toString() });
    await setAuthCookie(token);

    return NextResponse.json({
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("login error", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
