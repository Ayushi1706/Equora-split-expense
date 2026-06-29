import { Trash2 } from "lucide-react";
import { formatRelativeTime } from "../utils/format";

export default function NotificationCard({ notification, onMarkRead, onDelete }) {
  return (
    <div
      className={`glass-card flex items-start justify-between gap-3 rounded-xl p-4 ${
        notification.read ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        {!notification.read && (
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-teal" />
        )}
        <div>
          <p className="text-sm font-medium text-text">{notification.title}</p>
          <p className="mt-0.5 text-sm text-muted">{notification.description}</p>
          <p className="mt-1 text-xs text-muted">{formatRelativeTime(notification.createdAt)}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {!notification.read && (
          <button
            onClick={() => onMarkRead(notification.id)}
            className="text-xs font-medium text-brand-teal hover:underline"
          >
            Mark read
          </button>
        )}
        <button onClick={() => onDelete(notification.id)} className="text-muted hover:text-negative">
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
