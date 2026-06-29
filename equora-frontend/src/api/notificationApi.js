import api from "./axios";

export const createNotification = (data) =>
  api.post("/notification", data).then((res) => res.data);

export const getNotificationsForUser = (userId) =>
  api.get(`/notification/user/${userId}`).then((res) => res.data);

export const markNotificationAsRead = (notificationId) =>
  api.patch(`/notification/${notificationId}/read`).then((res) => res.data);

export const deleteNotification = (notificationId) =>
  api.delete(`/notification/${notificationId}`).then((res) => res.data);
