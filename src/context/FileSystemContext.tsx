import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { FileSystemContextType, PermissionState } from '../types/filesystem';
import { VaultEntry, VaultFile, VaultDirectory } from '../types/hierarchy';
import { loadDirectoryHandle, saveDirectoryHandle } from '../lib/db';

// Create context with default values
const FileSystemContext = createContext<FileSystemContextType>({
  directoryHandle: null,
  permissionState: 'loading',
  errorMessage: null,
  hierarchyData: null,
  isHierarchyLoading: false,
  activeFileHandle: null,
  activeFileContent: null,
  isFileContentLoading: false,
  selectDirectory: async () => {},
  readVaultHierarchy: async () => {},
  setActiveFile: () => {},
  readFileContent: async () => null,
});

// Provider component
export const FileSystemProvider = ({ children }: { children: ReactNode }) => {
  const [directoryHandle, setDirectoryHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [permissionState, setPermissionState] = useState<PermissionState>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hierarchyData, setHierarchyData] = useState<VaultEntry[] | null>(null);
  const [isHierarchyLoading, setIsHierarchyLoading] = useState<boolean>(false);
  const [activeFileHandle, setActiveFileHandle] = useState<FileSystemFileHandle | null>(null);
  const [activeFileContent, setActiveFileContent] = useState<string | null>(null);
  const [isFileContentLoading, setIsFileContentLoading] = useState<boolean>(false);

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
            // Read vault hierarchy after permission is confirmed
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
  
  // Read vault hierarchy when directory handle is set and permission is granted
  useEffect(() => {
    if (directoryHandle && permissionState === 'granted') {
      readVaultHierarchy();
    }
  }, [directoryHandle, permissionState]);

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

  // Helper function to get all markdown files (recursively searches all directories)
  const getAllMarkdownFiles = async (
    rootHandle: FileSystemDirectoryHandle,
    currentPath: string = ''
  ): Promise<VaultFile[]> => {
    const files: VaultFile[] = [];
    
    // Helper function to recursively explore directories
    const exploreDirectory = async (
      handle: FileSystemDirectoryHandle,
      path: string
    ) => {
      for await (const entry of handle.values()) {
        const entryPath = path ? `${path}/${entry.name}` : entry.name;
        
        if (entry.kind === 'file') {
          // Only include markdown files
          if (entry.name.endsWith('.md')) {
            const fileEntry: VaultFile = {
              name: entry.name,
              path: entryPath,
              kind: 'file',
              handle: entry,
            };
            files.push(fileEntry);
          }
        } else if (entry.kind === 'directory') {
          // Recursively explore subdirectory
          await exploreDirectory(entry, entryPath);
        }
      }
    };
    
    await exploreDirectory(rootHandle, currentPath);
    return files;
  };

  // Function to build a color-coded flat hierarchy based on dot notation
  const buildVirtualHierarchy = (files: VaultFile[]): VaultEntry[] => {
    // First, collect all existing file paths
    const existingFilePaths = new Set<string>();
    const flatEntries: VaultEntry[] = [];
    
    // Sort files to ensure consistent ordering
    const sortedFiles = [...files].sort((a, b) => a.name.localeCompare(b.name));
    
    // Process all files and add them to the map
    sortedFiles.forEach(file => {
      const basename = file.name.replace(/\.md$/, '');
      existingFilePaths.add(basename);
      
      const segments = basename.split('.');
      const depth = segments.length;
      
      // Add the actual file
      const fileEntry: VaultFile & { depth: number; hasNote: boolean } = {
        ...file,
        name: basename,
        path: basename,
        kind: 'file',
        depth,
        hasNote: true
      };
      
      flatEntries.push(fileEntry);
      
      // Generate parent paths for this file that might not exist
      for (let i = 1; i < depth; i++) {
        const parentPath = segments.slice(0, i).join('.');
        // Only add if we haven't already recorded this path
        if (!existingFilePaths.has(parentPath)) {
          existingFilePaths.add(parentPath);
          
          // Create a virtual file entry for this parent level
          const virtualParent: VaultFile & { depth: number; hasNote: boolean } = {
            name: parentPath,
            path: parentPath,
            kind: 'file',
            handle: {} as FileSystemFileHandle, // Just a placeholder
            depth: i,
            hasNote: false // This parent doesn't have an actual file
          };
          
          flatEntries.push(virtualParent);
        }
      }
    });
    
    // Sort by path to get proper hierarchy ordering
    return flatEntries.sort((a, b) => a.path.localeCompare(b.path));
  };

  // Function to read vault hierarchy
  const readVaultHierarchy = useCallback(async () => {
    // Check if we have a valid directory handle with granted permission
    if (!directoryHandle || permissionState !== 'granted') {
      return;
    }

    try {
      setIsHierarchyLoading(true);
      setErrorMessage(null);
      
      // Get all markdown files from the vault
      const allFiles = await getAllMarkdownFiles(directoryHandle);
      
      // Build the virtual hierarchy based on dot notation
      const hierarchy = buildVirtualHierarchy(allFiles);
      
      // Update state with the hierarchy
      setHierarchyData(hierarchy);
      
    } catch (error) {
      console.error('Error reading vault hierarchy:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error reading vault hierarchy');
    } finally {
      setIsHierarchyLoading(false);
    }
  }, [directoryHandle, permissionState]);

  // Function to read file content
  const readFileContent = useCallback(async (handle: FileSystemFileHandle): Promise<string | null> => {
    try {
      setIsFileContentLoading(true);
      setErrorMessage(null);
      
      // Get the File object from the handle
      const file = await handle.getFile();
      
      // Read the file content as text
      const content = await file.text();
      
      // Update the content state
      setActiveFileContent(content);
      
      return content;
    } catch (error) {
      console.error('Error reading file content:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error reading file content');
      setActiveFileContent(null);
      return null;
    } finally {
      setIsFileContentLoading(false);
    }
  }, []);

  // Function to set active file and read its content
  const setActiveFile = useCallback((handle: FileSystemFileHandle | null) => {
    setActiveFileHandle(handle);
    
    if (handle) {
      // Read the content of the selected file
      readFileContent(handle);
    } else {
      // Clear the content if no file is selected
      setActiveFileContent(null);
    }
  }, [readFileContent]);

  // Context value
  const value = {
    directoryHandle,
    permissionState,
    errorMessage,
    hierarchyData,
    isHierarchyLoading,
    activeFileHandle,
    activeFileContent,
    isFileContentLoading,
    selectDirectory,
    readVaultHierarchy,
    setActiveFile,
    readFileContent,
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
