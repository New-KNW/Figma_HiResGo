import { useState } from 'react';
import { ArrowLeft, Check, Crown, Shield, Zap, CreditCard, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { toast } from 'sonner';

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

interface CourseChangeScreenProps {
  user: User;
  onBack: () => void;
  onNavigate: (page: 'gallery' | 'avatar' | 'dashboard' | 'course') => void;
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
    accessLimit: '1,000/日',
    adFrequency: '×',
    storageExpansion: '×',
    passwordProtection: false,
    pvReward: false,
    features: ['SNS連携機能'],
    icon: <Shield className="h-5 w-5" />,
    description: '個人利用に最適な無料プラン',
    highlights: ['20枚まで保存', '200MB容量', 'SNS連携']
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
    accessLimit: '1,000/日',
    adFrequency: '×',
    storageExpansion: '1.99/GB/月',
    passwordProtection: false,
    pvReward: false,
    features: ['広告なし'],
    icon: <Zap className="h-5 w-5" />,
    description: 'より多くの画像を保存したい方に',
    highlights: ['100枚まで保存', '1GB容量', '広告なし']
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
    accessLimit: '10,000/日',
    adFrequency: '×',
    storageExpansion: '1.99/GB/月',
    passwordProtection: true,
    pvReward: false,
    features: ['画像一括ダウンロード', 'パスワード保護'],
    recommended: true,
    icon: <Crown className="h-5 w-5" />,
    description: 'プロフェッショナル向けの充実機能',
    highlights: ['200枚まで保存', '2GB容量', 'すべての機能']
  }
];

const OPTIONS: Option[] = [
  {
    id: 'access-pack',
    name: '追加アクセスパック',
    description: '24時間アクセス上限を追加購入',
    targetPlans: ['lite', 'standard'],
    price: '1,000アクセスごと0.99ドル',
    note: '購入ごとに即時反映'
  },
  {
    id: 'auto-scale',
    name: '自動スケールアップ',
    description: '上限到達時に自動で追加アクセスパックを適用',
    targetPlans: ['lite', 'standard'],
    price: '1,000アクセスごと0.99ドル',
    note: '事前設定でON/OFF切り替え可能'
  }
];

export function CourseChangeScreen({ user, onBack, onNavigate }: CourseChangeScreenProps) {
  const [currentPlan, setCurrentPlan] = useState(user.currentPlan || 'free');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [processing, setProcessing] = useState(false);
  const [showDetailedComparison, setShowDetailedComparison] = useState(false);

  const handlePlanChange = async (planId: string) => {
    if (planId === currentPlan) return;
    
    setProcessing(true);
    
    // モック処理
    setTimeout(() => {
      setCurrentPlan(planId);
      setProcessing(false);
      toast.success(`${PLANS.find(p => p.id === planId)?.name}プランに変更しました`);
    }, 2000);
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
    return price === 0 ? '無料' : `$${price}`;
  };

  const getPlanPrice = (plan: Plan) => {
    return billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
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
            戻る
          </Button>
          <div>
            <h1 className="text-2xl text-white">コース変更</h1>
            <p className="text-gray-300 text-sm">現在のプラン: {getCurrentPlan()?.name}</p>
          </div>
        </div>

        {/* 料金体系切り替え */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className={`text-sm ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>
            月額
          </span>
          <Switch
            checked={billingCycle === 'yearly'}
            onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
          />
          <span className={`text-sm ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-400'}`}>
            年額
          </span>
          {billingCycle === 'yearly' && (
            <Badge variant="secondary" className="ml-2 text-xs">
              約17%お得
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
                    おすすめ
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
                      /{billingCycle === 'yearly' ? '年' : '月'}
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
                        使用中
                      </Badge>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handlePlanChange(plan.id)}
                      disabled={processing}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                      size="lg"
                    >
                      {plan.id === 'free' ? 'ダウングレード' : 'アップグレード'}
                    </Button>
                  )}
                </div>

                {plan.id === currentPlan && (
                  <div className="text-center">
                    <Badge className="bg-green-600 text-white">
                      現在のプラン
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
                料金プラン比較
              </CardTitle>
              <CardDescription className="text-gray-300">
                あなたのニーズに合ったプランをお選びください
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left text-white py-3 px-2">プラン名</th>
                      <th className="text-center text-white py-3 px-2">月額</th>
                      <th className="text-center text-white py-3 px-2">年額</th>
                      <th className="text-center text-white py-3 px-2">枚数</th>
                      <th className="text-center text-white py-3 px-2">容量</th>
                      <th className="text-center text-white py-3 px-2">オリジナル保存</th>
                      <th className="text-center text-white py-3 px-2">アクセス制限</th>
                      <th className="text-center text-white py-3 px-2">パスワード機能</th>
                      <th className="text-center text-white py-3 px-2">アクション</th>
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
                              <Badge variant="secondary" className="text-xs">おすすめ</Badge>
                            )}
                            {plan.id === currentPlan && (
                              <Badge variant="default" className="text-xs">現在</Badge>
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
                              使用中
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handlePlanChange(plan.id)}
                              disabled={processing}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              {plan.id === 'free' ? 'ダウングレード' : 'アップグレード'}
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
                詳細比較を表示
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
                          <div className="text-gray-300">月額: <span className="text-white">{formatPrice(plan.monthlyPrice)}</span></div>
                          <div className="text-gray-300">年額: <span className="text-white">{formatPrice(plan.yearlyPrice)}</span></div>
                          <div className="text-gray-300">枚数: <span className="text-white">{plan.imageLimit}</span></div>
                          <div className="text-gray-300">容量: <span className="text-white">{plan.storageLimit}</span></div>
                          <div className="text-gray-300">オリジナル保存: <span className="text-white">{plan.originalStorage ? '○' : '×'}</span></div>
                          <div className="text-gray-300">パスワード機能: <span className="text-white">{plan.passwordProtection ? '○' : '×'}</span></div>
                        </div>
                        {plan.features.length > 0 && (
                          <div className="mt-2">
                            <div className="text-gray-300 text-xs">特徴: <span className="text-white">{plan.features.join(', ')}</span></div>
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
              追加オプション
            </CardTitle>
            <CardDescription className="text-gray-300">
              プランに追加できるオプション機能
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
                            料金: {option.price}
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
            <CardTitle className="text-white">現在の使用状況</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-4">
                  <div className="text-gray-300 text-sm">画像数</div>
                  <div className="text-white text-2xl font-bold">
                    12 / {getCurrentPlan()?.imageLimit}
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(12 / (getCurrentPlan()?.imageLimit || 1)) * 100}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-4">
                  <div className="text-gray-300 text-sm">ストレージ</div>
                  <div className="text-white text-2xl font-bold">
                    45MB / {getCurrentPlan()?.storageLimit}
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-4">
                  <div className="text-gray-300 text-sm">今日のアクセス</div>
                  <div className="text-white text-2xl font-bold">
                    247 / 1,000
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
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
              より多くの画像を保存し、高度な機能を利用するには有料プランへのアップグレードをご検討ください。
              年額プランなら約17%お得になります。
            </AlertDescription>
          </Alert>
        )}

        {processing && (
          <Alert className="bg-yellow-900/20 border-yellow-500/50">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-yellow-200">
              プラン変更を処理中です。しばらくお待ちください...
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}