import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { timelineApi } from '../api/timeline.api.js';
import TimelineView from '../components/timeline/TimelineView.jsx';
import { Loader } from '../components/common/Loader.jsx';

export default function TimelinePage() {
  const { storyId } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    timelineApi.list(storyId).then(({ data }) => {
      setEvents(data.data.events);
      setLoading(false);
    });
  }, [storyId]);

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-surface-border px-8 py-4">
        <Link to={`/stories/${storyId}`} className="text-xs text-text-muted hover:text-text-secondary">
          ← Back to editor
        </Link>
        <h1 className="mt-1 font-serif text-xl font-semibold text-text-primary">Story Timeline</h1>
      </header>

      <main className="px-8 py-8">
        {loading ? <Loader label="Loading timeline..." /> : <TimelineView events={events} onEdit={() => {}} />}
      </main>
    </div>
  );
}
