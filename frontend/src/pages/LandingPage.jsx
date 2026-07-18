import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Button from '../components/common/Button.jsx';
import landingIllustration from '../assets/landing-illustration.svg';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [loading, navigate, user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-text-secondary">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-text-primary">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-8">
        <header className="flex items-center justify-between">
          <div className="font-serif text-2xl font-semibold text-text-primary">WriteVerse</div>
          <Link to="/login" className="text-sm text-text-secondary transition hover:text-accent">
            Sign in
          </Link>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center gap-10 py-10 lg:flex-row lg:gap-16">
          <section className="max-w-xl">
            <div className="mb-5 inline-flex rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-sm text-accent">
              AI-powered storytelling workspace
            </div>
            <h1 className="mb-4 font-serif text-4xl font-semibold leading-tight text-text-primary sm:text-5xl">
              Turn your next chapter into a living story with WriteVerse.
            </h1>
            <p className="mb-8 text-lg leading-8 text-text-secondary">
              Create characters, map timelines, and brainstorm scenes in one calm creative space designed for writers.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/login">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary" size="lg">
                  Create account
                </Button>
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-surface-border bg-surface-raised p-4">
                <p className="text-sm font-semibold text-text-primary">Smart ideas</p>
                <p className="mt-1 text-sm text-text-secondary">Generate prompts and plot beats instantly.</p>
              </div>
              <div className="rounded-2xl border border-surface-border bg-surface-raised p-4">
                <p className="text-sm font-semibold text-text-primary">Character focus</p>
                <p className="mt-1 text-sm text-text-secondary">Keep arcs, traits, and voices consistent.</p>
              </div>
              <div className="rounded-2xl border border-surface-border bg-surface-raised p-4">
                <p className="text-sm font-semibold text-text-primary">Story clarity</p>
                <p className="mt-1 text-sm text-text-secondary">Track chapters and timelines from one view.</p>
              </div>
            </div>
          </section>

          <section className="w-full max-w-lg">
            <div className="rounded-[28px] border border-surface-border bg-surface-raised p-4 shadow-2xl shadow-black/20">
              <img src={landingIllustration} alt="WriteVerse app preview" className="w-full rounded-[20px] object-cover" />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
