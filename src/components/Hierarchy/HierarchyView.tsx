import { FC } from 'react';
import { Folder, FileText, Loader } from 'lucide-react';
import { VaultEntry, VaultFile } from '../../types/hierarchy';

interface HierarchyViewProps {
  hierarchyData: VaultEntry[] | null;
  isLoading: boolean;
  onFileSelect?: (file: VaultFile) => void;
}

// HierarchyNode component for rendering individual entry
const HierarchyNode: FC<{ 
  entry: VaultEntry; 
  depth: number; 
  onFileSelect?: (file: VaultFile) => void;
}> = ({ entry, depth, onFileSelect }) => {
  // Reduce indentation per level
  const paddingLeft = `${depth * 0.5}rem`;
  
  return (
    <li className="py-0.5">
      <div 
        className={`flex items-center gap-0.5 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-700 py-0.5 px-1 leading-snug ${entry.kind === 'file' ? 'cursor-pointer' : ''}`}
        style={{ paddingLeft }}
        onClick={entry.kind === 'file' && onFileSelect ? () => onFileSelect(entry as VaultFile) : undefined}
      >
        {entry.kind === 'directory' ? (
          <Folder size={13} className="text-blue-500 flex-shrink-0" />
        ) : (
          <FileText size={13} className="text-emerald-500 flex-shrink-0" />
        )}
        <span className="truncate">{entry.name}</span>
      </div>
      
      {entry.kind === 'directory' && entry.children && entry.children.length > 0 && (
        <ul className="list-none">
          {entry.children.map((child) => (
            <HierarchyNode 
              key={child.path} 
              entry={child} 
              depth={depth + 1} 
              onFileSelect={onFileSelect}
            />
          ))}
        </ul>
      )}
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
        {hierarchyData.map((entry) => (
          <HierarchyNode 
            key={entry.path} 
            entry={entry} 
            depth={0} 
            onFileSelect={onFileSelect}
          />
        ))}
      </ul>
    </div>
  );
};

export default HierarchyView;
