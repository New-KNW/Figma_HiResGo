import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { ArrowLeft, Edit3, X, Check, Camera, Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Language, useTranslation } from '../utils/i18n';

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

interface AvatarChangeScreenProps {
  user: User;
  onBack: () => void;
  onUpdateUser: (updatedUser: User) => void;
  language: Language;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108755-2616b60a9a91?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'
];

export function AvatarChangeScreen({ user, onBack, onUpdateUser, language }: AvatarChangeScreenProps) {
  const t = useTranslation(language);
  const [isEditing, setIsEditing] = useState(false);
  const [tempAvatarUrl, setTempAvatarUrl] = useState(user.user_metadata?.avatar_url || user.user_metadata?.picture || '');
  const [tempFullName, setTempFullName] = useState(user.user_metadata?.full_name || user.user_metadata?.name || '');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const currentAvatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email;
  const initials = displayName ? displayName.charAt(0).toUpperCase() : 'U';

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      // ファイルサイズチェック (5MB制限)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('fileSizeError'));
        setIsUploading(false);
        return;
      }

      // ファイルタイプチェック
      if (!file.type.startsWith('image/')) {
        toast.error(t('fileTypeError'));
        setIsUploading(false);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setTempAvatarUrl(result);
        setSelectedPreset(null);
        setIsUploading(false);
        toast.success(t('uploadSuccess'));
      };
      reader.onerror = () => {
        toast.error(t('fileReadError'));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetSelect = (avatarUrl: string) => {
    setTempAvatarUrl(avatarUrl);
    setSelectedPreset(avatarUrl);
  };

  const handleRemoveAvatar = () => {
    setTempAvatarUrl('');
    setSelectedPreset(null);
    toast.success(t('avatarRemoved'));
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setTempAvatarUrl(currentAvatarUrl || '');
    setTempFullName(displayName || '');
    setSelectedPreset(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTempAvatarUrl(currentAvatarUrl || '');
    setTempFullName(displayName || '');
    setSelectedPreset(null);
  };

  const handleSave = () => {
    const updatedUser: User = {
      ...user,
      user_metadata: {
        ...user.user_metadata,
        avatar_url: tempAvatarUrl,
        full_name: tempFullName.trim() || user.user_metadata?.full_name || user.user_metadata?.name
      }
    };

    onUpdateUser(updatedUser);
    setIsEditing(false);
    toast.success(t('profileUpdated'));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#4a4a4a', color: '#ffffff' }}>
      <div className="container mx-auto p-4 max-w-md">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-gray-600 p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-medium text-white">{t('profile')}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="text-white hover:bg-gray-600 p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  <Check className="h-4 w-4 mr-1" />
                  {t('save')}
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleStartEdit}
                className="text-white hover:bg-gray-600 p-2"
              >
                <Edit3 className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* プロフィールカード */}
        <Card className="bg-gray-800 border-gray-700 rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            {/* アバター */}
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  {(isEditing ? tempAvatarUrl : currentAvatarUrl) && (
                    <AvatarImage 
                      src={isEditing ? tempAvatarUrl : currentAvatarUrl} 
                      alt={t('profile')}
                    />
                  )}
                  <AvatarFallback className="text-2xl bg-gray-600">
                    {isEditing && tempFullName 
                      ? tempFullName.charAt(0).toUpperCase() 
                      : initials
                    }
                  </AvatarFallback>
                </Avatar>
                
                {/* 編集モード時のカメラアイコン */}
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                    <div className="bg-blue-600 rounded-full p-2">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* 編集モード時のアバター変更ボタン */}
              {isEditing && (
                <div className="flex gap-3">
                  <label htmlFor="avatar-upload">
                    <Button
                      type="button"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                      asChild
                    >
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        {t('change')}
                      </span>
                    </Button>
                  </label>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  
                  {tempAvatarUrl && (
                    <Button
                      onClick={handleRemoveAvatar}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('remove')}
                    </Button>
                  )}
                </div>
              )}

              {/* プリセットアバター（編集モード時のみ） */}
              {isEditing && (
                <div className="w-full space-y-3">
                  <p className="text-gray-300 text-sm text-center">{t('selectFromPresets')}</p>
                  <div className="grid grid-cols-6 gap-3 justify-items-center">
                    {PRESET_AVATARS.map((avatarUrl, index) => (
                      <button
                        key={index}
                        onClick={() => handlePresetSelect(avatarUrl)}
                        className={`relative rounded-full overflow-hidden transition-all duration-200 hover:scale-110 ${
                          selectedPreset === avatarUrl
                            ? 'ring-2 ring-blue-500'
                            : ''
                        }`}
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={avatarUrl} alt={`Preset ${index + 1}`} />
                        </Avatar>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 名前 */}
              <div className="text-center w-full">
                {isEditing ? (
                  <Input
                    value={tempFullName}
                    onChange={(e) => setTempFullName(e.target.value)}
                    placeholder={t('displayNamePlaceholder')}
                    className="bg-gray-700 border-gray-600 text-white text-center text-xl font-medium rounded-lg"
                  />
                ) : (
                  <h2 className="text-xl font-medium text-white">{displayName}</h2>
                )}
              </div>

              {/* メールアドレス */}
              <div className="flex items-center gap-2 text-gray-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">{user.email}</span>
              </div>

              {/* プラン情報 */}
              <div className="flex items-center gap-2 text-gray-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm">{t('freePlan')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 編集時の注意事項 */}
        {isEditing && (
          <div className="mt-4 text-xs text-gray-400 bg-gray-900 p-3 rounded-lg text-center">
            {t('fileSizeLimit')}
          </div>
        )}
      </div>
    </div>
  );
}