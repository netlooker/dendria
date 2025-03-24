# Dendria: Dendron-inspired Knowledge Management PWA

## Project Overview

Dendria is a Progressive Web Application (PWA) designed to replicate the core functionality of VS Code Dendron in a standalone web application. It provides hierarchical note-taking and knowledge management capabilities with powerful lookup, linking, and organization features. By bringing Dendron's paradigm to a PWA, Dendria makes structured knowledge management accessible across all devices without requiring VS Code.

## Technical Stack

Based on the prompter-pwa project architecture and the Tailwind CSS v4 requirements:

### Frontend Framework
- **React 19+** with functional components and hooks
- **TypeScript** with strict type checking
- **Vite 6+** as the build tool and development server

### Styling
- **Tailwind CSS v4** for utility-first styling
  - Using `@tailwindcss/vite` plugin for Vite integration
  - Dark mode support using the `class` strategy
  - CSS import syntax: `@import "tailwindcss";`
- Responsive design for all device sizes

### Editor Component
- **Monaco Editor** for rich Markdown editing with syntax highlighting
- Leveraging Monaco's built-in Markdown preview capabilities
- Custom extensions for Dendron-specific link formats
- Split-pane editing with real-time preview

### UI Components
- **Lucide Icons** for consistent, scalable iconography throughout the application
- Custom components built using React and Tailwind CSS
- Responsive and accessible UI elements
- Dark mode support for all components

### State Management
- **React Context API** for global state
- **Custom hooks** for encapsulated state logic

### File System Integration
- **File System Access API** for direct access to markdown files
- Directory-based vault structure matching Dendron's approach
- Metadata caching for performance optimization
- Fallback to IndexedDB when File System Access API is not available

### Code Quality & Development Tools
- **ESLint 9+** for code linting
- **TypeScript-ESLint** for TypeScript-specific linting
- **Prettier** for consistent code formatting

### PWA Features
- **Workbox** for service worker management
- Offline capability with full editing functionality
- Installable on desktop and mobile devices

## Core Dendron Features to Implement

### 1. Hierarchical Note Structure
- Dot-notation hierarchy system (e.g., `project.tasks.urgent`)
- File-based structure matching the hierarchy
- Tree view sidebar to navigate hierarchical structure
- Note folding/expanding in the hierarchy
- Note creation with automatic hierarchy placement

### 2. Markdown-based Editing
- Full Markdown support with Monaco Editor
- Syntax highlighting for code blocks
- Monaco's built-in preview capabilities with custom extensions
- Support for tables, images, and other Markdown extensions
- Direct saving to .md files in the vault directory

### 3. Powerful Lookup System
- Fuzzy search across all notes
- Hierarchical filtering
- Quick note creation from search with automatic hierarchy placement
- Recent notes tracking
- Customizable hotkeys for search and navigation

### 4. Linking and Backlinks
- Wiki-style linking between notes using [[link]] syntax
- Automatic backlink tracking and display
- Graph visualization of note connections
- "Unreferenced notes" view

### 5. Schemas
- Defining templates and validation for note hierarchies
- Schema enforcement and suggestions
- Template-based note creation
- Autocomplete based on schema definitions

### 6. Workspaces and Vaults
- Multiple workspaces to separate different knowledge domains
- Multiple vaults (folder-based note collections) within workspaces
- Import/export of vaults
- Sharing and collaboration options

### 7. Publishing
- Export to static website
- Customizable themes for published content
- Selective publishing of specific hierarchies
- Privacy controls for sensitive content

## File-Based Storage Architecture

### Directory Structure
- Each vault is a directory containing markdown files
- Hierarchical notes follow directory/file structure:
  - `project.md` (root note)
  - `project.tasks.md` (first level)
  - `project.tasks.urgent.md` (second level)
- Special directories for assets, schemas, and configuration

### File System Access Integration
- Using the File System Access API to read/write markdown files directly
- Directory-picker to select vault locations
- Permission persistence for seamless access across sessions
- Automated scanning of vault directories to build hierarchy

### Performance Optimizations
- Metadata indexing in-memory for fast lookups
- Caching of frequently accessed notes
- Background scanning and indexing
- Lazy loading of note content

### Fallback Mechanisms
- IndexedDB for browsers without File System Access API support
- Import/export functionality for manual synchronization
- Cloud storage integration options (Dropbox, Google Drive, etc.)

## PWA-Specific Enhancements

