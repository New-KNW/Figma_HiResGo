import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Folder, Plus } from 'lucide-react';
import { Language, useTranslation } from '../utils/i18n';

interface Folder {
  id: string;
  name: string;
}

interface FolderSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (folderId: string, newFolderName?: string) => void;
  folders: Folder[];
  language: Language;
}

export function FolderSelectDialog({ open, onOpenChange, onConfirm, folders, language }: FolderSelectDialogProps) {
  const t = useTranslation(language);
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);

  // 「すべての写真」を除外してフォルダーリストを作成
  const availableFolders = folders.filter(folder => folder.id !== 'all');

  const handleConfirm = () => {
    if (showNewFolderInput && newFolderName.trim()) {
      // 新しいフォルダーを作成
      const newFolderId = `folder-${Date.now()}`;
      onConfirm(newFolderId, newFolderName.trim());
    } else if (selectedFolderId) {
      onConfirm(selectedFolderId);
    }
    handleClose();
  };

  const handleClose = () => {
    onOpenChange(false);
    setSelectedFolderId('');
    setNewFolderName('');
    setShowNewFolderInput(false);
  };

  const handleCancel = () => {
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">{t('selectFolder2')}</DialogTitle>
          <DialogDescription className="text-gray-300">
            {t('selectFolderDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {!showNewFolderInput && (
            <div className="space-y-2">
              {availableFolders.map((folder) => (
                <div
                  key={folder.id}
                  className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer border transition-colors ${
                    selectedFolderId === folder.id
                      ? 'bg-blue-600 border-blue-500'
                      : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                  }`}
                  onClick={() => setSelectedFolderId(folder.id)}
                >
                  <Folder className="h-4 w-4" />
                  <span>{folder.name}</span>
                </div>
              ))}
              
              <div
                className="flex items-center gap-2 p-3 rounded-lg cursor-pointer border border-gray-600 bg-gray-700 hover:bg-gray-600 transition-colors"
                onClick={() => setShowNewFolderInput(true)}
              >
                <Plus className="h-4 w-4" />
                <span>{t('createNewFolder2')}</span>
              </div>
            </div>
          )}
          
          {showNewFolderInput && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="newFolder" className="text-white">{t('newFolderName2')}</Label>
                <Input
                  id="newFolder"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder={t('folderNamePlaceholder')}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newFolderName.trim()) {
                      handleConfirm();
                    }
                  }}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNewFolderInput(false)}
                className="bg-transparent border-gray-500 text-white hover:bg-gray-600"
              >
                {t('back')}
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="bg-transparent border-gray-500 text-white hover:bg-gray-600"
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedFolderId && (!showNewFolderInput || !newFolderName.trim())}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-600 disabled:text-gray-400"
          >
            {t('move')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}