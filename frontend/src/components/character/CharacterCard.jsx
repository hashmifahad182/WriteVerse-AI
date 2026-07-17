const STATUS_COLORS = {
  alive: 'bg-green-500/15 text-green-300',
  dead: 'bg-red-500/15 text-red-300',
  missing: 'bg-yellow-500/15 text-yellow-300',
  unknown: 'bg-gray-500/15 text-gray-300',
};

export default function CharacterCard({ character, onClick }) {
  return (
    <div
      onClick={() => onClick(character)}
      className="cursor-pointer rounded-xl border border-surface-border bg-surface-raised p-4 hover:border-accent/40"
    >
      <div className="mb-2 flex items-center justify-between">
        <h4 className="font-medium text-text-primary">{character.name}</h4>
        <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_COLORS[character.status]}`}>
          {character.status}
        </span>
      </div>
      <p className="line-clamp-2 text-sm text-text-secondary">
        {character.personality || 'No personality notes yet.'}
      </p>
    </div>
  );
}
