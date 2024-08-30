import React from 'react';

interface GridViewProps {
  files: FileEntry[];
  onFileClick: (path: string) => void;
  onFolderClick: (path: string) => void;
}

const GridView: React.FC<GridViewProps> = ({ files, onFileClick, onFolderClick }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {files.map((file, index) => (
        <div key={index} className="p-2 hover:bg-white hover:bg-opacity-10 rounded transition duration-300 flex flex-col items-center">
          {file.type === 'directory' ? (
            <button
              onClick={() => onFolderClick(file.path)}
              className="text-center folder-name hover:opacity-80 transition duration-300"
            >
              <div className="text-4xl mb-2">📁</div>
              <div className="truncate w-full">{file.name}</div>
            </button>
          ) : (
            <button
              onClick={() => onFileClick(file.path)}
              className="text-center file-name hover:opacity-80 transition duration-300"
            >
              <div className="text-4xl mb-2">📄</div>
              <div className="truncate w-full">{file.name}</div>
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default GridView;