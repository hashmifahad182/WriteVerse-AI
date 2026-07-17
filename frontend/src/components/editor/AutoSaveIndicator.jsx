const LABELS = {
  idle: '',
  saving: 'Saving...',
  saved: 'Saved',
  error: 'Failed to save',
};

const COLORS = {
  idle: '',
  saving: 'text-text-muted',
  saved: 'text-green-400',
  error: 'text-red-400',
};

export default function AutoSaveIndicator({ status }) {
  if (!LABELS[status]) return null;
  return <span className={`text-xs ${COLORS[status]}`}>{LABELS[status]}</span>;
}
