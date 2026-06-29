import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { createGroup, getGroupsForUser } from "../api/groupApi";
import { getUserBalanceSummary } from "../api/balanceApi";
import GroupCard from "../components/GroupCard";
import Modal from "../components/Modal";
import LoadingSpinner from "../components/LoadingSpinner";

const categories = ["TRIP", "HOME", "FOOD", "EVENT", "OTHER"];

export default function Groups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { category: "TRIP", currency: "INR" },
  });

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  function load() {
    setLoading(true);
    Promise.all([getGroupsForUser(user.userId), getUserBalanceSummary(user.userId)])
      .then(([g, b]) => {
        setGroups(g);
        setBalances(b);
      })
      .catch(() => setError("Couldn't load your groups."))
      .finally(() => setLoading(false));
  }

  async function onCreate(values) {
    setCreating(true);
    try {
      await createGroup({
        name: values.name,
        category: values.category,
        currency: values.currency,
      });
      reset();
      setModalOpen(false);
      load();
    } catch {
      setError("Couldn't create that group. Try again.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Groups</h1>
          <p className="mt-1 text-sm text-muted">Every shared ledger you're part of.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Create group
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-negative/30 bg-negative/10 px-4 py-3 text-sm text-negative">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-12 flex justify-center">
          <LoadingSpinner size={26} />
        </div>
      ) : groups.length ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {groups.map((group) => {
            const balance = balances.find((b) => b.groupId === group.id);
            return <GroupCard key={group.id} group={group} balance={balance} />;
          })}
        </div>
      ) : (
        <div className="glass-card mt-8 rounded-xl p-10 text-center">
          <p className="text-sm text-muted">No groups yet.</p>
          <button onClick={() => setModalOpen(true)} className="btn-primary mt-4 inline-flex text-sm">
            Create your first group
          </button>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create a group">
        <form onSubmit={handleSubmit(onCreate)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Group name</label>
            <input
              className="input-field"
              placeholder="Trip to Goa"
              {...register("name", { required: true })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">Category</label>
              <select className="input-field" {...register("category")}>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">Currency</label>
              <input className="input-field" {...register("currency")} />
            </div>
          </div>

          <button type="submit" disabled={creating} className="btn-primary w-full text-sm">
            {creating ? "Creating..." : "Create group"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
