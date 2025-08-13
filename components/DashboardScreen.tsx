import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  ArrowLeft, 
  BarChart3, 
  Calendar, 
  Camera, 
  CreditCard,
  Download, 
  FolderOpen, 
  HardDrive, 
  Heart, 
  Images, 
  Settings, 
  Star, 
  TrendingUp,
  Upload,
  Users
} from 'lucide-react';
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

interface DashboardScreenProps {
  user: User;
  onBack: () => void;
  onNavigate: (page: 'gallery' | 'avatar' | 'dashboard' | 'plan') => void;
  language: Language;
}

interface StatCard {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}

interface ActivityItem {
  id: string;
  type: 'upload' | 'favorite' | 'share' | 'download';
  title: string;
  time: string;
  details?: string;
}

export function DashboardScreen({ user, onBack, onNavigate, language }: DashboardScreenProps) {
  const t = useTranslation(language);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email;
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const initials = displayName ? displayName.charAt(0).toUpperCase() : 'U';

  // モックデータ
  const stats: StatCard[] = [
    {
      title: t('totalImages'),
      value: 1247,
      change: '+23',
      trend: 'up',
      icon: <Images className="h-5 w-5" />
    },
    {
      title: t('favorites'),
      value: 89,
      change: '+5',
      trend: 'up',
      icon: <Heart className="h-5 w-5" />
    },
    {
      title: t('folderCount'),
      value: 12,
      change: '+2',
      trend: 'up',
      icon: <FolderOpen className="h-5 w-5" />
    },
    {
      title: t('usedStorage'),
      value: '2.4 GB',
      change: '+150 MB',
      trend: 'up',
      icon: <HardDrive className="h-5 w-5" />
    }
  ];

  const recentActivity: ActivityItem[] = [
    {
      id: '1',
      type: 'upload',
      title: t('uploadedImages'),
      time: `2 ${t('hoursAgo')}`,
      details: language === 'en' ? '5 images added to "Travel" folder' : '5枚の画像を「旅行」フォルダーに追加'
    },
    {
      id: '2',
      type: 'favorite',
      title: t('addedToFavorites'),
      time: `4 ${t('hoursAgo')}`,
      details: language === 'en' ? 'Added "sunset_beach.jpg" to favorites' : '「sunset_beach.jpg」をお気に入りに追加'
    },
    {
      id: '3',
      type: 'share',
      title: t('sharedImages'),
      time: `1 ${t('dayAgo')}`,
      details: t('sharedViaInstagram')
    },
    {
      id: '4',
      type: 'download',
      title: t('downloadedImages'),
      time: `2 ${t('daysAgo')}`,
      details: language === 'en' ? 'Downloaded 8 images from "Family" folder' : '「家族」フォルダーから8枚をダウンロード'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload':
        return <Upload className="h-4 w-4 text-green-500" />;
      case 'favorite':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'share':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'download':
        return <Download className="h-4 w-4 text-purple-500" />;
      default:
        return <Camera className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#4a4a4a', color: '#ffffff' }}>
      <div className="container mx-auto p-4 max-w-7xl">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-gray-600"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('back')}
            </Button>
            <h1 className="text-2xl font-bold text-white">{t('dashboardTitle')}</h1>
          </div>
          
          {/* 期間選択 */}
          <div className="flex gap-2">
            {(['7d', '30d', '90d'] as const).map((period) => (
              <Button
                key={period}
                size="sm"
                variant={selectedPeriod === period ? 'default' : 'outline'}
                onClick={() => setSelectedPeriod(period)}
                className={
                  selectedPeriod === period
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-transparent border-gray-500 text-white hover:bg-gray-600'
                }
              >
                {period === '7d' ? t('days7') : period === '30d' ? t('days30') : t('days90')}
              </Button>
            ))}
          </div>
        </div>

        {/* ユーザー情報カード */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName || 'User'} />}
                <AvatarFallback className="text-xl">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">{displayName}</h2>
                <p className="text-gray-400">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-green-600 text-white">{t('premium')}</Badge>
                  <Badge variant="outline" className="border-gray-500 text-gray-300">
                    <Star className="h-3 w-3 mr-1" />
                    {t('level')} 5
                  </Badge>
                </div>
              </div>
              <Button
                onClick={() => onNavigate('avatar')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Settings className="h-4 w-4 mr-2" />
                {t('editProfile')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">{stat.title}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm flex items-center gap-1 ${getTrendColor(stat.trend)}`}>
                      <TrendingUp className="h-3 w-3" />
                      {stat.change}
                    </div>
                    <p className="text-xs text-gray-500">{t('pastDays')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ストレージ使用量 */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                {t('storageUsage')}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {t('planLimit')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">{t('usage')}</span>
                  <span className="text-white">2.4 GB / 10 GB</span>
                </div>
                <Progress value={24} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-sm text-gray-300">{t('images')}</span>
                  </div>
                  <span className="text-sm text-white">2.1 GB</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-sm text-gray-300">{t('videos')}</span>
                  </div>
                  <span className="text-sm text-white">250 MB</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className="text-sm text-gray-300">{t('others')}</span>
                  </div>
                  <span className="text-sm text-white">50 MB</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 最近のアクティビティ */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {t('recentActivity')}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {t('activityHistory')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{activity.title}</p>
                      {activity.details && (
                        <p className="text-gray-400 text-xs mt-1">{activity.details}</p>
                      )}
                      <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* アクションボタン */}
        <div className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">{t('quickActions')}</CardTitle>
              <CardDescription className="text-gray-300">
                {t('quickActionsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={onBack}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Images className="h-4 w-4 mr-2" />
                  {t('viewGallery')}
                </Button>
                <Button
                  onClick={() => onNavigate('avatar')}
                  variant="outline"
                  className="bg-transparent border-gray-500 text-white hover:bg-gray-600"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {t('settings')}
                </Button>
                <Button
                  onClick={() => onNavigate('plan')}
                  variant="outline"
                  className="bg-transparent border-gray-500 text-white hover:bg-gray-600"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {t('changePlan')}
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent border-gray-500 text-white hover:bg-gray-600"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t('exportData')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}