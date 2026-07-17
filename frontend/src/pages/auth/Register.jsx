import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import Button from '../../components/common/Button.jsx';
import { Toast } from '../../components/common/Loader.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-surface">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl border border-surface-border bg-surface-raised p-8">
        <h1 className="mb-1 font-serif text-2xl font-semibold text-text-primary">Create an account</h1>
        <p className="mb-6 text-sm text-text-secondary">Start writing with your AI copilot</p>

        {error && <div className="mb-4"><Toast message={error} variant="error" /></div>}

        <div className="mb-4">
          <label className="mb-1 block text-sm text-text-secondary">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-text-primary outline-none focus:border-accent"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm text-text-secondary">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-text-primary outline-none focus:border-accent"
          />
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-sm text-text-secondary">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-text-primary outline-none focus:border-accent"
          />
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Create Account
        </Button>

        <p className="mt-4 text-center text-sm text-text-secondary">
          Already have an account? <Link to="/login" className="text-accent hover:underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}
