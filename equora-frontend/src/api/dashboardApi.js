import api from "./axios";

// Returns { groups, balances, recentNotifications, unreadNotificationCount }
export const getDashboard = (userId) =>
  api.get(`/dashboard/${userId}`).then((res) => res.data);
