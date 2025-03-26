import { FolderTree } from 'lucide-react';
import VaultSelector from '../Vault/VaultSelector';

const Sidebar = () => {
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
      
      <div className="flex-1 p-4 overflow-auto">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          File tree will be displayed here once vault is selected
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
