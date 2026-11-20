import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma, getSettings } from "@/lib/db";
import { handler, bad } from "@/lib/auth";
import { COOKIE, signSession } from "@/lib/session";

async function ensureSuperAdmin(email: string) {
  const adminEmail = (process.env.SUPER_ADMIN_EMAIL || "").toLowerCase().trim();
  const adminPass = process.env.SUPER_ADMIN_PASSWORD || "";
  if (!adminEmail || !adminPass || email !== adminEmail) return;
  const exists = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (exists) return;
  await prisma.user.create({
    data: {
      empCode: "ADMIN",
      name: "Super Admin",
      email: adminEmail,
      password: await bcrypt.hash(adminPass, 10),
      role: "ADMIN",
      designation: "Super Admin",
    },
  });
  await getSettings();
}

export const POST = handler(async (req: Request) => {
  const { email, password } = await req.json();
  const id = String(email || "").toLowerCase().trim();
  if (!id || !password) bad("Enter your login ID and password");
  await ensureSuperAdmin(id);

  const user = await prisma.user.findFirst({
    where: { OR: [{ email: id }, { empCode: id.toUpperCase() }] },
  });
  if (!user || !(await bcrypt.compare(String(password), user.password))) bad("Wrong login ID or password");
  if (!user.active) bad("Your account is disabled. Contact admin.");

  const token = await signSession({ id: user.id, role: user.role, name: user.name });
  const res = NextResponse.json({ role: user.role });
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
});
