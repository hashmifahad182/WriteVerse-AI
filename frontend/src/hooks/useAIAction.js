import { useState, useCallback } from 'react';
import { aiWritingApi } from '../api/aiWriting.api.js';

const ACTION_MAP = {
  continue: aiWritingApi.continueWriting,
  rewrite: aiWritingApi.rewrite,
  improve: aiWritingApi.improve,
  expand: aiWritingApi.expand,
  shorten: aiWritingApi.shorten,
  tone: aiWritingApi.changeTone,
  dialogue: aiWritingApi.generateDialogue,
};

/**
 * Single hook powering every AI editor action (Continue, Rewrite,
 * Improve, Expand, Shorten, Change Tone, Generate Dialogue). Each
 * action follows the identical pattern: call endpoint -> loading state
 * -> return generated text + any consistency warnings. Parameterizing
 * by action type avoids writing this hook seven times.
 */
export function useAIAction(storyId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(
    async (actionType, payload) => {
      const apiCall = ACTION_MAP[actionType];
      if (!apiCall) throw new Error(`Unknown AI action: ${actionType}`);

      setLoading(true);
      setError(null);
      try {
        const { data } = await apiCall(storyId, payload);
        return data.data; // { text, warnings }
      } catch (err) {
        const message = err.response?.data?.message || 'AI request failed';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [storyId]
  );

  return { run, loading, error };
}
