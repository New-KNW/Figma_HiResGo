import { useState } from 'react';
import { UserMenu } from './UserMenu';
import { Gallery } from './Gallery';
import { ImageUpload } from './ImageUpload';
import { HierarchicalFolderSelect } from './HierarchicalFolderSelect';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { ArrowUpDown, Check, SortAsc, SortDesc, Calendar, GripVertical } from 'lucide-react';
import { Language, useTranslation } from '../utils/i18n';
import appIcon from 'figma:asset/167ec6a1b167fe4602c6642cd2ed1b26d314593f.png';

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    name?: string;
    picture?: string;
  };
}

interface GalleryScreenProps {
  user: User;
  onSignOut: () => Promise<void>;
  onNavigate?: (page: 'gallery' | 'avatar' | 'dashboard' | 'plan') => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
}

interface Folder {
  id: string;
  name: string;
  order: number;
}

interface Image {
  id: string;
  src: string;
  alt: string;
  dateCreated: Date;
  size: number;
  folderId: string;
  isFavorite: boolean;
  order: number;
}

// モックデータ
const initialImages: Image[] = [
  { 
    id: '1', 
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', 
    alt: '風景1',
    dateCreated: new Date('2024-01-15'),
    size: 1024000,
    folderId: 'nature',
    isFavorite: true,
    order: 1
  },
  { 
    id: '2', 
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop', 
    alt: '森',
    dateCreated: new Date('2024-01-12'),
    size: 856000,
    folderId: 'nature',
    isFavorite: false,
    order: 2
  },
  { 
    id: '3', 
    src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=400&fit=crop', 
    alt: '海',
    dateCreated: new Date('2024-01-18'),
    size: 1200000,
    folderId: 'travel',
    isFavorite: true,
    order: 3
  },
  { 
    id: '4', 
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop', 
    alt: '山',
    dateCreated: new Date('2024-01-10'),
    size: 950000,
    folderId: 'nature',
    isFavorite: false,
    order: 4
  },
  { 
    id: '5', 
    src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=400&fit=crop', 
    alt: '花畑',
    dateCreated: new Date('2024-01-20'),
    size: 780000,
    folderId: 'nature',
    isFavorite: true,
    order: 5
  },
  { 
    id: '6', 
    src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=400&fit=crop', 
    alt: '夕日',
    dateCreated: new Date('2024-01-08'),
    size: 1100000,
    folderId: 'travel',
    isFavorite: false,
    order: 6
  },
  { 
    id: '7', 
    src: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=400&h=400&fit=crop', 
    alt: '雲',
    dateCreated: new Date('2024-01-22'),
    size: 650000,
    folderId: 'nature',
    isFavorite: false,
    order: 7
  },
  { 
    id: '8', 
    src: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=400&fit=crop', 
    alt: '湖',
    dateCreated: new Date('2024-01-05'),
    size: 890000,
    folderId: 'family',
    isFavorite: true,
    order: 8
  },
];

