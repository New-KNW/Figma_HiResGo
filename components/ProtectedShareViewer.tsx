import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface ProtectedShareViewerProps {
  shareId: string;
  onPasswordSubmit: (password: string) => Promise<boolean>;
}

export function ProtectedShareViewer({ shareId, onPasswordSubmit }: ProtectedShareViewerProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('パスワードを入力してください');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const isValid = await onPasswordSubmit(password);
      if (!isValid) {
        setError('パスワードが正しくありません');
        setPassword('');
      }
    } catch (err) {
      setError('エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#4a4a4a' }}>
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Lock className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-white">保護されたコンテンツ</CardTitle>
          <CardDescription className="text-gray-300">
            このコンテンツにアクセスするにはパスワードが必要です
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">パスワード</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="パスワードを入力"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500 pr-10"
                  disabled={isVerifying}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isVerifying}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <Alert className="bg-red-900/20 border-red-500/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isVerifying || !password.trim()}
            >
              {isVerifying ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  確認中...
                </div>
              ) : (
                'アクセス'
              )}
            </Button>
          </form>

          <div className="mt-6 p-3 bg-gray-900 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-blue-600/20 rounded">
                <Lock className="h-4 w-4 text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-white text-sm font-medium mb-1">セキュリティについて</h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                  このコンテンツはパスワードで保護されています。
                  共有者からパスワードを受け取ってアクセスしてください。
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}