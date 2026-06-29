import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const categoryEmoji = {
  TRIP: "✈️",
  HOME: "🏠",
  FOOD: "🍽️",
  EVENT: "🎉",
  OTHER: "💰",
};

export default function GroupCard({ group, balance }) {
  const emoji = group.emoji || categoryEmoji[group.category] || "💰";
  const netBalance = balance?.netBalance ?? null;

  return (
    <Link
      to={`/groups/${group.id}`}
      className="glass-card group flex items-center justify-between rounded-xl p-4 transition-colors hover:border-brand-violet/40"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2 text-lg">
          {emoji}
        </span>
        <div>
          <p className="text-sm font-medium text-text">{group.name}</p>
          {netBalance !== null && (
            <span
              className={`balance-pill mt-1 inline-block ${
                netBalance >= 0 ? "balance-pill--positive" : "balance-pill--negative"
              }`}
            >
              {netBalance >= 0 ? "You're owed" : "You owe"} ₹{Math.abs(netBalance).toFixed(2)}
            </span>
          )}
        </div>
      </div>
      <ArrowRight size={16} className="text-muted transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
