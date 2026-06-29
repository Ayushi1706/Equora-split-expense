import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getDashboard } from "../api/dashboardApi";
import BalanceCard from "../components/BalanceCard";
import GroupCard from "../components/GroupCard";
import NotificationCard from "../components/NotificationCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { markNotificationAsRead, deleteNotification } from "../api/notificationApi";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  function load() {
    setLoading(true);
    getDashboard(user.userId)
      .then(setData)
      .catch(() => setError("Couldn't load your dashboard. Try refreshing."))
      .finally(() => setLoading(false));
  }

  async function handleMarkRead(id) {
    await markNotificationAsRead(id);
    load();
  }

  async function handleDeleteNotification(id) {
    await deleteNotification(id);
    load();
  }

  const totalOwedToYou =
    data?.balances?.filter((b) => b.netBalance > 0).reduce((sum, b) => sum + b.netBalance, 0) ?? 0;
  const totalYouOwe = data?.balances
      ?.filter((b) => b.netBalance < 0)
      .reduce((sum, b) => sum + Math.abs(b.netBalance), 0) ?? 0;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size={28} />
      </div>
    );
  }

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            Welcome back, <span className="brand-gradient-text">{user?.name?.split(" ")[0]}</span>
          </h1>
          <p className="mt-1 text-sm text-muted">Here's where things stand across your groups.</p>
        </div>
        <Link to="/groups" className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> New group
        </Link>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-negative/30 bg-negative/10 px-4 py-3 text-sm text-negative">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <BalanceCard
          label="You are owed"
          netBalance={totalOwedToYou}
          sublabel={`Across ${data?.balances?.filter((b) => b.netBalance > 0).length ?? 0} groups`}
        />
        <BalanceCard
          label="You owe"
          netBalance={-totalYouOwe}
          sublabel={`Across ${data?.balances?.filter((b) => b.netBalance < 0).length ?? 0} groups`}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Your groups</h2>
            <Link to="/groups" className="text-sm font-medium text-brand-teal hover:underline">
              View all
            </Link>
          </div>

          {data?.groups?.length ? (
            <div className="space-y-3">
              {data.groups.slice(0, 5).map((group) => {
                const balance = data.balances?.find((b) => b.groupId === group.id);
                return <GroupCard key={group.id} group={group} balance={balance} />;
              })}
            </div>
          ) : (
            <div className="glass-card rounded-xl p-8 text-center">
              <p className="text-sm text-muted">No groups yet — create one to start splitting costs.</p>
              <Link to="/groups" className="btn-primary mt-4 inline-flex text-sm">
                Create your first group
              </Link>
            </div>
          )}
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Notifications</h2>
            <Link to="/notifications" className="text-sm font-medium text-brand-teal hover:underline">
              View all
            </Link>
          </div>

          {data?.recentNotifications?.length ? (
            <div className="space-y-3">
              {data.recentNotifications.slice(0, 5).map((n) => (
                <NotificationCard
                  key={n.id}
                  notification={n}
                  onMarkRead={handleMarkRead}
                  onDelete={handleDeleteNotification}
                />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-xl p-6 text-center text-sm text-muted">
              Nothing here yet.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
