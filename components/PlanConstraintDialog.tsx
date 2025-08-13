import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { 
  AlertTriangle, 
  Images, 
  HardDrive, 
  Shield, 
  Clock, 
  Trash2, 
  ArrowDown, 
  CheckCircle, 
  XCircle,
  Info,
  ArrowRight
} from 'lucide-react';

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

interface Plan {
  id: string;
  name: string;
  imageLimit: number;
  storageLimit: string;
  passwordProtection: boolean;
  features: string[];
}

interface CurrentUsage {
  imageCount: number;
  storageUsed: number; // MB
  protectedShares: number;
}

interface PlanConstraintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: Plan;
  targetPlan: Plan;
  currentUsage: CurrentUsage;
  user: User;
  onConfirmChange: (options: ConstraintResolutionOptions) => void;
  onCancel: () => void;
}

interface ConstraintResolutionOptions {
  deleteExcessImages: boolean;
  selectedImagesToDelete: string[];
  disableProtectedShares: boolean;
  acceptGracePeriod: boolean;
}

interface ConstraintViolation {
  type: 'images' | 'storage' | 'features';
  severity: 'blocking' | 'warning';
  current: number | string;
  limit: number | string;
  excess: number;
  description: string;
  resolutionOptions: string[];
}

export function PlanConstraintDialog({ 
  open, 
  onOpenChange, 
  currentPlan, 
  targetPlan, 
  currentUsage, 
  user,
  onConfirmChange,
  onCancel 
}: PlanConstraintDialogProps) {
  const [deleteExcessImages, setDeleteExcessImages] = useState(true);
  const [disableProtectedShares, setDisableProtectedShares] = useState(true);
  const [acceptGracePeriod, setAcceptGracePeriod] = useState(false);

  // ストレージ制限を数値化（MB）
  const parseStorageLimit = (limit: string): number => {
    const numericValue = parseFloat(limit);
    if (limit.includes('GB')) {
      return numericValue * 1024;
    }
    return numericValue; // MB
  };

  const targetStorageLimit = parseStorageLimit(targetPlan.storageLimit);

  // 制約違反を検出
  const detectViolations = (): ConstraintViolation[] => {
    const violations: ConstraintViolation[] = [];

    // 画像数制限チェック
    if (currentUsage.imageCount > targetPlan.imageLimit) {
      violations.push({
        type: 'images',
        severity: 'blocking',
        current: currentUsage.imageCount,
        limit: targetPlan.imageLimit,
        excess: currentUsage.imageCount - targetPlan.imageLimit,
        description: `${currentUsage.imageCount - targetPlan.imageLimit}枚の画像を削除する必要があります`,
        resolutionOptions: []
      });
    }

    // ストレージ容量チェック
    if (currentUsage.storageUsed > targetStorageLimit) {
      violations.push({
        type: 'storage',
        severity: 'blocking',
        current: currentUsage.storageUsed,
        limit: targetStorageLimit,
        excess: currentUsage.storageUsed - targetStorageLimit,
        description: `${((currentUsage.storageUsed - targetStorageLimit) / 1024).toFixed(1)}GBの容量削減が必要です`,
        resolutionOptions: []
      });
    }

    // 機能制限チェック
    if (currentPlan.passwordProtection && !targetPlan.passwordProtection && currentUsage.protectedShares > 0) {
      violations.push({
        type: 'features',
        severity: 'warning',
        current: currentUsage.protectedShares,
        limit: 0,
        excess: currentUsage.protectedShares,
        description: `${currentUsage.protectedShares}個のパスワード保護を無効化します`,
        resolutionOptions: []
      });
    }

    return violations;
  };

  const violations = detectViolations();
  const hasBlockingViolations = violations.some(v => v.severity === 'blocking');

  const getViolationIcon = (type: string) => {
    switch (type) {
      case 'images': return <Images className="h-4 w-4" />;
      case 'storage': return <HardDrive className="h-4 w-4" />;
      case 'features': return <Shield className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const handleConfirm = () => {
    const options: ConstraintResolutionOptions = {
      deleteExcessImages,
      selectedImagesToDelete: [],
      disableProtectedShares,
      acceptGracePeriod
    };
    
    onConfirmChange(options);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl w-full mx-4 max-h-[85vh]">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-center text-white text-xl flex items-center justify-center gap-2">
            <ArrowDown className="h-5 w-5 text-orange-400" />
            プラン変更の確認
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            {currentPlan.name} → {targetPlan.name} への変更により制限が変わります
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto px-1">
          {/* 左列：プラン比較と現在の使用状況 */}
          <div className="space-y-4">
            {/* プラン比較 */}
            <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-600">
              <div className="flex-1 text-center">
                <div className="text-blue-200 text-sm mb-1">現在</div>
                <div className="text-white font-medium">{currentPlan.name}</div>
                <div className="text-blue-300 text-sm">
                  {currentPlan.imageLimit}枚・{currentPlan.storageLimit}
                </div>
              </div>
              
              <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
              
              <div className="flex-1 text-center">
                <div className="text-orange-200 text-sm mb-1">変更後</div>
                <div className="text-white font-medium">{targetPlan.name}</div>
                <div className="text-orange-300 text-sm">
                  {targetPlan.imageLimit}枚・{targetPlan.storageLimit}
                </div>
              </div>
            </div>

            {/* 現在の使用状況 */}
            <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-600">
              <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" />
                使用状況
              </h3>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">画像数</span>
                    <span className="text-white font-medium">
                      {currentUsage.imageCount} / {targetPlan.imageLimit}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min((currentUsage.imageCount / targetPlan.imageLimit) * 100, 100)} 
                    className="h-1.5" 
                  />
                  {currentUsage.imageCount > targetPlan.imageLimit && (
                    <div className="text-red-400 text-xs">{currentUsage.imageCount - targetPlan.imageLimit} 枚超過</div>
                  )}
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">ストレージ</span>
                    <span className="text-white font-medium">
                      {(currentUsage.storageUsed / 1024).toFixed(1)}GB / {targetPlan.storageLimit}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min((currentUsage.storageUsed / targetStorageLimit) * 100, 100)} 
                    className="h-1.5" 
                  />
                  {currentUsage.storageUsed > targetStorageLimit && (
                    <div className="text-red-400 text-xs">{((currentUsage.storageUsed - targetStorageLimit) / 1024).toFixed(1)} GB超過</div>
                  )}
                </div>

                {currentUsage.protectedShares > 0 && (
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">パスワード保護</span>
                      <span className="text-white font-medium">{currentUsage.protectedShares}個</span>
                    </div>
                    {!targetPlan.passwordProtection && (
                      <div className="text-yellow-400 text-xs">この機能は利用できません</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 制約違反 */}
            {violations.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-white font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-400" />
                  解決が必要な項目
                </h3>
                
                <div className={`grid gap-2 ${violations.length > 1 ? 'grid-cols-1' : 'grid-cols-1'}`}>
                  {violations.map((violation, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center gap-3 p-2 rounded-lg border ${
                        violation.severity === 'blocking' 
                          ? 'bg-red-900/20 border-red-500/50' 
                          : 'bg-yellow-900/20 border-yellow-500/50'
                      }`}
                    >
                      <div className={`flex-shrink-0 ${
                        violation.severity === 'blocking' ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {getViolationIcon(violation.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm ${
                          violation.severity === 'blocking' ? 'text-red-200' : 'text-yellow-200'
                        }`}>
                          {violation.description}
                        </span>
                      </div>
                      
                      <Badge 
                        variant={violation.severity === 'blocking' ? 'destructive' : 'secondary'}
                        className="text-xs flex-shrink-0"
                      >
                        {violation.severity === 'blocking' ? '必須' : '注意'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 右列：解決オプション */}
          <div className="space-y-4">
            <h3 className="text-white font-medium">解決方法</h3>
            
            {hasBlockingViolations && (
              <div className="space-y-2">
                {violations.some(v => v.type === 'images') && (
                  <div className="p-2 bg-blue-900/20 rounded-lg border border-blue-500/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trash2 className="h-4 w-4 text-blue-400" />
                        <div>
                          <Label className="text-blue-200 text-sm">画像の自動削除</Label>
                          <div className="text-blue-300 text-xs">古い画像から自動的に削除</div>
                        </div>
                      </div>
                      <Switch
                        checked={deleteExcessImages}
                        onCheckedChange={setDeleteExcessImages}
                      />
                    </div>
                  </div>
                )}

                {violations.some(v => v.type === 'features') && (
                  <div className="p-2 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-yellow-400" />
                        <div>
                          <Label className="text-yellow-200 text-sm">パスワード保護の無効化</Label>
                          <div className="text-yellow-300 text-xs">保護された共有リンクを無効化</div>
                        </div>
                      </div>
                      <Switch
                        checked={disableProtectedShares}
                        onCheckedChange={setDisableProtectedShares}
                      />
                    </div>
                  </div>
                )}

                <div className="p-2 bg-green-900/20 rounded-lg border border-green-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-400" />
                      <div>
                        <Label className="text-green-200 text-sm">30日間の猶予期間</Label>
                        <div className="text-green-300 text-xs">制限は30日後に適用</div>
                      </div>
                    </div>
                    <Switch
                      checked={acceptGracePeriod}
                      onCheckedChange={setAcceptGracePeriod}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 警告メッセージ */}
            {hasBlockingViolations ? (
              <div className="flex items-start gap-2 p-2 bg-orange-900/20 border border-orange-500/50 rounded-lg">
                <Clock className="h-4 w-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <div className="text-orange-200 text-sm">
                  <strong>重要:</strong> 制約を解決しないと一部機能が制限されます。猶予期間選択時は30日以内に調整してください。
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2 bg-blue-900/20 border border-blue-500/50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-blue-400" />
                <div className="text-blue-200 text-sm">
                  制約の問題はありません。安全にプラン変更を実行できます。
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator className="bg-gray-600" />

        {/* アクションボタン */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1 bg-transparent border-gray-500 text-white hover:bg-gray-600"
          >
            キャンセル
          </Button>
          
          <Button
            onClick={handleConfirm}
            disabled={hasBlockingViolations && !deleteExcessImages && !acceptGracePeriod}
            className={`flex-1 ${
              hasBlockingViolations 
                ? 'bg-orange-600 hover:bg-orange-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {hasBlockingViolations ? (
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                制約を承認して変更
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                プラン変更を実行
              </div>
            )}
          </Button>
        </div>

        {/* ヘルプテキスト */}
        <div className="text-center">
          <p className="text-gray-400 text-xs">
            プラン変更後も、30日以内であれば元のプランに戻すことができます
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}