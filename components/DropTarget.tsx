import { useState, ReactNode } from 'react';

interface DropTargetProps {
  folderId: string;
  onDrop: (imageIds: string[]) => void;
  children: ReactNode;
  className?: string;
}

export function DropTarget({ folderId, onDrop, children, className }: DropTargetProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // 子要素から出た場合は無視
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const draggedImageId = e.dataTransfer.getData('text/plain');
    if (draggedImageId) {
      onDrop([draggedImageId]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`${className} ${
        isDragOver ? 'bg-blue-600/20 border-blue-500' : ''
      } transition-colors`}
    >
      {children}
    </div>
  );
}