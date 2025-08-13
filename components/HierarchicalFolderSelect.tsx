import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { FolderOpen, GripVertical } from 'lucide-react';

interface Folder {
  id: string;
  name: string;
  order: number;
}

interface FolderSelectProps {
  folders: Folder[];
  selectedFolder: string;
  onFolderChange: (folderId: string) => void;
  getImageCount: (folderId: string) => number;
  onReorderFolders?: (draggedFolderId: string, targetFolderId: string, insertPosition: 'before' | 'after') => void;
  sortMode?: boolean;
  sortType?: 'name' | 'custom' | 'imageCount';
}

interface DraggableFolderItemProps {
  folder: Folder;
  imageCount: number;
  onReorder?: (draggedFolderId: string, targetFolderId: string, insertPosition: 'before' | 'after') => void;
  sortMode: boolean;
  isSystemFolder: boolean;
}

function DraggableFolderItem({ folder, imageCount, onReorder, sortMode, isSystemFolder }: DraggableFolderItemProps) {
  const [dragOver, setDragOver] = useState<'before' | 'after' | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // ドラッグ開始
  const handleDragStart = (e: React.DragEvent) => {
    // システムフォルダーはドラッグ不可
    if (!sortMode || isSystemFolder) {
      e.preventDefault();
      return;
    }
    
    console.log('Folder drag start:', folder.id);
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', folder.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  // ドラッグ終了
  const handleDragEnd = () => {
    console.log('Folder drag end:', folder.id);
    setIsDragging(false);
    setDragOver(null);
  };

  // ドラッグオーバー
  const handleDragOver = (e: React.DragEvent) => {
    // システムフォルダーはドロップ不可
    if (!sortMode || isSystemFolder) return;
    
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const position = y < rect.height / 2 ? 'before' : 'after';
    setDragOver(position);
  };

  // ドラッグリーブ
  const handleDragLeave = (e: React.DragEvent) => {
    // 子要素から出た場合は無視
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setDragOver(null);
  };

  // ドロップ
  const handleDrop = (e: React.DragEvent) => {
    // システムフォルダーはドロップ不可
    if (!sortMode || isSystemFolder) return;
    
    e.preventDefault();
    const draggedFolderId = e.dataTransfer.getData('text/plain');
    
    if (draggedFolderId && draggedFolderId !== folder.id && onReorder) {
      const position = dragOver || 'after';
      console.log('Folder drop:', draggedFolderId, 'onto:', folder.id, 'position:', position);
      onReorder(draggedFolderId, folder.id, position);
    }
    
    setDragOver(null);
  };

  return (
    <div
      draggable={sortMode && !isSystemFolder}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative transition-all duration-200 ${
        isDragging ? 'opacity-50' : ''
      } ${dragOver ? 'scale-105' : ''}`}
    >
      {/* ドロップインジケーター */}
      {dragOver && (
        <div 
          className={`absolute left-0 right-0 h-0.5 bg-blue-500 z-20 ${
            dragOver === 'before' ? '-top-px' : '-bottom-px'
          }`}
        />
      )}
      
      <SelectItem 
        value={folder.id} 
        className={`text-white hover:bg-gray-600 focus:bg-gray-600 ${
          sortMode && !isSystemFolder ? 'cursor-move' : 'cursor-pointer'
        } ${isSystemFolder ? 'bg-gray-700/30' : ''}`}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1">
            {sortMode && !isSystemFolder && (
              <GripVertical className="h-3 w-3 text-gray-400 mr-1" />
            )}
            {sortMode && isSystemFolder && (
              <div className="h-3 w-3 mr-1" /> // スペーサー
            )}
            <span className={isSystemFolder ? 'font-medium' : ''}>{folder.name}</span>
          </div>
          <span className="text-gray-400 text-sm ml-2">({imageCount})</span>
        </div>
      </SelectItem>
    </div>
  );
}

export function HierarchicalFolderSelect({
  folders,
  selectedFolder,
  onFolderChange,
  getImageCount,
  onReorderFolders,
  sortMode = false,
  sortType = 'name'
}: FolderSelectProps) {
  
  // フォルダーを3つのグループに分割して固定順序で表示
  const buildFolderOptions = (): JSX.Element[] => {
    // システムフォルダー（固定順序）
    const systemFolders = [
      folders.find(f => f.id === 'all'),
      folders.find(f => f.id === 'favorites')
    ].filter(Boolean) as Folder[];
    
    // ユーザーフォルダー（ソート可能）
    const userFolders = folders.filter(f => f.id !== 'all' && f.id !== 'favorites');
    
    // ユーザーフォルダーのソート
    const sortedUserFolders = [...userFolders].sort((a, b) => {
      if (sortMode || sortType === 'custom') {
        return a.order - b.order;
      } else if (sortType === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortType === 'imageCount') {
        const countA = getImageCount(a.id);
        const countB = getImageCount(b.id);
        return countB - countA; // 多い順
      }
      return a.name.localeCompare(b.name);
    });
    
    const result: JSX.Element[] = [];
    
    // システムフォルダーを追加
    systemFolders.forEach(folder => {
      const imageCount = getImageCount(folder.id);
      
      result.push(
        sortMode ? (
          <DraggableFolderItem
            key={folder.id}
            folder={folder}
            imageCount={imageCount}
            onReorder={onReorderFolders}
            sortMode={sortMode}
            isSystemFolder={true}
          />
        ) : (
          <SelectItem 
            key={folder.id} 
            value={folder.id} 
            className="text-white hover:bg-gray-600 focus:bg-gray-600 bg-gray-700/30"
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-medium">{folder.name}</span>
              <span className="text-gray-400 text-sm ml-2">({imageCount})</span>
            </div>
          </SelectItem>
        )
      );
    });
    
    // 区切り線（ユーザーフォルダーがある場合のみ）
    if (sortedUserFolders.length > 0) {
      result.push(
        <div key="divider" className="border-t border-gray-600 my-1" />
      );
    }
    
    // ユーザーフォルダーを追加
    sortedUserFolders.forEach(folder => {
      const imageCount = getImageCount(folder.id);
      
      result.push(
        sortMode ? (
          <DraggableFolderItem
            key={folder.id}
            folder={folder}
            imageCount={imageCount}
            onReorder={onReorderFolders}
            sortMode={sortMode}
            isSystemFolder={false}
          />
        ) : (
          <SelectItem 
            key={folder.id} 
            value={folder.id} 
            className="text-white hover:bg-gray-600 focus:bg-gray-600"
          >
            <div className="flex items-center justify-between w-full">
              <span>{folder.name}</span>
              <span className="text-gray-400 text-sm ml-2">({imageCount})</span>
            </div>
          </SelectItem>
        )
      );
    });
    
    return result;
  };

  const selectedFolderName = folders.find(f => f.id === selectedFolder)?.name || 'フォルダーを選択';

  return (
    <Select value={selectedFolder} onValueChange={onFolderChange}>
      <SelectTrigger className={`w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600 ${
        sortMode ? 'border-blue-500 ring-1 ring-blue-500' : ''
      }`}>
        <div className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-gray-300" />
          <SelectValue placeholder="フォルダーを選択" />
          {sortMode && (
            <GripVertical className="h-4 w-4 text-blue-400 ml-auto" />
          )}
        </div>
      </SelectTrigger>
      <SelectContent className="bg-gray-700 border-gray-600 max-h-60 overflow-y-auto">
        {sortMode && (
          <div className="px-2 py-1 text-xs text-blue-400 border-b border-gray-600 mb-1 bg-blue-900/20">
            📍 ユーザーフォルダーのみドラッグで順序変更可能
          </div>
        )}
        {buildFolderOptions()}
      </SelectContent>
    </Select>
  );
}