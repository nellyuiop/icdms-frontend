"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import api from "@/app/lib/api";
import { setAuthSession } from "@/app/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const data = response.data;

      setAuthSession(data);

      if (data.user?.must_change_password) {
        router.push("/change-password");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Invalid email or password.");
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <section className="auth-brand">
          <p className="auth-wordmark" aria-label="ClinIQ">
            Clin<span>IQ</span>
          </p>
          <h1>Clinical Data Management System</h1>
          <p className="auth-brand-copy">
            Secure, streamlined access to patient records, visits, vitals, and
            laboratory documentation.
          </p>
        </section>

        <section className="auth-panel">
          <div className="auth-panel-header">
            <h2>Sign In</h2>
            <p className="auth-panel-copy">Enter your credentials to continue.</p>
          </div>

          {error ? (
            <div className="alert alert-error" role="alert" aria-live="polite">
              {error}
            </div>
          ) : null}

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@icdms.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input auth-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <div className="auth-password-field">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input auth-input auth-input-password"
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-dark btn-lg auth-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="auth-footer">Protected clinical workspace</p>
        </section>
      </div>
    </main>
  );
}
