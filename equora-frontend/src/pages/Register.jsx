import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowRight, ArrowLeftRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  async function onSubmit(values) {
    setServerError("");
    setSubmitting(true);
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      navigate("/dashboard");
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Couldn't create your account. Try a different email."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2">
          <ArrowLeftRight className="text-brand-teal" size={20} />
          <span className="font-display text-lg font-semibold">Equora</span>
        </div>

        <h1 className="font-display text-2xl font-semibold text-text">Create your account</h1>
        <p className="mt-1 text-sm text-muted">Start splitting costs in seconds.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-text">
              Full name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Ayushi Singh"
              className="input-field"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <p className="mt-1.5 text-xs text-negative">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="input-field"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
              })}
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
              placeholder="At least 8 characters"
              className="input-field"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Use at least 8 characters" },
              })}
            />
            {errors.password && (
              <p className="mt-1.5 text-xs text-negative">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-text">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              className="input-field"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === password || "Passwords don't match",
              })}
            />
            {errors.confirmPassword && (
              <p className="mt-1.5 text-xs text-negative">{errors.confirmPassword.message}</p>
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
            {submitting ? <LoadingSpinner size={18} /> : <>Create account <ArrowRight size={16} /></>}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand-teal hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
