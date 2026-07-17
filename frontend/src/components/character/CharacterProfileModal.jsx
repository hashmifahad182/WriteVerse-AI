import { useState, useEffect } from 'react';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';

const FIELDS = [
  ['age', 'Age'],
  ['gender', 'Gender'],
  ['personality', 'Personality'],
  ['background', 'Background'],
  ['goals', 'Goals'],
  ['speakingStyle', 'Speaking Style'],
  ['lastKnownLocation', 'Last Known Location'],
];

export default function CharacterProfileModal({ character, open, onClose, onSave }) {
  const [form, setForm] = useState(character || {});

  useEffect(() => setForm(character || {}), [character]);

  if (!character) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={character.name}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(form)}>Save</Button>
        </>
      }
    >
      <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
        {FIELDS.map(([key, label]) => (
          <div key={key}>
            <label className="mb-1 block text-sm text-text-secondary">{label}</label>
            <input
              value={form[key] || ''}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
            />
          </div>
        ))}

        <div>
          <label className="mb-1 block text-sm text-text-secondary">Important Facts (locked)</label>
          <ul className="space-y-1 text-sm text-text-muted">
            {(character.importantFacts || []).map((fact, i) => (
              <li key={i}>• {fact}</li>
            ))}
            {(!character.importantFacts || character.importantFacts.length === 0) && (
              <li className="italic">None recorded yet — the AI adds these automatically.</li>
            )}
          </ul>
        </div>
      </div>
    </Modal>
  );
}
