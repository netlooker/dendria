import { FC } from 'react';
import Editor from '@monaco-editor/react';
import { Loader, AlertTriangle } from 'lucide-react';

interface NoteEditorProps {
  content: string | null;
  isLoading: boolean;
  error: string | null;
}

const NoteEditor: FC<NoteEditorProps> = ({ content, isLoading, error }) => {
  // If there's an error, display error message
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <AlertTriangle size={64} className="text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Error Loading Note</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">{error}</p>
      </div>
    );
  }

  // If loading, display loading indicator
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Loader size={48} className="animate-spin text-blue-500 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Loading note content...</p>
      </div>
    );
  }

  // If no content (no file selected), display a message
  if (content === null) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Select a note from the sidebar to view its content
        </p>
      </div>
    );
  }

  // Render the Monaco editor with the file content
  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        language="markdown"
        value={content}
        options={{
          readOnly: true,
          wordWrap: 'on',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          scrollbar: {
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10
          }
        }}
        theme="vs-dark"
      />
    </div>
  );
};

export default NoteEditor;
