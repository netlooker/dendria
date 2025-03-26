/**
 * IndexedDB utilities for storing FileSystemDirectoryHandle
 */
import { openDB } from 'idb';

// Constants for database configuration
const DB_NAME = 'DendriaDB';
const DB_VERSION = 1;
const OBJECT_STORE_NAME = 'FileSystemHandles';
const VAULT_HANDLE_KEY = 'vaultDirectoryHandle';

// Get database connection
export const getDb = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create the object store if it doesn't exist
      if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
        db.createObjectStore(OBJECT_STORE_NAME);
        console.log(`Created '${OBJECT_STORE_NAME}' object store`);
      }
    },
  });
};

/**
 * Save directory handle to IndexedDB
 */
export const saveDirectoryHandle = async (handle: FileSystemDirectoryHandle): Promise<void> => {
  try {
    const db = await getDb();
    await db.put(OBJECT_STORE_NAME, handle, VAULT_HANDLE_KEY);
    console.log('Directory handle saved successfully:', handle.name);
  } catch (error) {
    console.error('Error saving directory handle:', error);
    throw error;
  }
};

/**
 * Load directory handle from IndexedDB
 */
export const loadDirectoryHandle = async (): Promise<FileSystemDirectoryHandle | null> => {
  try {
    const db = await getDb();
    const handle = await db.get(OBJECT_STORE_NAME, VAULT_HANDLE_KEY);
    console.log(handle ? `Directory handle loaded: ${handle.name}` : 'No directory handle found');
    return handle || null;
  } catch (error) {
    console.error('Error loading directory handle:', error);
    return null;
  }
};

/**
 * Delete directory handle from IndexedDB
 */
export const deleteDirectoryHandle = async (): Promise<void> => {
  try {
    const db = await getDb();
    await db.delete(OBJECT_STORE_NAME, VAULT_HANDLE_KEY);
    console.log('Directory handle deleted successfully');
  } catch (error) {
    console.error('Error deleting directory handle:', error);
    throw error;
  }
};
