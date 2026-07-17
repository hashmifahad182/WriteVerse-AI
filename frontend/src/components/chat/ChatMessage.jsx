export default function ChatMessage({ role, content }) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
          isUser
            ? 'bg-accent text-white'
            : 'border border-surface-border bg-surface-raised text-text-primary'
        }`}
      >
        {content}
      </div>
    </div>
  );
}
