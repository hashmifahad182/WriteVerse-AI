import { useNavigate } from 'react-router-dom';

const TYPE_COLORS = {
  novel: 'bg-purple-500/15 text-purple-300',
  story: 'bg-blue-500/15 text-blue-300',
  blog: 'bg-green-500/15 text-green-300',
  script: 'bg-orange-500/15 text-orange-300',
};

export default function StoryCard({ story, onDelete }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/stories/${story._id}`)}
      className="group cursor-pointer rounded-xl border border-surface-border bg-surface-raised p-5 transition-colors hover:border-accent/50"
    >
      <div className="mb-3 flex items-start justify-between">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_COLORS[story.type] || ''}`}>
          {story.type}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(story._id);
          }}
          className="text-text-muted opacity-0 hover:text-red-400 group-hover:opacity-100"
        >
          ✕
        </button>
      </div>
      <h3 className="mb-1 truncate font-serif text-lg font-semibold text-text-primary">{story.title}</h3>
      <p className="mb-3 text-sm text-text-secondary">{story.genre || 'No genre set'}</p>
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>{story.wordCount?.toLocaleString() || 0} words</span>
        <span className="capitalize">{story.status.replace('_', ' ')}</span>
      </div>
    </div>
  );
}
