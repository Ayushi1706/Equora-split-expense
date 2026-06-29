import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft, Plus, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  getGroupById,
  getMemberCount,
  addMemberByEmail,
} from "../api/groupApi";
import { getExpensesForGroup, deleteExpense } from "../api/expenseApi";
import { getGroupBalances } from "../api/balanceApi";
import ExpenseCard from "../components/ExpenseCard";
import Modal from "../components/Modal";
import LoadingSpinner from "../components/LoadingSpinner";
import { formatCurrency } from "../utils/format";

export default function GroupDetails() {
  const { groupId } = useParams();
  const { user } = useAuth();

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [memberCount, setMemberCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [addingMember, setAddingMember] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    load();
  }, [groupId]);

  function load() {
    setLoading(true);
    Promise.all([
      getGroupById(groupId),
      getExpensesForGroup(groupId),
      getGroupBalances(groupId),
      getMemberCount(groupId),
    ])
      .then(([g, e, b, count]) => {
        setGroup(g);
        setExpenses(e);
        setBalances(b);
        setMemberCount(count);
      })
      .catch(() => setError("Couldn't load this group."))
      .finally(() => setLoading(false));
  }

  async function handleDeleteExpense(expenseId) {
    if (!window.confirm("Delete this expense? This can't be undone.")) return;
    await deleteExpense(expenseId);
    load();
  }

  async function onAddMember(values) {
    setAddingMember(true);
    try {
      await addMemberByEmail(groupId, values.email.trim());
      reset();
      setMemberModalOpen(false);
      load();
    } catch {
      setError("Couldn't add that member — check the email address.");
    } finally {
      setAddingMember(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size={28} />
      </div>
    );
  }

  const myBalance = balances.find((b) => b.userId === user?.userId);

  return (
    <div className="px-8 py-8">
      <Link to="/groups" className="flex items-center gap-1.5 text-sm text-muted hover:text-text">
        <ArrowLeft size={15} /> Back to groups
      </Link>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">{group?.name}</h1>
          <p className="mt-1 text-sm text-muted">
            {memberCount ?? "—"} members · {group?.category}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMemberModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-medium text-text hover:bg-surface-2"
          >
            <UserPlus size={16} /> Add member
          </button>
          <Link
            to={`/groups/${groupId}/add-expense`}
            className="btn-primary flex items-center gap-1.5 text-sm"
          >
            <Plus size={16} /> Add expense
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-negative/30 bg-negative/10 px-4 py-3 text-sm text-negative">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {myBalance && (
          <div className="glass-card rounded-2xl p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Your balance</p>
            <p
              className={`mt-2 font-display text-2xl font-semibold tabular-nums ${
                myBalance.netBalance >= 0 ? "text-positive" : "text-negative"
              }`}
            >
              {formatCurrency(Math.abs(myBalance.netBalance), group?.currency)}
            </p>
            <span
              className={`balance-pill mt-3 inline-block ${
                myBalance.netBalance >= 0 ? "balance-pill--positive" : "balance-pill--negative"
              }`}
            >
              {myBalance.netBalance >= 0 ? "You are owed" : "You owe"}
            </span>
          </div>
        )}

        <div className="glass-card rounded-2xl p-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
            All balances
          </p>
          <div className="space-y-2">
            {balances.map((b) => (
              <div key={b.userId} className="flex items-center justify-between text-sm">
                <span className="text-text">{b.userName}</span>
                <span
                  className={`font-medium tabular-nums ${
                    b.netBalance >= 0 ? "text-positive" : "text-negative"
                  }`}
                >
                  {b.netBalance >= 0 ? "+" : "-"}
                  {formatCurrency(Math.abs(b.netBalance), group?.currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-lg font-semibold">Expenses</h2>
        {expenses.length ? (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                currentUserId={user?.userId}
                onDelete={handleDeleteExpense}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-xl p-8 text-center">
            <p className="text-sm text-muted">No expenses logged yet.</p>
            <Link
              to={`/groups/${groupId}/add-expense`}
              className="btn-primary mt-4 inline-flex text-sm"
            >
              Add the first expense
            </Link>
          </div>
        )}
      </section>


      <Modal open={memberModalOpen} onClose={() => setMemberModalOpen(false)} title="Add a member">
        <form onSubmit={handleSubmit(onAddMember)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Email address</label>
            <input
                className="input-field"
                type="email"
                placeholder="friend@example.com"
                {...register("email", { required: true })}
            />
            <p className="mt-1.5 text-xs text-muted">
              Enter the email address they used to sign up.
            </p>
          </div>
          <button type="submit" disabled={addingMember} className="btn-primary w-full text-sm">
            {addingMember ? "Adding..." : "Add member"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
