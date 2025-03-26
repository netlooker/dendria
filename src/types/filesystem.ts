/**
 * Types for File System Access API interactions
 */

// Permission state for directory access
export type PermissionState = 'prompt' | 'granted' | 'denied' | 'loading' | 'error';

// Shape of FileSystemContext
export interface FileSystemContextType {
  directoryHandle: FileSystemDirectoryHandle | null;
  permissionState: PermissionState;
  errorMessage: string | null;
  selectDirectory: () => Promise<void>;
}
