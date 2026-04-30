"use client";

import { Expense } from "@/lib/types";
import { formatINR, formatDate } from "@/lib/format";
import { getCategory } from "@/lib/categories";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export function ExpenseRow({ expense }: { expense: Expense }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [deleting, setDeleting] = useState(false);
  const cat = getCategory(expense.category);

  async function onDelete() {
    const ok = window.confirm(
      `Delete this entry?\n\n${expense.description} — ${formatINR(Number(expense.amount))}`
    );
    if (!ok) return;
    setDeleting(true);
    const { error } = await supabase.from("expenses").delete().eq("id", expense.id);
    if (error) {
      window.alert("Failed to delete: " + error.message);
      setDeleting(false);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex items-start gap-3 py-3">
      <div className="text-2xl leading-none pt-0.5">{cat?.icon ?? "📝"}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <div className="truncate font-medium text-slate-900">
            {expense.description}
          </div>
          <div className="whitespace-nowrap font-semibold text-slate-900">
            {formatINR(Number(expense.amount))}
          </div>
        </div>
        <div className="mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5 text-xs text-slate-500">
          <span>{formatDate(expense.date)}</span>
          <span>·</span>
          <span>
            {expense.category}
            {expense.subcategory ? ` › ${expense.subcategory}` : ""}
          </span>
          {expense.paid_to && (
            <>
              <span>·</span>
              <span>To: {expense.paid_to}</span>
            </>
          )}
          {expense.payment_mode && (
            <>
              <span>·</span>
              <span>{expense.payment_mode}</span>
            </>
          )}
        </div>
        {expense.notes && (
          <div className="mt-1 text-xs text-slate-600">{expense.notes}</div>
        )}
      </div>
      <button
        onClick={onDelete}
        disabled={deleting}
        className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
        title="Delete entry"
        aria-label="Delete entry"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        </svg>
      </button>
    </div>
  );
}
