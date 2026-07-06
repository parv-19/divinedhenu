import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Container from '../components/common/Container.jsx';
import SEO from '../components/common/SEO.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const inputClass = 'mt-1 w-full rounded-md border border-ritual-border bg-white px-3 py-3 text-sm outline-none transition focus:border-ritual-gold';

const loadGoogleScript = () => new Promise((resolve, reject) => {
  if (window.google?.accounts?.id) {
    resolve();
    return;
  }

  const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
  if (existing) {
    existing.addEventListener('load', resolve, { once: true });
    existing.addEventListener('error', reject, { once: true });
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  script.onload = resolve;
  script.onerror = reject;
  document.body.appendChild(script);
});

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login, loginWithGoogle } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nextPath = useMemo(() => new URLSearchParams(location.search).get('next') || '/checkout', [location.search]);

  useEffect(() => {
    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) return undefined;

    let cancelled = false;
    loadGoogleScript()
      .then(() => {
        if (cancelled) return;
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: async (response) => {
            setError('');
            setLoading(true);
            try {
              await loginWithGoogle(response.credential);
              navigate(nextPath, { replace: true });
            } catch (requestError) {
              setError(requestError.response?.data?.message || 'Google login failed.');
            } finally {
              setLoading(false);
            }
          },
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-login-button'),
          { theme: 'outline', size: 'large', width: 320 },
        );
      })
      .catch(() => setError('Google login could not be loaded. Please use email login.'));

    return () => {
      cancelled = true;
    };
  }, [loginWithGoogle, navigate, nextPath]);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form);
      navigate(nextPath, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not login.');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) return <Navigate to={nextPath} replace />;

  return (
    <section className="py-12 md:py-16">
      <SEO title="Login | DivineDhenu" description="Login to DivineDhenu to continue checkout, manage your cart and place orders securely." path="/login" noIndex />
      <Container className="max-w-lg">
        <div className="rounded-lg border border-ritual-border bg-ritual-card p-5 shadow-soft md:p-7">
          <h1 className="font-serif text-3xl">Login to continue</h1>
          <p className="mt-2 text-sm text-ritual-muted">Your cart and checkout will stay linked to your account.</p>
          <div id="google-login-button" className="mt-6 flex min-h-[44px] justify-center" />
          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-ritual-muted">
            <span className="h-px flex-1 bg-ritual-border" /> or <span className="h-px flex-1 bg-ritual-border" />
          </div>
          <form onSubmit={submit} className="space-y-4">
            <Field label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
            <Field label="Password" type="password" value={form.password} onChange={(value) => setForm({ ...form, password: value })} />
            {error ? <p className="rounded-md bg-red-50 px-3 py-3 text-sm text-red-700">{error}</p> : null}
            <button type="submit" disabled={loading} className="focus-ring w-full rounded-md bg-ritual-text px-5 py-3 text-sm font-semibold text-ritual-card disabled:opacity-60">
              {loading ? 'Please wait...' : 'Login'}
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-ritual-muted">
            New here? <Link className="font-semibold text-ritual-text hover:text-ritual-gold" to={`/register?next=${encodeURIComponent(nextPath)}`}>Create account</Link>
          </p>
        </div>
      </Container>
    </section>
  );
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input required type={type} value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} />
    </label>
  );
}
