import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../../components/ui/Icon";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-jet-black flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center mb-8">
          <Icon name="crown" size={40} className="text-gold mb-4" />
          <span className="font-display text-4xl tracking-[0.3em] text-warm-white">
            TIMECRAFT
          </span>
        </div>

        <div className="bg-charcoal border border-white/10 p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <span className="h-px flex-1 bg-gold/40" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-ash">
              Admin Access
            </span>
            <span className="h-px flex-1 bg-gold/40" />
          </div>

          <h1 className="font-display text-3xl text-warm-white mb-8">
            Admin Access
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field"
            />
            <input
              type="password"
              required
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field"
            />

            {error && (
              <p className="text-sm text-red-300 flex items-center gap-2">
                <Icon name="close" size={14} className="text-red-300" />
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="gold"
              size="lg"
              loading={submitting}
              className="w-full"
            >
              Sign In
            </Button>
          </form>

          <p className="text-[11px] text-ash mt-6 leading-relaxed">
            Credentials are configured in server/.env (ADMIN_EMAIL / ADMIN_PASSWORD).
          </p>
        </div>

        <p className="text-center text-sm text-ash mt-6">
          <Link to="/" className="text-gold hover:underline">
            View Storefront
          </Link>
        </p>
      </div>
    </div>
  );
}