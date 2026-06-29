import { Check, Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "../utils/format";

export default function SettlementCard({ settlement, onConfirm, onDelete, currentUserId }) {
    const isPending = settlement.status === "PENDING";
    const isReceiver = settlement.toUser?.id === currentUserId;
    const isSender = settlement.fromUser?.id === currentUserId;

    return (
        <div className="glass-card flex items-center justify-between rounded-xl p-4">
            <div>
                <p className="text-sm font-medium text-text">
                    {settlement.fromUser?.name} → {settlement.toUser?.name}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                    {settlement.method} · {formatDate(settlement.settledAt || settlement.createdAt)}
                </p>
            </div>

            <div className="flex items-center gap-3">
        <span className="font-display text-sm font-semibold tabular-nums text-text">
          {formatCurrency(settlement.amount, settlement.currency)}
        </span>

                <span className={`balance-pill ${isPending ? "balance-pill--negative" : "balance-pill--positive"}`}>
          {isPending ? "Pending" : "Completed"}
        </span>

                {isPending && isReceiver && onConfirm && (
                    <button
                        onClick={() => onConfirm(settlement.id)}
                        aria-label="Confirm settlement"
                        className="text-muted hover:text-positive"
                    >
                        <Check size={16} />
                    </button>
                )}

                {onDelete && isSender && (
                    <button
                        onClick={() => onDelete(settlement.id)}
                        aria-label="Delete settlement"
                        className="text-muted hover:text-negative"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}