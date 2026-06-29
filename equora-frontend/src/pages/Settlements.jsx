import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getGroupsForUser, getGroupMembers } from "../api/groupApi";
import {
  createSettlement,
  getSettlementsForGroup,
  confirmSettlement,
  deleteSettlement,
} from "../api/settlementApi";
import SettlementCard from "../components/SettlementCard";
import Modal from "../components/Modal";
import LoadingSpinner from "../components/LoadingSpinner";

const methods = ["CASH", "BANK_TRANSFER", "UPI", "OTHER"];

export default function Settlements() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [settlements, setSettlements] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: { method: "CASH", currency: "INR" },
  });

  useEffect(() => {
    if (!user) return;
    getGroupsForUser(user.userId).then((g) => {
      setGroups(g);
      if (g.length) setSelectedGroupId(g[0].id);
      else setLoading(false);
    });
  }, [user]);

  useEffect(() => {
    if (!selectedGroupId) return;
    setLoading(true);
    getSettlementsForGroup(selectedGroupId)
        .then(setSettlements)
        .catch(() => setError("Couldn't load settlements."))
        .finally(() => setLoading(false));

    // Fetch members for the selected group
    getGroupMembers(selectedGroupId).then(setMembers).catch(() => setMembers([]));
  }, [selectedGroupId]);

  // Pre-fill fromUser as logged-in user when modal opens
  useEffect(() => {
    if (modalOpen && user) {
      setValue("fromUserId", user.userId);
    }
  }, [modalOpen, user, setValue]);

  function reload() {
    getSettlementsForGroup(selectedGroupId).then(setSettlements);
  }

  async function onCreate(values) {
    setCreating(true);
    setError("");
    try {
      await createSettlement({
        groupId: selectedGroupId,
        fromUserId: values.fromUserId,
        toUserId: values.toUserId,
        amount: Number(values.amount),
        currency: values.currency,
        method: values.method,
      });
      reset({ method: "CASH", currency: "INR" });
      setModalOpen(false);
      reload();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't record that settlement.");
    } finally {
      setCreating(false);
    }
  }

  async function handleConfirm(id) {
    await confirmSettlement(id);
    reload();
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this settlement?")) return;
    await deleteSettlement(id);
    reload();
  }

  const otherMembers = members.filter((m) => m.userId !== user?.userId);

  return (
      <div className="px-8 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold">Settlements</h1>
            <p className="mt-1 text-sm text-muted">Record and confirm payments between members.</p>
          </div>
          <button
              onClick={() => setModalOpen(true)}
              disabled={!selectedGroupId}
              className="btn-primary flex items-center gap-2 text-sm"
          >
            <Plus size={16} /> Record settlement
          </button>
        </div>

        {groups.length > 0 && (
            <div className="mt-5 max-w-xs">
              <select
                  className="input-field"
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
              >
                {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                ))}
              </select>
            </div>
        )}

        {error && (
            <div className="mt-4 rounded-lg border border-negative/30 bg-negative/10 px-4 py-3 text-sm text-negative">
              {error}
            </div>
        )}

        <div className="mt-6">
          {!groups.length ? (
              <div className="glass-card rounded-xl p-8 text-center text-sm text-muted">
                Join or create a group first.
              </div>
          ) : loading ? (
              <div className="flex justify-center py-10">
                <LoadingSpinner size={26} />
              </div>
          ) : settlements.length ? (
              <div className="space-y-3">
                {settlements.map((s) => (
                    <SettlementCard
                        key={s.id}
                        settlement={s}
                        currentUserId={user?.userId}
                        onConfirm={handleConfirm}
                        onDelete={handleDelete}
                    />
                ))}
              </div>
          ) : (
              <div className="glass-card rounded-xl p-8 text-center text-sm text-muted">
                No settlements logged for this group yet.
              </div>
          )}
        </div>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Record a settlement">
          <form onSubmit={handleSubmit(onCreate)} className="space-y-4">

            {/* From — locked to logged-in user */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">From</label>
              <input type="hidden" {...register("fromUserId", { required: true })} />
              <div className="input-field bg-surface-0 text-muted cursor-not-allowed">
                {user?.name || "You"}
              </div>
            </div>

            {/* To — dropdown of other group members */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">To</label>
              <select className="input-field" {...register("toUserId", { required: true })}>
                <option value="">Select member</option>
                {otherMembers.map((m) => (
                    <option key={m.userId} value={m.userId}>
                      {m.name}
                    </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text">Amount</label>
                <input
                    type="number"
                    step="0.01"
                    className="input-field"
                    {...register("amount", { required: true, min: 0.01 })}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text">Method</label>
                <select className="input-field" {...register("method")}>
                  {methods.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" disabled={creating} className="btn-primary w-full text-sm">
              {creating ? "Saving..." : "Record settlement"}
            </button>
          </form>
        </Modal>
      </div>
  );
}