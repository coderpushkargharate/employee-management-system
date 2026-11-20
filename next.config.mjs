/** @type {import('next').NextConfig} */
const nextConfig = {
  // expose the office timezone to client components
  env: { NEXT_PUBLIC_APP_TIMEZONE: process.env.APP_TIMEZONE || "Asia/Kolkata" },
};
export default nextConfig;
