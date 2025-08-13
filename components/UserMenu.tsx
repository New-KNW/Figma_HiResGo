import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { User, LogOut, Settings, BarChart3, CreditCard } from 'lucide-react';
import { Language, useTranslation } from '../utils/i18n';
import { LanguageToggle } from './LanguageToggle';

interface UserMenuProps {
  user: {
    id: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
      name?: string;
      picture?: string;
    };
  };
  onSignOut: () => Promise<void>;
  onNavigate?: (page: 'gallery' | 'avatar' | 'dashboard' | 'plan') => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export function UserMenu({ user, onSignOut, onNavigate, language, onLanguageChange }: UserMenuProps) {
  const t = useTranslation(language);
  
  const displayName = user.user_metadata?.full_name || 
                     user.user_metadata?.name || 
                     user.email?.split('@')[0] || 
                     'User';
  
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-700 transition-colors">
          <Avatar className="h-8 w-8">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
            <AvatarFallback className="bg-blue-600 text-white">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          <div className="text-left hidden sm:block">
            <p className="text-sm text-white">{displayName}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-gray-800 border-gray-700">
        <div className="px-2 py-1.5">
          <p className="text-sm text-white">{t('myAccount')}</p>
          <p className="text-xs text-gray-400 truncate">{user.email}</p>
        </div>
        <DropdownMenuSeparator className="bg-gray-600" />
        
        {onNavigate && (
          <DropdownMenuItem 
            onClick={() => onNavigate('avatar')}
            className="text-white hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            {t('profile')}
          </DropdownMenuItem>
        )}
        
        {onNavigate && (
          <DropdownMenuItem 
            onClick={() => onNavigate('dashboard')}
            className="text-white hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            {t('dashboard')}
          </DropdownMenuItem>
        )}
        
        {onNavigate && (
          <DropdownMenuItem 
            onClick={() => onNavigate('plan')}
            className="text-white hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            {t('planChange')}
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator className="bg-gray-600" />
        
        {/* Language Toggle */}
        <div className="px-2 py-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white">{t('language')}</span>
          </div>
          <div className="flex justify-center">
            <LanguageToggle 
              language={language}
              onLanguageChange={onLanguageChange}
              size="sm"
              variant="minimal"
            />
          </div>
        </div>
        
        <DropdownMenuSeparator className="bg-gray-600" />
        
        <DropdownMenuItem 
          onClick={onSignOut}
          className="text-red-400 hover:bg-red-900/20 focus:bg-red-900/20 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t('signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}