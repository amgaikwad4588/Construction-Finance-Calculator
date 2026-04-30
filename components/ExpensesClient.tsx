"use client";

import { Expense } from "@/lib/types";
import { CATEGORIES } from "@/lib/categories";
import { ExpenseRow } from "./ExpenseRow";
import { formatINR } from "@/lib/format";
import { useMemo, useState } from "react";

export function ExpensesClient({ initial }: { initial: Expense[] }) {
  const [category, setCategory] = useState<string>("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return initial.filter((e) => {
      if (category && e.category !== category) return false;
      if (from && e.date < from) return false;
      if (to && e.date > to) return false;
      if (q) {
        const needle = q.toLowerCase();
        const hay = `${e.description} ${e.paid_to ?? ""} ${e.notes ?? ""} ${
          e.subcategory ?? ""
        }`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [initial, category, from, to, q]);

  const total = filtered.reduce((s, e) => s + Number(e.amount), 0);

  function exportCSV() {
    const headers = [
      "Date",
      "Category",
      "Subcategory",
      "Description",
      "Paid To",
      "Amount (INR)",
      "Payment Mode",
      "Notes",
    ];
    const rows = filtered.map((e) => [
      e.date,
      e.category,
      e.subcategory ?? "",
      e.description,
      e.paid_to ?? "",
      Number(e.amount).toFixed(2),
      e.payment_mode ?? "",
      e.notes ?? "",
    ]);
    const csv = [headers, ...rows]
      .map((r) =>
        r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    const blob = new Blob(["﻿" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cost-diary-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function clearFilters() {
    setCategory("");
    setFrom("");
    setTo("");
    setQ("");
  }

  const hasFilters = !!(category || from || to || q);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            label="Search"
            value={q}
            onChange={setQ}
            placeholder="Description, vendor, notes..."
          />
          <Select label="Category" value={category} onChange={setCategory}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.icon} {c.name}
              </option>
            ))}
          </Select>
          <Input label="From" type="date" value={from} onChange={setFrom} />
          <Input label="To" type="date" value={to} onChange={setTo} />
        </div>
        {hasFilters && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={clearFilters}
              className="text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500">
            {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
            {hasFilters && initial.length !== filtered.length
              ? ` (of ${initial.length})`
              : ""}
          </div>
          <div className="text-2xl font-semibold text-slate-900">
            {formatINR(total)}
          </div>
        </div>
        <button
          onClick={exportCSV}
          disabled={filtered.length === 0}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50 disabled:opacity-50"
        >
          Export CSV
        </button>
      </div>

      {filtered.length > 0 ? (
        <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white px-5 shadow-sm">
          {filtered.map((e) => (
            <ExpenseRow key={e.id} expense={e} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          {initial.length === 0
            ? "No entries yet — add one from the dashboard."
            : "No entries match your filters."}
        </div>
      )}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
      >
        {children}
      </select>
    </label>
  );
}
