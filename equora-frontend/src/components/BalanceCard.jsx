import { formatCurrency } from "../utils/format";

// netBalance > 0  -> they're owed (positive/green)
// netBalance < 0  -> they owe (negative/red)
export default function BalanceCard({ label, netBalance, currency = "INR", sublabel }) {
  const isPositive = netBalance >= 0;

  return (
    <div className="glass-card rounded-2xl p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p
        className={`mt-2 font-display text-3xl font-semibold tabular-nums ${
          isPositive ? "text-positive" : "text-negative"
        }`}
      >
        {formatCurrency(Math.abs(netBalance), currency)}
      </p>
      <span
        className={`balance-pill mt-3 inline-block ${
          isPositive ? "balance-pill--positive" : "balance-pill--negative"
        }`}
      >
        {isPositive ? "You are owed" : "You owe"}
      </span>
      {sublabel && <p className="mt-2 text-xs text-muted">{sublabel}</p>}
    </div>
  );
}
