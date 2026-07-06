import { useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Container from '../components/common/Container.jsx';
import SEO from '../components/common/SEO.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const inputClass = 'mt-1 w-full rounded-md border border-ritual-border bg-white px-3 py-3 text-sm outline-none transition focus:border-ritual-gold';

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nextPath = useMemo(() => new URLSearchParams(location.search).get('next') || '/checkout', [location.search]);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate(nextPath, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not create account.');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) return <Navigate to={nextPath} replace />;

  return (
    <section className="py-12 md:py-16">
      <SEO title="Create Account | DivineDhenu" description="Create a DivineDhenu customer account to checkout securely and keep your cart separate." path="/register" noIndex />
      <Container className="max-w-lg">
        <form onSubmit={submit} className="rounded-lg border border-ritual-border bg-ritual-card p-5 shadow-soft md:p-7">
          <h1 className="font-serif text-3xl">Create account</h1>
          <p className="mt-2 text-sm text-ritual-muted">Use this account for checkout and future order history.</p>
          <div className="mt-6 space-y-4">
            <Field label="Full name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
            <Field label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
            <Field label="Mobile number" type="tel" value={form.phone} onChange={(value) => setForm({ ...form, phone: value.replace(/\D/g, '').slice(0, 10) })} />
            <Field label="Password" type="password" value={form.password} onChange={(value) => setForm({ ...form, password: value })} />
          </div>
          {error ? <p className="mt-5 rounded-md bg-red-50 px-3 py-3 text-sm text-red-700">{error}</p> : null}
          <button type="submit" disabled={loading} className="focus-ring mt-6 w-full rounded-md bg-ritual-text px-5 py-3 text-sm font-semibold text-ritual-card disabled:opacity-60">
            {loading ? 'Please wait...' : 'Create account'}
          </button>
          <p className="mt-5 text-center text-sm text-ritual-muted">
            Already registered? <Link className="font-semibold text-ritual-text hover:text-ritual-gold" to={`/login?next=${encodeURIComponent(nextPath)}`}>Login</Link>
          </p>
        </form>
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
