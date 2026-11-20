"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Payslip from "@/components/Payslip";
import { Empty, Loading } from "@/components/ui";
import { dateKey } from "@/lib/time";

function Inner() {
  const q = useSearchParams();
  const userId = q.get("userId");
  const month = q.get("month") || dateKey().slice(0, 7);
  if (!userId) return <Empty>Select an employee from the Salary page.</Empty>;
  return (
    <>
      <Link href={`/admin/payroll`} className="mb-3 inline-block text-sm font-semibold text-brand-600 print:hidden">
        ← Salary &amp; Hours
      </Link>
      <Payslip month={month} userId={userId} />
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Inner />
    </Suspense>
  );
}
