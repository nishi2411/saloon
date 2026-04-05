import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="glass-panel max-w-xl p-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-700">
          Lost Route
        </p>
        <h1 className="mt-4 text-5xl text-slate-900">Page not found</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          This placeholder route does not exist yet. Head back into the main application shell.
        </p>
        <Link to="/" className="btn-primary mt-8">
          Return Home
        </Link>
      </div>
    </div>
  );
}
