export function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex items-center gap-2 text-text-secondary text-sm">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-surface-border border-t-accent" />
      {label}
    </div>
  );
}

export function Toast({ message, variant = 'info', onDismiss }) {
  const variants = {
    info: 'border-accent/40 bg-accent/10 text-accent',
    error: 'border-red-500/40 bg-red-500/10 text-red-400',
    warning: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400',
    success: 'border-green-500/40 bg-green-500/10 text-green-400',
  };

  return (
    <div className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${variants[variant]}`}>
      <span>{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="text-current opacity-70 hover:opacity-100">
          ✕
        </button>
      )}
    </div>
  );
}
