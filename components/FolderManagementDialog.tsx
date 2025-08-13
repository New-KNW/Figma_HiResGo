import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from './ui/context-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Folder, FolderPlus, Edit2, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Folder {
  id: string;
  name: string;
  parentId?: string;
}

interface FolderManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folders: Folder[];
  onFoldersUpdate: (folders: Folder[]) => void;
  getImageCount: (folderId: string) => number;
}

export function FolderManagementDialog({ 
  open, 
  onOpenChange, 
  folders, 
  onFoldersUpdate,
  getImageCount 
}: FolderManagementDialogProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderParent, setNewFolderParent] = useState<string | undefined>(undefined);
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [deletingFolder, setDeletingFolder] = useState<Folder | null>(null);

  // システムフォルダー（削除・編集不可）
  const systemFolders = new Set(['all', 'nature', 'travel', 'family', 'work', 'favorites']);
  
  // 編集可能なフォルダーのみフィルタリング
  const editableFolders = folders.filter(folder => !systemFolders.has(folder.id));

  const toggleExpanded = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleEditFolder = (folder: Folder) => {
    setEditingFolder(folder.id);
    setEditName(folder.name);
  };

  const handleSaveEdit = () => {
    if (editName.trim() && editingFolder) {
      const updatedFolders = folders.map(folder =>
        folder.id === editingFolder
          ? { ...folder, name: editName.trim() }
          : folder
      );
      onFoldersUpdate(updatedFolders);
      toast.success('フォルダー名を変更しました');
      setEditingFolder(null);
      setEditName('');
    }
  };

  const handleDeleteFolder = (folder: Folder) => {
    const imageCount = getImageCount(folder.id);
    if (imageCount > 0) {
      toast.error(`フォルダーに${imageCount}個の画像があるため削除できません`);
      return;
    }
    
    // 子フォルダーがあるかチェック
    const hasChildren = folders.some(f => f.parentId === folder.id);
    if (hasChildren) {
      toast.error('サブフォルダーがあるため削除できません');
      return;
    }
    
    setDeletingFolder(folder);
  };

  const confirmDelete = () => {
    if (deletingFolder) {
      const updatedFolders = folders.filter(f => f.id !== deletingFolder.id);
      onFoldersUpdate(updatedFolders);
      toast.success('フォルダーを削除しました');
      setDeletingFolder(null);
    }
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: Folder = {
        id: `folder-${Date.now()}`,
        name: newFolderName.trim(),
        parentId: newFolderParent
      };
      onFoldersUpdate([...folders, newFolder]);
      toast.success('新しいフォルダーを作成しました');
      setNewFolderName('');
      setNewFolderParent(undefined);
      setShowNewFolderInput(false);
    }
  };

  const buildFolderTree = (parentId?: string): Folder[] => {
    return editableFolders
      .filter(folder => folder.parentId === parentId)
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const renderFolderItem = (folder: Folder, level: number = 0): JSX.Element => {
    const hasChildren = editableFolders.some(f => f.parentId === folder.id);
    const isExpanded = expandedFolders.has(folder.id);
    const imageCount = getImageCount(folder.id);

    return (
      <div key={folder.id}>
        <ContextMenu>
          <ContextMenuTrigger>
            <div 
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700 transition-colors"
              style={{ marginLeft: `${level * 20}px` }}
            >
              {hasChildren ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-4 w-4 hover:bg-transparent"
                  onClick={() => toggleExpanded(folder.id)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </Button>
              ) : (
                <div className="w-4" />
              )}
              
              <Folder className="h-4 w-4" />
              
              {editingFolder === folder.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="bg-gray-600 border-gray-500 text-white h-6 text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') {
                        setEditingFolder(null);
                        setEditName('');
                      }
                    }}
                    onBlur={handleSaveEdit}
                  />
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm">{folder.name}</span>
                  <span className="text-xs text-gray-400">({imageCount})</span>
                </div>
              )}
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="bg-gray-800 border-gray-700">
            <ContextMenuItem 
              onClick={() => handleEditFolder(folder)}
              className="text-white hover:bg-gray-700"
            >
              <Edit2 className="mr-2 h-4 w-4" />
              名前を変更
            </ContextMenuItem>
            <ContextMenuItem 
              onClick={() => handleDeleteFolder(folder)}
              className="text-red-400 hover:bg-gray-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              削除
            </ContextMenuItem>
            <ContextMenuItem 
              onClick={() => {
                setNewFolderParent(folder.id);
                setShowNewFolderInput(true);
              }}
              className="text-white hover:bg-gray-700"
            >
              <FolderPlus className="mr-2 h-4 w-4" />
              サブフォルダーを作成
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        
        {hasChildren && isExpanded && (
          <div>
            {buildFolderTree(folder.id).map(child => renderFolderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md max-h-[600px]">
          <DialogHeader>
            <DialogTitle className="text-white">フォルダー管理</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {/* 新しいフォルダー作成 */}
            {showNewFolderInput ? (
              <div className="space-y-3 p-3 bg-gray-700 rounded-lg">
                <Label className="text-white">新しいフォルダー名</Label>
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="フォルダー名を入力"
                  className="bg-gray-600 border-gray-500 text-white"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateFolder();
                  }}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleCreateFolder}
                    disabled={!newFolderName.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    作成
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowNewFolderInput(false);
                      setNewFolderName('');
                      setNewFolderParent(undefined);
                    }}
                    className="bg-transparent border-gray-500 text-white hover:bg-gray-600"
                  >
                    キャンセル
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setShowNewFolderInput(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <FolderPlus className="mr-2 h-4 w-4" />
                新しいフォルダーを作成
              </Button>
            )}

            {/* フォルダーツリー */}
            <div className="space-y-1">
              {buildFolderTree().map(folder => renderFolderItem(folder))}
              {editableFolders.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  カスタムフォルダーはありません
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-transparent border-gray-500 text-white hover:bg-gray-600"
            >
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <AlertDialog open={!!deletingFolder} onOpenChange={() => setDeletingFolder(null)}>
        <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>フォルダーを削除</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              「{deletingFolder?.name}」を削除してもよろしいですか？この操作は取り消すことができません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-gray-500 text-white hover:bg-gray-600">
              キャンセル
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}