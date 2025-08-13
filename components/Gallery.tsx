import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Grid3X3, Grid2X2, SquareStack, ArrowUpDown, SortAsc, SortDesc, Calendar, HardDrive, Move } from 'lucide-react';
import { cn } from './ui/utils';
import { ActionBar } from './ActionBar';
import { FolderSelectDialog } from './FolderSelectDialog';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { ShareDialog } from './ShareDialog';
import { DraggableImage } from './DraggableImage';
import { DropTarget } from './DropTarget';
import { ImageViewer } from './ImageViewer';
import { toast } from 'sonner@2.0.3';
import { Language, useTranslation } from '../utils/i18n';

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

interface Folder {
  id: string;
  name: string;
  parentId?: string;
}

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    name?: string;
    picture?: string;
  };
  currentPlan?: string;
}

interface GalleryProps {
  images: Image[];
  selectionMode: boolean;
  onSelectionModeChange: (enabled: boolean) => void;
  onImageUpload?: () => void;
  onImagesUpdate?: (images: Image[]) => void;
  onFolderMove?: (imageIds: string[], targetFolderId: string, newFolderName?: string) => void;
  onDragDrop?: (imageIds: string[], targetFolderId: string) => void;
  onToggleFavorite?: (imageId: string) => void;
  onReorderImages?: (draggedImageId: string, targetImageId: string, insertPosition: 'before' | 'after') => void;
  folders: Folder[];
  user?: User;
  onForceUpdate?: () => void;
  language: Language;
}

type SortOption = 'custom' | 'dateNew' | 'dateOld' | 'nameAZ' | 'nameZA' | 'sizeSmall' | 'sizeLarge';

