"use client";
import { useState } from "react";
import { api, Spinner } from "@/components/ui";
import InstallButton from "@/components/InstallButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const r = await api<{ role: string }>("/api/auth/login", { body: { email, password } });
      window.location.href = r.role === "ADMIN" ? "/admin" : "/employee";
    } catch (e) {
      setErr((e as Error).message);
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center text-white">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-3xl backdrop-blur">⏱</div>
          <h1 className="text-2xl font-bold">Employee Management</h1>
          <p className="text-sm text-brand-100">Attendance · Tasks · Leaves · Salary</p>
        </div>
        <form onSubmit={submit} className="card space-y-4 !p-6">
          <div>
            <label className="label">Email or Employee ID</label>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com or EMP001" autoComplete="username" autoFocus />
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input
                className="input pr-14"
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-brand-600">
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {err && <div className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{err}</div>}
          <button className="btn-primary w-full !py-3" disabled={busy}>
            {busy && <Spinner />} Login
          </button>
          <div className="flex justify-center">
            <InstallButton />
          </div>
        </form>
      </div>
    </div>
  );
}
