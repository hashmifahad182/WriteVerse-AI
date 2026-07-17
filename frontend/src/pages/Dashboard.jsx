import { useState, useEffect } from 'react';
import { storyApi } from '../api/story.api.js';
import { useAuth } from '../hooks/useAuth.js';
import StoryCard from '../components/dashboard/StoryCard.jsx';
import CreateStoryModal from '../components/dashboard/CreateStoryModal.jsx';
import Button from '../components/common/Button.jsx';
import { Loader } from '../components/common/Loader.jsx';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    storyApi.list().then(({ data }) => {
      setStories(data.data.stories);
      setLoading(false);
    });
  }, []);

  const handleCreate = async (payload) => {
    const { data } = await storyApi.create(payload);
    setStories((prev) => [data.data.story, ...prev]);
  };

  const handleDelete = async (storyId) => {
    await storyApi.remove(storyId);
    setStories((prev) => prev.filter((s) => s._id !== storyId));
  };

  return (
    <div className="min-h-screen bg-surface">
      <header className="flex items-center justify-between border-b border-surface-border px-8 py-4">
        <h1 className="font-serif text-xl font-semibold text-text-primary">AI Writer Copilot</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-text-secondary">{user?.name}</span>
          <Button variant="ghost" size="sm" onClick={logout}>
            Log out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-medium text-text-primary">Your Projects</h2>
          <Button onClick={() => setModalOpen(true)}>+ New Project</Button>
        </div>

        {loading ? (
          <Loader label="Loading projects..." />
        ) : stories.length === 0 ? (
          <div className="rounded-xl border border-dashed border-surface-border p-16 text-center text-text-muted">
            No projects yet. Create your first story, novel, blog, or script.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <StoryCard key={story._id} story={story} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>

      <CreateStoryModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreate} />
    </div>
  );
}
