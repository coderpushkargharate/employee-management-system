// Edge-safe JWT helpers (used by middleware and server code)
import { SignJWT, jwtVerify } from "jose";

export const COOKIE = "ems_session";
export type Session = { id: string; role: "ADMIN" | "EMPLOYEE"; name: string };

const key = () => new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret-change-me");

export async function signSession(s: Session) {
  return new SignJWT(s).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("30d").sign(key());
}

export async function verifySession(token?: string): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    return { id: payload.id as string, role: payload.role as Session["role"], name: payload.name as string };
  } catch {
    return null;
  }
}
