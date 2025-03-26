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
  selectDirectory: async () => {},
  readVaultHierarchy: async () => {},
});

// Provider component
export const FileSystemProvider = ({ children }: { children: ReactNode }) => {
  const [directoryHandle, setDirectoryHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [permissionState, setPermissionState] = useState<PermissionState>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hierarchyData, setHierarchyData] = useState<VaultEntry[] | null>(null);
  const [isHierarchyLoading, setIsHierarchyLoading] = useState<boolean>(false);

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

  // Function to build a virtual hierarchy based on dot notation in filenames
  const buildVirtualHierarchy = (files: VaultFile[]): VaultEntry[] => {
    const root: VaultEntry[] = [];
    // Map to track virtual directories by path
    const directories = new Map<string, VaultDirectory>();
    
    // Process each file
    files.forEach(file => {
      // Extract the basename and remove .md extension
      const basename = file.name.replace(/\.md$/, '');
      // Split by dots to get hierarchical segments
      const segments = basename.split('.');
      
      let currentLevel = root;
      let currentPath = '';
      
      // Process all segments except the last one (which is the filename)
      for (let i = 0; i < segments.length - 1; i++) {
        const segment = segments[i];
        currentPath = currentPath ? `${currentPath}.${segment}` : segment;
        
        // Look for existing directory at this level
        let dir = currentLevel.find(
          entry => entry.kind === 'directory' && entry.name === segment
        ) as VaultDirectory | undefined;
        
        // Create directory if it doesn't exist
        if (!dir) {
          // Create a virtual directory handle (this won't be used for actual file operations)
          const virtualDirHandle = {} as FileSystemDirectoryHandle;
          
          dir = {
            name: segment,
            path: currentPath,
            kind: 'directory',
            handle: virtualDirHandle,
            children: []
          };
          
          currentLevel.push(dir);
          directories.set(currentPath, dir);
        }
        
        // Move to the next level (children of current directory)
        currentLevel = dir.children;
      }
      
      // Add the file to the current level
      // The last segment becomes the display name
      const displayName = segments[segments.length - 1];
      
      const fileEntry: VaultFile = {
        ...file,
        name: displayName // Override name with the leaf segment
      };
      
      currentLevel.push(fileEntry);
    });
    
    // Sort the hierarchy at each level
    const sortEntries = (entries: VaultEntry[]): VaultEntry[] => {
      // Sort entries: directories first, then files, both alphabetically
      const sorted = entries.sort((a, b) => {
        // If types are different, directories come first
        if (a.kind !== b.kind) {
          return a.kind === 'directory' ? -1 : 1;
        }
        // If types are the same, sort alphabetically by name
        return a.name.localeCompare(b.name);
      });
      
      // Recursively sort children of directories
      sorted
        .filter((entry): entry is VaultDirectory => entry.kind === 'directory')
        .forEach(dir => {
          dir.children = sortEntries(dir.children);
        });
      
      return sorted;
    };
    
    return sortEntries(root);
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

  // Context value
  const value = {
    directoryHandle,
    permissionState,
    errorMessage,
    hierarchyData,
    isHierarchyLoading,
    selectDirectory,
    readVaultHierarchy,
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
