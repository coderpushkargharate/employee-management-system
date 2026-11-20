import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Employee Management System",
    short_name: "EMS",
    description: "Attendance with selfie & live location, tasks, leaves and payroll",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#4f46e5",
    orientation: "portrait",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
