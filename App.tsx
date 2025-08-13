import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { GalleryScreen } from './components/GalleryScreen';
import { AvatarChangeScreen } from './components/AvatarChangeScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { PlanChangeScreen } from './components/PlanChangeScreen';
import { DragDropProvider } from './components/DragDropProvider';
import { Toaster } from './components/ui/sonner';
import { Language, useTranslation } from './utils/i18n';

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    name?: string;
    picture?: string;
  };
  currentPlan?: string;
}

type Page = 'gallery' | 'avatar' | 'dashboard' | 'plan';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('gallery');
  const [language, setLanguage] = useState<Language>('en');
  const t = useTranslation(language);

  const signInWithGoogle = async () => {
    setLoading(true);
    // Mock Google login
    setTimeout(() => {
      setUser({
        id: '1',
        email: 'user@example.com',
        user_metadata: {
          full_name: 'Test User',
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
        },
        currentPlan: 'standard'
      });
      setLoading(false);
    }, 1000);
  };

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    // Mock email login
    setTimeout(() => {
      setUser({
        id: '1',
        email: email,
        user_metadata: {
          full_name: 'Test User'
        },
        currentPlan: 'standard'
      });
      setLoading(false);
    }, 1000);
  };

  const signOut = async () => {
    setUser(null);
    setCurrentPage('gallery');
  };

  const navigateToPage = (page: Page) => {
    setCurrentPage(page);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#4a4a4a' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="mt-2 text-white">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="size-full">
        <LoginScreen 
          onSignInWithGoogle={signInWithGoogle}
          onSignInWithEmail={signInWithEmail}
          loading={loading}
          language={language}
          onLanguageChange={setLanguage}
        />
        <Toaster theme="dark" />
      </div>
    );
  }

  return (
    <DragDropProvider>
      <div className="size-full">
        {currentPage === 'gallery' && (
          <GalleryScreen 
            user={user} 
            onSignOut={signOut}
            onNavigate={navigateToPage}
            language={language}
            onLanguageChange={setLanguage}
          />
        )}
        {currentPage === 'avatar' && (
          <AvatarChangeScreen
            user={user}
            onBack={() => navigateToPage('gallery')}
            onUpdateUser={updateUser}
            language={language}
          />
        )}
        {currentPage === 'dashboard' && (
          <DashboardScreen
            user={user}
            onBack={() => navigateToPage('gallery')}
            onNavigate={navigateToPage}
            language={language}
          />
        )}
        {currentPage === 'plan' && (
          <PlanChangeScreen
            user={user}
            onBack={() => navigateToPage('gallery')}
            onNavigate={navigateToPage}
            language={language}
          />
        )}
        <Toaster theme="dark" />
      </div>
    </DragDropProvider>
  );
}