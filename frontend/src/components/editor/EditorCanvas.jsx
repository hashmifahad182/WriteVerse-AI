import { useRef, useState, useCallback, useEffect } from 'react';
import EditorToolbar from './EditorToolbar.jsx';
import AIActionMenu from './AIActionMenu.jsx';
import { useAIAction } from '../../hooks/useAIAction.js';

/**
 * A contentEditable-based writing surface (Notion-style). We deliberately
 * avoid a heavy rich-text framework (Slate/TipTap) here to keep the
 * dependency footprint small for this project scope — contentEditable
 * + execCommand covers Bold/Italic/Underline/Lists/Headings adequately.
 */
export default function EditorCanvas({ storyId, chapterId, content, onChange }) {
  const editorRef = useRef(null);
  const [selectedText, setSelectedText] = useState('');
  const [menuPosition, setMenuPosition] = useState(null);
  const { run, loading } = useAIAction(storyId);

  useEffect(() => {
    // Only update editor if content has actually changed
    // to avoid clearing when switching to a chapter
    if (editorRef.current) {
      const currentContent = content || '';
      if (editorRef.current.innerHTML !== currentContent) {
        editorRef.current.innerHTML = currentContent;
      }
    }
  }, [chapterId, content]);

  const handleInput = useCallback(() => {
    onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const handleCommand = (cmd) => {
    if (cmd.startsWith('formatBlock:')) {
      document.execCommand('formatBlock', false, cmd.split(':')[1]);
    } else {
      document.execCommand(cmd, false, null);
    }
    handleInput();
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (text && text.length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectedText(text);
      setMenuPosition({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });
    } else {
      setSelectedText('');
      setMenuPosition(null);
    }
  };

  const handleAiAction = async (actionType, payload) => {
    try {
      const result = await run(actionType, { chapterId, ...payload });
      // Replace the current selection with the AI result
      document.execCommand('insertText', false, result.text);
      handleInput();

      if (result.warnings?.length > 0) {
        // eslint-disable-next-line no-alert
        console.warn('Consistency warnings:', result.warnings);
      }
    } finally {
      setMenuPosition(null);
    }
  };

  const handleContinueWriting = async () => {
    const cursorContext = editorRef.current.innerText.slice(-2000);
    const result = await run('continue', { chapterId, cursorContext });
    document.execCommand('insertText', false, '\n\n' + result.text);
    handleInput();
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-surface-border bg-surface-raised">
      <EditorToolbar onCommand={handleCommand} />

      <div className="relative flex-1 overflow-y-auto px-8 py-6">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onMouseUp={handleMouseUp}
          onKeyUp={handleMouseUp}
          className="prose prose-invert min-h-[400px] max-w-none font-serif text-[17px] leading-relaxed text-text-primary outline-none"
          data-placeholder="Start writing..."
        />

        {menuPosition && (
          <div
            style={{ position: 'absolute', top: menuPosition.top - 100, left: menuPosition.left }}
          >
            <AIActionMenu selectedText={selectedText} loading={loading} onAction={handleAiAction} />
          </div>
        )}
      </div>

      <div className="flex items-center justify-end border-t border-surface-border px-4 py-2">
        <button
          onClick={handleContinueWriting}
          disabled={loading}
          className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
        >
          {loading ? 'Generating...' : '✨ Continue Writing'}
        </button>
      </div>
    </div>
  );
}
