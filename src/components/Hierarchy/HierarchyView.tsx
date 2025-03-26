import { FC } from 'react';
import { FileText, Loader } from 'lucide-react';
import { VaultEntry, VaultFile } from '../../types/hierarchy';

interface HierarchyViewProps {
  hierarchyData: VaultEntry[] | null;
  isLoading: boolean;
  onFileSelect?: (file: VaultFile) => void;
}

// HierarchyNode component for rendering individual entry
const HierarchyNode: FC<{ 
  entry: VaultEntry; 
  onFileSelect?: (file: VaultFile) => void;
}> = ({ entry, onFileSelect }) => {
  // Calculate indentation based on the path depth
  const getIndentation = (name: string) => {
    const segments = name.split('.');
    return `${0.75 + ((segments.length - 1) * 0.5)}rem`;
  };
  
  // Determine color based on depth level
  const getIconColor = (depth = 1, hasNote = true) => {
    // Base colors by level
    const colors = [
      'text-blue-500',      // Level 1
      'text-emerald-500',   // Level 2
      'text-amber-500',     // Level 3
      'text-violet-500',    // Level 4
      'text-pink-500',      // Level 5
      'text-red-500'        // Level 6+
    ];
    
    // Fallback to last color for deeper levels
    const colorIndex = Math.min(depth - 1, colors.length - 1);
    
    // Return grayed out version if this level doesn't have a note
    return hasNote ? colors[colorIndex] : 'text-gray-400';
  };
  
  // Helper to format the display name
  const formatDisplayName = (name: string) => {
    // Get the last segment for display, without repeating hierarchy
    const segments = name.split('.');
    return segments[segments.length - 1];
  };
  
  // Get the depth from the path
  const depth = entry.depth || entry.name.split('.').length;
  
  // Whether this entry has an actual note file
  const hasNote = entry.hasNote !== undefined ? entry.hasNote : true;
  
  return (
    <li className="py-0">
      <div 
        className={`flex items-center gap-1 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-700 py-[2px] px-1 leading-tight ${hasNote ? 'cursor-pointer' : 'cursor-default'}`}
        style={{ paddingLeft: getIndentation(entry.name) }}
        onClick={hasNote && onFileSelect ? () => onFileSelect(entry as VaultFile) : undefined}
      >
        <FileText 
          size={13} 
          className={`flex-shrink-0 ${getIconColor(depth, hasNote)}`} 
        />
        
        <span className={`font-medium ${!hasNote ? 'text-gray-500 dark:text-gray-400' : ''}`}>
          {formatDisplayName(entry.name)}
        </span>
      </div>
    </li>
  );
};

// Main HierarchyView component
const HierarchyView: FC<HierarchyViewProps> = ({ hierarchyData, isLoading, onFileSelect }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center text-gray-500 dark:text-gray-400 h-full">
        <Loader size={24} className="animate-spin mb-2 text-blue-500" />
        <p>Loading vault structure...</p>
      </div>
    );
  }

  if (!hierarchyData || hierarchyData.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        <p>Vault is empty or structure not loaded.</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto pl-1">
      <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 px-1 py-0.5 mb-1">
        Files
      </h3>
      <ul className="list-none ml-0.5">
        {hierarchyData && hierarchyData.map((entry) => (
          <HierarchyNode 
            key={entry.path} 
            entry={entry}
            onFileSelect={onFileSelect}
          />
        ))}
      </ul>
    </div>
  );
};

export default HierarchyView;
