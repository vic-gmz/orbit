import { useState } from "react";
import { authClient } from "../lib/auth-client";
import OrbitMark from "./ui/OrbitMark";

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
    <div className="card w-full px-5 py-7 sm:px-8 sm:py-9">
      <div className="mb-7 flex flex-col items-center gap-3 text-center">
        <OrbitMark size={42} className="text-sun" />
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Orbit</h1>
          <p className="mt-1 text-sm text-muted">
            {mode === "signIn"
              ? "Welcome back to your network."
              : "Keep your people close, warmly."}
          </p>
        </div>
      </div>

      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        {mode === "signUp" && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input"
        />
        <div className="flex gap-2">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="input flex-1"
          />
          <button
            type="button"
            className="btn btn-ghost shrink-0 px-4"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {error && <p className="text-sm text-coral">{error}</p>}
        <button
          className="btn btn-primary w-full py-2.5"
          type="submit"
          disabled={loading}
        >
          {loading ? "Loading…" : mode === "signIn" ? "Sign In" : "Sign Up"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-muted">
        {mode === "signIn" ? "New to Orbit? " : "Already have an account? "}
        <button
          className="link"
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
