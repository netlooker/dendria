/**
 * Types for File System Access API interactions
 */
import { VaultEntry } from './hierarchy';

// Permission state for directory access
export type PermissionState = 'prompt' | 'granted' | 'denied' | 'loading' | 'error';

// Shape of FileSystemContext
export interface FileSystemContextType {
  directoryHandle: FileSystemDirectoryHandle | null;
  permissionState: PermissionState;
  errorMessage: string | null;
  hierarchyData: VaultEntry[] | null;
  isHierarchyLoading: boolean;
  activeFileHandle: FileSystemFileHandle | null;
  activeFileContent: string | null;
  isFileContentLoading: boolean;
  selectDirectory: () => Promise<void>;
  readVaultHierarchy: () => Promise<void>;
  setActiveFile: (handle: FileSystemFileHandle | null) => void;
  readFileContent: (handle: FileSystemFileHandle) => Promise<string | null>;
}
