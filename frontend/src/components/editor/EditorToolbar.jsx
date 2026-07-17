const TOOLS = [
  { cmd: 'bold', label: 'B', className: 'font-bold' },
  { cmd: 'italic', label: 'I', className: 'italic' },
  { cmd: 'underline', label: 'U', className: 'underline' },
  { cmd: 'insertUnorderedList', label: '• List' },
  { cmd: 'formatBlock:h2', label: 'H2' },
  { cmd: 'formatBlock:h3', label: 'H3' },
];

export default function EditorToolbar({ onCommand }) {
  return (
    <div className="flex items-center gap-1 border-b border-surface-border bg-surface-raised px-3 py-2">
      {TOOLS.map((tool) => (
        <button
          key={tool.cmd}
          onMouseDown={(e) => e.preventDefault()} // preserve text selection
          onClick={() => onCommand(tool.cmd)}
          className={`rounded px-2.5 py-1 text-sm text-text-secondary hover:bg-surface-border hover:text-text-primary ${tool.className || ''}`}
        >
          {tool.label}
        </button>
      ))}
    </div>
  );
}
