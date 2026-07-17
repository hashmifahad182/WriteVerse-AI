import { useParams, Link } from 'react-router-dom';
import ChatWindow from '../components/chat/ChatWindow.jsx';

export default function ChatPage() {
  const { storyId } = useParams();

  return (
    <div className="flex h-screen flex-col bg-surface">
      <header className="border-b border-surface-border px-8 py-4">
        <Link to={`/stories/${storyId}`} className="text-xs text-text-muted hover:text-text-secondary">
          ← Back to editor
        </Link>
        <h1 className="mt-1 font-serif text-xl font-semibold text-text-primary">Ask Your Story</h1>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-8 py-6">
        <ChatWindow storyId={storyId} />
      </main>
    </div>
  );
}
