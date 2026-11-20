import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "./db";
import { COOKIE, verifySession, type Session } from "./session";

export async function getSession(): Promise<Session | null> {
  const s = await verifySession((await cookies()).get(COOKIE)?.value);
  if (!s) return null;
  // make sure user still exists & is active
  const u = await prisma.user.findUnique({ where: { id: s.id }, select: { active: true, role: true, name: true } });
  if (!u || !u.active) return null;
  return { id: s.id, role: u.role, name: u.name };
}

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function requireUser(role?: "ADMIN" | "EMPLOYEE") {
  const s = await getSession();
  if (!s) throw new HttpError(401, "Please login again");
  if (role && s.role !== role) throw new HttpError(403, "Not allowed");
  return s;
}

/** Wrap a route handler: converts thrown errors into JSON responses */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handler<A extends any[]>(fn: (...args: A) => Promise<Response>) {
  return async (...args: A) => {
    try {
      return await fn(...args);
    } catch (e) {
      if (e instanceof HttpError) return NextResponse.json({ error: e.message }, { status: e.status });
      console.error(e);
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
  };
}

export const ok = (data: unknown = { ok: true }) => NextResponse.json(data);
export function bad(msg: string): never {
  throw new HttpError(400, msg);
}
