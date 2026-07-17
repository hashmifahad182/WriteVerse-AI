import { useState, useRef, useEffect } from 'react';

export default function Dropdown({ label, options, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-lg border border-surface-border bg-surface-raised px-3 py-1.5 text-sm text-text-primary hover:bg-surface-border"
      >
        {label} ▾
      </button>
      {open && (
        <div className="absolute z-20 mt-1 min-w-[160px] rounded-lg border border-surface-border bg-surface-raised py-1 shadow-xl">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onSelect(opt.value);
                setOpen(false);
              }}
              className="block w-full px-3 py-1.5 text-left text-sm text-text-secondary hover:bg-surface-border hover:text-text-primary"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
