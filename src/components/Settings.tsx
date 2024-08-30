'use client'

import React, { useState, useEffect } from 'react';
import { themes, ThemeName } from '../styles/themes';

interface SettingsProps {
  onThemeChange: (theme: ThemeName) => void;
  onFontChange: (font: string) => void;
  onBackgroundChange: (background: string) => void;
  onSidebarPositionChange: (position: 'left' | 'right' | 'top' | 'bottom') => void;
  currentSidebarPosition: 'left' | 'right' | 'top' | 'bottom';
}

const fonts = {
  system: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
};

const backgrounds = [
  'linear-gradient(45deg, #4a0e8f, #16a085)',
  'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
  'linear-gradient(45deg, #614385, #516395)',
];

function Settings({ onThemeChange, onFontChange, onBackgroundChange, onSidebarPositionChange, currentSidebarPosition }: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'window.__TAURI__' in window) {
      const { listen } = (window as any).__TAURI__.event;
      const unlisten = listen('open-settings', () => {
        setIsOpen(true);
      });
      return () => {
        unlisten.then((f: () => void) => f());
      };
    }
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-blue-500 bg-opacity-70 text-white rounded hover:bg-blue-600 hover:bg-opacity-70 transition duration-300"
      >
        Settings
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="fixed right-4 top-4 w-80 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-6 border border-white border-opacity-30 z-50 text-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Settings</h2>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-300 transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Theme</h3>
                <div className="space-y-2">
                  {Object.keys(themes).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => onThemeChange(theme as ThemeName)}
                      className="block w-full text-left py-2 px-3 rounded bg-white bg-opacity-10 hover:bg-opacity-20 transition duration-300"
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Font</h3>
                <div className="space-y-2">
                  {Object.keys(fonts).map((font) => (
                    <button
                      key={font}
                      onClick={() => onFontChange(font)}
                      className="block w-full text-left py-2 px-3 rounded bg-white bg-opacity-10 hover:bg-opacity-20 transition duration-300"
                    >
                      {font}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Background</h3>
                <div className="space-y-2">
                  {backgrounds.map((bg, index) => (
                    <button
                      key={index}
                      onClick={() => onBackgroundChange(bg)}
                      className="block w-full text-left py-2 px-3 rounded transition duration-300"
                      style={{ background: bg }}
                    >
                      Gradient {index + 1}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Sidebar Position</h3>
                <div className="space-y-2">
                  {['left', 'right', 'top', 'bottom'].map((position) => (
                    <button
                      key={position}
                      onClick={() => onSidebarPositionChange(position as 'left' | 'right' | 'top' | 'bottom')}
                      className={`block w-full text-left py-2 px-3 rounded bg-white bg-opacity-10 hover:bg-opacity-20 transition duration-300 ${
                        currentSidebarPosition === position ? 'bg-opacity-30' : ''
                      }`}
                    >
                      {position.charAt(0).toUpperCase() + position.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Settings;