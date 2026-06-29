import { NavLink } from "react-router-dom";
import {
  ArrowLeftRight,
  LayoutDashboard,
  Users,
  HandCoins,
  Bell,
  UserCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { initialsFromName } from "../utils/format";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/groups", label: "Groups", icon: Users },
  { to: "/settlements", label: "Settlements", icon: HandCoins },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profile", label: "Profile", icon: UserCircle },
];

export default function Sidebar({ unreadCount = 0 }) {
  const { user, logout } = useAuth();

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-border bg-surface px-4 py-5">
      <div className="flex items-center gap-2 px-2">
        <ArrowLeftRight className="text-brand-teal" size={20} />
        <span className="font-display text-lg font-semibold">Equora</span>
      </div>

      <nav className="mt-8 flex-1 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-surface-2 text-text"
                  : "text-muted hover:bg-surface-2 hover:text-text"
              }`
            }
          >
            <span className="flex items-center gap-2.5">
              <Icon size={17} />
              {label}
            </span>
            {label === "Notifications" && unreadCount > 0 && (
              <span className="rounded-full bg-brand-violet px-1.5 py-0.5 text-[11px] font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-violet to-brand-teal text-xs font-semibold text-white">
          {initialsFromName(user?.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-text">{user?.name}</p>
          <p className="truncate text-xs text-muted">{user?.email}</p>
        </div>
        <button onClick={logout} aria-label="Sign out" className="text-muted hover:text-negative">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
