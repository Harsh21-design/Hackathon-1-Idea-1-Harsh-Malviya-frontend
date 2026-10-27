import Link from "next/link";
import { Suspense } from "react";
import { StaffLoginForm } from "@/components/staff-login-form";

export const metadata = {
  title: "Staff sign in · Reservas Iturrieta",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f6f0] px-6 py-16">
      <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-xl sm:p-10">
        <Link href="/" className="font-serif text-2xl font-bold text-stone-900 hover:text-amber-700">
          Iturrieta OS
        </Link>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-700/80">
          Staff & owner portal
        </p>
        <h1 className="mt-8 font-serif text-3xl font-bold text-stone-900">Sign in</h1>
        <p className="mt-2 text-sm text-stone-500">
          Owner and floor staff only. Guest reservations stay on the public site.
        </p>
        <div className="mt-8">
          <Suspense fallback={<p className="text-sm text-stone-500">Loading…</p>}>
            <StaffLoginForm />
          </Suspense>
        </div>
        <p className="mt-8 text-center text-xs text-stone-400">
          <Link href="/" className="font-semibold text-stone-600 hover:underline">
            ← Back to guest site
          </Link>
        </p>
      </div>
    </div>
  );
}
