// Simple script to validate the hierarchy building logic

// Mock VaultFile and FileSystemFileHandle for testing
class MockFileHandle {
  constructor(name) {
    this.name = name;
  }
}

// Create mock files
const files = [
  { 
    name: 'daily.md', 
    path: 'daily', 
    kind: 'file', 
    handle: new MockFileHandle('daily.md')
  },
  { 
    name: 'daily.notes.md', 
    path: 'daily.notes', 
    kind: 'file', 
    handle: new MockFileHandle('daily.notes.md')
  },
  { 
    name: 'daily.notes.2024-03-26.md', 
    path: 'daily.notes.2024-03-26', 
    kind: 'file', 
    handle: new MockFileHandle('daily.notes.2024-03-26.md')
  },
  { 
    name: 'projects.md', 
    path: 'projects', 
    kind: 'file', 
    handle: new MockFileHandle('projects.md')
  },
  { 
    name: 'projects.dendria.md', 
    path: 'projects.dendria', 
    kind: 'file', 
    handle: new MockFileHandle('projects.dendria.md')
  },
  { 
    name: 'projects.dendria.phase3.md', 
    path: 'projects.dendria.phase3', 
    kind: 'file', 
    handle: new MockFileHandle('projects.dendria.phase3.md')
  }
];

// Build the virtual hierarchy based on dot notation in filenames
function buildVirtualHierarchy(files) {
  const root = [];
  // Map to track virtual directories by path
  const directories = new Map();
  // Map to track files by normalized path (without .md extension)
  const filesByPath = new Map();
  
  // First pass: Process all files and build the complete hierarchy
  files.forEach(file => {
    // Extract the basename and remove .md extension
    const basename = file.name.replace(/\.md$/, '');
    
    // Store the file by its normalized path
    filesByPath.set(basename, {
      ...file,
      name: basename.split('.').pop() || basename // Use the last segment as display name
    });
    
    // Split by dots to get hierarchical segments
    const segments = basename.split('.');
    
    // Create directory entries for each level
    let currentPath = '';
    
    // Process all segments (including the last one for parent notes)
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      currentPath = currentPath ? `${currentPath}.${segment}` : segment;
      
      // If this is not the leaf segment, ensure we have a directory for it
      if (i < segments.length - 1) {
        // If we don't already have this directory path, create it
        if (!directories.has(currentPath)) {
          // Create a virtual directory handle
          const virtualDirHandle = {};
          
          const dir = {
            name: segment,
            path: currentPath,
            kind: 'directory',
            handle: virtualDirHandle,
            children: []
          };
          
          directories.set(currentPath, dir);
        }
      }
    }
  });
  
  // Second pass: Build the actual hierarchy structure
  const addedFiles = new Set(); // Track files we've already added
  
  // Helper function to add a file to a directory path
  const addFileToDirectory = (filePath, file) => {
    const segments = filePath.split('.');
    let currentLevel = root;
    let currentPath = '';
    
    // Navigate to the correct level in the hierarchy
    for (let i = 0; i < segments.length - 1; i++) {
      const segment = segments[i];
      currentPath = currentPath ? `${currentPath}.${segment}` : segment;
      
      // Get or create the directory
      let dir = currentLevel.find(
        entry => entry.kind === 'directory' && entry.name === segment
      );
      
      // If directory doesn't exist yet (shouldn't happen in second pass but just in case)
      if (!dir) {
        const virtualDirHandle = {};
        
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
      
      currentLevel = dir.children;
    }
    
    // Add the file to current level
    if (!addedFiles.has(filePath)) {
      currentLevel.push(file);
      addedFiles.add(filePath);
    }
  };
  
  // Process all files and add them to the appropriate location in the hierarchy
  filesByPath.forEach((file, path) => {
    addFileToDirectory(path, file);
    
    // Special handling for parent notes (e.g., daily.md should also appear under "daily" directory)
    const parentNotePath = path.split('.');
    if (parentNotePath.length > 1) {
      //