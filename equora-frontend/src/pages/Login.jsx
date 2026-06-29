import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowRight, ArrowLeftRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit(values) {
    setServerError("");
    setSubmitting(true);
    try {
      await login(values);
      navigate("/dashboard");
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Couldn't sign you in. Check your email and password."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Signature left panel — the ledger motif */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-surface p-12 lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(124,92,255,0.25), transparent 40%), radial-gradient(circle at 80% 70%, rgba(34,211,184,0.2), transparent 45%)",
          }}
        />
        <div className="relative flex items-center gap-2">
          <ArrowLeftRight className="text-brand-teal" size={22} />
          <span className="font-display text-xl font-semibold">Equora</span>
        </div>

        <div className="relative space-y-6">
          <p className="font-display text-3xl leading-tight text-text">
            Every shared cost,
            <br />
            <span className="brand-gradient-text">settled to the rupee.</span>
          </p>

          <div className="space-y-3">
            {[
              { name: "Trip to Goa", note: "You're owed", amount: "₹2,450", positive: true },
              { name: "Flatmates · June", note: "You owe", amount: "₹890", positive: false },
            ].map((row) => (
              <div
                key={row.name}
                className="glass-card flex items-center justify-between rounded-xl px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-text">{row.name}</p>
                  <p className="text-xs text-muted">{row.note}</p>
                </div>
                <span
                  className={`balance-pill ${
                    row.positive ? "balance-pill--positive" : "balance-pill--negative"
                  }`}
                >
                  {row.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-muted">No more spreadsheets. No more guessing.</p>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="text-brand-teal" size={20} />
              <span className="font-display text-lg font-semibold">Equora</span>
            </div>
          </div>

          <h1 className="font-display text-2xl font-semibold text-text">Welcome back</h1>
          <p className="mt-1 text-sm text-muted">Sign in to see what's outstanding.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="input-field"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-negative">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-text">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="input-field"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="mt-1.5 text-xs text-negative">{errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <div className="rounded-lg border border-negative/30 bg-negative/10 px-3 py-2 text-sm text-negative">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex w-full items-center justify-center gap-2"
            >
              {submitting ? <LoadingSpinner size={18} /> : <>Sign in <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            New to Equora?{" "}
            <Link to="/register" className="font-medium text-brand-teal hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
