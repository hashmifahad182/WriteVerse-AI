import { useEffect, useRef, useState } from 'react';
import { useDebounce } from './useDebounce.js';
import { chapterApi } from '../api/chapter.api.js';

/**
 * Auto-saves chapter content 800ms after the user stops typing.
 * Skips the very first render (no point saving unchanged content on load)
 * and tracks a simple status the UI can show ("Saved" / "Saving...").
 */
export function useAutoSave(storyId, chapterId, content) {
  const debouncedContent = useDebounce(content, 800);
  const [status, setStatus] = useState('idle'); // idle | saving | saved | error
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!storyId || !chapterId) return;

    let cancelled = false;

    async function save() {
      setStatus('saving');
      try {
        await chapterApi.update(storyId, chapterId, { content: debouncedContent });
        if (!cancelled) setStatus('saved');
      } catch {
        if (!cancelled) setStatus('error');
      }
    }

    save();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedContent, storyId, chapterId]);

  return status;
}
