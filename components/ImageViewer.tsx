import { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

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

interface ImageViewerProps {
  images: Image[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageViewer({ images, currentIndex, isOpen, onClose }: ImageViewerProps) {
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // ESCキーでビューワーを閉じる
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowLeft') {
        handlePrevious();
      } else if (event.key === 'ArrowRight') {
        handleNext();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // ボディのスクロールを無効化
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // currentIndexが変更されたらactiveIndexを更新
  useEffect(() => {
    setActiveIndex(currentIndex);
  }, [currentIndex]);

  const handlePrevious = useCallback(() => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  }, [activeIndex]);

  const handleNext = useCallback(() => {
    if (activeIndex < images.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  }, [activeIndex, images.length]);

  // タッチイベントの処理
  const handleTouchStart = (event: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(event.targetTouches[0].clientX);
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    setTouchEndX(event.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }
  };

  // マウスドラッグの処理
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(event.clientX);
    event.preventDefault();
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !dragStartX) return;
    
    const distance = dragStartX - event.clientX;
    // ドラッグ中の視覚的フィードバックをここに追加できます
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    if (!isDragging || !dragStartX) return;
    
    const distance = dragStartX - event.clientX;
    const isLeftDrag = distance > 50;
    const isRightDrag = distance < -50;

    if (isLeftDrag) {
      handleNext();
    } else if (isRightDrag) {
      handlePrevious();
    }

    setIsDragging(false);
    setDragStartX(null);
  };

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[activeIndex];
  const hasPrevious = activeIndex > 0;
  const hasNext = activeIndex < images.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
      {/* ヘッダー */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3 text-white">
            <span className="text-sm bg-black/30 px-2 py-1 rounded">
              {activeIndex + 1} / {images.length}
            </span>
            <span className="text-sm">{currentImage.alt}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full w-10 h-10 p-0"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* メイン画像 */}
      <div 
        className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          if (isDragging) {
            setIsDragging(false);
            setDragStartX(null);
          }
        }}
      >
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className="max-w-full max-h-full object-contain select-none pointer-events-none"
          style={{ userSelect: 'none' }}
        />

        {/* 前の画像ボタン */}
        {hasPrevious && (
          <Button
            variant="ghost"
            size="lg"
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full w-12 h-12 p-0 opacity-70 hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
        )}

        {/* 次の画像ボタン */}
        {hasNext && (
          <Button
            variant="ghost"
            size="lg"
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full w-12 h-12 p-0 opacity-70 hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        )}
      </div>

      {/* フッター */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex items-center justify-center p-4 gap-2">
          {images.slice(Math.max(0, activeIndex - 2), Math.min(images.length, activeIndex + 3)).map((image, index) => {
            const imageIndex = Math.max(0, activeIndex - 2) + index;
            return (
              <button
                key={image.id}
                onClick={() => setActiveIndex(imageIndex)}
                className={`relative overflow-hidden rounded transition-all duration-200 ${
                  imageIndex === activeIndex 
                    ? 'ring-2 ring-white scale-110' 
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-12 h-12 object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* スワイプヒント */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/60 text-sm text-center">
        <p>← → キーまたはスワイプで画像を切り替え</p>
      </div>
    </div>
  );
}