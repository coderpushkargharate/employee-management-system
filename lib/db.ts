import { PrismaClient } from "@prisma/client";

const g = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = g.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") g.prisma = prisma;

export async function getSettings() {
  const s = await prisma.settings.findUnique({ where: { id: 1 } });
  return s ?? prisma.settings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
}

export const employeeSelect = {
  id: true, empCode: true, name: true, email: true, role: true, phone: true, designation: true,
  department: true, salaryType: true, salary: true, joinDate: true, active: true, createdAt: true,
} as const;
