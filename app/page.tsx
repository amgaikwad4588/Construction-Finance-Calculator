import Link from "next/link";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { CATEGORIES } from "@/lib/categories";
import type { Expense } from "@/lib/types";
import { StatCard } from "@/components/StatCard";
import { CategoryBar } from "@/components/CategoryBar";
import { AddExpenseForm } from "@/components/AddExpenseForm";
import { ExpenseRow } from "@/components/ExpenseRow";
import { CreateFirstProfile } from "@/components/CreateFirstProfile";
import { formatINR } from "@/lib/format";
import { getProfilesAndCurrent } from "@/lib/profile";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const { profiles, current, error: profileError } = await getProfilesAndCurrent();

  if (profileError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
        <p className="font-semibold">Couldn&rsquo;t load profiles.</p>
        <p className="mt-1">{profileError}</p>
        <p className="mt-2 text-red-700">
          Have you run <code className="rounded bg-white px-1">supabase-schema.sql</code> in
          your Supabase SQL editor? It creates the <code className="rounded bg-white px-1">profiles</code>{" "}
          and <code className="rounded bg-white px-1">expenses</code> tables.
        </p>
      </div>
    );
  }

  if (profiles.length === 0 || !current) {
    return <CreateFirstProfile />;
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("profile_id", current.id)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
        <p className="font-semibold">Couldn&rsquo;t load expenses.</p>
        <p className="mt-1">{error.message}</p>
      </div>
    );
  }

  const list = (data ?? []) as Expense[];
  const total = list.reduce((s, e) => s + Number(e.amount), 0);
  const count = list.length;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonth = list
    .filter((e) => new Date(e.date) >= monthStart)
    .reduce((s, e) => s + Number(e.amount), 0);

  const byCat = new Map<string, { total: number; count: number }>();
  for (const e of list) {
    const cur = byCat.get(e.category) ?? { total: 0, count: 0 };
    cur.total += Number(e.amount);
    cur.count += 1;
    byCat.set(e.category, cur);
  }
  const catTotals = CATEGORIES.map((c) => ({
    ...c,
    total: byCat.get(c.name)?.total ?? 0,
    count: byCat.get(c.name)?.count ?? 0,
  }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);

  const recent = list.slice(0, 6);

  return (
    <div className="space-y-6">
      <div
        className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm"
        style={{ borderLeftColor: current.color, borderLeftWidth: 5 }}
      >
        <div className="text-2xl">{current.icon}</div>
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wide text-slate-500">
            Active profile
          </div>
          <div className="text-lg font-semibold text-slate-900">{current.name}</div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Total spent" value={formatINR(total)} />
        <StatCard
          label="This month"
          value={formatINR(thisMonth)}
          hint={now.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        />
        <StatCard label="Total entries" value={count.toString()} />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Add new expense</h2>
        <AddExpenseForm profileId={current.id} />
      </section>

      {catTotals.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">By category</h2>
          <div className="space-y-3">
            {catTotals.map((c) => (
              <CategoryBar
                key={c.name}
                icon={c.icon}
                name={c.name}
                total={c.total}
                count={c.count}
                max={catTotals[0].total}
              />
            ))}
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent entries</h2>
            <Link
              href="/expenses"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recent.map((e) => (
              <ExpenseRow key={e.id} expense={e} />
            ))}
          </div>
        </section>
      )}

      {list.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          <p className="text-base">No expenses yet for {current.name}.</p>
          <p className="mt-1 text-sm">Add your first one using the form above.</p>
        </div>
      )}
    </div>
  );
}
