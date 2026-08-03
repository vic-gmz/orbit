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
    <div className="w-full max-w-sm p-6">
      <h1 className="text-xl mb-4">
        {mode === "signIn" ? "Sign In" : "Sign Up"}
      </h1>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        {mode === "signUp" && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="px-3 py-2 border rounded"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-3 py-2 border rounded"
        />
        <div className="flex gap-2">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            type="button"
            className="px-3 py-2 border rounded"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          className="px-3 py-2 bg-black text-white rounded disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? "Loading…" : mode === "signIn" ? "Sign In" : "Sign Up"}
        </button>
      </form>
      <p className="mt-4 text-sm">
        {mode === "signIn" ? "No account? " : "Already have an account? "}
        <button
          className="underline"
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
