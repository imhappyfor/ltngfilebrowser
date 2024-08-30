import React, { useState } from 'react';
import FileExplorer from './FileExplorer';
import NavigationControls from './NavigationControls';
import Sidebar from './Sidebar';
import Settings from './Settings';
import { useTauriAPI } from '../hooks/useTauriAPI';
function Home() {
  const [pinnedFolders, setPinnedFolders] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [sidebarPosition, setSidebarPosition] = useState<'left' | 'right' | 'top' | 'bottom'>('left');

  const handleSelectFolder = (path: string) => {
    setCurrentPath(path);
  };

  const handlePinFolder = (path: string) => {
    if (!pinnedFolders.includes(path)) {
      setPinnedFolders([...pinnedFolders, path]);
    }
  };

  const handleUnpinFolder = (path: string) => {
    setPinnedFolders(pinnedFolders.filter(folder => folder !== path));
  };

  const sidebarProps = {
    pinnedFolders,
    onSelectFolder: handleSelectFolder,
    onPinFolder: handlePinFolder,
    onUnpinFolder: handleUnpinFolder,
    currentPath,
    position: sidebarPosition,
  };

  const handleSidebarPositionChange = (position: 'left' | 'right' | 'top' | 'bottom') => {
    setSidebarPosition(position);
  };

  return (
    <div className="home-container h-screen flex flex-col">
      <NavigationControls />
      <div className={`main-content flex-1 flex ${
        sidebarPosition === 'top' || sidebarPosition === 'bottom' ? 'flex-col' : 'flex-row'
      }`}>
        {sidebarPosition === 'top' && <Sidebar {...sidebarProps} />}
        {sidebarPosition === 'left' && <Sidebar {...sidebarProps} />}
        <FileExplorer
                  onPathChange={setCurrentPath}
                  onPinFolder={handlePinFolder}
                  tauriAPI={useTauriAPI()} initialPath={''}        />
        {sidebarPosition === 'right' && <Sidebar {...sidebarProps} />}
        {sidebarPosition === 'bottom' && <Sidebar {...sidebarProps} />}
      </div>
      <Settings
        onThemeChange={() => {}} // Implement these functions as needed
        onFontChange={() => {}}
        onBackgroundChange={() => {}}
        onSidebarPositionChange={handleSidebarPositionChange}
        currentSidebarPosition={sidebarPosition}
      />
    </div>
  );
}

export default Home;