### 1. Offline Capabilities
- Full functionality without internet connection
- Working directly with local files even offline
- Change tracking for conflict detection

### 2. Cross-device Synchronization
- Git-based synchronization option for advanced users
- Cloud storage integration for file sync (optional)
- Version history and change tracking
- Conflict resolution for multi-device edits

### 3. Mobile Optimization
- Touch-friendly interface
- Responsive design adapting to all screen sizes
- Mobile-specific navigation patterns
- Quick capture functionality for mobile
- Progressive loading for better performance on mobile devices

### 4. Progressive Enhancement
- Core functionality available to all browsers
- Enhanced features for supporting browsers
- Fallback mechanisms for browsers without File System Access API
- Installable on desktop and mobile home screens

## Data Model

### Core Entities

1. **Note**
   - File path and name (representing hierarchical path)
   - Title (derived from filename)
   - Content (Markdown)
   - YAML frontmatter for metadata
   - Created/Modified timestamps
   - Tags and custom properties

2. **Workspace**
   - Configuration file (JSON/YAML)
   - Name
   - Settings
   - Associated vault paths

3. **Vault**
   - Root directory path
   - Name
   - Configuration settings
   - Optional remote synchronization settings

4. **Schema**
   - Schema files stored in dedicated directory
   - Namespace definitions
   - Templates
   - Pattern definitions
   - Validation rules

5. **Link**
   - Source note path
   - Target note path
   - Link type
   - Context (surrounding text)

## Components Architecture

### Core Components

1. **NoteEditor**
   - Monaco Editor integration
   - Markdown syntax highlighting and preview
   - Autosave to markdown files
   - Frontmatter editing support
   - Split view with preview using Monaco's capabilities

2. **HierarchyView**
   - Tree visualization of file/directory structure
   - Drag-and-drop organization
   - Filtering and sorting options
   - Context menus for file operations
   - Lucide icons for visual indicators (folders, documents, states)

3. **LookupModal**
   - Fuzzy search across all markdown files
   - Fast filename and content search
   - Note creation with automatic file creation
   - Keyboard navigation
   - Search result highlighting

4. **BacklinksPanel**
   - Scan files for links to current note
   - Preview of context around links
   - Navigation to linked notes
   - Visual indicators for link types

5. **GraphView**
   - Visual representation of file connections
   - Interactive navigation through the graph
   - Filtering by hierarchy or tags
   - Zooming and focusing options
   - Node and edge visualization using Dendria's color scheme

6. **SchemaManager**
   - Schema file editing
   - Template creation
   - Validation rules configuration
   - Schema inheritance management
   - Visual rule builder interface

7. **VaultManager**
   - Vault directory selection
   - Permissions management for File System Access
   - Directory scanning and indexing
   - Import/export functions for vault migration
   - Status indicators for vault health

8. **FileSystemBridge**
   - Abstraction layer for file system operations
   - Support for File System Access API
   - Fallback mechanisms for unsupported browsers
   - Caching and performance optimizations
   - Error handling and recovery

9. **CommandPalette**
   - Quick access to application commands
   - Keyboard shortcut management
   - Recent command history
   - Custom command creation
   - Lucide icons for visual recognition

## UI/UX Design Principles

### Design System
- Clean, minimal interface with focus on content
- Consistent spacing, typography, and color usage
- Keyboard shortcuts for power users
- Dark/light mode support using Tailwind's class strategy
- VS Code-inspired aesthetics with customization options
- Dendrite-inspired visual motifs for branding
- Consistent iconography using Lucide icons

### Icon Usage Guidelines
- Use Lucide icons consistently throughout the interface
- Maintain consistent sizing (16px for inline, 20px for navigation, 24px for featured)
- Match icon colors to the application's color scheme
- Ensure sufficient contrast in both light and dark modes
- Use tooltips for icon-only UI elements
- Maintain visual hierarchy through icon weight and prominence

### User Experience Goals
- Frictionless note capture and organization
- Fast, keyboard-friendly navigation
- Seamless offline/online transition
- Progressive disclosure of advanced features
- Minimal setup with clear onboarding for file permissions
- Intuitive iconography for improved usability and recognition

### Branding Elements
- Logo incorporating dendrite/branching imagery
- Color palette inspired by neural connections and knowledge growth
  - Primary: #3a5dd9 (Neural connection blue)
  - Secondary: #7c4dff (Knowledge growth purple)
  - Accent: #00bcd4 (Highlight teal)
