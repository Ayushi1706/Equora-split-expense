import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getNotificationsForUser,
  markNotificationAsRead,
  deleteNotification,
} from "../api/notificationApi";
import NotificationCard from "../components/NotificationCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  function load() {
    setLoading(true);
    getNotificationsForUser(user.userId)
      .then(setNotifications)
      .finally(() => setLoading(false));
  }

  async function handleMarkRead(id) {
    await markNotificationAsRead(id);
    load();
  }

  async function handleDelete(id) {
    await deleteNotification(id);
    load();
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="px-8 py-8">
      <h1 className="font-display text-2xl font-semibold">Notifications</h1>
      <p className="mt-1 text-sm text-muted">
        {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up."}
      </p>

      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner size={26} />
          </div>
        ) : notifications.length ? (
          <div className="space-y-3">
            {notifications.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-xl p-8 text-center text-sm text-muted">
            Nothing here yet.
          </div>
        )}
      </div>
    </div>
  );
}
