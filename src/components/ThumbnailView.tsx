import React from 'react';

interface ThumbnailViewProps {
  files: FileEntry[];
  onFileClick: (path: string) => void;
  onFolderClick: (path: string) => void;
}

const ThumbnailView: React.FC<ThumbnailViewProps> = ({ files, onFileClick, onFolderClick }) => {
  return (
    <div className="grid grid-cols-6 gap-4">
      {files.map((file, index) => (
        <div key={index} className="p-2 hover:bg-white hover:bg-opacity-10 rounded transition duration-300 flex flex-col items-center">
          {file.type === 'directory' ? (
            <button
              onClick={() => onFolderClick(file.path)}
              className="text-center folder-name hover:opacity-80 transition duration-300"
            >
              <div className="text-6xl mb-2">📁</div>
              <div className="truncate w-full text-xs">{file.name}</div>
            </button>
          ) : (
            <button
              onClick={() => onFileClick(file.path)}
              className="text-center file-name hover:opacity-80 transition duration-300"
            >
              <div className="text-6xl mb-2">📄</div>
              <div className="truncate w-full text-xs">{file.name}</div>
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ThumbnailView;