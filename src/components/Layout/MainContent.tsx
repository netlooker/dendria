import { useFileSystem } from '../../context/FileSystemContext';
import { FolderOpen, AlertTriangle, FileText } from 'lucide-react';
import NoteEditor from '../Editor/NoteEditor';

const MainContent = () => {
  const { 
    permissionState, 
    directoryHandle, 
    activeFileHandle, 
    activeFileContent, 
    isFileContentLoading, 
    errorMessage 
  } = useFileSystem();

  return (
    <div className="flex-1 h-screen overflow-auto p-6">
      {permissionState === 'prompt' && (
        <div className="flex flex-col items-center justify-center h-full">
          <FolderOpen size={64} className="text-blue-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Vault Selected</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
            Please select a vault directory from the sidebar to get started with Dendria
          </p>
        </div>
      )}

      {permissionState === 'denied' && (
        <div className="flex flex-col items-center justify-center h-full">
          <AlertTriangle size={64} className="text-amber-500 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Permission Denied</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
            Dendria needs permission to access your vault directory. Please try selecting it again.
          </p>
        </div>
      )}

      {permissionState === 'granted' && directoryHandle && (
        <>
          {!activeFileHandle ? (
            <div className="flex flex-col items-center justify-center h-full">
              <FileText size={64} className="text-green-600 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Vault Connected</h2>
              <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                Ready to work with your notes in <strong>{directoryHandle.name}</strong>
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-4">
                Select a note from the sidebar to view its content
              </p>
            </div>
          ) : (
            <NoteEditor 
              content={activeFileContent} 
              isLoading={isFileContentLoading} 
              error={errorMessage} 
            />
          )}
        </>
      )}

      {permissionState === 'loading' && (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-dendria-primary"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading vault...</p>
        </div>
      )}

      {permissionState === 'error' && (
        <div className="flex flex-col items-center justify-center h-full">
          <AlertTriangle size={64} className="text-red-500 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
            An error occurred while trying to access the vault directory. Please try again.
          </p>
        </div>
      )}
    </div>
  );
};

export default MainContent;
