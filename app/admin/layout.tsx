import Shell from "@/components/Shell";

const items = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/employees", label: "Employees", icon: "👥" },
  { href: "/admin/attendance", label: "Attendance", icon: "🕘" },
  { href: "/admin/tasks", label: "Tasks", icon: "✅" },
  { href: "/admin/leaves", label: "Leaves", icon: "🌴" },
  { href: "/admin/report", label: "Monthly Sheet", icon: "📅" },
  { href: "/admin/payroll", label: "Salary & Hours", icon: "💰" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Shell items={items} role="ADMIN">
      {children}
    </Shell>
  );
}
