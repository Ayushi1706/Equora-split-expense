import api from "./axios";

export const getMe = () => api.get("/user/me").then((res) => res.data);

export const getAllUsers = () => api.get("/user").then((res) => res.data);

export const getUserById = (id) => api.get(`/user/${id}`).then((res) => res.data);

export const updateUser = (id, data) => api.put(`/user/${id}`, data).then((res) => res.data);

export const deleteUser = (id) => api.delete(`/user/${id}`).then((res) => res.data);