- Clean, modern typography that balances technical precision with approachability
- Visual language that subtly reinforces the hierarchical nature of the knowledge system

## Implementation Strategy

### File System Integration
- Use File System Access API as primary method
- Request and store directory access permissions
- Build efficient indexing for fast file operations
- Implement watching for external file changes
- Provide fallback mechanisms for browsers without support

### Performance Considerations
- Virtualization for large file collections
- Incremental file scanning
- Metadata caching for fast lookups
- Efficient text indexing for search
- Throttled real-time updates to prevent excessive disk operations

### Browser Compatibility
- Initially focus exclusively on Chrome and Edge browsers for development
- These browsers have full support for the File System Access API
- Safari and Firefox support will be considered for future phases
- Development priorities are set around modern Chromium-based browsers

### Accessibility
- WCAG 2.1 AA compliance
- Semantic HTML structure
- Keyboard navigation
- Screen reader compatibility
- Sufficient color contrast
- Proper ARIA labels for icon-only UI elements

## Tailwind CSS v4 Configuration Requirements

1. **Dependencies**
   ```json
   "dependencies": {
     "@tailwindcss/vite": "^4.0.14",
     "tailwindcss": "^4.0.14"
   }
   ```

2. **Vite Configuration (vite.config.ts)**
   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import tailwindcss from '@tailwindcss/vite'

   export default defineConfig({
     plugins: [
       react(),
       tailwindcss()
     ],
     // other configurations...
   })
   ```

3. **Tailwind CSS Configuration (tailwind.config.js)**
   ```javascript
   export default {
     content: [
       "./index.html",
       "./src/**/*.{js,ts,jsx,tsx}",
     ],
     darkMode: 'class',
     theme: {
       extend: {
         typography: {
           DEFAULT: {
             css: {
               maxWidth: 'none',
             },
           },
         },
         colors: {
           // Dendria-inspired color palette
           dendria: {
             primary: '#3a5dd9', // Neural connection blue
             secondary: '#7c4dff', // Knowledge growth purple
             accent: '#00bcd4', // Highlight teal
             bg: {
               light: '#ffffff',
               dark: '#1e1e1e'
             },
             text: {
               light: '#333333',
               dark: '#e0e0e0'
             }
           }
         },
       },
     },
     plugins: [],
   }
   ```

4. **CSS Import (src/index.css)**
   ```css
   @import "tailwindcss";

   /* Custom styles for Markdown rendering and editor */
   ```

## Development Environment Setup

### Initial Setup Commands

```bash
# Navigate to your projects directory
cd /Users/netlooker/projects/

# Create a new Vite project with React and TypeScript
npm create vite@latest dendria -- --template react-ts

# Navigate to the new project directory
cd dendria

# Install core dependencies
npm install react@19.0.0 react-dom@19.0.0 @monaco-editor/react monaco-editor lucide-react uuid

# Install Tailwind CSS v4 and required plugins
npm install tailwindcss@4.0.14 @tailwindcss/vite@4.0.14

# Install dev dependencies
npm install -D typescript@5.7.2 eslint prettier

# Initialize the project
npm run dev
```

### Tailwind CSS Setup

After installation, create the necessary configuration files:

1. Create `tailwind.config.js` in the project root:
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dendria: {
          primary: '#3a5dd9',
          secondary: '#7c4dff',
          accent: '#00bcd4',
          bg: {
            light: '#ffffff',
            dark: '#1e1e1e'
          },
          text: {
            light: '#333333',
            dark: '#e0e0e0'
          }
        }
      },
    },
  },
  plugins: [],
}
```

2. Update `src/index.css`:
```css
@import "tailwindcss";

/* Custom Dendria styles */
```

3. Update `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 5173,
    strictPort: true,
  }
})
```

### Monaco Editor Setup

For Monaco Editor, you'll need to configure it for Markdown editing and preview:

```typescript
import { Editor } from '@monaco-editor/react';
import { useEffect, useRef } from 'react';

const MarkdownEditor = ({ content, onChange }) => {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  return (
    <div className="h-full">
      <Editor
        height="100%"
        defaultLanguage="markdown"
        defaultValue={content}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          wordWrap: 'on',
          lineNumbers: 'on',
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
};

export default MarkdownEditor;
```

### Lucide Icons Setup

Lucide icons can be easily imported and used within your React components:

