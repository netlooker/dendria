/**
 * Types for the vault hierarchy data structure
 */

// Base entry type for all vault entries
export interface VaultEntry {
  name: string;
  path: string;
  kind: 'file' | 'directory';
}

// File-specific entry type
export interface VaultFile extends VaultEntry {
  kind: 'file';
  handle: FileSystemFileHandle;
}

// Directory-specific entry type
export interface VaultDirectory extends VaultEntry {
  kind: 'directory';
  handle: FileSystemDirectoryHandle;
  children: VaultEntry[];
}
