import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-xl">🏠</span>
          <span>Cost Diary</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/"
            className="rounded-md px-3 py-1.5 text-slate-700 hover:bg-slate-100"
          >
            Dashboard
          </Link>
          <Link
            href="/expenses"
            className="rounded-md px-3 py-1.5 text-slate-700 hover:bg-slate-100"
          >
            All entries
          </Link>
        </nav>
      </div>
    </header>
  );
}
