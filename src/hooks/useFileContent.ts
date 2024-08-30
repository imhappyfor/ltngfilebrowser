import { useState, useEffect } from 'react';
import { readBinaryFile, readTextFile } from '@tauri-apps/api/fs';
import { convertFileSrc } from '@tauri-apps/api/tauri';

type FileType = 'text' | 'image' | 'pdf' | 'video' | 'unknown';

const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
const videoExtensions = ['mp4', 'webm', 'ogg', 'mov'];

export function useFileContent(filePath: string) {
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [fileType, setFileType] = useState<FileType>('unknown');

  useEffect(() => {
    let isMounted = true;

    async function loadContent() {
      try {
        setLoading(true);
        setError(null);

        const fileExtension = filePath.split('.').pop()?.toLowerCase();
        
        if (imageExtensions.includes(fileExtension || '')) {
          setFileType('image');
          const binaryContent = await readBinaryFile(filePath);
          const blob = new Blob([binaryContent], { type: `image/${fileExtension}` });
          const url = URL.createObjectURL(blob);
          if (isMounted) {
            setContent(url);
          }
        } else if (videoExtensions.includes(fileExtension || '')) {
          setFileType('video');
          const binaryContent = await readBinaryFile(filePath);
          const blob = new Blob([binaryContent], { type: `video/${fileExtension}` });
          const url = URL.createObjectURL(blob);
          if (isMounted) {
            setContent(url);
          }
        } else if (fileExtension === 'pdf') {
          setFileType('pdf');
          const binaryContent = await readBinaryFile(filePath);
          const blob = new Blob([binaryContent], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          if (isMounted) {
            setContent(url);
          }
        } else {
          setFileType('text');
          if (isMounted) {
            const textContent = await readTextFile(filePath);
            setContent(textContent);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(`Failed to load file: ${err}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadContent();

    return () => {
      isMounted = false;
      if (fileType === 'image' || fileType === 'pdf') {
        URL.revokeObjectURL(content);
      }
    };
  }, [filePath]);

  return { content, error, loading, fileType };
}