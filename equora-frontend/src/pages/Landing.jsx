import { Link } from "react-router-dom";
import { ArrowLeftRight, ArrowRight, Users, Receipt, ScanLine } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-ink">
      <header className="flex items-center justify-between px-6 py-5 lg:px-12">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="text-brand-teal" size={22} />
          <span className="font-display text-xl font-semibold">Equora</span>
        </div>
        <nav className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-muted hover:text-text">
            Sign in
          </Link>
          <Link to="/register" className="btn-primary text-sm">
            Get started
          </Link>
        </nav>
      </header>

      <main className="px-6 pt-16 pb-24 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Shared costs, <span className="brand-gradient-text">settled cleanly.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted">
            Log group expenses, split them exactly how you agreed, and see who owes who —
            without the spreadsheet.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Link to="/register" className="btn-primary flex items-center gap-2">
              Create your account <ArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-text hover:bg-surface"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Signature element: a live-looking ledger preview */}
        <div className="glass-card mx-auto mt-16 max-w-3xl rounded-2xl p-6">
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted">
            Trip to Goa · 4 members
          </p>
          <div className="space-y-3">
            {[
              { label: "Dinner at Beach Shack", paidBy: "You", amount: "₹2,400", pill: "+₹600 each" },
              { label: "Cab from airport", paidBy: "Rohan", amount: "₹1,200", pill: "you owe ₹300" },
              { label: "Resort booking", paidBy: "Priya", amount: "₹18,000", pill: "you owe ₹4,500" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-text">{row.label}</p>
                  <p className="text-xs text-muted">Paid by {row.paidBy} · {row.amount}</p>
                </div>
                <span className="balance-pill balance-pill--positive">{row.pill}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-20 grid max-w-4xl gap-6 sm:grid-cols-3">
          {[
            { icon: Users, title: "Group it", desc: "Trips, flats, anything shared — keep one ledger per group." },
            { icon: Receipt, title: "Log it once", desc: "Add the expense, split it equally or by exact amount." },
            { icon: ScanLine, title: "Settle it", desc: "See net balances per group and mark payments as done." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card rounded-xl p-5">
              <Icon className="mb-3 text-brand-teal" size={20} />
              <p className="font-display text-base font-semibold">{title}</p>
              <p className="mt-1 text-sm text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-border px-6 py-6 text-center text-xs text-muted lg:px-12">
        Equora — built for splitting costs without losing the friendship.
      </footer>
    </div>
  );
}
