/**
 * Validation helper for testing hierarchical structure
 */
import { VaultEntry, VaultDirectory, VaultFile } from '../types/hierarchy';

// Helper function to log the hierarchy structure
export const logHierarchyStructure = (entries: VaultEntry[], level = 0): void => {
  const indent = '  '.repeat(level);
  
  entries.forEach(entry => {
    const prefix = entry.kind === 'directory' ? '📁' : '📄';
    const name = entry.kind === 'file' && entry.name === '(root)' ? 'Root Note' : entry.name;
    const path = entry.kind === 'file' ? (entry as VaultFile).handle.name : '';
    
    console.log(`${indent}${prefix} ${name}${path ? ` (${path})` : ''}`);
    
    if (entry.kind === 'directory') {
      logHierarchyStructure((entry as VaultDirectory).children, level + 1);
    }
  });
};

// Helper to find a specific entry in the hierarchy
export const findEntryByPath = (entries: VaultEntry[], path: string): VaultEntry | null => {
  for (const entry of entries) {
    if (entry.path === path) {
      return entry;
    }
    
    if (entry.kind === 'directory') {
      const found = findEntryByPath((entry as VaultDirectory).children, path);
      if (found) {
        return found;
      }
    }
  }
  
  return null;
};
