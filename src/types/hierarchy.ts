/**
 * Types for the vault hierarchy data structure
 */

// Base entry type for all vault entries
export interface VaultEntry {
  name: string;
  path: string;
  kind: 'file' | 'directory';
  depth?: number; // Depth in the hierarchy based on dot notation
  hasNote?: boolean; // Whether this entry has an actual file
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
