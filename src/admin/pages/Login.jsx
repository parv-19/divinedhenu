import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import adminApi, { getErrorMessage } from '../services/adminApi.js';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'setup' ? '/admin/auth/setup' : '/admin/auth/login';
      const payload = mode === 'setup'
        ? form
        : { email: form.email, password: form.password };
      const { data } = await adminApi.post(endpoint, payload);
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
        <p className="text-xs uppercase tracking-[0.2em] text-ritual-muted">{mode === 'setup' ? 'First admin setup' : 'Admin login'}</p>
        <h1 className="mt-2 font-serif text-3xl text-ritual-text">DivineDhenu CMS</h1>
        <p className="mt-2 text-sm leading-6 text-ritual-muted">
          {mode === 'setup'
            ? 'Create the first super admin for this live CMS. This works only while no admin account exists.'
            : 'Sign in to manage products, blogs, CowPedia, banners, offers, reviews, and settings.'}
        </p>
        <div className="mt-6 space-y-4">
          {mode === 'setup' ? (
            <label className="block">
              <span className="text-sm font-medium text-ritual-text">Name</span>
              <input
                type="text"
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="focus-ring mt-1 w-full rounded-md border border-ritual-border bg-ritual-background px-3 py-2 text-sm"
              />
            </label>
          ) : null}
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
          {loading ? 'Please wait...' : mode === 'setup' ? 'Create admin and enter CMS' : 'Sign in'}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode(mode === 'setup' ? 'login' : 'setup');
            setError('');
          }}
          className="mt-4 w-full text-sm font-semibold text-ritual-gold hover:text-ritual-text"
        >
          {mode === 'setup' ? 'Already have an admin account? Sign in' : 'First time? Create the first admin'}
        </button>
      </form>
    </div>
  );
}
