import { FolderTree } from 'lucide-react';
import VaultSelector from '../Vault/VaultSelector';
import HierarchyView from '../Hierarchy/HierarchyView';
import { useFileSystem } from '../../context/FileSystemContext';
import { VaultFile } from '../../types/hierarchy';

const Sidebar = () => {
  const { hierarchyData, isHierarchyLoading, permissionState, setActiveFile } = useFileSystem();
  
  const handleFileSelect = (file: VaultFile) => {
    setActiveFile(file.handle);
  };
  
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col dark:bg-gray-800 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-blue-600">
          <FolderTree size={24} />
          Dendria
        </h1>
      </div>
      
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <VaultSelector />
      </div>
      
      <div className="flex-1 overflow-auto">
        {permissionState === 'granted' ? (
          <HierarchyView 
            hierarchyData={hierarchyData} 
            isLoading={isHierarchyLoading}
            onFileSelect={handleFileSelect}
          />
        ) : (
          <div className="p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              File tree will be displayed here once vault is selected
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
