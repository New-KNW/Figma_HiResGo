import { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Plus, X, FolderOpen, FolderPlus, Upload, ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Language, useTranslation } from '../utils/i18n';

interface Folder {
  id: string;
  name: string;
  order: number;
}

interface ImageUploadProps {
  onImageUpload: (files: FileList, folderId?: string, newFolderName?: string) => void;
  onClose?: () => void;
  folders?: Folder[];
  defaultFolderId?: string;
  language: Language;
}

interface PreviewImage {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
}

type UploadPhase = 'folder-selection' | 'file-preview' | 'uploading';

export function ImageUpload({ onImageUpload, onClose, folders = [], defaultFolderId = 'all', language }: ImageUploadProps) {
  const t = useTranslation(language);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFolderId, setSelectedFolderId] = useState(defaultFolderId);
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);
  const [currentPhase, setCurrentPhase] = useState<UploadPhase>('folder-selection');

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const previews: PreviewImage[] = [];
      let processedCount = 0;

      Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const preview: PreviewImage = {
            id: `preview-${Date.now()}-${index}`,
            file,
            previewUrl: e.target?.result as string,
            name: file.name,
            size: file.size
          };
          
          previews.push(preview);
          processedCount++;
          
          if (processedCount === files.length) {
            setPreviewImages(previews.sort((a, b) => a.name.localeCompare(b.name)));
            setCurrentPhase('file-preview');
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleFolderSelection = (value: string) => {
    if (value === 'new-folder') {
      setShowNewFolderInput(true);
      setSelectedFolderId('');
    } else {
      setSelectedFolderId(value);
      setShowNewFolderInput(false);
    }
  };

  const handleBackToFolderSelection = () => {
    setPreviewImages([]);
    setCurrentPhase('folder-selection');
    // ファイル入力をリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = () => {
    if (previewImages.length === 0) return;
    
    setCurrentPhase('uploading');
    
    // FileListオブジェクトを再構築
    const dt = new DataTransfer();
    previewImages.forEach(preview => {
      dt.items.add(preview.file);
    });
    const fileList = dt.files;
    
    if (showNewFolderInput && newFolderName.trim()) {
      onImageUpload(fileList, undefined, newFolderName.trim());
    } else {
      onImageUpload(fileList, selectedFolderId !== 'all' ? selectedFolderId : undefined);
    }
  };

  const handleRemoveImage = (imageId: string) => {
    setPreviewImages(prev => prev.filter(img => img.id !== imageId));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const selectedFolderName = showNewFolderInput 
    ? newFolderName || (language === 'ja' ? '新しいフォルダー' : 'New Folder')
    : selectedFolderId === 'all' 
      ? (language === 'ja' ? 'すべての写真' : 'All Photos')
      : folders.find(f => f.id === selectedFolderId)?.name || (language === 'ja' ? 'フォルダーを選択' : 'Select Folder');

  const canProceedToFileSelection = !showNewFolderInput || (showNewFolderInput && newFolderName.trim());
  const canUpload = previewImages.length > 0 && (selectedFolderId || (showNewFolderInput && newFolderName.trim()));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            {currentPhase === 'file-preview' && (
              <Button
                onClick={handleBackToFolderSelection}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-700 p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <h3 className="text-lg text-white">
              {currentPhase === 'folder-selection' && t('uploadImages')}
              {currentPhase === 'file-preview' && t('uploadConfirmation')}
              {currentPhase === 'uploading' && t('uploading')}
            </h3>
          </div>
          {onClose && currentPhase !== 'uploading' && (
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        {/* フォルダー選択フェーズ */}
        {currentPhase === 'folder-selection' && (
          <div className="p-6 space-y-4">
            {/* フォルダー選択 */}
            <div className="space-y-2">
              <Label className="text-white text-sm">{t('selectFolder')}</Label>
              
              {!showNewFolderInput ? (
                <Select value={selectedFolderId} onValueChange={handleFolderSelection}>
                  <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4 text-gray-300" />
                      <SelectValue>
                        <span className="text-white">{selectedFolderName}</span>
                      </SelectValue>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600 max-h-60 overflow-y-auto">
                    {/* すべての写真オプション */}
                    <SelectItem 
                      value="all" 
                      className="text-white hover:bg-gray-600 focus:bg-gray-600"
                    >
                      <div className="flex items-center gap-2">
                        <FolderOpen className="h-4 w-4 text-gray-300" />
                        <span>{language === 'ja' ? 'すべての写真' : 'All Photos'}</span>
                      </div>
                    </SelectItem>
                    
                    {/* 既存フォルダー */}
                    {folders
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((folder) => (
                        <SelectItem 
                          key={folder.id} 
                          value={folder.id} 
                          className="text-white hover:bg-gray-600 focus:bg-gray-600"
                        >
                          <div className="flex items-center gap-2">
                            <FolderOpen className="h-4 w-4 text-gray-300" />
                            <span>{folder.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    
                    {/* 新規フォルダー作成 */}
                    <SelectItem 
                      value="new-folder" 
                      className="text-blue-400 hover:bg-gray-600 focus:bg-gray-600 border-t border-gray-600"
                    >
                      <div className="flex items-center gap-2">
                        <FolderPlus className="h-4 w-4 text-blue-400" />
                        <span>{t('createNewFolder')}</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="newFolder" className="text-white text-sm">{t('newFolderName')}</Label>
                    <Input
                      id="newFolder"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder={t('newFolderPlaceholder')}
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      autoFocus
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowNewFolderInput(false);
                      setNewFolderName('');
                      setSelectedFolderId(defaultFolderId);
                    }}
                    className="bg-transparent border-gray-500 text-white hover:bg-gray-600"
                  >
                    {t('back')}
                  </Button>
                </div>
              )}
            </div>

            {/* ファイル選択ボタン */}
            <Button
              onClick={handleClick}
              disabled={!canProceedToFileSelection}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-600 disabled:text-gray-400"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('selectFiles')}
            </Button>
            
            <p className="text-sm text-gray-400 text-center">
              {t('multipleSelection')}
            </p>

            {/* 選択されたフォルダーの表示 */}
            {!showNewFolderInput && selectedFolderId !== 'all' && (
              <div className="text-xs text-gray-400 bg-gray-700/50 p-2 rounded">
                📁 {t('uploadTo')} {folders.find(f => f.id === selectedFolderId)?.name}
              </div>
            )}
            
            {showNewFolderInput && newFolderName.trim() && (
              <div className="text-xs text-gray-400 bg-gray-700/50 p-2 rounded">
                ➕ {language === 'ja' ? '新しいフォルダー' : 'New Folder'}: {newFolderName}
              </div>
            )}
          </div>
        )}

        {/* ファイルプレビューフェーズ */}
        {currentPhase === 'file-preview' && (
          <div className="flex flex-col h-full">
            {/* アップロード先情報 */}
            <div className="px-6 py-4 bg-gray-700/50 border-b border-gray-600">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <FolderOpen className="h-4 w-4" />
                <span>{t('uploadTo')}</span>
                <span className="text-white font-medium">{selectedFolderName}</span>
              </div>
            </div>

            {/* プレビューグリッド */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-medium">
                    {t('selectedImages')} ({previewImages.length}{t('items')})
                  </h4>
                  <Button
                    onClick={handleClick}
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-gray-500 text-white hover:bg-gray-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('add')}
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {previewImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                        <img
                          src={image.previewUrl}
                          alt={image.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* 削除ボタン */}
                      <Button
                        onClick={() => handleRemoveImage(image.id)}
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </Button>

                      {/* ファイル情報 */}
                      <div className="mt-2 text-xs text-gray-400">
                        <div className="truncate" title={image.name}>{image.name}</div>
                        <div>{formatFileSize(image.size)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="p-6 border-t border-gray-700">
              <Button
                onClick={handleUpload}
                disabled={!canUpload}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-600 disabled:text-gray-400"
              >
                <Upload className="h-4 w-4 mr-2" />
                {t('upload')} ({previewImages.length}{t('items')})
              </Button>
            </div>
          </div>
        )}

        {/* アップロード中フェーズ */}
        {currentPhase === 'uploading' && (
          <div className="p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-white mb-2">{t('uploading')}</p>
            <p className="text-sm text-gray-400">
              {previewImages.length}{t('items')} {t('uploadingTo')} 「{selectedFolderName}」
            </p>
          </div>
        )}
      </div>
    </div>
  );
}