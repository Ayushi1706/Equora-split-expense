import api from "./axios";

// CreateExpenseRequest shape expected by the backend:
// { groupId, paidByUserId, amount, description, category, currency, splits: [{ userId, amount }] }
// NOTE: the backend does NOT auto-calculate equal splits — the caller
// must send a concrete amount per participant. Splits must sum to `amount`.
export const createExpense = (data) => api.post("/expense", data).then((res) => res.data);

export const getExpenseById = (expenseId) =>
  api.get(`/expense/${expenseId}`).then((res) => res.data);

export const getExpensesForGroup = (groupId) =>
  api.get(`/expense/group/${groupId}`).then((res) => res.data);

export const updateExpense = (expenseId, data) =>
  api.put(`/expense/${expenseId}`, data).then((res) => res.data);

export const deleteExpense = (expenseId) =>
  api.delete(`/expense/${expenseId}`).then((res) => res.data);

// Helper used by the AddExpense screen to build an equal split client-side,
// since the backend trusts whatever per-user amounts are sent.
export function buildEqualSplits(totalAmount, participantIds) {
  const n = participantIds.length;
  if (n === 0) return [];

  const cents = Math.round(totalAmount * 100);
  const base = Math.floor(cents / n);
  const remainder = cents - base * n;

  return participantIds.map((userId, index) => {
    const extra = index < remainder ? 1 : 0;
    return { userId, amount: (base + extra) / 100 };
  });
}
