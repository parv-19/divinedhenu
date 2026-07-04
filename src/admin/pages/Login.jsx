import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import adminApi, { getErrorMessage } from '../services/adminApi.js';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await adminApi.post('/admin/auth/login', form);
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.admin));
      navigate(location.state?.from?.pathname || '/admin/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ritual-background px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-ritual-border bg-ritual-card p-6 shadow-soft">
        <p className="text-xs uppercase tracking-[0.2em] text-ritual-muted">Admin login</p>
        <h1 className="mt-2 font-serif text-3xl text-ritual-text">DivineDhenu CMS</h1>
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-ritual-text">Email</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="focus-ring mt-1 w-full rounded-md border border-ritual-border bg-ritual-background px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ritual-text">Password</span>
            <input
              type="password"
              required
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              className="focus-ring mt-1 w-full rounded-md border border-ritual-border bg-ritual-background px-3 py-2 text-sm"
            />
          </label>
        </div>
        {error ? <p className="mt-4 rounded-md bg-ritual-rose/20 px-3 py-2 text-sm text-ritual-text">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="focus-ring mt-6 w-full rounded-md bg-ritual-text px-4 py-3 text-sm font-semibold text-ritual-card disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
