import Shell from "@/components/Shell";

const items = [
  { href: "/employee", label: "Home", icon: "🏠" },
  { href: "/employee/tasks", label: "Tasks", icon: "✅" },
  { href: "/employee/attendance", label: "History", icon: "🗓️" },
  { href: "/employee/leaves", label: "Leaves", icon: "🌴" },
  { href: "/employee/profile", label: "Profile", icon: "👤" },
];

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <Shell items={items} role="EMPLOYEE">
      {children}
    </Shell>
  );
}
