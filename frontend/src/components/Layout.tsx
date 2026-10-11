import { Link, NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  const link = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-1.5 text-sm font-medium ${isActive ? "bg-indigo-50 text-indigo-700" : "text-zinc-600 hover:text-zinc-900"}`;
  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-bold text-zinc-900">
            <span className="grid size-7 place-items-center rounded-lg bg-indigo-600 text-sm text-white">AI</span>
            Interview Taker
          </Link>
          <nav className="flex gap-1">
            <NavLink to="/" end className={link}>Dashboard</NavLink>
            <NavLink to="/interview/new" className={link}>New interview</NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
