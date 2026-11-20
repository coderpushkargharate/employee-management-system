import bcrypt from "bcryptjs";
import { prisma, employeeSelect } from "@/lib/db";
import { handler, requireUser, ok, bad } from "@/lib/auth";

export const GET = handler(async () => {
  await requireUser("ADMIN");
  const list = await prisma.user.findMany({
    where: { role: "EMPLOYEE" },
    select: employeeSelect,
    orderBy: [{ active: "desc" }, { name: "asc" }],
  });
  return ok(list);
});

export const POST = handler(async (req: Request) => {
  await requireUser("ADMIN");
  const b = await req.json();
  const name = String(b.name || "").trim();
  const email = String(b.email || "").toLowerCase().trim();
  const password = String(b.password || "");
  if (!name) bad("Name is required");
  if (!/^\S+@\S+\.\S+$/.test(email)) bad("Valid email is required");
  if (password.length < 6) bad("Password must be at least 6 characters");

  let empCode = String(b.empCode || "").trim().toUpperCase();
  if (!empCode) {
    const count = await prisma.user.count({ where: { role: "EMPLOYEE" } });
    empCode = `EMP${String(count + 1).padStart(3, "0")}`;
    while (await prisma.user.findUnique({ where: { empCode } })) empCode = `EMP${Math.floor(Math.random() * 9000 + 1000)}`;
  }
  const clash = await prisma.user.findFirst({ where: { OR: [{ email }, { empCode }] } });
  if (clash) bad(clash.email === email ? "This email is already used" : "This employee ID is already used");

  const user = await prisma.user.create({
    data: {
      name, email, empCode,
      password: await bcrypt.hash(password, 10),
      phone: b.phone || null,
      designation: b.designation || null,
      department: b.department || null,
      salaryType: b.salaryType === "HOURLY" ? "HOURLY" : "MONTHLY",
      salary: Number(b.salary) || 0,
      joinDate: b.joinDate ? new Date(`${b.joinDate}T00:00:00Z`) : new Date(),
    },
    select: employeeSelect,
  });
  return ok(user);
});
