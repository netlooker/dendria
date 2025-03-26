import { FC, useState } from 'react';
import { FileText, Loader, Plus, Minus } from 'lucide-react';
import { VaultEntry, VaultFile } from '../../types/hierarchy';

interface HierarchyViewProps {
  hierarchyData: VaultEntry[] | null;
  isLoading: boolean;
  onFileSelect?: (file: VaultFile) => void;
}

// Determine if an entry has children
const hasChildren = (name: string, allEntries: VaultEntry[]): boolean => {
  const segments = name.split('.');
  const prefix = name + '.';
  return allEntries.some(entry => entry.name.startsWith(prefix));
};

// HierarchyNode component for rendering individual entry
const HierarchyNode: FC<{ 
  entry: VaultEntry; 
  onFileSelect?: (file: VaultFile) => void;
  allEntries: VaultEntry[];
}> = ({ entry, onFileSelect, allEntries }) => {
  const [collapsed, setCollapsed] = useState(false);
  const isParent = hasChildren(entry.name, allEntries);

  // Calculate indentation based on the path depth
  // Create the full tree line for indentation
  // Calculate indentation based on the path depth
  const getIndentation = (name: string) => {
    const segments = name.split('.');
    const depth = segments.length - 1;
    
    // No indentation for top level, small indent for each level after
    return depth === 0 ? '0.5rem' : `${0.5 + (depth * 0.75)}rem`;
  };
  
  // Determine color based on depth level
  const getIconColor = (depth = 1) => {
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
    return colors[colorIndex];
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
  
  // Get children entries for a given parent
  const getChildEntries = (parentName: string, allEntries: VaultEntry[]): VaultEntry[] => {
    const prefix = parentName + '.';
    return allEntries.filter(entry => {
      // Direct children only - match prefix and no further dots after the prefix
      return entry.name.startsWith(prefix) && 
        !entry.name.substring(prefix.length).includes('.');
    });
  };

  return (
    <li className="py-0">
      <div 
        className="flex items-center text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-700 py-[2px] px-1 leading-tight"
        style={{ paddingLeft: getIndentation(entry.name) }}
      >
        {/* Expand/collapse icon for parent items */}
        {isParent && (
          <span 
            className="mr-1 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setCollapsed(!collapsed);
            }}
          >
            {collapsed ? 
              <Plus size={10} className="text-gray-500" /> : 
              <Minus size={10} className="text-gray-500" />
            }
          </span>
        )}
        {!isParent && <span className="w-[10px] mr-1" />}
        
        {/* File icon with click handler */}
        <span 
          className="flex items-center cursor-pointer"
          onClick={hasNote && onFileSelect ? () => onFileSelect(entry as VaultFile) : undefined}
        >
          <FileText 
            size={13} 
            className={`flex-shrink-0 ${hasNote ? getIconColor(depth) : 'text-gray-400'}`} 
          />
          
          <span className={`ml-1 font-medium ${!hasNote ? 'text-gray-500 dark:text-gray-400' : ''}`}>
            {formatDisplayName(entry.name)}
          </span>
        </span>
      </div>

      {/* Render children if this entry has any and is not collapsed */}
      {isParent && !collapsed && (
        <ul>
          {getChildEntries(entry.name, allEntries).map(childEntry => (
            <HierarchyNode
              key={childEntry.path}
              entry={childEntry}
              onFileSelect={onFileSelect}
              allEntries={allEntries}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

// Main HierarchyView component
const HierarchyView: FC<HierarchyViewProps> = ({ hierarchyData, isLoading, onFileSelect }) => {
  // Get top level entries
  const getTopLevelEntries = (entries: VaultEntry[]): VaultEntry[] => {
    return entries.filter(entry => !entry.name.includes('.'));
  };

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
    <div className="overflow-auto pl-0">
      <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 px-1 py-0.5 mb-1">
        Files
      </h3>
      <ul className="list-none ml-0">
        {hierarchyData && getTopLevelEntries(hierarchyData).map((entry) => (
          <HierarchyNode 
            key={entry.path} 
            entry={entry}
            onFileSelect={onFileSelect}
            allEntries={hierarchyData}
          />
        ))}
      </ul>
    </div>
  );
};

export default HierarchyView;
