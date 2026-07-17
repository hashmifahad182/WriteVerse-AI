import { useState } from 'react';
import Dropdown from '../common/Dropdown.jsx';
import { Loader } from '../common/Loader.jsx';

const REWRITE_STYLES = ['professional', 'emotional', 'thriller', 'horror', 'romantic', 'funny'].map((s) => ({
  value: s,
  label: s[0].toUpperCase() + s.slice(1),
}));

const TONES = ['formal', 'friendly', 'academic', 'poetic', 'dark', 'mystery'].map((t) => ({
  value: t,
  label: t[0].toUpperCase() + t.slice(1),
}));

/**
 * Floating action menu shown when text is selected in the editor.
 * Fires the shared useAIAction hook and hands the result back to the
 * parent editor to insert/replace.
 */
export default function AIActionMenu({ selectedText, loading, onAction }) {
  const [pendingLabel, setPendingLabel] = useState('');

  const fire = (actionType, extra = {}) => {
    setPendingLabel(actionType);
    onAction(actionType, { selectedText, ...extra });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-surface-border bg-surface-raised px-3 py-2 shadow-xl">
      {loading ? (
        <Loader label={`Running ${pendingLabel}...`} />
      ) : (
        <>
          <button
            onClick={() => fire('improve')}
            className="rounded px-2.5 py-1 text-sm text-text-secondary hover:bg-surface-border hover:text-text-primary"
          >
            Improve
          </button>
          <button
            onClick={() => fire('expand')}
            className="rounded px-2.5 py-1 text-sm text-text-secondary hover:bg-surface-border hover:text-text-primary"
          >
            Expand
          </button>
          <button
            onClick={() => fire('shorten')}
            className="rounded px-2.5 py-1 text-sm text-text-secondary hover:bg-surface-border hover:text-text-primary"
          >
            Shorten
          </button>
          <Dropdown label="Rewrite as" options={REWRITE_STYLES} onSelect={(style) => fire('rewrite', { style })} />
          <Dropdown label="Change tone" options={TONES} onSelect={(tone) => fire('tone', { tone })} />
        </>
      )}
    </div>
  );
}
