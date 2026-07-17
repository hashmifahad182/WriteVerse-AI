import { useState } from 'react';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';

const TYPES = ['story', 'novel', 'blog', 'script'];

export default function CreateStoryModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState({ title: '', type: 'novel', genre: '', writingStyle: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      await onCreate(form);
      setForm({ title: '', type: 'novel', genre: '', writingStyle: '' });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create New Project"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={submitting}>
            Create
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-text-secondary">Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-text-primary outline-none focus:border-accent"
            placeholder="The Last Signal"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-text-secondary">Type</label>
          <div className="flex gap-2">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setForm({ ...form, type: t })}
                className={`rounded-lg border px-3 py-1.5 text-sm capitalize ${
                  form.type === t
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-surface-border text-text-secondary hover:bg-surface-border'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-text-secondary">Genre (optional)</label>
          <input
            value={form.genre}
            onChange={(e) => setForm({ ...form, genre: e.target.value })}
            className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-text-primary outline-none focus:border-accent"
            placeholder="Sci-fi thriller"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-text-secondary">Writing style (optional)</label>
          <input
            value={form.writingStyle}
            onChange={(e) => setForm({ ...form, writingStyle: e.target.value })}
            className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-text-primary outline-none focus:border-accent"
            placeholder="Dark, minimalist, fast-paced"
          />
        </div>
      </div>
    </Modal>
  );
}
