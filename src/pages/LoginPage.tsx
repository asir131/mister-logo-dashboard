import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { apiRequest } from '../utils/apiClient';
import { setAdminToken } from '../utils/adminSession';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await apiRequest({
      path: '/api/admin/auth/login',
      method: 'POST',
      body: { email, password }
    });

    if (!result.ok) {
      setError(result.data?.error || 'Login failed.');
      setLoading(false);
      return;
    }

    setAdminToken(result.data.token || '');
    navigate('/');
  }

  return <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-surface border border-slate-700 rounded-xl p-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text-primary">Admin Login</h1>
          <p className="text-sm text-text-secondary">
            Sign in with your admin credentials.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input label="Email" type="email" value={email} onChange={event => setEmail(event.target.value)} />
          <Input label="Password" type="password" value={password} onChange={event => setPassword(event.target.value)} />
          {error && <div className="text-sm text-red-400">{error}</div>}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>;
}
