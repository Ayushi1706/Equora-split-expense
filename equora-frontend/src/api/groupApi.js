import api from "./axios";

export const createGroup = (data) => api.post("/group", data).then((res) => res.data);

export const getGroupById = (groupId) => api.get(`/group/${groupId}`).then((res) => res.data);

export const getGroupsForUser = (userId) =>
    api.get(`/group/user/${userId}`).then((res) => res.data);

export const updateGroup = (groupId, data) =>
    api.put(`/group/${groupId}`, data).then((res) => res.data);

export const deleteGroup = (groupId) => api.delete(`/group/${groupId}`).then((res) => res.data);

export const addMember = (groupId, userId) =>
    api.post(`/group/${groupId}/members`, null, { params: { userId } }).then((res) => res.data);

export const removeMember = (groupId, userId) =>
    api.delete(`/group/${groupId}/members/${userId}`).then((res) => res.data);

export const getMemberCount = (groupId) =>
    api.get(`/group/${groupId}/members/count`).then((res) => res.data);

export const searchGroups = (name) =>
    api.get("/group/search", { params: { name } }).then((res) => res.data);

export const getGroupMembers = (groupId) =>
    api.get(`/group/${groupId}/members`).then((r) => r.data);

export const addMemberByEmail = (groupId, email) =>
    api.post(`/group/${groupId}/members/email`, null, { params: { email } }).then((res) => res.data);