import { useState } from 'react';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';
import { POV_OPTIONS } from '../../utils/constants.js';
import { chapterApi } from '../../api/chapter.api.js';

export default function GenerateChapterModal({ storyId, open, onClose, onGenerated }) {
  const [form, setForm] = useState({
    title: '',
    wordCount: 1500,
    genre: '',
    writingStyle: '',
    pov: 'third_person',
    instructions: '',
  });
  const [loading, setLoading] = useState(false);
  const [warnings, setWarnings] = useState([]);

  const handleGenerate = async () => {
    if (!form.title.trim()) return;
    setLoading(true);
    setWarnings([]);
    try {
      const { data } = await chapterApi.generate(storyId, form);
      onGenerated(data.data.chapter);
      if (data.data.warnings?.length > 0) setWarnings(data.data.warnings);
      else onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Generate Next Chapter"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} loading={loading}>
            Generate
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-text-secondary">Chapter Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-text-primary outline-none focus:border-accent"
            placeholder="The Signal Returns"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm text-text-secondary">Target Word Count</label>
            <input
              type="number"
              min={200}
              max={8000}
              value={form.wordCount}
              onChange={(e) => setForm({ ...form, wordCount: Number(e.target.value) })}
              className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-text-primary outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-text-secondary">POV</label>
            <select
              value={form.pov}
              onChange={(e) => setForm({ ...form, pov: e.target.value })}
              className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-text-primary outline-none focus:border-accent"
            >
              {POV_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-text-secondary">Additional Instructions (optional)</label>
          <textarea
            value={form.instructions}
            onChange={(e) => setForm({ ...form, instructions: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-text-primary outline-none focus:border-accent"
            placeholder="Introduce the antagonist's motive, build tension toward the reveal..."
          />
        </div>

        {warnings.length > 0 && (
          <div className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-3 text-sm text-yellow-400">
            <p className="mb-1 font-medium">Consistency warnings:</p>
            <ul className="list-disc pl-4">
              {warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
}
