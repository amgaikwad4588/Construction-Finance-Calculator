"use client";

import { Profile } from "@/lib/types";
import {
  setProfileCookie,
  clearProfileCookie,
  PROFILE_COLORS,
  PROFILE_ICONS,
} from "@/lib/profile-cookie";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type View = "list" | "create" | "manage";

export function ProfileSwitcher({
  profiles,
  currentId,
}: {
  profiles: Profile[];
  currentId: string | null;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("list");
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(PROFILE_ICONS[0]);
  const [color, setColor] = useState(PROFILE_COLORS[0].value);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const current = profiles.find((p) => p.id === currentId) ?? profiles[0];

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  function close() {
    setOpen(false);
    setView("list");
    setError(null);
  }

  function switchTo(id: string) {
    setProfileCookie(id);
    close();
    router.refresh();
  }

  async function createProfile(e: React.FormEvent) {
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
    setName("");
    setIcon(PROFILE_ICONS[0]);
    setColor(PROFILE_COLORS[0].value);
    close();
    router.refresh();
  }

  async function deleteProfile(p: Profile) {
    const ok = window.confirm(
      `Delete profile "${p.name}"?\n\nIts expenses will be kept but unassigned (you can reassign them in Supabase). This cannot be undone.`
    );
    if (!ok) return;
    setBusy(true);
    const { error: delErr } = await supabase
      .from("profiles")
      .delete()
      .eq("id", p.id);
    setBusy(false);
    if (delErr) {
      window.alert("Failed: " + delErr.message);
      return;
    }
    if (p.id === currentId) clearProfileCookie();
    router.refresh();
  }

  if (profiles.length === 0) {
    return null;
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => {
          setOpen((o) => !o);
          setView("list");
        }}
        className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
        style={current ? { borderLeftColor: current.color, borderLeftWidth: 4 } : {}}
      >
        <span className="text-base leading-none">{current?.icon ?? "🏠"}</span>
        <span className="max-w-[10rem] truncate">{current?.name ?? "Pick profile"}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-slate-400"
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-1 w-72 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
          {view === "list" && (
            <div className="py-1">
              <div className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Switch profile
              </div>
              <div className="max-h-64 overflow-y-auto">
                {profiles.map((p) => {
                  const active = p.id === current?.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => switchTo(p.id)}
                      className={`flex w-full items-center gap-2.5 px-3 py-2 text-sm hover:bg-slate-50 ${
                        active ? "bg-slate-50 font-medium" : ""
                      }`}
                    >
                      <span
                        className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: p.color }}
                      />
                      <span className="text-base leading-none">{p.icon}</span>
                      <span className="flex-1 truncate text-left">{p.name}</span>
                      {active && (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          className="text-emerald-600"
                        >
                          <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="border-t border-slate-100">
                <button
                  onClick={() => setView("create")}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <span className="text-base leading-none">＋</span>
                  Create new profile
                </button>
                {profiles.length > 0 && (
                  <button
                    onClick={() => setView("manage")}
                    className="flex w-full items-center gap-2 border-t border-slate-100 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Manage profiles
                  </button>
                )}
              </div>
            </div>
          )}

          {view === "create" && (
            <form onSubmit={createProfile} className="p-3">
              <div className="mb-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className="text-xs font-medium text-slate-500 hover:text-slate-900"
                >
                  ← Back
                </button>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  New profile
                </span>
              </div>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-600">Name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My House / Brother's house / ..."
                  autoFocus
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />
              </label>
              <div className="mt-3">
                <span className="mb-1 block text-xs font-medium text-slate-600">Icon</span>
                <div className="flex flex-wrap gap-1">
                  {PROFILE_ICONS.map((i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setIcon(i)}
                      className={`flex h-7 w-7 items-center justify-center rounded text-base hover:bg-slate-100 ${
                        icon === i ? "bg-slate-200" : ""
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-3">
                <span className="mb-1 block text-xs font-medium text-slate-600">Color</span>
                <div className="flex flex-wrap gap-1.5">
                  {PROFILE_COLORS.map((c) => (
                    <button
                      type="button"
                      key={c.value}
                      onClick={() => setColor(c.value)}
                      title={c.name}
                      className={`h-6 w-6 rounded-full ring-offset-2 ${
                        color === c.value ? "ring-2 ring-slate-900" : ""
                      }`}
                      style={{ background: c.value }}
                    />
                  ))}
                </div>
              </div>
              {error && (
                <div className="mt-3 rounded-md bg-red-50 px-2 py-1.5 text-xs text-red-700">
                  {error}
                </div>
              )}
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {busy ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          )}

          {view === "manage" && (
            <div className="p-3">
              <div className="mb-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className="text-xs font-medium text-slate-500 hover:text-slate-900"
                >
                  ← Back
                </button>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Manage
                </span>
              </div>
              <div className="max-h-64 space-y-1 overflow-y-auto">
                {profiles.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-slate-50"
                  >
                    <span
                      className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: p.color }}
                    />
                    <span className="text-base leading-none">{p.icon}</span>
                    <span className="flex-1 truncate text-sm">{p.name}</span>
                    <button
                      onClick={() => deleteProfile(p)}
                      disabled={busy}
                      className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                      title="Delete profile"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M3 6h18" strokeLinecap="round" />
                        <path
                          d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] leading-snug text-slate-500">
                Deleting a profile keeps its expenses (unassigned). Renaming will be added later.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
