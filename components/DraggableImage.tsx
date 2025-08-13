import { useState, useEffect, useRef } from 'react';
import { useDragDrop } from './DragDropProvider';
import { Heart, MoreVertical, FileImage, Calendar, HardDrive } from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { cn } from './ui/utils';

interface Image {
  id: string;
  src: string;
  alt: string;
  dateCreated?: Date;
  size?: number;
  folderId: string;
  isFavorite: boolean;
  order: number;
}

interface DraggableImageProps {
  image: Image;
  isSelected: boolean;
  onSelect: (imageId: string) => void;
  selectionMode: boolean;
  selectedImages: Set<string>;
  onToggleFavorite?: (imageId: string) => void;
  onReorder?: (draggedImageId: string, targetImageId: string, insertPosition: 'before' | 'after') => void;
  isCustomSort: boolean;
  onDoubleClick?: (imageId: string) => void;
  columns: 1 | 2 | 3;
}

export function DraggableImage({ 
  image, 
  isSelected, 
  onSelect, 
  selectionMode,
  selectedImages,
  onToggleFavorite,
  onReorder,
  isCustomSort,
  onDoubleClick,
  columns
}: DraggableImageProps) {
  const [dragOver, setDragOver] = useState<'before' | 'after' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // シンプルなドラッグ可能状態の管理
  const isDraggable = isCustomSort && !selectionMode;

  console.log(`🎯 DraggableImage render: ${image.id} (${image.alt}), isDraggable: ${isDraggable}`);

  // 確実なdraggable属性設定
  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.draggable = isDraggable;
      console.log(`✅ Set draggable=${isDraggable} for ${image.id}`);
    }
  }, [isDraggable, image.id]);

  // ドラッグ開始 - シンプルな実装
  const handleDragStart = (e: React.DragEvent) => {
    console.log(`🚀 Drag start: ${image.id}, isDraggable: ${isDraggable}`);
    
    if (!isDraggable) {
      console.log('❌ Drag prevented: not draggable');
      e.preventDefault();
      return;
    }
    
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', image.id);
    e.dataTransfer.effectAllowed = 'move';
    console.log(`✅ Drag started successfully: ${image.id}`);
  };

  // ドラッグ終了
  const handleDragEnd = () => {
    console.log(`🔚 Drag end: ${image.id}`);
    setIsDragging(false);
    setDragOver(null);
  };

  // ドラッグオーバー
  const handleDragOver = (e: React.DragEvent) => {
    if (!isDraggable) return;
    
    e.preventDefault();
    const rect = elementRef.current?.getBoundingClientRect();
    if (!rect) return;

    const isHorizontal = columns > 1;
    let insertPosition: 'before' | 'after';

    if (isHorizontal) {
      const middleX = rect.left + rect.width / 2;
      insertPosition = e.clientX < middleX ? 'before' : 'after';
    } else {
      const middleY = rect.top + rect.height / 2;
      insertPosition = e.clientY < middleY ? 'before' : 'after';
    }

    setDragOver(insertPosition);
  };

  // ドラッグリーブ
  const handleDragLeave = () => {
    setDragOver(null);
  };

  // ドロップ
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedImageId = e.dataTransfer.getData('text/plain');
    
    console.log(`📍 Drop: dragged=${draggedImageId}, target=${image.id}, position=${dragOver}`);
    
    if (draggedImageId && draggedImageId !== image.id && dragOver && onReorder) {
      onReorder(draggedImageId, image.id, dragOver);
    }
    
    setDragOver(null);
  };

  // 画像クリック
  const handleImageClick = (e: React.MouseEvent) => {
    if (selectionMode) {
      e.preventDefault();
      onSelect(image.id);
    }
  };

  // 画像ダブルクリック
  const handleImageDoubleClick = (e: React.MouseEvent) => {
    if (!selectionMode && onDoubleClick) {
      e.preventDefault();
      onDoubleClick(image.id);
    }
  };

  // お気に入りトグル
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(image.id);
    }
  };

  const getDropIndicatorClass = () => {
    if (!dragOver) return '';
    
    const baseClass = 'absolute bg-blue-500 z-10';
    if (columns === 1) {
      return dragOver === 'before' 
        ? `${baseClass} top-0 left-0 right-0 h-1`
        : `${baseClass} bottom-0 left-0 right-0 h-1`;
    } else {
      return dragOver === 'before'
        ? `${baseClass} top-0 bottom-0 left-0 w-1`
        : `${baseClass} top-0 bottom-0 right-0 w-1`;
    }
  };

  // ファイルサイズのフォーマット
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // 1列表示の場合はリスト形式
  if (columns === 1) {
    return (
      <div
        ref={elementRef}
        className={cn(
          'relative group bg-gray-800 rounded-lg overflow-hidden border-2 transition-all duration-200 p-4',
          isDragging ? 'opacity-50 border-blue-500 scale-95' : 'border-transparent',
          isSelected ? 'ring-2 ring-blue-500' : '',
          selectionMode ? 'cursor-pointer' : '',
          isDraggable ? 'cursor-move' : ''
        )}
        data-image-id={image.id}
        data-draggable={isDraggable}
        draggable={isDraggable}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleImageClick}
        onDoubleClick={handleImageDoubleClick}
      >
        {/* ドロップインジケーター */}
        {dragOver && <div className={getDropIndicatorClass()} />}

        <div className="flex items-center gap-4">
          {/* 選択モード時のチェックボックス */}
          {selectionMode && (
            <div className="flex-shrink-0">
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onSelect(image.id)}
                className="bg-white border-white data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
              />
            </div>
          )}

          {/* サムネイル画像 */}
          <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-700">
            <img 
              src={image.src} 
              alt={image.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* ファイル情報 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <FileImage className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <p className="text-white truncate font-medium">{image.alt}</p>
              {image.isFavorite && (
                <Heart className="h-4 w-4 text-red-400 fill-current flex-shrink-0" />
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-400">
              {image.size && (
                <div className="flex items-center gap-1">
                  <HardDrive className="h-3 w-3" />
                  <span>{formatFileSize(image.size)}</span>
                </div>
              )}
              
              {image.dateCreated && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Intl.DateTimeFormat('ja-JP').format(image.dateCreated)}</span>
                </div>
              )}
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* お気に入りボタン */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleFavorite}
              className={cn(
                'p-2 h-8 w-8',
                image.isFavorite 
                  ? 'text-red-400 hover:text-red-300' 
                  : 'text-gray-400 hover:text-gray-300'
              )}
            >
              <Heart className={cn('h-4 w-4', image.isFavorite ? 'fill-current' : '')} />
            </Button>

            {/* メニューボタン */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 h-8 w-8 text-gray-400 hover:text-gray-300"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                <DropdownMenuItem 
                  onClick={handleToggleFavorite}
                  className="text-white hover:bg-gray-700 focus:bg-gray-700"
                >
                  {image.isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    );
  }

  // 2列・3列表示の場合は従来のグリッド形式
  return (
    <div
      ref={elementRef}
      className={cn(
        'relative group bg-gray-800 rounded-lg overflow-hidden border-2 transition-all duration-200',
        isDragging ? 'opacity-50 border-blue-500 scale-95' : 'border-transparent',
        isSelected ? 'ring-2 ring-blue-500' : '',
        selectionMode ? 'cursor-pointer' : '',
        isDraggable ? 'cursor-move' : ''
      )}
      data-image-id={image.id}
      data-draggable={isDraggable}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleImageClick}
      onDoubleClick={handleImageDoubleClick}
    >
      {/* ドロップインジケーター */}
      {dragOver && <div className={getDropIndicatorClass()} />}

      {/* 選択モード時のチェックボックス */}
      {selectionMode && (
        <div className="absolute top-2 left-2 z-20">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(image.id)}
            className="bg-white border-white data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
          />
        </div>
      )}

      {/* 画像 */}
      <div className="aspect-square">
        <img 
          src={image.src} 
          alt={image.alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* オーバーレイ（ホバー時の情報表示） */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-end opacity-0 group-hover:opacity-100">
        <div className="w-full p-3 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{image.alt}</p>
              {image.dateCreated && (
                <p className="text-xs text-gray-300">
                  {new Intl.DateTimeFormat('ja-JP').format(image.dateCreated)}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-1 ml-2">
              {/* お気に入りボタン */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleFavorite}
                className={cn(
                  'p-1 h-8 w-8',
                  image.isFavorite 
                    ? 'text-red-400 hover:text-red-300' 
                    : 'text-gray-400 hover:text-gray-300'
                )}
              >
                <Heart className={cn('h-4 w-4', image.isFavorite ? 'fill-current' : '')} />
              </Button>

              {/* メニューボタン */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-8 w-8 text-gray-400 hover:text-gray-300"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                  <DropdownMenuItem 
                    onClick={handleToggleFavorite}
                    className="text-white hover:bg-gray-700 focus:bg-gray-700"
                  >
                    {image.isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}