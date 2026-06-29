import api from "./axios";

export const getGroupBalances = (groupId) =>
  api.get(`/balance/group/${groupId}`).then((res) => res.data);

// Returns a per-group breakdown: [{ groupId, groupName, netBalance }]
export const getUserBalanceSummary = (userId) =>
  api.get(`/balance/user/${userId}`).then((res) => res.data);
