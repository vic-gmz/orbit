import { useState } from "react";
import { authClient } from "../lib/auth-client";

export default function AuthForm() {
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signIn") {
        const { error: err } = await authClient.signIn.email({ email, password });
        if (err) setError(err.message ?? "Sign in failed");
      } else {
        const { error: err } = await authClient.signUp.email({ email, password, name });
        if (err) setError(err.message ?? "Sign up failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-wrapper">
      <h2>{mode === "signIn" ? "Sign In" : "Sign Up"}</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        {mode === "signUp" && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="auth-form-password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          <button
            type="button"
            className="auth-form-password-toggle"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            )}
          </button>
        </div>
        {error && <p className="auth-form-error">{error}</p>}
        <button className="auth-form-submit" type="submit" disabled={loading}>
          {loading ? "Loading…" : mode === "signIn" ? "Sign In" : "Sign Up"}
        </button>
      </form>
      <p className="auth-form-toggle">
        {mode === "signIn" ? "No account? " : "Already have an account? "}
        <button
          className="auth-form-toggle-btn"
          type="button"
          onClick={() => {
            setMode(mode === "signIn" ? "signUp" : "signIn");
            setError(null);
            setPassword("");
            setShowPassword(false);
          }}
        >
          {mode === "signIn" ? "Sign Up" : "Sign In"}
        </button>
      </p>
    </div>
  );
}
