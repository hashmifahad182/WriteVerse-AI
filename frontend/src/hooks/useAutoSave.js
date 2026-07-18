import { useEffect, useRef, useState } from 'react';
import { chapterApi } from '../api/chapter.api.js';

const SAVE_DELAY_MS = 800;

/**
 * Auto-saves chapter content 800ms after the user stops typing.
 *
 * IMPORTANT: content and chapterId must always be saved as a matched
 * pair. A naive "debounce the content, separately react to chapterId"
 * approach breaks the moment a chapter switch happens inside the
 * debounce window: chapterId updates immediately, but debounced
 * content takes another 800ms to catch up — so a save can fire with
 * the OLD chapter's text against the NEW chapter's id, silently
 * overwriting it. This implementation tracks which chapterId a
 * pending save belongs to and cancels/skips it the instant the
 * chapter changes, instead of letting it fire against the new one.
 */
export function useAutoSave(storyId, chapterId, content, onSave) {
  const [status, setStatus] = useState('idle'); // idle | saving | saved | error
  const timerRef = useRef(null);
  const lastChapterIdRef = useRef(chapterId);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip the very first render — nothing to save on initial load.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      lastChapterIdRef.current = chapterId;
      return;
    }

    // Chapter just switched: cancel any pending save that was scheduled
    // for the PREVIOUS chapter's content instead of letting it fire
    // against this new chapterId. Reset status since this is a freshly
    // loaded chapter, not a dirty one.
    if (lastChapterIdRef.current !== chapterId) {
      if (timerRef.current) clearTimeout(timerRef.current);
      lastChapterIdRef.current = chapterId;
      setStatus('idle');
      return;
    }

    if (!storyId || !chapterId) return;

    // Same chapter, content changed (i.e. the user is typing) — debounce.
    if (timerRef.current) clearTimeout(timerRef.current);
    setStatus('saving');

    timerRef.current = setTimeout(async () => {
      // Guard again at fire-time: if the chapter changed since this
      // timer was scheduled, this content no longer belongs to
      // chapterId — do not save it.
      if (lastChapterIdRef.current !== chapterId) return;
      try {
        const response = await chapterApi.update(storyId, chapterId, { content });
        // Notify parent to refresh chapters array with updated chapter data
        if (onSave && response.data?.data?.chapter) {
          onSave(response.data.data.chapter);
        }
        setStatus('saved');
      } catch {
        setStatus('error');
      }
    }, SAVE_DELAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, storyId, chapterId, onSave]);

  return status;
}