export function GalleryScreen({ user, onSignOut, onNavigate, language, onLanguageChange }: GalleryScreenProps) {
  const t = useTranslation(language);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [selectionMode, setSelectionMode] = useState(false);
  const [images, setImages] = useState<Image[]>(initialImages);
  const [folders, setFolders] = useState<Folder[]>([
    { id: 'all', name: t('allPhotos'), order: 1 },
    { id: 'favorites', name: t('favorites'), order: 2 },
    { id: 'nature', name: 'Nature', order: 3 },
    { id: 'travel', name: 'Travel', order: 4 },
    { id: 'family', name: 'Family', order: 5 },
    { id: 'work', name: 'Work', order: 6 },
  ]);
  const [showUpload, setShowUpload] = useState(false);
  const [folderSortMode, setFolderSortMode] = useState(false);
  const [folderSortType, setFolderSortType] = useState<'name' | 'custom' | 'imageCount'>('name');

  const handleImageUpload = (files: FileList, folderId?: string, newFolderName?: string) => {
    const newImages: Image[] = [];
    let processedCount = 0;
    
    // 新規フォルダー作成の場合
    let targetFolderId = folderId;
    if (newFolderName && !folderId) {
      targetFolderId = `folder-${Date.now()}`;
      const maxOrder = Math.max(...folders.map(f => f.order), 0);
      const newFolder: Folder = {
        id: targetFolderId,
        name: newFolderName,
        order: maxOrder + 1
      };
      setFolders(prev => [...prev, newFolder]);
      console.log(`📁 Created new folder: \"${newFolderName}\" (${targetFolderId})`);
    }
    
    // アップロード先フォルダーの決定
    const finalTargetFolderId = targetFolderId || (selectedFolder === 'all' || selectedFolder === 'favorites' ? 'work' : selectedFolder);
    
    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage: Image = {
          id: `${Date.now()}-${index}`,
          src: e.target?.result as string,
          alt: file.name,
          dateCreated: new Date(),
          size: file.size,
          folderId: finalTargetFolderId,
          isFavorite: false,
          order: 0.1 + (index * 0.1),
        };
        
        newImages.push(newImage);
        processedCount++;
        
        if (processedCount === files.length) {
          const folderName = newFolderName || folders.find(f => f.id === finalTargetFolderId)?.name || 'フォルダー';
          console.log(`✅ All ${files.length} files processed, uploading to \"${folderName}\" (${finalTargetFolderId})`);
          
          setImages(prev => {
            const allImages = [...newImages, ...prev];
            const reorderedImages = allImages.map((img, index) => ({
              ...img,
              order: index + 1
            }));
            
            console.log('📸 Added new images:', newImages.map(img => ({ id: img.id, alt: img.alt, folderId: img.folderId })));
            console.log('💡 To enable drag functionality for new images, switch to \"カスタム順（ドラッグで並び替え）\"');
            
            return reorderedImages;
          });
        }
      };
      reader.readAsDataURL(file);
    });
    
    setShowUpload(false);
  };

  const handleFolderMove = (imageIds: string[], targetFolderId: string, newFolderName?: string) => {
    let finalFolderId = targetFolderId;
    
    // 新しいフォルダーが作成される場合
    if (newFolderName && targetFolderId.startsWith('folder-')) {
      const maxOrder = Math.max(...folders.map(f => f.order), 0);
      const newFolder: Folder = {
        id: targetFolderId,
        name: newFolderName,
        order: maxOrder + 1
      };
      setFolders(prev => [...prev, newFolder]);
      finalFolderId = targetFolderId;
    }

    // 画像のフォルダーを更新
    setImages(prev => 
      prev.map(image => 
        imageIds.includes(image.id) 
          ? { ...image, folderId: finalFolderId }
          : image
      )
    );
  };

  const handleImagesUpdate = (updatedImages: Image[]) => {
    setImages(updatedImages);
  };

  const handleDragDrop = (imageIds: string[], targetFolderId: string) => {
    handleFolderMove(imageIds, targetFolderId);
  };

  const handleToggleFavorite = (imageId: string) => {
    setImages(prev => 
      prev.map(image => 
        image.id === imageId 
          ? { ...image, isFavorite: !image.isFavorite }
          : image
      )
    );
  };

  const handleReorderImages = (draggedImageId: string, targetImageId: string, insertPosition: 'before' | 'after') => {
    console.log('GalleryScreen handleReorderImages called:', { draggedImageId, targetImageId, insertPosition });
    
    setImages(prev => {
      const filteredImages = getFilteredImages();
      const allImages = [...prev];
      
      console.log('Current filtered images before reorder:', filteredImages.map(img => ({ id: img.id, alt: img.alt, order: img.order })));
      
      const draggedIndex = filteredImages.findIndex(img => img.id === draggedImageId);
      const targetIndex = filteredImages.findIndex(img => img.id === targetImageId);
      
      console.log('Drag/target indices:', { draggedIndex, targetIndex });
      
      if (draggedIndex === -1 || targetIndex === -1) {
        console.log('Invalid indices, aborting reorder');
        return prev;
      }
      
      const reorderedFiltered = [...filteredImages];
      const draggedImage = reorderedFiltered.splice(draggedIndex, 1)[0];
      
      console.log('Dragged image details:', { id: draggedImage.id, alt: draggedImage.alt, order: draggedImage.order });
      
      let newTargetIndex = reorderedFiltered.findIndex(img => img.id === targetImageId);
      if (insertPosition === 'after') {
        newTargetIndex += 1;
      }
      
      console.log('Inserting at index:', newTargetIndex);
      
      reorderedFiltered.splice(newTargetIndex, 0, draggedImage);
      
      console.log('Reordered filtered images:', reorderedFiltered.map(img => ({ id: img.id, alt: img.alt, order: img.order })));
      
      const reorderedWithNewOrder = reorderedFiltered.map((img, index) => ({
        ...img,
        order: (index + 1) * 10
      }));
      
      console.log('Reordered with new order:', reorderedWithNewOrder.map(img => ({ id: img.id, alt: img.alt, order: img.order })));
      
      const updatedImages = allImages.map(img => {
        const reorderedImg = reorderedWithNewOrder.find(r => r.id === img.id);
        return reorderedImg || img;
      });
      
      console.log('Final updated images:', updatedImages.map(img => ({ id: img.id, alt: img.alt, order: img.order, folderId: img.folderId })));
      
      return updatedImages;
    });
  };

  // 1階層フォルダー用の画像フィルタリング
  const getFilteredImages = () => {
    if (selectedFolder === 'all') {
      return images;
    }
    
    if (selectedFolder === 'favorites') {
      return images.filter(image => image.isFavorite);
    }
    
    // 1階層なので直接フォルダーIDで絞り込み
    return images.filter(image => image.folderId === selectedFolder);
  };

  // 1階層フォルダー用の画像数取得
  const getFolderImageCount = (folderId: string) => {
    if (folderId === 'all') {
      return images.length;
    }
    
    if (folderId === 'favorites') {
      return images.filter(image => image.isFavorite).length;
    }
    
    // 1階層なので直接フォルダーIDで集計
    return images.filter(image => image.folderId === folderId).length;
  };

  const handleReorderFolders = (draggedFolderId: string, targetFolderId: string, insertPosition: 'before' | 'after') => {
    console.log('GalleryScreen handleReorderFolders called:', { draggedFolderId, targetFolderId, insertPosition });
    
    setFolders(prev => {
      const draggedFolder = prev.find(f => f.id === draggedFolderId);
      const targetFolder = prev.find(f => f.id === targetFolderId);
      
      if (!draggedFolder || !targetFolder) {
        console.log('Invalid folder IDs, aborting reorder');
        return prev;
      }
      
      // 1階層なので全フォルダーが並び替え対象（システムフォルダー除く）
      const systemFolders = prev.filter(f => f.id === 'all' || f.id === 'favorites');
      const userFolders = prev.filter(f => f.id !== 'all' && f.id !== 'favorites');
      
      console.log('User folders for reorder:', userFolders.map(f => ({ id: f.id, order: f.order })));
      
      const draggedIndex = userFolders.findIndex(f => f.id === draggedFolderId);
      const targetIndex = userFolders.findIndex(f => f.id === targetFolderId);
      
      if (draggedIndex === -1 || targetIndex === -1) {
        console.log('Invalid indices, aborting reorder');
        return prev;
      }
      
      const reorderedFolders = [...userFolders];
      const draggedItem = reorderedFolders.splice(draggedIndex, 1)[0];
      
      let newTargetIndex = reorderedFolders.findIndex(f => f.id === targetFolderId);
      if (insertPosition === 'after') {
        newTargetIndex += 1;
      }
      
      reorderedFolders.splice(newTargetIndex, 0, draggedItem);
      
      const reorderedWithNewOrder = reorderedFolders.map((folder, index) => ({
        ...folder,
        order: index + 3 // システムフォルダー（all=1, favorites=2）の後から開始
      }));
      
      console.log('Reordered folders:', reorderedWithNewOrder.map(f => ({ id: f.id, order: f.order })));
      
      return [...systemFolders, ...reorderedWithNewOrder];
    });
  };

  const handleFolderSort = (sortType: 'name' | 'custom' | 'imageCount') => {
    setFolderSortType(sortType);
    
    if (sortType === 'custom') {
      setFolderSortMode(true);
    } else {
      setFolderSortMode(false);
      
      setFolders(prev => {
        const systemFolders = prev.filter(f => f.id === 'all' || f.id === 'favorites');
        const userFolders = prev.filter(f => f.id !== 'all' && f.id !== 'favorites');
        
        const sorted = userFolders.sort((a, b) => {
          if (sortType === 'name') {
            return a.name.localeCompare(b.name);
          } else if (sortType === 'imageCount') {
            const countA = getFolderImageCount(a.id);
            const countB = getFolderImageCount(b.id);
            return countB - countA;
          }
          return 0;
        });
        
        sorted.forEach((folder, index) => {
          folder.order = index + 3;
        });
        
        return [...systemFolders, ...sorted];
      });
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#4a4a4a', color: '#ffffff' }}>
      <div className="container mx-auto p-4 pb-20">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          {/* アプリロゴ */}
          <div className="flex items-center gap-3">
            <img 
              src={appIcon} 
              alt="HiResGo! Logo" 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg shadow-lg"
            />
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                HiResGo!
              </h1>
              <span className="text-xs text-gray-300 hidden sm:block">
                {t('appTagline')}
              </span>
            </div>
          </div>
          
          {/* ユーザーメニュー */}
          <UserMenu 
            user={user} 
            onSignOut={onSignOut} 
            onNavigate={onNavigate}
            language={language}
            onLanguageChange={onLanguageChange}
          />
        </div>

        {/* フォルダー選択 */}
        <div className="flex items-center gap-2 mb-6">
          <HierarchicalFolderSelect
            folders={folders}
            selectedFolder={selectedFolder}
            onFolderChange={setSelectedFolder}
            getImageCount={getFolderImageCount}
            onReorderFolders={handleReorderFolders}
            sortMode={folderSortMode}
            sortType={folderSortType}
          />
          {/* フォルダーソートドロップダウン */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`p-2 rounded transition-colors flex items-center justify-center w-10 h-10 ${
                  folderSortMode 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-600 text-white hover:bg-gray-500'
                }`}
                title={t('folderSort')}
                aria-label={t('folderSort')}
              >
                {folderSortMode ? (
                  <GripVertical className="h-4 w-4" />
                ) : folderSortType === 'name' ? (
                  <SortAsc className="h-4 w-4" />
                ) : folderSortType === 'imageCount' ? (
                  <Calendar className="h-4 w-4" />
                ) : (
                  <ArrowUpDown className="h-4 w-4" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700" align="end">
              <DropdownMenuItem 
                onClick={() => handleFolderSort('name')}
                className={`text-white hover:bg-gray-700 focus:bg-gray-700 ${
                  folderSortType === 'name' && !folderSortMode ? 'bg-gray-700' : ''
                }`}
              >
                <SortAsc className="mr-2 h-4 w-4" />
                {t('nameSort')}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleFolderSort('imageCount')}
                className={`text-white hover:bg-gray-700 focus:bg-gray-700 ${
                  folderSortType === 'imageCount' && !folderSortMode ? 'bg-gray-700' : ''
                }`}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {t('imageCountSort')}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleFolderSort('custom')}
                className={`text-white hover:bg-gray-700 focus:bg-gray-700 ${
                  folderSortMode ? 'bg-blue-600' : ''
                }`}
              >
                <GripVertical className="mr-2 h-4 w-4" />
                {t('customSort')}
              </DropdownMenuItem>
              {folderSortMode && (
                <DropdownMenuItem 
                  onClick={() => setFolderSortMode(false)}
                  className="text-blue-400 hover:bg-gray-700 focus:bg-gray-700 border-t border-gray-600"
                >
                  <Check className="mr-2 h-4 w-4" />
                  {t('sortComplete')}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ギャラリー */}
        <Gallery
          images={getFilteredImages()}
          selectionMode={selectionMode}
          onSelectionModeChange={setSelectionMode}
          onImageUpload={() => setShowUpload(true)}
          onImagesUpdate={handleImagesUpdate}
          onFolderMove={handleFolderMove}
          onDragDrop={handleDragDrop}
          onToggleFavorite={handleToggleFavorite}
          onReorderImages={handleReorderImages}
          folders={folders}
          user={user}
          onForceUpdate={() => console.log('Gallery force update triggered')}
          language={language}
        />

        {/* 画像アップロード */}
        {showUpload && (
          <ImageUpload 
            onImageUpload={handleImageUpload}
            onClose={() => setShowUpload(false)}
            folders={folders.filter(f => f.id !== 'all' && f.id !== 'favorites')}
            defaultFolderId={selectedFolder}
            language={language}
          />
        )}
      </div>
    </div>
  );
}