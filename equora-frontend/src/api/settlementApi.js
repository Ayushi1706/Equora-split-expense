import api from "./axios";

// CreateSettlementRequest shape: { groupId, fromUserId, toUserId, amount, currency, method }
export const createSettlement = (data) => api.post("/settlement", data).then((res) => res.data);

export const getSettlementById = (settlementId) =>
  api.get(`/settlement/${settlementId}`).then((res) => res.data);

export const getSettlementsForGroup = (groupId) =>
  api.get(`/settlement/group/${groupId}`).then((res) => res.data);

export const confirmSettlement = (settlementId) =>
  api.patch(`/settlement/${settlementId}/confirm`).then((res) => res.data);

export const deleteSettlement = (settlementId) =>
  api.delete(`/settlement/${settlementId}`).then((res) => res.data);
