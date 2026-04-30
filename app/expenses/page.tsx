import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Expense } from "@/lib/types";
import { ExpensesClient } from "@/components/ExpensesClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ExpensesPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("expenses")
    .select("*")
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

  return <ExpensesClient initial={(data ?? []) as Expense[]} />;
}
