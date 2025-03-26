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
  selectDirectory: () => Promise<void>;
  readVaultHierarchy: () => Promise<void>;
}
