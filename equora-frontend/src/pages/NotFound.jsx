import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="font-display text-5xl font-semibold brand-gradient-text">404</p>
      <p className="text-muted">This page doesn't exist.</p>
      <Link to="/dashboard" className="mt-2 text-sm font-medium text-brand-teal hover:underline">
        Back to dashboard
      </Link>
    </div>
  );
}
