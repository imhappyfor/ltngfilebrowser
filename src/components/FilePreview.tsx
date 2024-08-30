import React, { useEffect, useRef, useState } from 'react';
import { useFileContent } from '../hooks/useFileContent';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { WebviewWindow } from '@tauri-apps/api/window';

// Remove the Next.js Image import
// import Image from 'next/image';

interface FilePreviewProps {
  filePath: string;
  onClose: () => void;
  initialWidth: number;
  onResize: (width: number) => void;
}

function FilePreview({ filePath, onClose, initialWidth, onResize }: FilePreviewProps) {
  const { content, error, loading, fileType } = useFileContent(filePath);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPopout, setIsPopout] = useState(false);

  useEffect(() => {
    if (videoRef.current && fileType === 'video') {
      videoRef.current.load();
    }
  }, [content, fileType]);

  const handlePopout = async () => {
    const label = `popout-${Date.now()}`;
    const popoutWindow = new WebviewWindow(label, {
      url: `popout?filePath=${encodeURIComponent(filePath)}&fileType=${fileType}`,
      title: 'File Preview',
      width: 800,
      height: 600,
    });

    await popoutWindow.once('tauri://created', async () => {
      console.log('Popout window created');
    });

    popoutWindow.once('tauri://error', (e) => {
      console.error('Error creating popout window:', e);
    });
  };

  const renderContent = (isPopoutContent: boolean = false) => {
    if (loading) {
      return (
        <div className="flex flex-col justify-center items-center h-full">
          <div className="mb-4">Loading preview...</div>
          <div className="w-64 h-2 bg-gray-200 rounded-full">
            <div className="w-1/2 h-full bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      );
    }

    if (error) {
      return <div className="p-4 text-red-500">Error loading preview: {error}</div>;
    }

    switch (fileType) {
      case 'image':
        return (
          <img 
            src={convertFileSrc(filePath)} 
            alt="Preview" 
            className="max-w-full h-auto" 
            loading="lazy"
          />
        );
      case 'video':
        return (
          <video 
            ref={videoRef}
            src={convertFileSrc(filePath)}
            controls 
            className="max-w-full h-auto"
          >
            Your browser does not support the video tag.
          </video>
        );
      case 'pdf':
        return <iframe src={convertFileSrc(filePath)} className="w-full h-full" />;
      case 'text':
      default:
        return <pre className="whitespace-pre-wrap">{content}</pre>;
    }
  };

  if (isPopout) {
    return null;
  }

  return (
    <ResizableBox
      width={initialWidth}
      height={Infinity}
      minConstraints={[200, Infinity]}
      maxConstraints={[800, Infinity]}
      onResize={(e, { size }) => onResize(size.width)}
      resizeHandles={['w']}
      className="flex-shrink-0 overflow-hidden border-l border-white border-opacity-30"
    >
      <div className="h-full flex flex-col bg-gray-900">
        <div className="flex justify-between items-center p-2 bg-gray-800">
          <h2 className="text-white font-semibold">{filePath.split('/').pop()}</h2>
          <div className="flex space-x-2">
            <button onClick={handlePopout} className="text-white hover:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
            <button onClick={onClose} className="text-white hover:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1 p-4 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </ResizableBox>
  );
}

export default FilePreview;