import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Eye, EyeOff } from 'lucide-react';
import { Language, useTranslation } from '../utils/i18n';
import { LanguageToggle } from './LanguageToggle';
import appIcon from 'figma:asset/167ec6a1b167fe4602c6642cd2ed1b26d314593f.png';

interface LoginScreenProps {
  onSignInWithGoogle: () => void;
  onSignInWithEmail: (email: string, password: string) => void;
  loading: boolean;
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export function LoginScreen({ onSignInWithGoogle, onSignInWithEmail, loading, language, onLanguageChange }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const t = useTranslation(language);

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onSignInWithEmail(email, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#4a4a4a' }}>
      <div className="w-full max-w-md space-y-8">
        {/* Language Selector */}
        <div className="flex justify-end">
          <LanguageToggle 
            language={language}
            onLanguageChange={onLanguageChange}
            size="md"
            variant="glass"
          />
        </div>

        {/* アプリロゴとタイトル */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src={appIcon} 
              alt="HiResGo! Logo" 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl shadow-2xl"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-wide">
              HiResGo!
            </h1>
            <p className="text-gray-300 text-sm sm:text-base">
              {t('appSubtitle')}
            </p>
            <p className="text-gray-400 text-xs sm:text-sm">
              {t('appDescription')}
            </p>
          </div>
        </div>

        {/* ログインフォーム */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-xl text-white mb-2">{t('login')}</h2>
            <p className="text-gray-400 text-sm">{t('loginDescription')}</p>
          </div>

          {/* Google サインイン */}
          <Button 
            onClick={onSignInWithGoogle}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-100 text-gray-900 border border-gray-300"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? t('signingIn') : t('signInWithGoogle')}
          </Button>

          <div className="relative">
            <Separator className="bg-gray-600" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-gray-800 px-2 text-gray-400 text-sm">{t('or')}</span>
            </div>
          </div>

          {/* メールログイン */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">{t('password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t('passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={loading || !email || !password}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? t('signingIn') : t('signInWithEmail')}
            </Button>
          </form>
        </div>

        {/* フッター */}
        <div className="text-center text-gray-400 text-xs">
          <p>{t('copyright')}</p>
          <p className="mt-1">{t('professionalSolution')}</p>
        </div>
      </div>
    </div>
  );
}