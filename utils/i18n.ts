export type Language = 'en' | 'ja';

export interface Translation {
  // App
  loading: string;
  
  // LoginScreen
  appSubtitle: string;
  appDescription: string;
  login: string;
  loginDescription: string;
  signInWithGoogle: string;
  signingIn: string;
  or: string;
  email: string;
  emailPlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  signInWithEmail: string;
  copyright: string;
  professionalSolution: string;
  
  // GalleryScreen
  appTagline: string;
  folderSort: string;
  nameSort: string;
  imageCountSort: string;
  customSort: string;
  sortComplete: string;
  allPhotos: string;
  favorites: string;
  
  // UserMenu
  myAccount: string;
  profile: string;
  dashboard: string;
  planChange: string;
  signOut: string;
  language: string;
  english: string;
  japanese: string;
  
  // ImageUpload
  uploadImages: string;
  uploadConfirmation: string;
  uploading: string;
  selectFolder: string;
  createNewFolder: string;
  newFolderName: string;
  newFolderPlaceholder: string;
  back: string;
  selectFiles: string;
  multipleSelection: string;
  selectedImages: string;
  add: string;
  upload: string;
  uploadTo: string;
  uploadingTo: string;
  
  // Gallery
  selection: string;
  customOrder: string;
  dragToReorder: string;
  
  // ShareDialog
  shareImages: string;
  shareDescription: string;
  passwordProtection: string;
  standardPlan: string;
  enterPassword: string;
  autoGenerate: string;
  secureSepatateDelivery: string;
  recommended: string;
  separateDeliveryDescription: string;
  passwordDeliveryMethod: string;
  emailDelivery: string;
  emailDeliveryDesc: string;
  smsDelivery: string;
  smsDeliveryDesc: string;
  lineDelivery: string;
  lineDeliveryDesc: string;
  manualDelivery: string;
  manualDeliveryDesc: string;
  passwordEmailPlaceholder: string;
  phoneNumberPlaceholder: string;
  manualPasswordLabel: string;
  sendingStatus: string;
  urlSent: string;
  passwordSent: string;
  notSent: string;
  completed: string;
  sendPassword: string;
  secureDeliveryComplete: string;
  passwordProtectionAvailable: string;
  shareLink: string;
  protected: string;
  separateDelivery: string;
  selectAllLinkText: string;
  passwordSeparateWarning: string;
  recipientEmail: string;
  send: string;
  passwordSeparateNotice: string;
  directShare: string;
  showLink: string;
  mail: string;
  snsShare: string;
  platforms: string;
  linkGenerated: string;
  secureDeliveryTip: string;
  close: string;
  
  // ActionBar
  selected: string;
  moveToFolder: string;
  share: string;
  deleteAction: string;
  addImages: string;
  
  // DeleteConfirmDialog
  deleteImages: string;
  deleteConfirmMessage: string;
  thisActionCannotBeUndone: string;
  
  // FolderSelectDialog
  selectFolder2: string;
  selectFolderDescription: string;
  createNewFolder2: string;
  newFolderName2: string;
  folderNamePlaceholder: string;
  move: string;
  
  // Common
  cancel: string;
  confirm: string;
  delete: string;
  edit: string;
  save: string;
  close2: string;
  items: string;
  
  // AvatarChangeScreen
  profile: string;
  displayName: string;
  displayNamePlaceholder: string;
  change: string;
  remove: string;
  selectFromPresets: string;
  freePlan: string;
  profileUpdated: string;
  uploadSuccess: string;
  avatarRemoved: string;
  fileSizeError: string;
  fileTypeError: string;
  fileReadError: string;
  fileSizeLimit: string;
  
  // DashboardScreen
  dashboardTitle: string;
  totalImages: string;
  favorites: string;
  folderCount: string;
  usedStorage: string;
  premium: string;
  level: string;
  editProfile: string;
  storageUsage: string;
  planLimit: string;
  usage: string;
  images: string;
  videos: string;
  others: string;
  recentActivity: string;
  activityHistory: string;
  uploadedImages: string;
  addedToFavorites: string;
  sharedImages: string;
  downloadedImages: string;
  hoursAgo: string;
  dayAgo: string;
  daysAgo: string;
  addedToFavoriteDetail: string;
  sharedViaInstagram: string;
  downloadedFromFolder: string;
  quickActions: string;
  quickActionsDescription: string;
  viewGallery: string;
  settings: string;
  changePlan: string;
  exportData: string;
  pastDays: string;
  days7: string;
  days30: string;
  days90: string;
  
