import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Language, useTranslation } from '../utils/i18n';

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  selectedCount: number;
  language: Language;
}

export function DeleteConfirmDialog({ open, onOpenChange, onConfirm, selectedCount, language }: DeleteConfirmDialogProps) {
  const t = useTranslation(language);
  
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">{t('deleteImages')}</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            {language === 'en' 
              ? `${t('deleteConfirmMessage')} ${selectedCount} images? ${t('thisActionCannotBeUndone')}`
              : `選択した${selectedCount}${t('deleteConfirmMessage')} ${t('thisActionCannotBeUndone')}`
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent border-gray-500 text-white hover:bg-gray-600">
            {t('cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {t('delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}