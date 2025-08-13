import { useState } from 'react';
import { ArrowLeft, Check, Crown, Shield, Zap, CreditCard, Info, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { PlanConstraintDialog } from './PlanConstraintDialog';
import { toast } from 'sonner';
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

interface PlanChangeScreenProps {
  user: User;
  onBack: () => void;
  onNavigate: (page: 'gallery' | 'avatar' | 'dashboard' | 'plan') => void;
  language: Language;
}

interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  imageLimit: number;
  storageLimit: string;
  container: boolean;
  originalStorage: boolean;
  accessLimit: string;
  adFrequency: string;
  storageExpansion: string;
  passwordProtection: boolean;
  pvReward: boolean;
  features: string[];
  recommended?: boolean;
  icon: React.ReactNode;
  description: string;
  highlights: string[];
}

interface Option {
  id: string;
  name: string;
  description: string;
  targetPlans: string[];
  price: string;
  note: string;
}

export function PlanChangeScreen({ user, onBack, onNavigate, language }: PlanChangeScreenProps) {
  const t = useTranslation(language);
  const [currentPlan, setCurrentPlan] = useState(user.currentPlan || 'free');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [processing, setProcessing] = useState(false);
  const [showDetailedComparison, setShowDetailedComparison] = useState(false);
  const [showConstraintDialog, setShowConstraintDialog] = useState(false);
  const [pendingPlanChange, setPendingPlanChange] = useState<string>('');

  const PLANS: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      monthlyPrice: 0,
      yearlyPrice: 0,
      imageLimit: 20,
      storageLimit: '200MB',
      container: false,
      originalStorage: true,
      accessLimit: '1,000/day',
      adFrequency: '×',
      storageExpansion: '×',
      passwordProtection: false,
      pvReward: false,
      features: language === 'en' ? ['SNS Integration'] : ['SNS連携機能'],
      icon: <Shield className="h-5 w-5" />,
      description: t('freeDescription'),
      highlights: language === 'en' 
        ? ['Up to 20 images', '200MB storage', 'SNS integration']
        : ['20枚まで保存', '200MB容量', 'SNS連携']
    },
    {
      id: 'lite',
      name: 'Lite',
      monthlyPrice: 1.99,
      yearlyPrice: 19.99,
      imageLimit: 100,
      storageLimit: '1GB',
      container: false,
      originalStorage: true,
      accessLimit: '1,000/day',
      adFrequency: '×',
      storageExpansion: '$1.99/GB/month',
      passwordProtection: false,
      pvReward: false,
      features: language === 'en' ? ['Ad-free'] : ['広告なし'],
      icon: <Zap className="h-5 w-5" />,
      description: t('liteDescription'),
      highlights: language === 'en'
        ? ['Up to 100 images', '1GB storage', 'Ad-free']
        : ['100枚まで保存', '1GB容量', '広告なし']
    },
    {
      id: 'standard',
      name: 'Standard',
      monthlyPrice: 3.99,
      yearlyPrice: 39.99,
      imageLimit: 200,
      storageLimit: '2GB',
      container: true,
      originalStorage: false,
      accessLimit: '10,000/day',
      adFrequency: '×',
      storageExpansion: '$1.99/GB/month',
      passwordProtection: true,
      pvReward: false,
      features: language === 'en' 
        ? ['Bulk download', 'Password protection']
        : ['画像一括ダウンロード', 'パスワード保護'],
      recommended: true,
      icon: <Crown className="h-5 w-5" />,
      description: t('standardDescription'),
      highlights: language === 'en'
        ? ['Up to 200 images', '2GB storage', 'All features']
        : ['200枚まで保存', '2GB容量', 'すべての機能']
    }
  ];

  const OPTIONS: Option[] = [
    {
      id: 'access-pack',
      name: language === 'en' ? 'Additional Access Pack' : '追加アクセスパック',
      description: language === 'en' 
        ? 'Purchase additional 24-hour access limits'
        : '24時間アクセス上限を追加購入',
      targetPlans: ['lite', 'standard'],
      price: language === 'en' ? '$0.99 per 1,000 accesses' : '1,000アクセスごと0.99ドル',
      note: language === 'en' ? 'Applied immediately upon purchase' : '購入ごとに即時反映'
    },
    {
      id: 'auto-scale',
      name: language === 'en' ? 'Auto Scale-up' : '自動スケールアップ',
      description: language === 'en'
        ? 'Automatically apply additional access packs when limits are reached'
        : '上限到達時に自動で追加アクセスパックを適用',
      targetPlans: ['lite', 'standard'],
      price: language === 'en' ? '$0.99 per 1,000 accesses' : '1,000アクセスごと0.99ドル',
      note: language === 'en' ? 'Can be toggled ON/OFF in advance settings' : '事前設定でON/OFF切り替え可能'
    }
  ];

  // モックの現在使用状況データ
  const getCurrentUsage = () => ({
    imageCount: 135, // 実際のアプリでは実データを使用
    storageUsed: 2800, // MB
    protectedShares: 5
  });

  const handlePlanChange = async (planId: string) => {
    if (planId === currentPlan) return;
    
    const targetPlan = PLANS.find(p => p.id === planId);
    const currentPlanData = PLANS.find(p => p.id === currentPlan);
    
    if (!targetPlan || !currentPlanData) return;
    
    // ダウングレードかどうかチェック
    const currentLevel = getPlanLevel(currentPlan);
    const targetLevel = getPlanLevel(planId);
    const isDowngrade = targetLevel < currentLevel;
    
    if (isDowngrade) {
      // 制約チェックが必要な場合は確認ダイアログを表示
      const usage = getCurrentUsage();
      const hasViolations = 
        usage.imageCount > targetPlan.imageLimit ||
        usage.storageUsed > parseStorageLimit(targetPlan.storageLimit) ||
        (currentPlanData.passwordProtection && !targetPlan.passwordProtection && usage.protectedShares > 0);
      
      if (hasViolations) {
        setPendingPlanChange(planId);
        setShowConstraintDialog(true);
        return;
      }
    }
    
    // 制約がない場合は直接実行
    executePlanChange(planId);
  };

  const parseStorageLimit = (limit: string): number => {
    const numericValue = parseFloat(limit);
    if (limit.includes('GB')) {
      return numericValue * 1024;
    }
    return numericValue; // MB
  };

  const executePlanChange = (planId: string) => {
    setProcessing(true);
    
    // モック処理
    setTimeout(() => {
      setCurrentPlan(planId);
      setProcessing(false);
      toast.success(`${t('planChanged')} ${PLANS.find(p => p.id === planId)?.name}`);
    }, 2000);
  };

  const handleConstraintDialogConfirm = (options: any) => {
    // 制約解決オプションを処理
    if (options.deleteExcessImages) {
      toast.info(language === 'en' ? 'Starting to delete excess images...' : '超過画像の削除を開始します...');
    }
    if (options.disableProtectedShares) {
      toast.info(language === 'en' ? 'Disabling password protection...' : 'パスワード保護を無効化しています...');
    }
    if (options.acceptGracePeriod) {
      toast.info(language === 'en' ? '30-day grace period has been set' : '30日間の猶予期間が設定されました');
    }
    
    // プラン変更を実行
    executePlanChange(pendingPlanChange);
    setPendingPlanChange('');
  };

  const handleConstraintDialogCancel = () => {
    setPendingPlanChange('');
    toast.info(t('planChangeCancelled'));
  };

  const handleOptionToggle = (optionId: string) => {
    const newOptions = new Set(selectedOptions);
    if (newOptions.has(optionId)) {
      newOptions.delete(optionId);
    } else {
      newOptions.add(optionId);
    }
    setSelectedOptions(newOptions);
  };

  const getCurrentPlan = () => PLANS.find(p => p.id === currentPlan);

  const formatPrice = (price: number) => {
    return price === 0 ? (language === 'en' ? 'Free' : '無料') : `$${price}`;
  };

  const getPlanPrice = (plan: Plan) => {
    return billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  };

  // プランレベルを数値で判定する関数
  const getPlanLevel = (planId: string) => {
    const levels: { [key: string]: number } = {
      'free': 0,
      'lite': 1,
      'standard': 2
    };
    return levels[planId] || 0;
  };

  // 現在のプランと比較してアップグレード/ダウングレードを判定
  const getActionLabel = (planId: string) => {
    const currentLevel = getPlanLevel(currentPlan);
    const targetLevel = getPlanLevel(planId);
    
    if (targetLevel > currentLevel) {
      return t('upgrade');
    } else if (targetLevel < currentLevel) {
      return t('downgrade');
    } else {
      return t('change');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#4a4a4a' }}>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* ヘッダー */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="text-white hover:bg-gray-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('back')}
          </Button>
          <div>
            <h1 className="text-2xl text-white">{t('planChangeTitle')}</h1>
            <p className="text-gray-300 text-sm">{t('currentPlan')} {getCurrentPlan()?.name}</p>
          </div>
        </div>

        {/* 料金体系切り替え */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className={`text-sm ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>
            {t('monthly')}
          </span>
          <Switch
            checked={billingCycle === 'yearly'}
            onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
          />
          <span className={`text-sm ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-400'}`}>
            {t('yearly')}
          </span>
          {billingCycle === 'yearly' && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {t('discount17')}
            </Badge>
          )}
        </div>

        {/* モバイル：カード形式のプラン表示 */}
        <div className="block md:hidden space-y-4 mb-8">
          {PLANS.map((plan) => (
            <Card key={plan.id} className={`bg-gray-800 border-gray-700 relative ${plan.id === currentPlan ? 'ring-2 ring-blue-500' : ''}`}>
              {plan.recommended && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-3 py-1">
                    {t('recommended')}
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="p-2 bg-blue-600 rounded-lg text-white">
                    {plan.icon}
                  </div>
                  <CardTitle className="text-white text-xl">
                    {plan.name}
                  </CardTitle>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {formatPrice(getPlanPrice(plan))}
                  {getPlanPrice(plan) > 0 && (
                    <span className="text-sm text-gray-400 ml-1">
                      {t('per')}{billingCycle === 'yearly' ? t('year') : t('month')}
                    </span>
                  )}
                </div>
                <CardDescription className="text-gray-300 text-sm">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* 主要機能のハイライト */}
                <div className="space-y-2">
                  {plan.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span className="text-white">{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* アクションボタン */}
                <div className="pt-4">
                  {plan.id === currentPlan ? (
                    <div className="text-center">
                      <Badge variant="outline" className="text-white border-gray-500 px-4 py-2">
                        {t('inUse')}
                      </Badge>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handlePlanChange(plan.id)}
                      disabled={processing}
                      className={`w-full py-3 text-white ${
                        getPlanLevel(plan.id) < getPlanLevel(currentPlan)
                          ? 'bg-orange-600 hover:bg-orange-700'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                      size="lg"
                    >
                      {getPlanLevel(plan.id) < getPlanLevel(currentPlan) && (
                        <AlertTriangle className="h-4 w-4 mr-2" />
                      )}
                      {getActionLabel(plan.id)}
                    </Button>
                  )}
                </div>

                {plan.id === currentPlan && (
                  <div className="text-center">
                    <Badge className="bg-green-600 text-white">
                      {t('current')}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* デスクトップ：テーブル形式の詳細比較 */}
        <div className="hidden md:block">
          <Card className="bg-gray-800 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                {t('planComparisonTitle')}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {t('planComparisonDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left text-white py-3 px-2">{t('planName')}</th>
                      <th className="text-center text-white py-3 px-2">{t('monthlyPrice')}</th>
                      <th className="text-center text-white py-3 px-2">{t('yearlyPrice')}</th>
                      <th className="text-center text-white py-3 px-2">{t('imageCount')}</th>
                      <th className="text-center text-white py-3 px-2">{t('storage')}</th>
                      <th className="text-center text-white py-3 px-2">{t('originalStorage')}</th>
                      <th className="text-center text-white py-3 px-2">{t('accessLimit')}</th>
                      <th className="text-center text-white py-3 px-2">{t('passwordFeature')}</th>
                      <th className="text-center text-white py-3 px-2">{t('action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PLANS.map((plan) => (
                      <tr key={plan.id} className={`border-b border-gray-700 ${plan.id === currentPlan ? 'bg-blue-900/20' : ''}`}>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-2">
                            {plan.icon}
                            <span className="text-white font-medium">{plan.name}</span>
                            {plan.recommended && (
                              <Badge variant="secondary" className="text-xs">{t('recommended')}</Badge>
                            )}
                            {plan.id === currentPlan && (
                              <Badge variant="default" className="text-xs">{t('current')}</Badge>
                            )}
                          </div>
                        </td>
                        <td className="text-center text-white py-4 px-2">{formatPrice(plan.monthlyPrice)}</td>
                        <td className="text-center text-white py-4 px-2">{formatPrice(plan.yearlyPrice)}</td>
                        <td className="text-center text-white py-4 px-2">{plan.imageLimit}</td>
                        <td className="text-center text-white py-4 px-2">{plan.storageLimit}</td>
                        <td className="text-center py-4 px-2">
                          {plan.originalStorage ? (
                            <Check className="h-4 w-4 text-green-400 mx-auto" />
                          ) : (
                            <span className="text-gray-400">×</span>
                          )}
                        </td>
                        <td className="text-center text-white py-4 px-2">{plan.accessLimit}</td>
                        <td className="text-center py-4 px-2">
                          {plan.passwordProtection ? (
                            <Check className="h-4 w-4 text-green-400 mx-auto" />
                          ) : (
                            <span className="text-gray-400">×</span>
                          )}
                        </td>
                        <td className="text-center py-4 px-2">
                          {plan.id === currentPlan ? (
                            <Badge variant="outline" className="text-white border-gray-500">
                              {t('inUse')}
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handlePlanChange(plan.id)}
                              disabled={processing}
                              className={`text-white ${
                                getPlanLevel(plan.id) < getPlanLevel(currentPlan)
                                  ? 'bg-orange-600 hover:bg-orange-700'
                                  : 'bg-blue-600 hover:bg-blue-700'
                              }`}
                            >
                              {getPlanLevel(plan.id) < getPlanLevel(currentPlan) && (
                                <AlertTriangle className="h-4 w-4 mr-1" />
                              )}
                              {getActionLabel(plan.id)}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 詳細比較の展開ボタン（モバイルのみ） */}
        <div className="block md:hidden mb-6">
          <Collapsible open={showDetailedComparison} onOpenChange={setShowDetailedComparison}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                {t('showDetailedComparison')}
                {showDetailedComparison ? (
                  <ChevronUp className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-2" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="bg-gray-800 border-gray-700 mt-4">
                <CardContent className="p-4">
                  <div className="space-y-6">
                    {PLANS.map((plan) => (
                      <div key={plan.id} className="border-b border-gray-700 last:border-b-0 pb-4 last:pb-0">
                        <div className="flex items-center gap-2 mb-3">
                          {plan.icon}
                          <h3 className="text-white font-medium">{plan.name}</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-gray-300">{t('monthlyPrice')}: <span className="text-white">{formatPrice(plan.monthlyPrice)}</span></div>
                          <div className="text-gray-300">{t('yearlyPrice')}: <span className="text-white">{formatPrice(plan.yearlyPrice)}</span></div>
                          <div className="text-gray-300">{t('imageCount')}: <span className="text-white">{plan.imageLimit}</span></div>
                          <div className="text-gray-300">{t('storage')}: <span className="text-white">{plan.storageLimit}</span></div>
                          <div className="text-gray-300">{t('originalStorage')}: <span className="text-white">{plan.originalStorage ? '○' : '×'}</span></div>
                          <div className="text-gray-300">{t('passwordFeature')}: <span className="text-white">{plan.passwordProtection ? '○' : '×'}</span></div>
                        </div>
                        {plan.features.length > 0 && (
                          <div className="mt-2">
                            <div className="text-gray-300 text-xs">
                              {language === 'en' ? 'Features: ' : '特徴: '}
                              <span className="text-white">{plan.features.join(', ')}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* オプション設定 */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Info className="h-5 w-5" />
              {t('additionalOptions')}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {t('additionalOptionsDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {OPTIONS.map((option) => {
                const isAvailable = option.targetPlans.includes(currentPlan);
                return (
                  <Card key={option.id} className={`bg-gray-700 border-gray-600 ${!isAvailable && 'opacity-50'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className={`font-medium ${isAvailable ? 'text-white' : 'text-gray-500'}`}>
                              {option.name}
                            </h4>
                            <div className="flex gap-1">
                              {option.targetPlans.map(planId => (
                                <Badge key={planId} variant="outline" size="sm" className="text-xs">
                                  {PLANS.find(p => p.id === planId)?.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <p className={`text-sm mb-2 ${isAvailable ? 'text-gray-300' : 'text-gray-500'}`}>
                            {option.description}
                          </p>
                          <div className={`text-sm ${isAvailable ? 'text-white' : 'text-gray-500'}`}>
                            {t('price')} {option.price}
                          </div>
                          <div className={`text-xs mt-1 ${isAvailable ? 'text-gray-400' : 'text-gray-500'}`}>
                            {option.note}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <Switch
                            checked={selectedOptions.has(option.id)}
                            onCheckedChange={() => handleOptionToggle(option.id)}
                            disabled={!isAvailable}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 現在の使用状況 */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">{t('currentUsageTitle')}</CardTitle>
            <CardDescription className="text-gray-300">
              {t('currentUsageDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-4">
                  <div className="text-gray-300 text-sm">{t('imageCount')}</div>
                  <div className="text-white text-2xl font-bold">
                    {getCurrentUsage().imageCount} / {getCurrentPlan()?.imageLimit}
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${
                        getCurrentUsage().imageCount > (getCurrentPlan()?.imageLimit || 0) 
                          ? 'bg-red-600' 
                          : getCurrentUsage().imageCount > (getCurrentPlan()?.imageLimit || 0) * 0.8 
                            ? 'bg-yellow-600' 
                            : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min((getCurrentUsage().imageCount / (getCurrentPlan()?.imageLimit || 1)) * 100, 100)}%` }}
                    ></div>
                  </div>
                  {getCurrentUsage().imageCount > (getCurrentPlan()?.imageLimit || 0) && (
                    <div className="text-red-400 text-xs mt-1">{t('exceededLimit')}</div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-4">
                  <div className="text-gray-300 text-sm">{t('storageUsed')}</div>
                  <div className="text-white text-2xl font-bold">
                    {(getCurrentUsage().storageUsed / 1024).toFixed(1)}GB / {getCurrentPlan()?.storageLimit}
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${
                        getCurrentUsage().storageUsed > parseStorageLimit(getCurrentPlan()?.storageLimit || '0MB')
                          ? 'bg-red-600'
                          : getCurrentUsage().storageUsed > parseStorageLimit(getCurrentPlan()?.storageLimit || '0MB') * 0.8
                            ? 'bg-yellow-600'
                            : 'bg-green-600'
                      }`}
                      style={{ width: `${Math.min((getCurrentUsage().storageUsed / parseStorageLimit(getCurrentPlan()?.storageLimit || '0MB')) * 100, 100)}%` }}
                    ></div>
                  </div>
                  {getCurrentUsage().storageUsed > parseStorageLimit(getCurrentPlan()?.storageLimit || '0MB') && (
                    <div className="text-red-400 text-xs mt-1">{t('exceededLimit')}</div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-4">
                  <div className="text-gray-300 text-sm">{t('passwordProtectedShares')}</div>
                  <div className="text-white text-2xl font-bold">
                    {getCurrentUsage().protectedShares}{language === 'en' ? ' shares' : '個'}
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: getCurrentUsage().protectedShares > 0 ? '100%' : '0%' }}></div>
                  </div>
                  {getCurrentUsage().protectedShares > 0 && !getCurrentPlan()?.passwordProtection && (
                    <div className="text-yellow-400 text-xs mt-1">{t('featureNotAvailable')}</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* アップグレード案内 */}
        {currentPlan === 'free' && (
          <Alert className="bg-blue-900/20 border-blue-500/50 mb-6">
            <Crown className="h-4 w-4" />
            <AlertDescription className="text-blue-200">
              {t('upgradeRecommendation')}
            </AlertDescription>
          </Alert>
        )}

        {processing && (
          <Alert className="bg-yellow-900/20 border-yellow-500/50">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-yellow-200">
              {t('processingPlanChange')}
            </AlertDescription>
          </Alert>
        )}

        {/* 制約チェックダイアログ */}
        {showConstraintDialog && pendingPlanChange && (
          <PlanConstraintDialog
            currentPlan={currentPlan}
            targetPlan={pendingPlanChange}
            currentUsage={getCurrentUsage()}
            plans={PLANS}
            isOpen={showConstraintDialog}
            onConfirm={handleConstraintDialogConfirm}
            onCancel={handleConstraintDialogCancel}
          />
        )}
      </div>
    </div>
  );
}