# Employee Management System (Next.js)

Attendance with **selfie + live location**, daily tasks, task assignment, leaves, holidays,
announcements and automatic **hours & salary calculation**. Installable as a phone app (PWA).

## Run
```bash
npm install          # first time only
npx prisma db push   # creates/updates the database tables
npm run dev          # http://localhost:3000
# production: npm run build && npm start
```

**Super Admin login:** values of `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` in `.env`
(account is created automatically on first login).
Employees log in with their **email or Employee ID** + the password the admin set.

## Database
This project has its **own separate database** (`prisma/ems.db`), fully independent of Mappingg.
For online hosting (Vercel etc.) create a **new empty** PostgreSQL database, then:
1. put its URL in `DATABASE_URL`
2. change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma`
3. run `npx prisma db push`

## Features
**Super Admin:** live dashboard (present / late / absent / on leave, selfies, location),
create / edit / disable employees with login ID + password, salary (monthly or hourly),
office time, late grace, half-day rule, working days, holidays, office location + geofence radius,
assign tasks to one or many employees, approve leaves, attendance register with selfie & map,
manual corrections, monthly salary & hours report, CSV export, announcements,
monthly attendance sheet (muster roll: P / HD / L / A / WO / H grid), bonus / deduction / salary advance
per month, printable payslips (Print / Save PDF), yearly leave limits with balance tracking.

**Employee:** check-in / check-out with front-camera selfie and live GPS location (map shown),
today's plan becomes daily tasks, live worked-hours timer, my tasks, attendance history,
monthly hours & estimated salary, own payslip, leave requests with remaining balance,
change password, install app.

## Notes
- Camera and location only work over **HTTPS** (or `localhost`). Deploy with HTTPS for phones.
- Forgotten check-outs are auto-closed at office end time for hour calculation.
- `GOOGLE_MAPS_API_KEY` is used for address lookup; falls back to OpenStreetMap if unavailable.
