import { formatINR } from "@/lib/format";

export function CategoryBar({
  icon,
  name,
  total,
  max,
  count,
}: {
  icon: string;
  name: string;
  total: number;
  max: number;
  count: number;
}) {
  const pct = max > 0 ? Math.max(2, (total / max) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-800">
          <span className="mr-1.5">{icon}</span>
          {name}
          <span className="ml-2 text-xs text-slate-500">{count} entr{count === 1 ? "y" : "ies"}</span>
        </span>
        <span className="font-semibold text-slate-900">{formatINR(total)}</span>
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full bg-slate-900 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
