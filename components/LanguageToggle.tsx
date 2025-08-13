import { Language } from '../utils/i18n';

interface LanguageToggleProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'minimal';
}

export function LanguageToggle({ 
  language, 
  onLanguageChange, 
  size = 'md',
  variant = 'default' 
}: LanguageToggleProps) {
  
  const sizeClasses = {
    sm: 'h-8 w-16 text-xs',
    md: 'h-9 w-18 text-sm',
    lg: 'h-10 w-20 text-sm'
  };

  const variantClasses = {
    default: 'bg-gray-700/80 border border-gray-600/50 backdrop-blur-sm',
    glass: 'bg-white/10 border border-white/20 backdrop-blur-md',
    minimal: 'bg-gray-800/60 border border-gray-700/80'
  };

  const activeVariantClasses = {
    default: 'bg-blue-600 text-white shadow-lg shadow-blue-600/25',
    glass: 'bg-white/20 text-white shadow-lg shadow-white/10',
    minimal: 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
  };

  const inactiveVariantClasses = {
    default: 'text-gray-300 hover:text-white',
    glass: 'text-white/70 hover:text-white',
    minimal: 'text-gray-400 hover:text-white'
  };

  return (
    <div className={`
      relative inline-flex items-center justify-between rounded-full p-1 
      transition-all duration-300 ease-in-out cursor-pointer
      ${sizeClasses[size]} ${variantClasses[variant]}
      hover:scale-105 active:scale-95
      shadow-sm hover:shadow-md
    `}>
      {/* EN Button */}
      <button
        onClick={() => onLanguageChange('en')}
        className={`
          relative flex items-center justify-center rounded-full px-2 py-1 z-10
          transition-all duration-300 ease-in-out font-medium tracking-wide
          ${language === 'en' 
            ? `${activeVariantClasses[variant]} scale-105` 
            : `${inactiveVariantClasses[variant]} hover:bg-white/5`
          }
        `}
        aria-label="Switch to English"
      >
        <span className="relative z-10">EN</span>
        {language === 'en' && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 opacity-90 animate-pulse" />
        )}
      </button>

      {/* JA Button */}
      <button
        onClick={() => onLanguageChange('ja')}
        className={`
          relative flex items-center justify-center rounded-full px-2 py-1 z-10
          transition-all duration-300 ease-in-out font-medium tracking-wide
          ${language === 'ja' 
            ? `${activeVariantClasses[variant]} scale-105` 
            : `${inactiveVariantClasses[variant]} hover:bg-white/5`
          }
        `}
        aria-label="Switch to Japanese"
      >
        <span className="relative z-10">JA</span>
        {language === 'ja' && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 opacity-90 animate-pulse" />
        )}
      </button>

      {/* Background sliding indicator */}
      <div 
        className={`
          absolute top-1 bottom-1 w-7 rounded-full transition-all duration-300 ease-in-out
          bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 shadow-lg
          ${language === 'en' ? 'left-1' : 'right-1'}
          opacity-20
        `}
      />

      {/* Glow effect */}
      <div className={`
        absolute inset-0 rounded-full transition-opacity duration-300
        ${language === 'en' || language === 'ja' ? 'opacity-30' : 'opacity-0'}
        bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-sm
      `} />
    </div>
  );
}