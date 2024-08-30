import React, { useEffect, useState } from 'react';
import { convertFileSrc } from '@tauri-apps/api/tauri';

function PopoutPreview() {
  const [filePath, setFilePath] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFilePath(params.get('filePath'));
    setFileType(params.get('fileType'));
  }, []);

  if (!filePath || !fileType) {
    return <div>Loading...</div>;
  }

  const renderContent = () => {
    const src = convertFileSrc(filePath);
    switch (fileType) {
      case 'image':
        return <img src={src} alt="Preview" className="max-w-full h-auto" />;
      case 'video':
        return <video src={src} controls className="max-w-full h-auto">Your browser does not support the video tag.</video>;
      case 'pdf':
        return <iframe src={src} className="w-full h-full" />;
      case 'text':
        return <pre className="whitespace-pre-wrap">{src}</pre>;
      default:
        return <div>Unsupported file type</div>;
    }
  };

  return (
    <div className="w-full h-screen bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-4">{filePath.split('/').pop()}</h2>
      <div className="w-full h-[calc(100vh-6rem)] overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
}

export default PopoutPreview;