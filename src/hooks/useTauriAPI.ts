import { useState, useEffect } from 'react';

interface TauriAPI {
  invoke: any;
  homeDir: any;
  readDir: any;
}

export function useTauriAPI() {
  const [tauriAPI, setTauriAPI] = useState<TauriAPI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initTauriAPI() {
      if (typeof window !== 'undefined') {
        try {
          const { invoke } = await import('@tauri-apps/api/tauri');
          const { homeDir } = await import('@tauri-apps/api/path');
          const { readDir } = await import('@tauri-apps/api/fs');

          setTauriAPI({
            invoke,
            homeDir,
            readDir,
          });
        } catch (err) {
          console.error('Error initializing Tauri API:', err);
          setError(`Error initializing Tauri API: ${err}`);
        }
      } else {
        console.warn('Tauri API not available');
        setError('Tauri API not available');
      }
      setIsLoading(false);
    }

    initTauriAPI();
  }, []);

  return { tauriAPI, isLoading, error };
}