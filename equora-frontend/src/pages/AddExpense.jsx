import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { createExpense, buildEqualSplits } from "../api/expenseApi";
import { getGroupMembers } from "../api/groupApi";

const categories = ["FOOD", "TRAVEL", "RENT", "UTILITIES", "ENTERTAINMENT", "OTHER"];

export default function AddExpense() {
  const { groupId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [exactAmounts, setExactAmounts] = useState({});

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      description: "",
      amount: "",
      category: "FOOD",
      currency: "INR",
      splitType: "EQUAL",
    },
  });

  const splitType = watch("splitType");
  const amount = watch("amount");

  useEffect(() => {
    getGroupMembers(groupId)
        .then((m) => {
          setMembers(m);
          // Pre-select logged-in user
          setSelectedIds([user?.userId]);
        })
        .catch(() => setError("Couldn't load group members."));
  }, [groupId]);

  function toggleMember(id) {
    setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function onSubmit(values) {
    setError("");
    const totalAmount = Number(values.amount);

    if (selectedIds.length === 0) {
      setError("Select at least one participant.");
      return;
    }

    let splits;
    if (values.splitType === "EQUAL") {
      splits = buildEqualSplits(totalAmount, selectedIds);
    } else {
      splits = selectedIds.map((id) => ({
        userId: id,
        amount: Number(exactAmounts[id] || 0),
      }));
      const sum = splits.reduce((acc, s) => acc + s.amount, 0);
      if (Math.abs(sum - totalAmount) > 0.01) {
        setError(
            `Exact amounts (${sum.toFixed(2)}) must add up to total (${totalAmount.toFixed(2)}).`
        );
        return;
      }
    }

    setSubmitting(true);
    try {
      await createExpense({
        groupId,
        paidByUserId: user.userId,
        amount: totalAmount,
        description: values.description,
        category: values.category,
        currency: values.currency,
        splits,
      });
      navigate(`/groups/${groupId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create the expense.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
      <div className="px-8 py-8">
        <Link
            to={`/groups/${groupId}`}
            className="flex items-center gap-1.5 text-sm text-muted hover:text-text"
        >
          <ArrowLeft size={15} /> Back to group
        </Link>

        <h1 className="mt-3 font-display text-2xl font-semibold">Add an expense</h1>
        <p className="mt-1 text-sm text-muted">
          You're logging this as the payer. Splits are calculated and saved exactly as entered.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 max-w-xl space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Description</label>
            <input
                className="input-field"
                placeholder="Dinner at Beach Shack"
                {...register("description", { required: true })}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">Amount</label>
              <input
                  type="number"
                  step="0.01"
                  className="input-field"
                  placeholder="1200"
                  {...register("amount", { required: true, min: 0.01 })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">Currency</label>
              <input className="input-field" {...register("currency")} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">Category</label>
              <select className="input-field" {...register("category")}>
                {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Split type</label>
            <div className="flex gap-2">
              {["EQUAL", "EXACT"].map((type) => (
                  <label
                      key={type}
                      className={`flex-1 cursor-pointer rounded-xl border px-4 py-2.5 text-center text-sm font-medium transition-colors ${
                          splitType === type
                              ? "border-brand-violet bg-brand-violet/10 text-text"
                              : "border-border text-muted hover:bg-surface-2"
                      }`}
                  >
                    <input type="radio" value={type} {...register("splitType")} className="hidden" />
                    {type === "EQUAL" ? "Split equally" : "Exact amounts"}
                  </label>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Participants</label>
            <div className="space-y-2">
              {members.map((m) => (
                  <div
                      key={m.userId}
                      className="flex items-center justify-between rounded-xl border border-border px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <input
                          type="checkbox"
                          checked={selectedIds.includes(m.userId)}
                          onChange={() => toggleMember(m.userId)}
                          className="h-4 w-4 accent-brand-violet"
                      />
                      <div>
                        <p className="text-sm font-medium text-text">
                          {m.name}
                          {m.userId === user?.userId && (
                              <span className="ml-2 text-xs text-muted">(you)</span>
                          )}
                        </p>
                        <p className="text-xs text-muted">{m.email}</p>
                      </div>
                    </div>
                    {splitType === "EXACT" && selectedIds.includes(m.userId) && (
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Amount"
                            className="input-field w-28"
                            value={exactAmounts[m.userId] || ""}
                            onChange={(e) =>
                                setExactAmounts((prev) => ({ ...prev, [m.userId]: e.target.value }))
                            }
                        />
                    )}
                    {splitType === "EQUAL" && selectedIds.includes(m.userId) && amount && (
                        <span className="text-sm text-muted tabular-nums">
                    ₹{(Number(amount) / selectedIds.length).toFixed(2)}
                  </span>
                    )}
                  </div>
              ))}
            </div>
            {splitType === "EQUAL" && amount && selectedIds.length > 0 && (
                <p className="mt-1.5 text-xs text-muted">
                  Each share: ₹{(Number(amount) / selectedIds.length).toFixed(2)}
                </p>
            )}
          </div>

          {error && (
              <div className="rounded-lg border border-negative/30 bg-negative/10 px-3 py-2 text-sm text-negative">
                {error}
              </div>
          )}

          <button type="submit" disabled={submitting} className="btn-primary w-full text-sm">
            {submitting ? "Saving..." : "Save expense"}
          </button>
        </form>
      </div>
  );
}