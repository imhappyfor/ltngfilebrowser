'use client'

import React, { useState, useEffect } from 'react';
import ClientFileExplorer from '../components/ClientFileExplorer';
import NavigationControls from '../components/NavigationControls';
import Sidebar from '../components/Sidebar';
import Settings from '../components/Settings';
import '../styles/globals.css';
import { useTauriAPI } from '@/hooks/useTauriAPI';
import { ThemeName } from '../styles/themes';

export default function Home() {
  const [pinnedFolders, setPinnedFolders] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [theme, setTheme] = useState<ThemeName>('monokai');
  const [font, setFont] = useState('system');
  const [background, setBackground] = useState('linear-gradient(45deg, #4a0e8f, #16a085)');
  const [sidebarPosition, setSidebarPosition] = useState<'left' | 'right' | 'top' | 'bottom'>('left');
  const { tauriAPI, isLoading, error } = useTauriAPI();

  useEffect(() => {
    if (tauriAPI) {
      tauriAPI.homeDir().then(setCurrentPath).catch(console.error);
    }
  }, [tauriAPI]);
  const handleSelectFolder = (path: string) => {
    setCurrentPath(path);
    if (tauriAPI) {
      loadDirectory(path);
    }
  };

  const handlePinFolder = (path: string) => {
    if (!pinnedFolders.includes(path)) {
      setPinnedFolders([...pinnedFolders, path]);
    }
  };

  const handleUnpinFolder = (path: string) => {
    setPinnedFolders(pinnedFolders.filter(folder => folder !== path));
  };

  const loadDirectory = async (path: string) => {
    if (tauriAPI) {
      try {
        await tauriAPI.readDir(path, { recursive: false });
        setCurrentPath(path);
      } catch (error) {
        console.error("Error loading directory:", error);
      }
    }
  };

  useEffect(() => {
    document.body.style.background = background;
    document.body.style.fontFamily = font;
  }, [background, font]);

  const sidebarProps = {
    pinnedFolders,
    onSelectFolder: handleSelectFolder,
    onPinFolder: handlePinFolder,
    onUnpinFolder: handleUnpinFolder,
    currentPath,
    position: sidebarPosition,
  };
  if (isLoading) {
    return <div>Loading Tauri API...</div>;
  }

  if (error) {
    return <div>Error: {error}. This application requires Tauri to run.</div>;
  }
  return (
    <div className={`home-container min-h-screen p-4 theme-${theme}`}>
      <div className="flex justify-between items-center mb-4">
        <NavigationControls />
        <Settings 
          onThemeChange={setTheme}
          onFontChange={setFont}
          onBackgroundChange={setBackground}
          onSidebarPositionChange={setSidebarPosition}
          currentSidebarPosition={sidebarPosition}
        />
      </div>
      <div className={`main-content mt-4 flex ${
        sidebarPosition === 'top' || sidebarPosition === 'bottom' ? 'flex-col' : 'flex-row'
      }`}>
        {sidebarPosition === 'top' && <Sidebar {...sidebarProps} />}
        {sidebarPosition === 'left' && <Sidebar {...sidebarProps} />}
        <ClientFileExplorer
          onPathChange={setCurrentPath}
          onPinFolder={handlePinFolder}
          initialPath={currentPath}
          tauriAPI={tauriAPI}
        />
        {sidebarPosition === 'right' && <Sidebar {...sidebarProps} />}
        {sidebarPosition === 'bottom' && <Sidebar {...sidebarProps} />}
      </div>
    </div>
  );
}