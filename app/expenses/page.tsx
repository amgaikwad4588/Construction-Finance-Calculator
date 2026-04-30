import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Expense } from "@/lib/types";
import { ExpensesClient } from "@/components/ExpensesClient";
import { getProfilesAndCurrent } from "@/lib/profile";
import { CreateFirstProfile } from "@/components/CreateFirstProfile";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ExpensesPage() {
  const { profiles, current, error: profileError } = await getProfilesAndCurrent();

  if (profileError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
        <p className="font-semibold">Couldn&rsquo;t load profiles.</p>
        <p className="mt-1">{profileError}</p>
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

  return (
    <ExpensesClient
      initial={(data ?? []) as Expense[]}
      profileName={current.name}
      profileIcon={current.icon}
      profileColor={current.color}
    />
  );
}