```typescript
import React from 'react';
import { FileText, Folder, Search, Settings, Link, GitBranch } from 'lucide-react';

// Example sidebar navigation component using Lucide icons
const Sidebar = () => {
  return (
    <div className="h-full w-64 bg-dendria-bg-light dark:bg-dendria-bg-dark border-r border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <h1 className="text-xl font-bold text-dendria-primary flex items-center">
          <GitBranch className="mr-2" size={24} />
          Dendria
        </h1>
      </div>
      
      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          <li>
            <button className="flex items-center w-full p-2 text-left rounded hover:bg-gray-100 dark:hover:bg-gray-800">
              <FileText size={20} className="mr-3 text-dendria-primary" />
              <span>Notes</span>
            </button>
          </li>
          <li>
            <button className="flex items-center w-full p-2 text-left rounded hover:bg-gray-100 dark:hover:bg-gray-800">
              <Folder size={20} className="mr-3 text-dendria-secondary" />
              <span>Vaults</span>
            </button>
          </li>
          <li>
            <button className="flex items-center w-full p-2 text-left rounded hover:bg-gray-100 dark:hover:bg-gray-800">
              <Search size={20} className="mr-3 text-dendria-accent" />
              <span>Search</span>
            </button>
          </li>
          <li>
            <button className="flex items-center w-full p-2 text-left rounded hover:bg-gray-100 dark:hover:bg-gray-800">
              <Settings size={20} className="mr-3 text-gray-500" />
              <span>Settings</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
```

This approach allows for consistent iconography throughout the application while maintaining flexibility for different sizes, colors, and states.

## Implementation Roadmap

### Phase 1: Core Infrastructure
- Project setup with React, TypeScript, Vite, and Tailwind CSS v4
- Monaco Editor integration with Markdown support
- File System Access API implementation
- Basic directory structure and file operations

### Phase 2: Basic Note Management
- Note creation and editing with file saving
- Hierarchical directory navigation
- Markdown rendering and preview
- Directory scanning and indexing

### Phase 3: Advanced Dendron Features
- Enhanced lookup with fuzzy search
- Link parsing and backlink generation
- Schema definition and validation
- Graph visualization

### Phase 4: Multi-context Support
- Multiple workspace support
- Multiple vault directories
- Import/export functionality
- Publishing capabilities

### Phase 5: PWA Enhancement
- Offline functionality
- Cross-device synchronization options
- Progressive enhancement features
- Performance optimization

## Prompt Template for AI Assistance

When working with Claude on the Dendria project, use the following prompt template to get the most out of the AI assistant:

```
## Role

You are a Senior IT Full Stack Expert with over 20 years of experience in managing complex, large-scale IT projects, specializing in front-end technologies and UI/UX design. Your extensive knowledge encompasses Progressive Web Applications, TypeScript ecosystem, React component architecture, Tailwind CSS styling, and modern web development best practices. You excel at creating efficient, user-centered applications that meet strict technical requirements and follow strictly guidelines and documentation of the frameworks you use. Additionally, you have deep expertise in VS Code Dendron and its implementation details, particularly its file-based storage approach.

## Dendria Project Context

Dendria is a Progressive Web App replicating Dendron's core functionality using React 19+, TypeScript, and Tailwind CSS v4. The application implements hierarchical note-taking with dot notation, powerful lookup, linking, and schema validation. Unlike traditional web apps, Dendria uses the File System Access API to directly read and write markdown files in the user's selected directories, replicating Dendron's file-based approach while functioning as a PWA.

The development environment is currently running on the default Vite port (http://localhost:5173) in the /Users/netlooker/projects/dendria/ directory. We're focusing exclusively on Chrome and Edge browsers for initial development due to their comprehensive support for the File System Access API.

[SPECIFIC TASK OR QUESTION]

## Technical Requirements

- React 19+ with functional components and hooks
- TypeScript with strict type checking
- Tailwind CSS v4 with proper configuration
- Monaco Editor for Markdown editing and preview
- Lucide icons for UI elements
- File System Access API for direct file operations
- Chrome/Edge browser compatibility as primary focus
- PWA capabilities with offline support
- Dendron-compatible file structure and note format

## Expected Output

[DESCRIBE WHAT YOU NEED: CODE, EXPLANATION, REVIEW, ETC.]

Please provide detailed explanations of your approach, considerations for optimizing file-based operations, and code that's compatible with modern Chromium-based browsers.
```

Replace the bracketed sections with your specific needs for each interaction. This structured prompt will help Claude understand the context of your Dendron-inspired, file-based project and provide more targeted assistance.
