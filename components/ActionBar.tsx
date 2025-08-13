import { FolderPlus, Share2, Trash2, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Language, useTranslation } from '../utils/i18n';

interface ActionBarProps {
  selectedCount: number;
  onMoveToFolder: () => void;
  onShare: () => void;
  onDelete: () => void;
  onImageUpload?: () => void;
  language: Language;
}

export function ActionBar({ selectedCount, onMoveToFolder, onShare, onDelete, onImageUpload, language }: ActionBarProps) {
  const t = useTranslation(language);
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3">
        {selectedCount > 0 ? (
          <>
            <div className="flex items-center gap-2">
              <span className="text-white text-sm">
                {selectedCount}{t('selected')}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={onMoveToFolder}
                className="bg-green-600 hover:bg-green-700 text-white p-2 h-10 w-10"
                title={t('moveToFolder')}
              >
                <FolderPlus className="h-5 w-5" />
              </Button>
              
              <Button
                size="sm"
                onClick={onShare}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 h-10 w-10"
                title={t('share')}
              >
                <Share2 className="h-5 w-5" />
              </Button>
              
              <Button
                size="sm"
                onClick={onDelete}
                className="bg-red-600 hover:bg-red-700 text-white p-2 h-10 w-10"
                title={t('deleteAction')}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex justify-end w-full">
            {onImageUpload && (
              <Button
                onClick={onImageUpload}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                title={t('addImages')}
              >
                <Plus className="h-6 w-6" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}