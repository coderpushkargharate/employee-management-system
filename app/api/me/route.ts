import bcrypt from "bcryptjs";
import { prisma, getSettings } from "@/lib/db";
import { handler, requireUser, ok, bad } from "@/lib/auth";

const publicUser = {
  id: true, empCode: true, name: true, email: true, role: true, phone: true, designation: true,
  department: true, salaryType: true, salary: true, joinDate: true, active: true,
} as const;

export const GET = handler(async () => {
  const s = await requireUser();
  const [user, settings] = await Promise.all([
    prisma.user.findUnique({ where: { id: s.id }, select: publicUser }),
    getSettings(),
  ]);
  return ok({ user, settings });
});

/** Change own password */
export const POST = handler(async (req: Request) => {
  const s = await requireUser();
  const { current, next } = await req.json();
  if (!next || String(next).length < 6) bad("New password must be at least 6 characters");
  const u = await prisma.user.findUniqueOrThrow({ where: { id: s.id } });
  if (!(await bcrypt.compare(String(current || ""), u.password))) bad("Current password is wrong");
  await prisma.user.update({ where: { id: s.id }, data: { password: await bcrypt.hash(String(next), 10) } });
  return ok();
});