export function Gallery({ 
  images, 
  selectionMode, 
  onSelectionModeChange, 
  onImageUpload, 
  onImagesUpdate, 
  onFolderMove,
  onDragDrop,
  onToggleFavorite,
  onReorderImages,
  folders,
  user,
  onForceUpdate,
  language
}: GalleryProps) {
  const t = useTranslation(language);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [columns, setColumns] = useState<1 | 2 | 3>(3);
  const [sortBy, setSortBy] = useState<SortOption>('custom');
  const [showFolderDialog, setShowFolderDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [viewerImageIndex, setViewerImageIndex] = useState(0);

  // 新規画像が追加された場合のログ（簡素化）
  useEffect(() => {
    const newImages = images.filter(img => 
      img.id.includes('-') && !isNaN(parseInt(img.id.split('-')[0]))
    );
    
    if (newImages.length > 0) {
      console.log('🆕 New images detected:', newImages.map(img => ({ id: img.id, alt: img.alt })));
      
      // カスタムソートでない場合の警告
      if (sortBy !== 'custom') {
        console.log('⚠️ Warning: New images detected but not in custom sort mode');
        console.log(`💡 To enable drag functionality, switch to "${t('customOrder')} (${t('dragToReorder')})"`);
      }
    }
  }, [images, sortBy, t]);

  // 選択モードとselectedImagesの同期
  useEffect(() => {
    // 選択モードがfalseの場合、選択をクリア
    if (!selectionMode && selectedImages.size > 0) {
      setSelectedImages(new Set());
    }
  }, [selectionMode, selectedImages.size]);

  const handleImageSelect = (imageId: string) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(imageId)) {
      newSelection.delete(imageId);
    } else {
      newSelection.add(imageId);
    }
    setSelectedImages(newSelection);
  };

  // 選択を全てクリアする関数
  const clearSelection = () => {
    setSelectedImages(new Set());
    onSelectionModeChange(false);
  };

  const handleSelectAll = () => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(images.map(img => img.id)));
    }
  };

  const getGridClass = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-3';
      default:
        return 'grid-cols-3';
    }
  };

  const getSortedImages = () => {
    const sortedImages = [...images];
    
    switch (sortBy) {
      case 'custom':
        return sortedImages.sort((a, b) => a.order - b.order);
      case 'dateNew':
        return sortedImages.sort((a, b) => {
          const dateA = a.dateCreated || new Date(0);
          const dateB = b.dateCreated || new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
      case 'dateOld':
        return sortedImages.sort((a, b) => {
          const dateA = a.dateCreated || new Date(0);
          const dateB = b.dateCreated || new Date(0);
          return dateA.getTime() - dateB.getTime();
        });
      case 'nameAZ':
        return sortedImages.sort((a, b) => a.alt.localeCompare(b.alt));
      case 'nameZA':
        return sortedImages.sort((a, b) => b.alt.localeCompare(a.alt));
      case 'sizeSmall':
        return sortedImages.sort((a, b) => (a.size || 0) - (b.size || 0));
      case 'sizeLarge':
        return sortedImages.sort((a, b) => (b.size || 0) - (a.size || 0));
      default:
        return sortedImages;
    }
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'custom':
        return t('customOrder');
      case 'dateNew':
        return language === 'en' ? 'Date (Newest)' : '日付（新しい順）';
      case 'dateOld':
        return language === 'en' ? 'Date (Oldest)' : '日付（古い順）';
      case 'nameAZ':
        return language === 'en' ? 'Name (A-Z)' : '名前（A-Z）';
      case 'nameZA':
        return language === 'en' ? 'Name (Z-A)' : '名前（Z-A）';
      case 'sizeSmall':
        return language === 'en' ? 'Size (Smallest)' : 'サイズ（小さい順）';
      case 'sizeLarge':
        return language === 'en' ? 'Size (Largest)' : 'サイズ（大きい順）';
      default:
        return language === 'en' ? 'Sort' : 'ソート';
    }
  };

  const handleMoveToFolder = (folderId: string, newFolderName?: string) => {
    if (onFolderMove) {
      const selectedImageIds = Array.from(selectedImages);
      onFolderMove(selectedImageIds, folderId, newFolderName);
      
      const folderName = newFolderName || folders.find(f => f.id === folderId)?.name || (language === 'en' ? 'Folder' : 'フォルダー');
      
      const message = language === 'en' 
        ? `Moved ${selectedImages.size} images to "${folderName}"`
        : `${selectedImages.size}個の画像を「${folderName}」に移動しました`;
      
      toast.success(message);
      clearSelection();
    }
    setShowFolderDialog(false);
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const handleShareDialogClose = (open: boolean) => {
    setShowShareDialog(open);
    if (!open) {
      // 共有ダイアログが閉じられた時は選択状態を維持
      // ユーザーが手動で選択ボタンをオフにするまで選択は残す
    }
  };

  const handleDelete = () => {
    if (onImagesUpdate) {
      const updatedImages = images.filter(img => !selectedImages.has(img.id));
      onImagesUpdate(updatedImages);
    }
    
    const message = language === 'en' 
      ? `Deleted ${selectedImages.size} images`
      : `${selectedImages.size}個の画像を削除しました`;
    
    toast.success(message);
    clearSelection();
    setShowDeleteDialog(false);
  };

  const handleDrop = (imageIds: string[], targetFolderId: string) => {
    if (onDragDrop) {
      onDragDrop(imageIds, targetFolderId);
      const folderName = folders.find(f => f.id === targetFolderId)?.name || (language === 'en' ? 'Folder' : 'フォルダー');
      
      const message = language === 'en' 
        ? `Moved ${imageIds.length} images to "${folderName}"`
        : `${imageIds.length}個の画像を「${folderName}」に移動しました`;
      
      toast.success(message);
      
      if (selectionMode) {
        clearSelection();
      }
    }
  };

  const handleToggleFavorite = (imageId: string) => {
    if (onToggleFavorite) {
      onToggleFavorite(imageId);
    }
  };

  const handleReorder = (draggedImageId: string, targetImageId: string, insertPosition: 'before' | 'after') => {
    console.log('🔄 Gallery handleReorder:', { draggedImageId, targetImageId, insertPosition });
    
    if (onReorderImages) {
      onReorderImages(draggedImageId, targetImageId, insertPosition);
      
      const message = language === 'en' 
        ? 'Image order changed'
        : '画像の順序を変更しました';
      
      toast.success(message);
    }
  };

  const isCustomSort = sortBy === 'custom';

  const handleImageDoubleClick = (imageId: string) => {
    const sortedImages = getSortedImages();
    const imageIndex = sortedImages.findIndex(img => img.id === imageId);
    if (imageIndex !== -1) {
      setViewerImageIndex(imageIndex);
      setShowImageViewer(true);
    }
  };

  return (
    <>
      <div className="space-y-4 pb-20">
        {/* コントロールバー */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={selectionMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                if (selectionMode) {
                  // 選択モードをオフにする時は選択もクリア
                  clearSelection();
                } else {
                  // 選択モードをオンにする
                  onSelectionModeChange(true);
                }
              }}
              className={selectionMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-transparent border-gray-500 text-white hover:bg-gray-600 hover:border-gray-400'}
            >
              {t('selection')}
            </Button>
            {selectionMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="bg-transparent border-gray-500 text-white hover:bg-gray-600 hover:border-gray-400"
              >
                {selectedImages.size === images.length 
                  ? (language === 'en' ? 'Deselect All' : '全選択解除')
                  : (language === 'en' ? 'Select All' : '全選択')
                }
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* ソートボタン */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`bg-transparent border-gray-500 text-white hover:bg-gray-600 hover:border-gray-400 ${
                    isCustomSort ? 'border-blue-500 text-blue-400' : ''
                  }`}
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  {getSortLabel()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-700">
                <DropdownMenuItem 
                  onClick={() => setSortBy('custom')}
                  className="text-white hover:bg-gray-700 focus:bg-gray-700"
                >
                  <Move className="mr-2 h-4 w-4" />
                  {language === 'en' ? 'Custom Order (Drag to Reorder)' : 'カスタム順（ドラッグで並び替え）'}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortBy('dateNew')}
                  className="text-white hover:bg-gray-700 focus:bg-gray-700"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {language === 'en' ? 'Date (Newest)' : '日付（新しい順）'}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortBy('dateOld')}
                  className="text-white hover:bg-gray-700 focus:bg-gray-700"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {language === 'en' ? 'Date (Oldest)' : '日付（古い順）'}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortBy('nameAZ')}
                  className="text-white hover:bg-gray-700 focus:bg-gray-700"
                >
                  <SortAsc className="mr-2 h-4 w-4" />
                  {language === 'en' ? 'Name (A-Z)' : '名前（A-Z）'}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortBy('nameZA')}
                  className="text-white hover:bg-gray-700 focus:bg-gray-700"
                >
                  <SortDesc className="mr-2 h-4 w-4" />
                  {language === 'en' ? 'Name (Z-A)' : '名前（Z-A）'}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortBy('sizeSmall')}
                  className="text-white hover:bg-gray-700 focus:bg-gray-700"
                >
                  <HardDrive className="mr-2 h-4 w-4" />
                  {language === 'en' ? 'Size (Smallest)' : 'サイズ（小さい順）'}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortBy('sizeLarge')}
                  className="text-white hover:bg-gray-700 focus:bg-gray-700"
                >
                  <HardDrive className="mr-2 h-4 w-4" />
                  {language === 'en' ? 'Size (Largest)' : 'サイズ（大きい順）'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* 表示列数変更ボタン */}
            <div className="flex items-center gap-1 border border-gray-600 rounded-md p-1 bg-gray-700">
              <Button
                variant={columns === 1 ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setColumns(1)}
                className={cn('p-2', columns === 1 ? 'bg-white text-black hover:bg-gray-200' : 'text-gray-300 hover:bg-gray-600 hover:text-white')}
              >
                <SquareStack className="h-4 w-4" />
              </Button>
              <Button
                variant={columns === 2 ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setColumns(2)}
                className={cn('p-2', columns === 2 ? 'bg-white text-black hover:bg-gray-200' : 'text-gray-300 hover:bg-gray-600 hover:text-white')}
              >
                <Grid2X2 className="h-4 w-4" />
              </Button>
              <Button
                variant={columns === 3 ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setColumns(3)}
                className={cn('p-2', columns === 3 ? 'bg-white text-black hover:bg-gray-200' : 'text-gray-300 hover:bg-gray-600 hover:text-white')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* カスタムソート時の説明 */}
        {isCustomSort && images.length > 0 && (
          <div className="text-sm text-blue-400 bg-blue-900/20 p-3 rounded-lg">
            💡 {t('dragToReorder')}
          </div>
        )}

        {/* ギャラリーグリッド */}
        <div className={cn(
          columns === 1 ? 'flex flex-col gap-2' : 'grid gap-4', 
          columns === 1 ? '' : getGridClass()
        )}>
          {getSortedImages().map((image, index) => (
            <DraggableImage
              key={image.id}
              image={image}
              isSelected={selectedImages.has(image.id)}
              onSelect={handleImageSelect}
              selectionMode={selectionMode}
              selectedImages={selectedImages}
              onToggleFavorite={handleToggleFavorite}
              onReorder={handleReorder}
              isCustomSort={isCustomSort}
              onDoubleClick={handleImageDoubleClick}
              columns={columns}
            />
          ))}
        </div>

        {selectionMode && selectedImages.size > 0 && (
          <div className="text-sm text-gray-300">
            {language === 'en' 
              ? `${selectedImages.size} images selected`
              : `${selectedImages.size}個の画像が選択されています`
            }
          </div>
        )}

        {images.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            {language === 'en' 
              ? 'No images in this folder'
              : 'このフォルダーに画像はありません'
            }
          </div>
        )}
      </div>

      {/* アクションバー */}
      <ActionBar
        selectedCount={selectedImages.size}
        onMoveToFolder={() => setShowFolderDialog(true)}
        onShare={handleShare}
        onDelete={() => setShowDeleteDialog(true)}
        onImageUpload={onImageUpload}
        language={language}
      />

      {/* ダイアログ */}
      <FolderSelectDialog
        open={showFolderDialog}
        onOpenChange={setShowFolderDialog}
        onConfirm={handleMoveToFolder}
        folders={folders}
        language={language}
      />

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        selectedCount={selectedImages.size}
        language={language}
      />

      <ShareDialog
        open={showShareDialog}
        onOpenChange={handleShareDialogClose}
        selectedCount={selectedImages.size}
        user={user}
        language={language}
      />

      <ImageViewer
        images={getSortedImages()}
        currentIndex={viewerImageIndex}
        isOpen={showImageViewer}
        onClose={() => setShowImageViewer(false)}
      />
    </>
  );
}