  // PlanChangeScreen
  planChangeTitle: string;
  currentPlan: string;
  monthly: string;
  yearly: string;
  discount17: string;
  recommended: string;
  current: string;
  inUse: string;
  upgrade: string;
  downgrade: string;
  change: string;
  planComparisonTitle: string;
  planComparisonDescription: string;
  planName: string;
  monthlyPrice: string;
  yearlyPrice: string;
  imageCount: string;
  storage: string;
  originalStorage: string;
  accessLimit: string;
  passwordFeature: string;
  action: string;
  showDetailedComparison: string;
  additionalOptions: string;
  additionalOptionsDescription: string;
  currentUsageTitle: string;
  currentUsageDescription: string;
  storageUsed: string;
  passwordProtectedShares: string;
  exceededLimit: string;
  featureNotAvailable: string;
  upgradeRecommendation: string;
  processingPlanChange: string;
  free: string;
  freeDescription: string;
  freePlanFeatures: string;
  lite: string;
  liteDescription: string;
  litePlanFeatures: string;
  standard: string;
  standardDescription: string;
  standardPlanFeatures: string;
  planChanged: string;
  planChangeCancelled: string;
  price: string;
  per: string;
  year: string;
  month: string;
}

export const translations: Record<Language, Translation> = {
  en: {
    // App
    loading: 'Loading...',
    
    // LoginScreen
    appSubtitle: 'Hi-Res Photo Easy Sharing App',
    appDescription: 'Easy and Free Album Creation',
    login: 'Login',
    loginDescription: 'Please sign in to your account',
    signInWithGoogle: 'Sign in with Google',
    signingIn: 'Signing in...',
    or: 'or',
    email: 'Email Address',
    emailPlaceholder: 'your@email.com',
    password: 'Password',
    passwordPlaceholder: 'Enter password',
    signInWithEmail: 'Sign in with Email',
    copyright: '© 2024 HiResGo! All rights reserved.',
    professionalSolution: 'Professional Hi-Res Content Distribution Solution',
    
    // GalleryScreen
    appTagline: 'Hi-Resolution Image Management',
    folderSort: 'Folder Sort',
    nameSort: 'Name (A-Z)',
    imageCountSort: 'Image Count (Most)',
    customSort: 'Custom (User Folders Only)',
    sortComplete: 'Sort Complete',
    allPhotos: 'All Photos',
    favorites: 'Favorites',
    
    // UserMenu
    myAccount: 'My Account',
    profile: 'Profile',
    dashboard: 'Dashboard',
    planChange: 'Plan',
    signOut: 'Sign Out',
    language: 'Language',
    english: 'English',
    japanese: '日本語',
    
    // ImageUpload
    uploadImages: 'Upload Images',
    uploadConfirmation: 'Upload Confirmation',
    uploading: 'Uploading...',
    selectFolder: 'Destination Folder',
    createNewFolder: 'Create New Folder',
    newFolderName: 'New Folder Name',
    newFolderPlaceholder: 'Enter folder name',
    back: 'Back',
    selectFiles: 'Select Files',
    multipleSelection: 'You can select multiple images at once',
    selectedImages: 'Selected Images',
    add: 'Add',
    upload: 'Upload',
    uploadTo: 'Upload to:',
    uploadingTo: 'Uploading to',
    
    // Gallery
    selection: 'Selection',
    customOrder: 'Custom Order',
    dragToReorder: 'Drag images to freely reorder them.',
    
    // ShareDialog
    shareImages: 'Share Images',
    shareDescription: 'Share selected images via link, email, or social media',
    passwordProtection: 'Password Protection',
    standardPlan: 'Standard',
    enterPassword: 'Enter password',
    autoGenerate: 'Auto Generate',
    secureSepatateDelivery: 'Secure Separate Delivery',
    recommended: 'Recommended',
    separateDeliveryDescription: 'Send URL and password separately for enhanced security',
    passwordDeliveryMethod: 'Password Delivery Method',
    emailDelivery: 'Email',
    emailDeliveryDesc: 'Send password to different email address',
    smsDelivery: 'SMS',
    smsDeliveryDesc: 'Send SMS to mobile phone',
    lineDelivery: 'LINE',
    lineDeliveryDesc: 'Send via LINE official account',
    manualDelivery: 'Manual Distribution',
    manualDeliveryDesc: 'Display password for manual delivery',
    passwordEmailPlaceholder: 'password@example.com',
    phoneNumberPlaceholder: '090-1234-5678',
    manualPasswordLabel: 'Manual Distribution Password:',
    sendingStatus: 'Sending Status',
    urlSent: 'URL sent',
    passwordSent: 'Password sent',
    notSent: 'Not sent',
    completed: 'Completed',
    sendPassword: 'Send Password',
    secureDeliveryComplete: 'Secure separate delivery completed',
    passwordProtectionAvailable: 'Password protection is available with Standard plan or above',
    shareLink: 'Share Link',
    protected: 'Protected',
    separateDelivery: 'Separate Delivery',
    selectAllLinkText: 'Tap to select link and copy',
    passwordSeparateWarning: 'Password will be sent separately',
    recipientEmail: 'Recipient Email',
    send: 'Send',
    passwordSeparateNotice: 'Password will be sent separately',
    directShare: 'Direct Share',
    showLink: 'Show Link',
    mail: 'Email',
    snsShare: 'Social Share',
    platforms: 'platforms',
    linkGenerated: 'Share link generated',
    secureDeliveryTip: '💡 Secure separate delivery sends URL and password via different channels safely',
    close: 'Close',
    
    // ActionBar
    selected: 'selected',
    moveToFolder: 'Move to folder',
    share: 'Share',
    deleteAction: 'Delete',
    addImages: 'Add images',
    
    // DeleteConfirmDialog
    deleteImages: 'Delete Images',
    deleteConfirmMessage: 'Delete selected images?',
    thisActionCannotBeUndone: 'This action cannot be undone.',
    
    // FolderSelectDialog
    selectFolder2: 'Select Folder',
    selectFolderDescription: 'Select a folder to move images to, or create a new folder.',
    createNewFolder2: 'Create New Folder',
    newFolderName2: 'New Folder Name',
    folderNamePlaceholder: 'Enter folder name',
    move: 'Move',
    
    // Common
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    save: 'Save',
    close2: 'Close',
    items: 'items',
    
    // AvatarChangeScreen
    profile: 'Profile',
    displayName: 'Display Name',
    displayNamePlaceholder: 'Enter display name',
    change: 'Change',
    remove: 'Remove',
    selectFromPresets: 'Or select from presets',
    freePlan: 'FREE Plan',
    profileUpdated: 'Profile updated',
    uploadSuccess: 'Image uploaded successfully',
    avatarRemoved: 'Avatar removed',
    fileSizeError: 'File size must be 5MB or less',
    fileTypeError: 'Please select an image file',
    fileReadError: 'Failed to read image',
    fileSizeLimit: '💡 Supports image files (JPG, PNG, GIF) up to 5MB',
    
    // DashboardScreen
    dashboardTitle: 'Dashboard',
    totalImages: 'Total Images',
    favorites: 'Favorites',
    folderCount: 'Folders',
    usedStorage: 'Used Storage',
    premium: 'Standard',
    level: 'Level',
    editProfile: 'Edit Profile',
    storageUsage: 'Storage Usage',
    planLimit: 'Plan Limit: 10 GB',
    usage: 'Usage',
    images: 'Images',
    videos: 'Videos',
    others: 'Others',
    recentActivity: 'Recent Activity',
    activityHistory: 'Activity history for the past 7 days',
    uploadedImages: 'Uploaded new images',
    addedToFavorites: 'Added to favorites',
    sharedImages: 'Shared images',
    downloadedImages: 'Downloaded images',
    hoursAgo: 'hours ago',
    dayAgo: 'day ago',
    daysAgo: 'days ago',
    addedToFavoriteDetail: 'Added to favorites',
    sharedViaInstagram: 'Shared 3 images via Instagram',
    downloadedFromFolder: 'Downloaded 8 images from folder',
    quickActions: 'Quick Actions',
    quickActionsDescription: 'Shortcuts to frequently used functions',
    viewGallery: 'View Gallery',
    settings: 'Settings',
    changePlan: 'Change Plan',
    exportData: 'Export',
    pastDays: 'Past 30 days',
    days7: '7 days',
    days30: '30 days',
    days90: '90 days',
    
    // PlanChangeScreen
    planChangeTitle: 'Change Plan',
    currentPlan: 'Current Plan:',
    monthly: 'Monthly',
    yearly: 'Yearly',
    discount17: '~17% Off',
    recommended: 'Recommended',
    current: 'Current',
    inUse: 'In Use',
    upgrade: 'Upgrade',
    downgrade: 'Downgrade',
    change: 'Change',
    planComparisonTitle: 'Plan Comparison',
    planComparisonDescription: 'Choose the plan that best fits your needs',
    planName: 'Plan Name',
    monthlyPrice: 'Monthly',
    yearlyPrice: 'Yearly',
    imageCount: 'Images',
    storage: 'Storage',
    originalStorage: 'Original Storage',
    accessLimit: 'Access Limit',
    passwordFeature: 'Password Protection',
    action: 'Action',
    showDetailedComparison: 'Show Detailed Comparison',
    additionalOptions: 'Additional Options',
    additionalOptionsDescription: 'Optional features you can add to your plan',
    currentUsageTitle: 'Current Usage',
    currentUsageDescription: 'Used for constraint checks when changing plans',
    storageUsed: 'Storage Used',
    passwordProtectedShares: 'Password Protected Shares',
    exceededLimit: 'Limit exceeded',
    featureNotAvailable: 'This feature is not available in current plan',
    upgradeRecommendation: 'To store more images and access advanced features, consider upgrading to a paid plan. Annual plans save you about 17%.',
    processingPlanChange: 'Processing plan change. Please wait...',
    free: 'Free',
    freeDescription: 'Perfect for personal use',
    freePlanFeatures: 'Up to 20 images, 200MB storage, SNS integration',
    lite: 'Lite',
    liteDescription: 'For those who need more images',
    litePlanFeatures: 'Up to 100 images, 1GB storage, Ad-free',
    standard: 'Standard',
    standardDescription: 'Full-featured for professionals',
    standardPlanFeatures: 'Up to 200 images, 2GB storage, All features',
    planChanged: 'Plan changed to',
    planChangeCancelled: 'Plan change cancelled',
    price: 'Price:',
    per: '/',
    year: 'year',
    month: 'month'
  },
  ja: {
    // App
    loading: '読み込み中...',
    
    // LoginScreen
    appSubtitle: 'ハイレゾ写真簡単共有アプリ',
    appDescription: '簡単自由にアルバム作成',
    login: 'ログイン',
    loginDescription: 'アカウントにサインインしてください',
    signInWithGoogle: 'Googleでサインイン',
    signingIn: 'サインイン中...',
    or: 'または',
    email: 'メールアドレス',
    emailPlaceholder: 'your@email.com',
    password: 'パスワード',
    passwordPlaceholder: 'パスワードを入力',
    signInWithEmail: 'メールでサインイン',
    copyright: '© 2024 HiResGo! All rights reserved.',
    professionalSolution: 'プロフェッショナルハイレゾコンテンツ配信ソリューション',
    
    // GalleryScreen
    appTagline: '高解像度画像管理',
    folderSort: 'フォルダーソート',
    nameSort: '名前順（A-Z）',
    imageCountSort: '画像数順（多い順）',
    customSort: 'カスタム順（ユーザーフォルダーのみ）',
    sortComplete: '並び替え完了',
    allPhotos: 'すべての写真',
    favorites: 'お気に入り',
    
    // UserMenu
    myAccount: 'マイアカウント',
    profile: 'アバター',
    dashboard: 'ダッシュボード',
    planChange: 'プラン変更',
    signOut: 'サインアウト',
    language: '言語',
    english: 'English',
    japanese: '日本語',
    
    // ImageUpload
    uploadImages: '画像をアップロード',
    uploadConfirmation: 'アップロード確認',
    uploading: 'アップロード中...',
    selectFolder: '登録先フォルダー',
    createNewFolder: '新しいフォルダーを作成',
    newFolderName: '新しいフォルダー名',
    newFolderPlaceholder: 'フォルダー名を入力',
    back: '戻る',
    selectFiles: 'ファイルを選択',
    multipleSelection: '複数の画像を同時に選択できます',
    selectedImages: '選択された画像',
    add: '追加',
    upload: 'アップロード',
    uploadTo: 'アップロード先:',
    uploadingTo: 'アップロード中',
    
    // Gallery
    selection: '選択',
    customOrder: 'カスタム順',
    dragToReorder: '画像をドラッグして自由に並び替えができます。',
    
    // ShareDialog
    shareImages: '個の画像を共有',
    shareDescription: 'リンク、メール、SNSで選択した画像を共有できます',
    passwordProtection: 'パスワード保護',
    standardPlan: 'Standard',
    enterPassword: 'パスワードを入力',
    autoGenerate: '自動生成',
    secureSepatateDelivery: 'セキュア分離送信',
    recommended: '推奨',
    separateDeliveryDescription: 'URLとパスワードを別々の手段で送信してセキュリティを向上',
    passwordDeliveryMethod: 'パスワード送信方法',
    emailDelivery: 'メール',
    emailDeliveryDesc: '別のメールアドレスにパスワードを送信',
    smsDelivery: 'SMS',
    smsDeliveryDesc: '携帯電話にSMS（ショートメッセージ）で送信',
    lineDelivery: 'LINE',
    lineDeliveryDesc: 'LINE公式アカウント経由で送信',
    manualDelivery: '手動配布',
    manualDeliveryDesc: 'パスワードを表示して手動で伝達',
    passwordEmailPlaceholder: 'password@example.com',
    phoneNumberPlaceholder: '090-1234-5678',
    manualPasswordLabel: '手動配布用パスワード:',
    sendingStatus: '送信状況',
    urlSent: 'URL送信',
    passwordSent: 'パスワード送信',
    notSent: '未送信',
    completed: '完了',
    sendPassword: 'パスワードを送信',
    secureDeliveryComplete: 'セキュア分離送信が完了しました',
    passwordProtectionAvailable: 'パスワード保護機能はStandardプラン以上でご利用いただけます',
    shareLink: '共有リンク',
    protected: '保護中',
    separateDelivery: '分離送信',
    selectAllLinkText: 'タップしてリンクを選択し、コピーしてください',
    passwordSeparateWarning: 'パスワードは別経路で送信されます',
    recipientEmail: '送信先メールアドレス',
    send: '送信',
    passwordSeparateNotice: 'パスワードは別途送信されます',
    directShare: '直接共有',
    showLink: 'リンクを表示',
    mail: 'メール',
    snsShare: 'SNS共有',
    platforms: 'プラットフォーム',
    linkGenerated: '共有リンク生成済み',
    secureDeliveryTip: '💡 セキュア分離送信でURLとパスワードを別経路で安全に送信',
    close: '閉じる',
    
    // ActionBar
    selected: '個選択中',
    moveToFolder: 'フォルダーに移動',
    share: '共有',
    deleteAction: '削除',
    addImages: '画像を追加',
    
    // DeleteConfirmDialog
    deleteImages: '画像を削除',
    deleteConfirmMessage: '個の画像を削除しますか？',
    thisActionCannotBeUndone: 'この操作は元に戻せません。',
    
    // FolderSelectDialog
    selectFolder2: 'フォルダーを選択',
    selectFolderDescription: '画像を移動するフォルダーを選択するか、新しいフォルダーを作成してください。',
    createNewFolder2: '新しいフォルダーを作成',
    newFolderName2: '新しいフォルダー名',
    folderNamePlaceholder: 'フォルダー名を入力',
    move: '移動',
    
    // Common
    cancel: 'キャンセル',
    confirm: '確認',
    delete: '削除',
    edit: '編集',
    save: '保存',
    close2: '閉��る',
    items: '件',
    
    // AvatarChangeScreen
    profile: 'プロフィール',
    displayName: '表示名',
    displayNamePlaceholder: '表示名を入力',
    change: '変更',
    remove: '削除',
    selectFromPresets: 'またはプリセットから選択',
    freePlan: 'FREEプラン',
    profileUpdated: 'プロフィールを更新しました',
    uploadSuccess: '画像がアップロードされました',
    avatarRemoved: 'アバターを削除しました',
    fileSizeError: 'ファイルサイズは5MB以下にしてください',
    fileTypeError: '画像ファイルを選択してください',
    fileReadError: '画像の読み込みに失敗しました',
    fileSizeLimit: '💡 5MB以下の画像ファイル（JPG、PNG、GIF）に対応しています',
    
    // DashboardScreen
    dashboardTitle: 'ダッシュボード',
    totalImages: '総画像数',
    favorites: 'お気に入り',
    folderCount: 'フォルダー数',
    usedStorage: '使用容量',
    premium: 'Standard',
    level: 'レベル',
    editProfile: 'プロフィール編集',
    storageUsage: 'ストレージ使用量',
    planLimit: 'プランの上限: 10 GB',
    usage: '使用量',
    images: '画像',
    videos: '動画',
    others: 'その他',
    recentActivity: '最近のアクティビティ',
    activityHistory: '過去7日間の活動履歴',
    uploadedImages: '新しい画像をアップロード',
    addedToFavorites: 'お気に入りに追加',
    sharedImages: '画像を共有',
    downloadedImages: '画像をダウンロード',
    hoursAgo: '時間前',
    dayAgo: '日前',
    daysAgo: '日前',
    addedToFavoriteDetail: 'をお気に入りに追加',
    sharedViaInstagram: 'Instagram経由で3枚の画像を共有',
    downloadedFromFolder: 'から8枚をダウンロード',
    quickActions: 'クイックアクション',
    quickActionsDescription: 'よく使う機能へのショートカット',
    viewGallery: 'ギャラリーを見る',
    settings: '設定',
    changePlan: 'プラン変更',
    exportData: 'エクスポート',
    pastDays: '過去30日',
    days7: '7日',
    days30: '30日',
    days90: '90日',
    
    // PlanChangeScreen
    planChangeTitle: 'プラン変更',
    currentPlan: '現在のプラン:',
    monthly: '月額',
    yearly: '年額',
    discount17: '約17%お得',
    recommended: 'おすすめ',
    current: '現在',
    inUse: '使用中',
    upgrade: 'アップグレード',
    downgrade: 'ダウングレード',
    change: '変更',
    planComparisonTitle: '料金プラン比較',
    planComparisonDescription: 'あなたのニーズに合ったプランをお選びください',
    planName: 'プラン名',
    monthlyPrice: '月額',
    yearlyPrice: '年額',
    imageCount: '枚数',
    storage: '容量',
    originalStorage: 'オリジナル保存',
    accessLimit: 'アクセス制限',
    passwordFeature: 'パスワード機能',
    action: 'アクション',
    showDetailedComparison: '詳細比較を表示',
    additionalOptions: '追加オプション',
    additionalOptionsDescription: 'プランに追加できるオプション機能',
    currentUsageTitle: '現在の使用状況',
    currentUsageDescription: 'プラン変更時の制約チェックに使用されます',
    storageUsed: 'ストレージ',
    passwordProtectedShares: 'パスワード保護共有',
    exceededLimit: '制限を超過しています',
    featureNotAvailable: 'この機能は現在のプランでは利用不可',
    upgradeRecommendation: 'より多くの画像を保存し、高度な機能を利用するには有料プランへのアップグレードをご検討ください。年額プランなら約17%お得になります。',
    processingPlanChange: 'プラン変更を処理中です。しばらくお待ちください...',
    free: 'Free',
    freeDescription: '個人利用に最適な無料プラン',
    freePlanFeatures: '20枚まで保存, 200MB容量, SNS連携',
    lite: 'Lite',
    liteDescription: 'より多くの画像を保存したい方に',
    litePlanFeatures: '100枚まで保存, 1GB容量, 広告なし',
    standard: 'Standard',
    standardDescription: 'プロフェッショナル向けの充実機能',
    standardPlanFeatures: '200枚まで保存, 2GB容量, すべての機能',
    planChanged: 'プランに変更しました',
    planChangeCancelled: 'プラン変更をキャンセルしました',
    price: '料金:',
    per: '/',
    year: '年',
    month: '月'
  }
};

export const useTranslation = (language: Language) => {
  return (key: keyof Translation): string => {
    return translations[language][key];
  };
};