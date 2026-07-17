import TimelineEventCard from './TimelineEventCard.jsx';

export default function TimelineView({ events, onEdit }) {
  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-surface-border p-10 text-center text-text-muted">
        No timeline events yet. Events are created automatically as you write chapters, or you can add
        them manually.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {events.map((event) => (
        <TimelineEventCard key={event._id} event={event} onEdit={onEdit} />
      ))}
    </div>
  );
}
