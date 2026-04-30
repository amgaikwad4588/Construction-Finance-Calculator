"use client";

import { createClient } from "@/utils/supabase/client";
import {
  setProfileCookie,
  PROFILE_COLORS,
  PROFILE_ICONS,
} from "@/lib/profile-cookie";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export function CreateFirstProfile() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [name, setName] = useState("My House");
  const [icon, setIcon] = useState(PROFILE_ICONS[0]);
  const [color, setColor] = useState(PROFILE_COLORS[0].value);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setBusy(true);
    const { data, error: insErr } = await supabase
      .from("profiles")
      .insert({ name: name.trim(), icon, color })
      .select()
      .single();
    setBusy(false);
    if (insErr || !data) {
      setError(insErr?.message ?? "Failed to create profile");
      return;
    }
    setProfileCookie(data.id);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="text-center">
        <div className="text-5xl">🏠</div>
        <h1 className="mt-3 text-xl font-semibold text-slate-900">
          Welcome to Cost Diary
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Create a profile to start tracking. You can add more profiles later for
          different people or projects.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600">
            Profile name
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My House"
            autoFocus
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          />
        </label>

        <div>
          <span className="mb-1 block text-xs font-medium text-slate-600">
            Icon
          </span>
          <div className="flex flex-wrap gap-1">
            {PROFILE_ICONS.map((i) => (
              <button
                type="button"
                key={i}
                onClick={() => setIcon(i)}
                className={`flex h-9 w-9 items-center justify-center rounded text-lg hover:bg-slate-100 ${
                  icon === i ? "bg-slate-200 ring-2 ring-slate-900" : ""
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-1 block text-xs font-medium text-slate-600">
            Color
          </span>
          <div className="flex flex-wrap gap-2">
            {PROFILE_COLORS.map((c) => (
              <button
                type="button"
                key={c.value}
                onClick={() => setColor(c.value)}
                title={c.name}
                className={`h-7 w-7 rounded-full ring-offset-2 ${
                  color === c.value ? "ring-2 ring-slate-900" : ""
                }`}
                style={{ background: c.value }}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {busy ? "Creating..." : "Create profile"}
        </button>
      </form>
    </div>
  );
}
