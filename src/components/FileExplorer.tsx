'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { ResizableBox } from 'react-resizable';
import FilePreview from './FilePreview';
import ListView from './ListView';
import GridView from './GridView';
import ThumbnailView from './ThumbnailView';
import 'react-resizable/css/styles.css';

interface FileEntry {
  path: string;
  name: string;
  children?: FileEntry[];
  type: 'file' | 'directory';
  isHidden: boolean;
}

interface FileExplorerProps {
  onPathChange: (path: string) => void;
  onPinFolder: (path: string) => void;
  initialPath: string;
  tauriAPI: any;
}

type LayoutType = 'list' | 'grid' | 'thumbnail';
type SortKey = 'name' | 'type' | 'size' | 'date';
type SortOrder = 'asc' | 'desc';

function FileExplorer({ onPathChange, onPinFolder, tauriAPI, initialPath }: FileExplorerProps) {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [currentPath, setCurrentPath] = useState(initialPath || '');
  const [error, setError] = useState<string | null>(null);
  const [showHidden, setShowHidden] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [previewWidth, setPreviewWidth] = useState<number>(400);
  const [layout, setLayout] = useState<LayoutType>('list');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [dirname, setDirname] = useState<((path: string) => Promise<string>) | null>(null);

  useEffect(() => {
    if (initialPath) {
      loadDirectory(initialPath);
    }
  }, [initialPath]);

  const loadDirectory = useCallback(async (path: string) => {
    if (!tauriAPI) {
      console.error('Tauri API not initialized');
      setError('Tauri API not initialized');
      setIsLoading(false);
      return;
    }

    console.log("Loading directory:", path);
    if (typeof path !== 'string' || path.length === 0) {
      console.error('Invalid path provided to loadDirectory');
      setError('Invalid path');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const entries = await tauriAPI.readDir(path, { recursive: false });
      console.log("Received entries:", entries);
      const mappedEntries = entries.map((entry: any) => ({
        path: entry.path,
        name: entry.name,
        type: entry.children !== undefined ? 'directory' : 'file',
        isHidden: entry.name.startsWith('.')
      }));
      
      // Filter hidden files/folders if showHidden is false
      const filteredEntries = showHidden ? mappedEntries : mappedEntries.filter(entry => !entry.isHidden);
      
      setFiles(filteredEntries);
      setCurrentPath(path);
      onPathChange(path);
    } catch (err) {
      console.error('Error reading directory:', err);
      setError(`Error reading directory: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }, [tauriAPI, onPathChange, showHidden]);

  useEffect(() => {
    // Dynamically import Tauri functions
    const loadTauriFunctions = async () => {
      const { dirname } = await import('@tauri-apps/api/path');
      setDirname(() => dirname);
    };

    loadTauriFunctions();
  }, []);

  useEffect(() => {
    if (tauriAPI) {
      tauriAPI.homeDir()
        .then((homeDirPath: string) => {
          console.log("Home directory path:", homeDirPath);
          loadDirectory(homeDirPath);
        })
        .catch((error: any) => {
          console.error("Error initializing file explorer:", error);
          setError(`Error initializing file explorer: ${error}`);
          setIsLoading(false);
        });
    }
  }, [tauriAPI, loadDirectory]);

  const navigateUp = useCallback(async () => {
    if (!tauriAPI || !dirname) {
      console.error('Tauri API or dirname function not initialized');
      setError('Tauri API or dirname function not initialized');
      return;
    }
    try {
      const parentDir = await dirname(currentPath);
      if (parentDir !== currentPath) {
        loadDirectory(parentDir);
      } else {
        console.log("Already at the root directory");
      }
    } catch (error) {
      console.error("Error navigating up:", error);
      setError(`Error navigating up: ${error}`);
    }
  }, [currentPath, loadDirectory, tauriAPI, dirname]);

  const navigateToDirectory = useCallback((path: string) => {
    loadDirectory(path);
  }, [loadDirectory]);

  const refreshDirectory = useCallback(() => {
    loadDirectory(currentPath);
  }, [currentPath, loadDirectory]);

  const toggleShowHidden = useCallback(() => {
    setShowHidden(prev => !prev);
  }, []);

  useEffect(() => {
    if (currentPath) {
      loadDirectory(currentPath);
    }
  }, [showHidden, currentPath, loadDirectory]);

  const togglePreview = useCallback((filePath: string) => {
    setPreviewFile(prevFile => prevFile === filePath ? null : filePath);
  }, []);

  const handleResizeStop = (e: React.SyntheticEvent, data: { size: { width: number } }) => {
    setPreviewWidth(data.size.width);
  };

  const sortFiles = useCallback((files: FileEntry[]) => {
    return [...files].sort((a, b) => {
      if (sortKey === 'name') {
        return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else if (sortKey === 'type') {
        return sortOrder === 'asc' ? 
          (a.type === b.type ? a.name.localeCompare(b.name) : a.type.localeCompare(b.type)) :
          (a.type === b.type ? b.name.localeCompare(a.name) : b.type.localeCompare(a.type));
      }
      // Add more sorting options for 'size' and 'date' if available in your FileEntry object
      return 0;
    });
  }, [sortKey, sortOrder]);

  const filterFiles = useCallback((files: FileEntry[]) => {
    if (!searchTerm) return files;
    return files.filter(file => 
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const sortedFiles = sortFiles(filterFiles(files));

  const renderFileList = () => {
    switch (layout) {
      case 'grid':
        return <GridView files={sortedFiles} onFileClick={togglePreview} onFolderClick={navigateToDirectory} />;
      case 'thumbnail':
        return <ThumbnailView files={sortedFiles} onFileClick={togglePreview} onFolderClick={navigateToDirectory} />;
      case 'list':
      default:
        return <ListView files={sortedFiles} onFileClick={togglePreview} onFolderClick={navigateToDirectory} />;
    }
  };

  if (!tauriAPI) {
    return <div>Initializing Tauri API...</div>;
  }

  if (isLoading) {
    return <div>Loading file explorer...</div>;
  }

  return (
    <div className="flex-1 flex flex-row overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="glassmorphism mb-4">
          <div className="flex items-center space-x-2 p-4">
            <button onClick={navigateUp} className="px-4 py-2 rounded transition duration-300">
              Up
            </button>
            <button onClick={refreshDirectory} className="px-4 py-2 rounded transition duration-300">
              Refresh
            </button>
            <button onClick={() => onPinFolder(currentPath)} className="px-4 py-2 rounded transition duration-300">
              Pin Current Folder
            </button>
            <button onClick={toggleShowHidden} className="px-4 py-2 rounded transition duration-300">
              {showHidden ? 'Hide' : 'Show'} Hidden Files
            </button>
            <p className="ml-4">Current path: {currentPath || 'Loading...'}</p>
            <select 
              value={layout} 
              onChange={(e) => setLayout(e.target.value as LayoutType)}
              className="px-2 py-1 rounded bg-gray-700 text-white"
            >
              <option value="list">List</option>
              <option value="grid">Grid</option>
              <option value="thumbnail">Thumbnail</option>
            </select>
            <select 
              value={sortKey} 
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="px-2 py-1 rounded bg-gray-700 text-white"
            >
              <option value="name">Name</option>
              <option value="type">Type</option>
              {/* Add more sorting options if available */}
            </select>
            <button 
              onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
              className="px-2 py-1 rounded transition duration-300"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-2 py-1 rounded bg-gray-700 text-white"
            />
            <button
              onClick={() => setSearchTerm('')}
              className="px-2 py-1 rounded transition duration-300 ml-2"
            >
              Clear
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          {renderFileList()}
        </div>
      </div>
      {previewFile && (
        <ResizableBox
          width={previewWidth}
          height={Infinity}
          minConstraints={[200, Infinity]}
          maxConstraints={[800, Infinity]}
          onResizeStop={handleResizeStop}
          resizeHandles={['w']}
          className="flex-shrink-0 overflow-auto border-l border-white border-opacity-30"
        >
          <FilePreview filePath={previewFile} onClose={() => setPreviewFile(null)} />
        </ResizableBox>
      )}
    </div>
  );
}

export default FileExplorer;