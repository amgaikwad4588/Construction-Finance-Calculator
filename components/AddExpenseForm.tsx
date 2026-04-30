"use client";

import { CATEGORIES, PAYMENT_MODES } from "@/lib/categories";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export function AddExpenseForm({ profileId }: { profileId: string }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const today = () => new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(today);
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [subcategory, setSubcategory] = useState("");
  const [description, setDescription] = useState("");
  const [paidTo, setPaidTo] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] =
    useState<(typeof PAYMENT_MODES)[number]>("Cash");
  const [notes, setNotes] = useState("");

  const subcategories = useMemo(
    () => CATEGORIES.find((c) => c.name === category)?.subcategories ?? [],
    [category]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFlash(null);

    const amt = parseFloat(amount);
    if (!amount || Number.isNaN(amt) || amt < 0) {
      setError("Enter a valid amount");
      return;
    }
    if (!description.trim()) {
      setError("Add a short description");
      return;
    }

    setSubmitting(true);
    const { error: insertError } = await supabase.from("expenses").insert({
      date,
      category,
      subcategory: subcategory || null,
      description: description.trim(),
      paid_to: paidTo.trim() || null,
      amount: amt,
      payment_mode: paymentMode || null,
      notes: notes.trim() || null,
      profile_id: profileId,
    });
    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setFlash("Saved ✓");
    setDescription("");
    setPaidTo("");
    setAmount("");
    setNotes("");
    setSubcategory("");
    router.refresh();
    setTimeout(() => setFlash(null), 2000);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
      <Field label="Date">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={inputCls}
          required
        />
      </Field>

      <Field label="Amount (₹)">
        <input
          type="number"
          step="0.01"
          min="0"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          className={inputCls}
          required
        />
      </Field>

      <Field label="Category">
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSubcategory("");
          }}
          className={inputCls}
        >
          {CATEGORIES.map((c) => (
            <option key={c.name} value={c.name}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Subcategory (optional)">
        <select
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          className={inputCls}
        >
          <option value="">—</option>
          {subcategories.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Description" full>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. 50 bags of cement, 1st slab labour, etc."
          className={inputCls}
          required
        />
      </Field>

      <Field label="Paid to">
        <input
          value={paidTo}
          onChange={(e) => setPaidTo(e.target.value)}
          placeholder="Name / shop"
          className={inputCls}
        />
      </Field>

      <Field label="Payment mode">
        <select
          value={paymentMode}
          onChange={(e) =>
            setPaymentMode(e.target.value as (typeof PAYMENT_MODES)[number])
          }
          className={inputCls}
        >
          {PAYMENT_MODES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Notes (optional)" full>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className={inputCls}
        />
      </Field>

      {error && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 sm:col-span-2">
          {error}
        </div>
      )}

      <div className="flex items-center justify-end gap-3 sm:col-span-2">
        {flash && (
          <span className="text-sm font-medium text-emerald-700">{flash}</span>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Save expense"}
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900";

function Field({
  label,
  full,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1 block text-xs font-medium text-slate-600">
        {label}
      </span>
      {children}
    </label>
  );
}
