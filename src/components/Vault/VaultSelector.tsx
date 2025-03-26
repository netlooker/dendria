import { FolderOpen, CheckCircle, AlertTriangle, HelpCircle, Loader } from 'lucide-react';
import { useFileSystem } from '../../context/FileSystemContext';

const VaultSelector = () => {
  const { directoryHandle, permissionState, selectDirectory, errorMessage } = useFileSystem();

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Vault Directory</h2>
      
      {permissionState === 'loading' && (
        <div className="flex items-center gap-2 p-2 rounded bg-gray-100 dark:bg-gray-800">
          <Loader size={20} className="text-blue-600 animate-spin" />
          <span>Loading vault...</span>
        </div>
      )}
      
      {permissionState === 'granted' && directoryHandle && (
        <div className="flex items-center justify-between p-2 rounded bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900">
          <div className="flex items-center gap-2">
            <CheckCircle size={20} className="text-green-600 dark:text-green-500" />
            <span className="font-medium">{directoryHandle.name}</span>
          </div>
          <button 
            onClick={selectDirectory}
            className="text-xs py-1 px-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Change
          </button>
        </div>
      )}
      
      {permissionState === 'prompt' && (
        <button
          onClick={selectDirectory}
          className="flex items-center gap-2 w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <FolderOpen size={20} />
          <span>Select Vault Directory</span>
        </button>
      )}
      
      {permissionState === 'denied' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 rounded bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900">
            <AlertTriangle size={20} className="text-amber-600 dark:text-amber-500" />
            <span className="font-medium">Permission Denied</span>
          </div>
          <button
            onClick={selectDirectory}
            className="flex items-center gap-2 w-full p-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <FolderOpen size={20} />
            <span>Try Again</span>
          </button>
        </div>
      )}
      
      {permissionState === 'error' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 rounded bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900">
            <AlertTriangle size={20} className="text-red-600 dark:text-red-500" />
            <span className="font-medium">Error</span>
          </div>
          {errorMessage && (
            <p className="text-xs text-red-600 dark:text-red-400 p-2 bg-red-50 dark:bg-red-900/10 rounded">
              {errorMessage}
            </p>
          )}
          <button
            onClick={selectDirectory}
            className="flex items-center gap-2 w-full p-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <FolderOpen size={20} />
            <span>Try Again</span>
          </button>
        </div>
      )}
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {directoryHandle 
          ? `Selected: ${directoryHandle.name}`
          : 'Choose a folder to store your notes'}
      </p>
    </div>
  );
};

export default VaultSelector;
