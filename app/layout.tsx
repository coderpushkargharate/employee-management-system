import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastHost } from "@/components/ui";
import SWRegister from "@/components/SWRegister";

export const metadata: Metadata = {
  title: "Employee Management System",
  description: "Attendance, selfie check-in, tasks, leaves and payroll",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "EMS", statusBarStyle: "default" },
  icons: { icon: "/icon-192.png", apple: "/icon-192.png" },
};

export const viewport: Viewport = { themeColor: "#4f46e5", width: "device-width", initialScale: 1, maximumScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToastHost />
        <SWRegister />
      </body>
    </html>
  );
}
