import { cache } from "react";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { PROFILE_COOKIE } from "./profile-cookie";
import type { Profile } from "./types";

export const getProfilesAndCurrent = cache(
  async (): Promise<{
    profiles: Profile[];
    current: Profile | null;
    error: string | null;
  }> => {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      return { profiles: [], current: null, error: error.message };
    }

    const profiles = (data ?? []) as Profile[];
    const cookieId = cookieStore.get(PROFILE_COOKIE)?.value;
    const current =
      profiles.find((p) => p.id === cookieId) ?? profiles[0] ?? null;

    return { profiles, current, error: null };
  }
);
