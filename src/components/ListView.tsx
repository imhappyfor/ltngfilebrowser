import React from 'react';

interface ListViewProps {
  files: FileEntry[];
  onFileClick: (path: string) => void;
  onFolderClick: (path: string) => void;
}

const ListView: React.FC<ListViewProps> = ({ files, onFileClick, onFolderClick }) => {
  return (
    <ul className="space-y-2">
      {files.map((file, index) => (
        <li key={index} className="flex items-center justify-between p-2 hover:bg-white hover:bg-opacity-10 rounded transition duration-300">
          {file.type === 'directory' ? (
            <button
              onClick={() => onFolderClick(file.path)}
              className="flex items-center text-left folder-name hover:opacity-80 transition duration-300"
            >
              <span className="mr-2">📁</span>
              {file.name}
            </button>
          ) : (
            <span className="flex items-center file-name">
              <span className="mr-2">📄</span>
              {file.name}
            </span>
          )}
          {file.type === 'file' && (
            <button
              onClick={() => onFileClick(file.path)}
              className="px-2 py-1 rounded transition duration-300"
            >
              Preview
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ListView;