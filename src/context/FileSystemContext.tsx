import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { FileSystemContextType, PermissionState } from '../types/filesystem';
import { loadDirectoryHandle, saveDirectoryHandle } from '../lib/db';

// Create context with default values
const FileSystemContext = createContext<FileSystemContextType>({
  directoryHandle: null,
  permissionState: 'loading',
  errorMessage: null,
  selectDirectory: async () => {},
});

// Provider component
export const FileSystemProvider = ({ children }: { children: ReactNode }) => {
  const [directoryHandle, setDirectoryHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [permissionState, setPermissionState] = useState<PermissionState>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check or request permission for a directory handle
  const checkPermission = useCallback(async (handle: FileSystemDirectoryHandle, request = false) => {
    try {
      // Query current permission state
      let permission = await handle.queryPermission({ mode: 'readwrite' });
      
      // Request permission if needed and if request flag is true
      if (permission !== 'granted' && request) {
        permission = await handle.requestPermission({ mode: 'readwrite' });
      }
      
      // Update state based on permission
      setPermissionState(permission as PermissionState);
      setErrorMessage(null);
      
      return permission === 'granted';
    } catch (error) {
      console.error('Error checking/requesting permission:', error);
      setPermissionState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error checking permissions');
      return false;
    }
  }, []);

  // Initialize context on mount
  useEffect(() => {
    const initializeFileSystem = async () => {
      try {
        setPermissionState('loading');
        
        // Load handle from IndexedDB
        const handle = await loadDirectoryHandle();
        
        if (handle) {
          // Check permission without requesting initially
          const hasPermission = await checkPermission(handle, false);
          
          if (hasPermission) {
            setDirectoryHandle(handle);
          } else {
            // If permission is not granted but we have a handle, we need to ask
            setDirectoryHandle(handle);
          }
        } else {
          // No stored handle, set state to prompt
          setPermissionState('prompt');
          setDirectoryHandle(null);
        }
      } catch (error) {
        console.error('Error initializing file system:', error);
        setPermissionState('error');
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error initializing file system');
        setDirectoryHandle(null);
      }
    };

    initializeFileSystem();
  }, [checkPermission]);

  // Function to select directory and request permission
  const selectDirectory = useCallback(async () => {
    try {
      setPermissionState('loading');
      setErrorMessage(null);
      
      // Show directory picker
      const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
      
      // Request permission immediately
      const hasPermission = await checkPermission(handle, true);
      
      if (hasPermission) {
        // Save handle and update state
        await saveDirectoryHandle(handle);
        setDirectoryHandle(handle);
      } else {
        // Permission denied
        setDirectoryHandle(null);
      }
    } catch (error) {
      console.error('Error selecting directory:', error);
      
      // Handle user cancellation (AbortError) gracefully
      if (error instanceof DOMException && error.name === 'AbortError') {
        // If we already have a directory handle, keep its state
        if (directoryHandle) {
          setPermissionState(permissionState);
        } else {
          setPermissionState('prompt');
        }
      } else {
        // Other errors
        setPermissionState('error');
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error selecting directory');
        setDirectoryHandle(null);
      }
    }
  }, [checkPermission, directoryHandle, permissionState]);

  // Context value
  const value = {
    directoryHandle,
    permissionState,
    errorMessage,
    selectDirectory,
  };

  return (
    <FileSystemContext.Provider value={value}>
      {children}
    </FileSystemContext.Provider>
  );
};

// Custom hook for using the context
export const useFileSystem = () => {
  const context = useContext(FileSystemContext);
  
  if (context === undefined) {
    throw new Error('useFileSystem must be used within a FileSystemProvider');
  }
  
  return context;
};

export default FileSystemContext;
