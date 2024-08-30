'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const FileExplorer = dynamic(() => import('./FileExplorer'), { ssr: false });

interface ClientFileExplorerProps {
  onPathChange: (path: string) => void;
  onPinFolder: (path: string) => void;
  initialPath: string;
  tauriAPI: any;
}

const ClientFileExplorer: React.FC<ClientFileExplorerProps> = (props) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      <FileExplorer {...props} />
    </div>
  );
};

export default ClientFileExplorer;