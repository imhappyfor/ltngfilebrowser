import React from 'react';

interface SidebarProps {
  pinnedFolders: string[];
  onSelectFolder: (path: string) => void;
  onPinFolder: (path: string) => void;
  onUnpinFolder: (path: string) => void;
  currentPath: string;
  position: 'left' | 'right' | 'top' | 'bottom';
}

function Sidebar({ pinnedFolders, onSelectFolder, onPinFolder, onUnpinFolder, currentPath, position }: SidebarProps) {
  const isVertical = position === 'left' || position === 'right';

  return (
    <div className={`sidebar bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-4 border border-white border-opacity-30 ${
      isVertical ? 'w-64' : 'w-full h-48'
    } ${position === 'right' ? 'ml-4' : ''} ${position === 'left' ? 'mr-4' : ''} ${position === 'bottom' ? 'mt-4' : ''} ${position === 'top' ? 'mb-4' : ''}`}>
      <h2 className="text-xl font-bold mb-4 text-white">Pinned Folders</h2>
      <ul className={`space-y-2 ${!isVertical && 'flex flex-wrap'}`}>
        {pinnedFolders.map((folder, index) => (
          <li key={index} className={`flex items-center justify-between ${!isVertical && 'mr-4 mb-2'}`}>
            <button
              onClick={() => onSelectFolder(folder)}
              className="text-blue-300 hover:text-blue-100 truncate"
            >
              {folder}
            </button>
            <button
              onClick={() => onUnpinFolder(folder)}
              className="text-red-400 hover:text-red-200 ml-2"
            >
              Unpin
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={() => onPinFolder(currentPath)}
        className="mt-4 px-4 py-2 bg-yellow-500 bg-opacity-70 text-white rounded hover:bg-yellow-600 hover:bg-opacity-70 transition duration-300"
      >
        Pin Current Folder
      </button>
    </div>
  );
}

export default Sidebar;