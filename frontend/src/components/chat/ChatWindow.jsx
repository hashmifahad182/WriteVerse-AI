import { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage.jsx';
import { Loader } from '../common/Loader.jsx';
import { aiChatApi } from '../../api/aiChat.api.js';

export default function ChatWindow({ storyId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    aiChatApi.history(storyId).then(({ data }) => setMessages(data.data.messages));
  }, [storyId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question || loading) return;

    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await aiChatApi.ask(storyId, question);
      setMessages((prev) => [...prev, { role: 'assistant', content: data.data.answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong answering that.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-surface-border bg-surface-raised">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-text-muted">
            Ask anything about your story — "What happened in Chapter 4?", "Who knows the secret?"
          </p>
        )}
        {messages.map((m, i) => (
          <ChatMessage key={i} role={m.role} content={m.content} />
        ))}
        {loading && <Loader label="Thinking..." />}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 border-t border-surface-border p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about your story..."
          className="flex-1 rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
