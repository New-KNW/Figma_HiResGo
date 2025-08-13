import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Copy, Check, Mail, Link2, Crown, Lock, MessageCircle, Send, ExternalLink, Shield, Phone, AlertTriangle, Clock, Share2, Users } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
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
  currentPlan?: string;
}

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  user?: User;
  language: Language;
}

interface ShareOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
  type: 'direct' | 'social';
}

interface PasswordDeliveryMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  available: boolean;
}

export function ShareDialog({ open, onOpenChange, selectedCount, user, language }: ShareDialogProps) {
  const t = useTranslation(language);
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showLinkSection, setShowLinkSection] = useState(false);
  
  // 分離送信関連
  const [separateDelivery, setSeparateDelivery] = useState(false);
  const [passwordDeliveryMethod, setPasswordDeliveryMethod] = useState('email');
  const [passwordRecipient, setPasswordRecipient] = useState('');
  const [urlSent, setUrlSent] = useState(false);
  const [passwordSent, setPasswordSent] = useState(false);
  const [showPasswordDelivery, setShowPasswordDelivery] = useState(false);
  
  const isStandardOrAbove = user?.currentPlan === 'standard';
  const baseShareLink = `https://example.com/shared/${Date.now()}`;
  const shareLink = passwordProtected ? `${baseShareLink}?protected=true` : baseShareLink;
  const shareText = language === 'en' 
    ? `Sharing ${selectedCount} images`
    : `${selectedCount}個の画像を共有します`;

  const passwordDeliveryMethods: PasswordDeliveryMethod[] = [
    {
      id: 'email',
      name: t('emailDelivery'),
      description: t('emailDeliveryDesc'),
      icon: <Mail className="h-4 w-4" />,
      available: true
    },
    {
      id: 'sms',
      name: t('smsDelivery'),
      description: t('smsDeliveryDesc'),
      icon: <Phone className="h-4 w-4" />,
      available: true
    },
    {
      id: 'line',
      name: t('lineDelivery'),
      description: t('lineDeliveryDesc'),
      icon: <MessageCircle className="h-4 w-4" />,
      available: false // デモでは無効
    },
    {
      id: 'manual',
      name: t('manualDelivery'),
      description: t('manualDeliveryDesc'),
      icon: <Shield className="h-4 w-4" />,
      available: true
    }
  ];

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handlePasswordToggle = (enabled: boolean) => {
    setPasswordProtected(enabled);
    if (enabled && !password) {
      const newPassword = generateRandomPassword();
      setGeneratedPassword(newPassword);
      setPassword(newPassword);
    } else if (!enabled) {
      setPassword('');
      setGeneratedPassword('');
      setSeparateDelivery(false);
      setUrlSent(false);
      setPasswordSent(false);
    }
  };

  const handleSeparateDeliveryToggle = (enabled: boolean) => {
    setSeparateDelivery(enabled);
    if (enabled) {
      setShowPasswordDelivery(true);
    } else {
      setShowPasswordDelivery(false);
      setPasswordRecipient('');
      setUrlSent(false);
      setPasswordSent(false);
    }
  };

  const handleShowLink = () => {
    setShowLinkSection(true);
  };

  const handleSelectAllLink = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement;
    textarea.select();
    textarea.setSelectionRange(0, 99999);
  };

  const handleEmailShare = () => {
    if (!email.trim()) {
      setShowEmailInput(true);
      return;
    }
    
    const subject = language === 'en' 
      ? `Image Share: ${selectedCount} images`
      : `画像の共有: ${selectedCount}個の画像`;
    
    let body = `${shareText}\n\n${language === 'en' ? 'Share link' : '共有リンク'}: ${shareLink}`;
    
    // 分離送信でない場合のみパスワードを含める
    if (passwordProtected && password && !separateDelivery) {
      body += language === 'en' 
        ? `\n\nAccess password: ${password}`
        : `\n\nアクセスパスワード: ${password}`;
    } else if (separateDelivery) {
      body += language === 'en' 
        ? '\n\n* Access password will be sent separately.'
        : '\n\n※ アクセスパスワードは別途お送りいたします。';
    }
    
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
    
    if (separateDelivery && passwordProtected) {
      setUrlSent(true);
    }
    
    setEmail('');
    setShowEmailInput(false);
    
    if (!separateDelivery) {
      onOpenChange(false);
    }
  };

  const handlePasswordDelivery = () => {
    if (!passwordRecipient.trim()) {
      return;
    }
    
    let deliveryAction = '';
    
    switch (passwordDeliveryMethod) {
      case 'email':
        const subject = language === 'en' 
          ? `Access Password: ${selectedCount} images shared`
          : `アクセスパスワード: ${selectedCount}個の画像共有`;
        const body = language === 'en' 
          ? `Access password for the image share sent earlier.\n\nPassword: ${password}\n\n* Please do not share this password with others.`
          : `先程お送りした画像共有のアクセスパスワードです。\n\nパスワード: ${password}\n\n※ このパスワードは他の方と共有しないでください。`;
        deliveryAction = `mailto:${passwordRecipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(deliveryAction, '_blank');
        break;
        
      case 'sms':
        const smsBody = language === 'en' 
          ? `Image share password: ${password}\n* Please do not share with others`
          : `画像共有パスワード: ${password}\n※他の方との共有はお控えください`;
        const smsMessage = language === 'en' 
          ? `SMS Simulation\nTo: ${passwordRecipient}\nContent: ${smsBody}`
          : `SMS送信シミュレーション\n宛先: ${passwordRecipient}\n内容: ${smsBody}`;
        alert(smsMessage);
        break;
        
      case 'line':
        const lineMessage = language === 'en' 
          ? 'LINE sending is currently unavailable'
          : 'LINE送信は現在利用できません';
        alert(lineMessage);
        return;
        
      case 'manual':
        break;
    }
    
    setPasswordSent(true);
    setTimeout(() => {
      onOpenChange(false);
    }, 2000);
  };

  const handleSNSShare = (platform: string, url: string) => {
    if (platform === 'instagram' || platform === 'tiktok') {
      setShowLinkSection(true);
      setTimeout(() => {
        const linkSection = document.getElementById('share-link-section');
        if (linkSection) {
          linkSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.open(url, '_blank', 'width=600,height=400');
      
      if (separateDelivery && passwordProtected) {
        setUrlSent(true);
      } else {
        onOpenChange(false);
      }
    }
  };

  // 直接共有オプション
  const directShareOptions: ShareOption[] = [
    {
      id: 'show-link',
      name: t('showLink'),
      icon: <Link2 className="h-5 w-5" />,
      color: '#3b82f6',
      action: handleShowLink,
      type: 'direct'
    },
    {
      id: 'email',
      name: t('mail'),
      icon: <Mail className="h-5 w-5" />,
      color: '#059669',
      action: handleEmailShare,
      type: 'direct'
    }
  ];

  // SNS共有オプション（9つ）
  const snsShareOptions: ShareOption[] = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <div className="text-sm font-bold">f</div>,
      color: '#1877F2',
      action: () => handleSNSShare('facebook', `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`),
      type: 'social'
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      icon: <div className="text-sm font-bold">𝕏</div>,
      color: '#000000',
      action: () => handleSNSShare('twitter', `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareLink)}`),
      type: 'social'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <div className="text-lg">📷</div>,
      color: '#E4405F',
      action: () => handleSNSShare('instagram', '#'),
      type: 'social'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: <MessageCircle className="h-5 w-5" />,
      color: '#25D366',
      action: () => handleSNSShare('whatsapp', `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareLink)}`),
      type: 'social'
    },
    {
      id: 'line',
      name: 'LINE',
      icon: <Send className="h-5 w-5" />,
      color: '#00B900',
      action: () => handleSNSShare('line', `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(shareText)}`),
      type: 'social'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <div className="text-xs font-bold">in</div>,
      color: '#0A66C2',
      action: () => handleSNSShare('linkedin', `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}`),
      type: 'social'
    },
    {
      id: 'reddit',
      name: 'Reddit',
      icon: <div className="text-lg">📰</div>,
      color: '#FF4500',
      action: () => handleSNSShare('reddit', `https://www.reddit.com/submit?url=${encodeURIComponent(shareLink)}&title=${encodeURIComponent(shareText)}`),
      type: 'social'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: <div className="text-lg">🎵</div>,
      color: '#ff0050',
      action: () => handleSNSShare('tiktok', '#'),
      type: 'social'
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      icon: <div className="text-lg">📌</div>,
      color: '#BD081C',
      action: () => handleSNSShare('pinterest', `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareLink)}&description=${encodeURIComponent(shareText)}`),
      type: 'social'
    }
  ];

  const handleClose = () => {
    onOpenChange(false);
    setEmail('');
    setPasswordProtected(false);
    setPassword('');
    setGeneratedPassword('');
    setShowEmailInput(false);
    setShowLinkSection(false);
    setSeparateDelivery(false);
    setPasswordRecipient('');
    setUrlSent(false);
    setPasswordSent(false);
    setShowPasswordDelivery(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md w-full mx-4 max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-center text-white text-lg">
            {selectedCount}{t('shareImages')}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400 text-sm">
            {t('shareDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="px-6 pb-6 space-y-6">
            {/* パスワード保護オプション */}
            {isStandardOrAbove && (
              <div className="space-y-3 p-4 bg-gray-900 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-blue-400" />
                    <Label className="text-white text-sm">{t('passwordProtection')}</Label>
                    <Badge className="bg-blue-600 text-white text-xs px-2 py-0.5">
                      <Crown className="h-3 w-3 mr-1" />
                      {t('standardPlan')}
                    </Badge>
                  </div>
                  <Switch
                    checked={passwordProtected}
                    onCheckedChange={handlePasswordToggle}
                  />
                </div>
                
                {passwordProtected && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('enterPassword')}
                        className="bg-gray-700 border-gray-600 text-white text-sm"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const newPassword = generateRandomPassword();
                          setGeneratedPassword(newPassword);
                          setPassword(newPassword);
                        }}
                        className="bg-transparent border-gray-500 text-white hover:bg-gray-600 text-xs px-3"
                      >
                        {t('autoGenerate')}
                      </Button>
                    </div>
                    
                    {/* 分離送信オプション */}
                    <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-blue-400" />
                          <Label className="text-blue-200 text-sm">{t('secureSepatateDelivery')}</Label>
                          <Badge variant="outline" className="text-blue-300 border-blue-400 text-xs">
                            {t('recommended')}
                          </Badge>
                        </div>
                        <Switch
                          checked={separateDelivery}
                          onCheckedChange={handleSeparateDeliveryToggle}
                        />
                      </div>
                      <p className="text-blue-200 text-xs">
                        {t('separateDeliveryDescription')}
                      </p>
                    </div>
                    
                    {generatedPassword && !separateDelivery && (
                      <p className="text-yellow-400 text-xs bg-yellow-500/10 p-2 rounded">
                        🔐 {language === 'en' ? 'Password' : 'パスワード'}: {password}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* パスワード分離送信設定 */}
            {passwordProtected && separateDelivery && showPasswordDelivery && (
              <div className="space-y-4 p-4 bg-orange-900/20 rounded-lg border border-orange-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-orange-400" />
                  <Label className="text-orange-200 text-sm">{t('passwordDeliveryMethod')}</Label>
                </div>
                
                <RadioGroup value={passwordDeliveryMethod} onValueChange={setPasswordDeliveryMethod}>
                  {passwordDeliveryMethods.map((method) => (
                    <div key={method.id} className={`flex items-center space-x-2 p-2 rounded ${!method.available ? 'opacity-50' : ''}`}>
                      <RadioGroupItem value={method.id} id={method.id} disabled={!method.available} />
                      <div className="flex items-center gap-2 flex-1">
                        {method.icon}
                        <div>
                          <Label htmlFor={method.id} className="text-white text-sm cursor-pointer">
                            {method.name}
                          </Label>
                          <p className="text-gray-400 text-xs">{method.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
                
                {passwordDeliveryMethod !== 'manual' && (
                  <div className="space-y-2">
                    <Label className="text-white text-sm">
                      {passwordDeliveryMethod === 'email' 
                        ? (language === 'en' ? 'Password email recipient' : 'パスワード送信先メールアドレス')
                        : passwordDeliveryMethod === 'sms' 
                          ? (language === 'en' ? 'Mobile phone number' : '携帯電話番号')
                          : (language === 'en' ? 'Recipient' : '送信先')
                      }
                    </Label>
                    <Input
                      type={passwordDeliveryMethod === 'email' ? 'email' : 'text'}
                      value={passwordRecipient}
                      onChange={(e) => setPasswordRecipient(e.target.value)}
                      placeholder={passwordDeliveryMethod === 'email' 
                        ? t('passwordEmailPlaceholder')
                        : passwordDeliveryMethod === 'sms' 
                          ? t('phoneNumberPlaceholder')
                          : (language === 'en' ? 'Enter recipient' : '送信先を入力')
                      }
                      className="bg-gray-700 border-gray-600 text-white text-sm"
                    />
                  </div>
                )}
                
                {passwordDeliveryMethod === 'manual' && (
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                    <Label className="text-yellow-300 text-xs">{t('manualPasswordLabel')}</Label>
                    <textarea
                      readOnly
                      value={password}
                      onClick={handleSelectAllLink}
                      className="w-full mt-1 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-200 text-sm resize-none h-12 cursor-pointer hover:bg-yellow-500/20 transition-colors"
                    />
                  </div>
                )}
              </div>
            )}

            {/* 送信状況表示 */}
            {separateDelivery && passwordProtected && (urlSent || passwordSent) && (
              <div className="space-y-2 p-4 bg-green-900/20 rounded-lg border border-green-500/30">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-400" />
                  <Label className="text-green-200 text-sm">{t('sendingStatus')}</Label>
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className={`flex items-center gap-2 ${urlSent ? 'text-green-300' : 'text-gray-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${urlSent ? 'bg-green-400' : 'bg-gray-500'}`} />
                    <span>{t('urlSent')}: {urlSent ? t('completed') : t('notSent')}</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordSent ? 'text-green-300' : 'text-gray-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${passwordSent ? 'bg-green-400' : 'bg-gray-500'}`} />
                    <span>{t('passwordSent')}: {passwordSent ? t('completed') : t('notSent')}</span>
                  </div>
                </div>
                
                {urlSent && !passwordSent && passwordDeliveryMethod !== 'manual' && (
                  <Button
                    onClick={handlePasswordDelivery}
                    disabled={!passwordRecipient.trim()}
                    className="w-full mt-2 bg-orange-600 hover:bg-orange-700 text-white text-sm"
                  >
                    {t('sendPassword')}
                  </Button>
                )}
                
                {passwordSent && (
                  <div className="flex items-center gap-2 text-green-300 text-sm mt-2">
                    <Check className="h-4 w-4" />
                    <span>{t('secureDeliveryComplete')}</span>
                  </div>
                )}
              </div>
            )}

            {/* プラン制限メッセージ */}
            {!isStandardOrAbove && (
              <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                <div className="flex items-center gap-2 text-blue-200 text-sm">
                  <Crown className="h-4 w-4" />
                  <span>{t('passwordProtectionAvailable')}</span>
                </div>
              </div>
            )}

            {/* 共有リンク表示セクション */}
            {showLinkSection && (
              <div id="share-link-section" className="space-y-3 p-4 bg-gray-900 rounded-lg border border-gray-600">
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-blue-400" />
                  <Label className="text-white text-sm">{t('shareLink')}</Label>
                  {passwordProtected && (
                    <Badge variant="outline" className="text-green-400 border-green-500 text-xs">
                      <Lock className="h-3 w-3 mr-1" />
                      {t('protected')}
                    </Badge>
                  )}
                  {separateDelivery && (
                    <Badge variant="outline" className="text-orange-400 border-orange-500 text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      {t('separateDelivery')}
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  <textarea
                    readOnly
                    value={shareLink}
                    onClick={handleSelectAllLink}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white text-sm resize-none h-20 cursor-pointer hover:bg-gray-600 transition-colors"
                    placeholder={t('shareLink')}
                  />
                  <p className="text-blue-300 text-xs flex items-center gap-1">
                    <Copy className="h-3 w-3" />
                    {t('selectAllLinkText')}
                  </p>
                  
                  {separateDelivery && (
                    <div className="text-xs text-orange-400 bg-orange-500/10 p-3 rounded-lg flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{t('passwordSeparateWarning')}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* メール入力 */}
            {showEmailInput && (
              <div className="space-y-2 p-4 bg-gray-900 rounded-lg border border-gray-600">
                <Label className="text-white text-sm">{t('recipientEmail')}</Label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="bg-gray-700 border-gray-600 text-white text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={handleEmailShare}
                    disabled={!email.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                  >
                    {t('send')}
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEmailInput(false)}
                  className="text-gray-400 hover:text-white text-xs"
                >
                  {t('cancel')}
                </Button>
                
                {separateDelivery && passwordProtected && (
                  <div className="text-xs text-orange-400 bg-orange-500/10 p-2 rounded flex items-center gap-2">
                    <Shield className="h-3 w-3" />
                    <span>{t('passwordSeparateNotice')}</span>
                  </div>
                )}
              </div>
            )}

            {/* 直接共有セクション */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <Share2 className="h-5 w-5 text-blue-400" />
                <h3 className="text-white font-medium">{t('directShare')}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {directShareOptions.map((option) => (
                  <Button
                    key={option.id}
                    onClick={option.action}
                    className="flex flex-col items-center justify-center gap-3 p-6 h-auto bg-gray-700 hover:bg-gray-600 border-gray-600 text-white transition-all duration-200 hover:scale-105 relative"
                    variant="outline"
                  >
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-transform"
                      style={{ backgroundColor: option.color }}
                    >
                      {option.icon}
                    </div>
                    <span className="text-sm text-center text-gray-300 leading-tight">
                      {option.name}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            <Separator className="bg-gray-600" />

            {/* SNS共有セクション */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <Users className="h-5 w-5 text-green-400" />
                <h3 className="text-white font-medium">{t('snsShare')}</h3>
                <Badge variant="outline" className="text-gray-400 border-gray-500 text-xs">
                  9{t('platforms')}
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {snsShareOptions.map((option) => (
                  <Button
                    key={option.id}
                    onClick={option.action}
                    className="flex flex-col items-center justify-center gap-2 p-4 h-auto bg-gray-700 hover:bg-gray-600 border-gray-600 text-white transition-all duration-200 hover:scale-105 relative"
                    variant="outline"
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-transform"
                      style={{ backgroundColor: option.color }}
                    >
                      {option.icon}
                    </div>
                    <span className="text-xs text-center text-gray-300 leading-tight">
                      {option.name}
                    </span>
                  </Button>
                ))}
              </div>

              {/* SNS共有情報 */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                  <ExternalLink className="h-4 w-4" />
                  <span>{t('linkGenerated')}</span>
                </div>

                <div className="text-xs text-gray-500 bg-gray-900/50 p-3 rounded-lg">
                  {t('secureDeliveryTip')}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        {/* フッター */}
        <div className="border-t border-gray-700 p-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="w-full bg-transparent border-gray-500 text-white hover:bg-gray-600"
          >
            {t('close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}