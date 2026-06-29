import { useState } from "react";
import { useForm } from "react-hook-form";
import { Copy, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { updateUser } from "../api/userApi";
import { initialsFromName } from "../utils/format";

export default function Profile() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit } = useForm({
    defaultValues: { name: user?.name, email: user?.email },
  });

  function copyId() {
    navigator.clipboard.writeText(user?.userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function onSave(values) {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await updateUser(user.userId, { id: user.userId, name: values.name, email: values.email });
      setSaved(true);
    } catch {
      setError("Couldn't save your changes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="px-8 py-8">
      <h1 className="font-display text-2xl font-semibold">Profile</h1>
      <p className="mt-1 text-sm text-muted">Your account details.</p>

      <div className="mt-6 max-w-md space-y-6">
        <div className="glass-card flex items-center gap-4 rounded-2xl p-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-violet to-brand-teal font-display text-lg font-semibold text-white">
            {initialsFromName(user?.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-text">{user?.name}</p>
            <p className="truncate text-sm text-muted">{user?.email}</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Your user ID</p>
          <div className="mt-2 flex items-center gap-2">
            <code className="flex-1 truncate rounded-lg bg-surface-2 px-3 py-2 text-xs text-text">
              {user?.userId}
            </code>
            <button onClick={copyId} className="text-muted hover:text-brand-teal" aria-label="Copy user ID">
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <p className="mt-2 text-xs text-muted">
            Share this with a friend so they can add you to a group.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="glass-card space-y-4 rounded-2xl p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Edit details</p>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Name</label>
            <input className="input-field" {...register("name", { required: true })} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Email</label>
            <input className="input-field" type="email" {...register("email", { required: true })} />
          </div>

          {error && <p className="text-xs text-negative">{error}</p>}
          {saved && <p className="text-xs text-positive">Saved.</p>}

          <button type="submit" disabled={saving} className="btn-primary w-full text-sm">
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
