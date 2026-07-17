const EVENT_ICONS = {
  major_event: '⚡',
  character_introduction: '👤',
  character_death: '💀',
  location_change: '📍',
  flashback: '⏪',
  plot_twist: '🌀',
  important_object: '🔑',
  relationship_change: '💫',
  time_skip: '⏭️',
};

export default function TimelineEventCard({ event, onEdit }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-surface-border bg-surface-raised text-sm">
          {EVENT_ICONS[event.eventType] || '•'}
        </div>
        <div className="w-px flex-1 bg-surface-border" />
      </div>

      <div
        onClick={() => onEdit(event)}
        className="mb-6 flex-1 cursor-pointer rounded-lg border border-surface-border bg-surface-raised p-4 hover:border-accent/40"
      >
        <div className="mb-1 flex items-center justify-between">
          <h4 className="font-medium text-text-primary">{event.title}</h4>
          {event.isManuallyEdited && (
            <span className="text-xs text-text-muted">edited</span>
          )}
        </div>
        <p className="text-sm text-text-secondary">{event.description}</p>
        <div className="mt-2 flex gap-3 text-xs text-text-muted">
          <span className="capitalize">{event.eventType.replace('_', ' ')}</span>
          {event.location && <span>📍 {event.location}</span>}
          {event.storyTimeReference && <span>🕐 {event.storyTimeReference}</span>}
        </div>
      </div>
    </div>
  );
}
