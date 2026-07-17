import { createContext, useState, useMemo } from 'react';

export const EditorContext = createContext(null);

export function EditorProvider({ children }) {
  const [activeChapter, setActiveChapter] = useState(null);
  const [selection, setSelection] = useState({ text: '', range: null });

  const value = useMemo(
    () => ({ activeChapter, setActiveChapter, selection, setSelection }),
    [activeChapter, selection]
  );

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}
