import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable. Add it to .env.local");
}

export const AUTH_COOKIE = "token";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface JwtPayload {
  userId: string;
}

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET!, { expiresIn: MAX_AGE });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET!) as JwtPayload;
  } catch {
    return null;
  }
}

/** Write the JWT into an httpOnly cookie. */
export async function setAuthCookie(token: string) {
  const store = await cookies();
  store.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearAuthCookie() {
  const store = await cookies();
  store.delete(AUTH_COOKIE);
}

/** Returns the authenticated user's id from the request cookie, or null. */
export async function getUserId(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  return payload?.userId ?? null;
}
