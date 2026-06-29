import { Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "../utils/format";

export default function ExpenseCard({ expense, currentUserId, onDelete }) {
    const paidByYou = expense.paidBy?.id === currentUserId;
    const mySplit = expense.splits?.find(
        (s) => s.user?.id === currentUserId || s.userId === currentUserId
    );

    return (
        <div className="glass-card flex items-center justify-between rounded-xl p-4">
            <div className="min-w-0">
                <p className="truncate text-sm font-medium text-text">
                    {expense.description || "No description"}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                    {paidByYou ? "Paid by you" : `Paid by ${expense.paidBy?.name ?? "someone"}`} ·{" "}
                    {formatDate(expense.expenseDate)}
                </p>
            </div>

            <div className="flex items-center gap-4 pl-4">
                <div className="text-right">
                    <p className="font-display text-sm font-semibold tabular-nums text-text">
                        {formatCurrency(expense.amount, expense.currency)}
                    </p>
                    {mySplit && (
                        <p className="text-xs text-muted">
                            your share: {formatCurrency(mySplit.amount, expense.currency)}
                        </p>
                    )}
                </div>
                {onDelete && paidByYou && (
                    <button
                        onClick={() => onDelete(expense.id)}
                        aria-label="Delete expense"
                        className="text-muted hover:text-negative"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}