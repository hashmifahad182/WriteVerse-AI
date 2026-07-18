import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storyApi } from '../api/story.api.js';
import { chapterApi } from '../api/chapter.api.js';
import EditorCanvas from '../components/editor/EditorCanvas.jsx';
import AutoSaveIndicator from '../components/editor/AutoSaveIndicator.jsx';
import GenerateChapterModal from '../components/editor/GenerateChapterModal.jsx';
import Button from '../components/common/Button.jsx';
import { Loader } from '../components/common/Loader.jsx';
import { useAutoSave } from '../hooks/useAutoSave.js';

export default function StoryEditor() {
  const { storyId } = useParams();
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [activeChapterId, setActiveChapterId] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [genModalOpen, setGenModalOpen] = useState(false);

  const activeChapter = chapters.find((c) => c._id === activeChapterId);
  
  const handleChapterSaved = useCallback((updatedChapter) => {
    setChapters((prev) =>
      prev.map((ch) => (ch._id === updatedChapter._id ? updatedChapter : ch))
    );
  }, []);
  
  const saveStatus = useAutoSave(storyId, activeChapterId, content, handleChapterSaved);

  useEffect(() => {
    async function load() {
      const [storyRes, chaptersRes] = await Promise.all([
        storyApi.get(storyId),
        chapterApi.list(storyId),
      ]);
      setStory(storyRes.data.data.story);
      const loadedChapters = chaptersRes.data.data.chapters;
      setChapters(loadedChapters);
      if (loadedChapters.length > 0) {
        setActiveChapterId(loadedChapters[0]._id);
        setContent(loadedChapters[0].content);
      }
      setLoading(false);
    }
    load();
  }, [storyId]);

  const selectChapter = (chapter) => {
    setActiveChapterId(chapter._id);
    setContent(chapter.content);
  };

  const handleNewChapter = async () => {
    const { data } = await chapterApi.create(storyId, {
      title: `Chapter ${chapters.length + 1}`,
      order: chapters.length + 1,
      content: '',
    });
    setChapters((prev) => [...prev, data.data.chapter]);
    selectChapter(data.data.chapter);
  };

  const handleGenerated = useCallback((chapter) => {
    setChapters((prev) => [...prev, chapter]);
    setActiveChapterId(chapter._id);
    setContent(chapter.content);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <Loader label="Loading story..." />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-surface">
      {/* Sidebar */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-surface-border">
        <div className="border-b border-surface-border p-4">
          <Link to="/" className="text-xs text-text-muted hover:text-text-secondary">
            ← All Projects
          </Link>
          <h2 className="mt-1 truncate font-serif text-lg font-semibold text-text-primary">
            {story.title}
          </h2>
          <div className="mt-2 flex gap-2">
            <Link to={`/stories/${storyId}/timeline`} className="text-xs text-accent hover:underline">
              Timeline
            </Link>
            <Link to={`/stories/${storyId}/chat`} className="text-xs text-accent hover:underline">
              AI Chat
            </Link>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {chapters.map((chapter) => (
            <button
              key={chapter._id}
              onClick={() => selectChapter(chapter)}
              className={`mb-1 block w-full truncate rounded-lg px-3 py-2 text-left text-sm ${
                chapter._id === activeChapterId
                  ? 'bg-accent/15 text-accent'
                  : 'text-text-secondary hover:bg-surface-raised'
              }`}
            >
              {chapter.title}
            </button>
          ))}
        </div>

        <div className="space-y-2 border-t border-surface-border p-3">
          <Button variant="secondary" className="w-full" onClick={handleNewChapter}>
            + Blank Chapter
          </Button>
          <Button className="w-full" onClick={() => setGenModalOpen(true)}>
            ✨ Generate with AI
          </Button>
        </div>
      </aside>

      {/* Main editor area */}
      <main className="flex flex-1 flex-col p-6">
        {activeChapter ? (
          <>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-serif text-xl text-text-primary">{activeChapter.title}</h3>
              <AutoSaveIndicator status={saveStatus} />
            </div>
            <div className="flex-1">
              <EditorCanvas
                key={activeChapterId}
                storyId={storyId}
                chapterId={activeChapterId}
                content={content}
                onChange={setContent}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-text-muted">
            No chapters yet. Create one to start writing.
          </div>
        )}
      </main>

      <GenerateChapterModal
        storyId={storyId}
        open={genModalOpen}
        onClose={() => setGenModalOpen(false)}
        onGenerated={handleGenerated}
      />
    </div>
  );
}
