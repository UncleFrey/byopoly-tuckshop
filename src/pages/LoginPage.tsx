import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import logo from '../assets/logo.png';

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: signInError } = await signIn(email.trim(), password);
    setLoading(false);
    if (signInError) {
      setError(signInError);
      return;
    }
    navigate('/dashboard');
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-10">
      <div className="plate-clip bg-parchment-100 p-8 shadow-plate ring-1 ring-charcoal/5">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-md bg-white sm:h-28 sm:w-28">
            <img src={logo} alt="Sky Silhouette" className="h-full w-full object-contain" />
          </div>
          <h1 className="mt-2 font-display text-xl font-bold">Staff &amp; Admin Login</h1>
          <div className="mt-1 flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-charcoal/70 sm:text-[11px]">
            <span>QUALITY</span>
            <span className="text-charcoal/40">•</span>
            <span>AFFORDABLE</span>
            <span className="text-charcoal/40">•</span>
            <span>RELIABLE</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-charcoal/15 px-3 py-2.5 text-sm outline-none focus:border-oxblood-600"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-charcoal/15 px-3 py-2.5 text-sm outline-none focus:border-oxblood-600"
              required
            />
          </div>
          {error && <p className="text-sm font-medium text-signal-rust">{error}</p>}
          <Button type="submit" icon={<LogIn size={16} />} loading={loading} className="w-full">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
