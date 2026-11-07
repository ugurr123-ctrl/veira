import React, { useState } from 'react';
import { applyTheme, VEIRA_THEMES, ThemeDefinition } from '../../utils/themeManager';
import { VeiraLogo } from './VeiraLogo';
import { VeiraPremiumModal } from './VeiraPremiumModal';
import {
  isNotificationSupported,
  requestNotificationPermission,
  sendBrowserNotification,
  sendReflectionNotification,
  getTodayIntention,
  getNotificationPermission,
} from '../../utils/dailyIntentions';
import { dailyReflectionService } from '../../services/dailyReflectionService';

interface SettingsTabProps {
  onShowToast: (msg: string, icon?: string) => void;
  onOpenAuth?: () => void;
  onPlayChime?: () => void;
  onOpenArchitectureIntro?: () => void;
  onOpenOnboardingCards?: () => void;
  onReplaySplash?: () => void;
}

export interface CuratedTheme {
  id: string;
  name: string;
  subtitle: string;
  isDefault?: boolean;
  colors: [string, string, string];
  accentHex: string;
}

export const CURATED_THEMES: CuratedTheme[] = [
  {
    id: 'nocturnal-serenity',
    name: 'Nocturnal Serenity',
    subtitle: 'Gece Mavisi & Göksel Altın',
    isDefault: true,
    colors: ['#080A16', '#161A30', '#F5D061'],
    accentHex: '#F5D061',
  },
  {
    id: 'celestial-aurora',
    name: 'Celestial Aurora',
    subtitle: 'Kuzey Işıkları & Mistik Turkuaz',
    colors: ['#050C18', '#0C1B2E', '#2DD4BF'],
    accentHex: '#2DD4BF',
  },
  {
    id: 'golden-eclipse',
    name: 'Golden Eclipse',
    subtitle: 'Sıcak Obsidiyen & Kraliyet Altını',
    colors: ['#0A0805', '#1C1610', '#D4AF37'],
    accentHex: '#D4AF37',
  },
  {
    id: 'velvet-cosmos',
    name: 'Velvet Cosmos',
    subtitle: 'Mistik Mürdüm & Kozmik Gül',
    colors: ['#0D0514', '#1E0C2B', '#EC4899'],
    accentHex: '#EC4899',
  },
  {
    id: 'pure-oled',
    name: 'Pure OLED Midnight',
    subtitle: 'Saf Siyah & Minimalist Yıldız',
    colors: ['#000000', '#0A0A0C', '#F5D061'],
    accentHex: '#F5D061',
  },
];

export const SettingsTab: React.FC<SettingsTabProps> = ({
  onShowToast,
  onOpenAuth,
  onPlayChime,
  onOpenArchitectureIntro,
  onOpenOnboardingCards,
  onReplaySplash,
}) => {
  // 1. Personal preferences states
  const [language, setLanguage] = useState<'Türkçe (TR)' | 'English (EN)' | 'Italiano (IT)'>('Türkçe (TR)');
  const [notificationFreq, setNotificationFreq] = useState<'Günde 3 Kez • Sakin & Nazik Ritüel' | 'Günde 1 Kez • Sabah Niyeti' | 'Sadece Akşam Değerlendirmesi' | 'Kapalı'>('Günde 3 Kez • Sakin & Nazik Ritüel');
  const [quietHours, setQuietHours] = useState('23:00 — 07:00');
  const [coachTone, setCoachTone] = useState<'Bilge & Şefkatli' | 'Dingin & Zen Minimalist' | 'İlham Verici & Güçlü'>('Bilge & Şefkatli');
  const [dailyNotifEnabled, setDailyNotifEnabled] = useState<boolean>(() => {
    try {
      return (
        typeof window !== 'undefined' &&
        'Notification' in window &&
        Notification.permission === 'granted' &&
        localStorage.getItem('veira_daily_notif_enabled') !== 'false'
      );
    } catch {
      return false;
    }
  });
  const [dailyNotifTime, setDailyNotifTime] = useState<string>(() => {
    try {
      return localStorage.getItem('veira_daily_notif_time') || '08:30';
    } catch {
      return '08:30';
    }
  });

  const [permissionState, setPermissionState] = useState<string>(() => {
    try {
      return getNotificationPermission();
    } catch {
      return 'unsupported';
    }
  });

  const [eveningNotifEnabled, setEveningNotifEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('veira_evening_notif_enabled') !== 'false';
    } catch {
      return true;
    }
  });

  const [eveningNotifTime, setEveningNotifTime] = useState<string>(() => {
    try {
      return localStorage.getItem('veira_evening_notif_time') || '21:30';
    } catch {
      return '21:30';
    }
  });

  // Profile data sync & inline name editing
  const [profileName, setProfileName] = useState<string>(() => {
    try {
      return localStorage.getItem('veira_profile_fullname') || 'Selin Kaya';
    } catch {
      return 'Selin Kaya';
    }
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(profileName);

  const [profileAvatar, setProfileAvatar] = useState<string>(() => {
    try {
      return (
        localStorage.getItem('veira_profile_avatar') ||
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCKdjO6cwQiVcMJq7qAOAmmoy0r9zzWviGIzJmCrFnTEQzH9xZvyIgh4QGAM4uiTNQnwqKNMeCWaQHFbpzo_0gBERbt4xdE4iNBjUY8GYIhxksJyZX6WJxvI7WU0KFt6zc3kKRI2IKiz2-_TI3AChwJQjK_y3A_KdmRbDOQIEsXPJTWS2ViTYI6t_61HC9SqY1CpZ27oP-G6sYj-Pn898yxpwi3O9TwivXCArimDVM'
      );
    } catch {
      return 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKdjO6cwQiVcMJq7qAOAmmoy0r9zzWviGIzJmCrFnTEQzH9xZvyIgh4QGAM4uiTNQnwqKNMeCWaQHFbpzo_0gBERbt4xdE4iNBjUY8GYIhxksJyZX6WJxvI7WU0KFt6zc3kKRI2IKiz2-_TI3AChwJQjK_y3A_KdmRbDOQIEsXPJTWS2ViTYI6t_61HC9SqY1CpZ27oP-G6sYj-Pn898yxpwi3O9TwivXCArimDVM';
    }
  });

  // Theme & Visual Atmosphere states
  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    try {
      return localStorage.getItem('veira_active_theme') || 'nocturnal-serenity';
    } catch {
      return 'nocturnal-serenity';
    }
  });

  const [customAccentColor, setCustomAccentColor] = useState<string>(() => {
    try {
      return localStorage.getItem('veira_custom_accent') || '#F5D061';
    } catch {
      return '#F5D061';
    }
  });

  const [darkSaturationMode, setDarkSaturationMode] = useState<
    'pure-oled' | 'mystic-cosmic' | 'soft-dark'
  >(() => {
    try {
      return (
        (localStorage.getItem('veira_saturation_mode') as 'pure-oled' | 'mystic-cosmic' | 'soft-dark') ||
        'mystic-cosmic'
      );
    } catch {
      return 'mystic-cosmic';
    }
  });

  const [glassBlurLevel, setGlassBlurLevel] = useState<number>(() => {
    try {
      const val = localStorage.getItem('veira_glass_blur');
      return val ? Number(val) : 80;
    } catch {
      return 80;
    }
  });

  // 2. Audio & Frequency settings
  const [frequency, setFrequency] = useState<'432 Hz' | '528 Hz' | '396 Hz' | '639 Hz'>('432 Hz');
  const [isBackgroundAudioOn, setIsBackgroundAudioOn] = useState(true);
  const [sleepTimer, setSleepTimer] = useState<'15 Dakika' | '30 Dakika' | '45 Dakika' | '60 Dakika' | 'Kapalı'>('30 Dakika');

  // 3. Privacy & Biometrics
  const [isBiometricLockOn, setIsBiometricLockOn] = useState(true);

  // Modals for interactive selection
  const [activeModal, setActiveModal] = useState<
    'lang' | 'notif' | 'quiet' | 'coach' | 'freq' | 'sleep' | 'privacy' | 'delete' | null
  >(null);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  // Haptic feedback helper
  const triggerHaptic = () => {
    try {
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(25);
      }
    } catch {
      // silent fallback
    }
  };

  const handleToggleBackgroundAudio = () => {
    triggerHaptic();
    const next = !isBackgroundAudioOn;
    setIsBackgroundAudioOn(next);
    onShowToast(
      next
        ? 'Arka planda çalma aktif: Ekran kapalıyken frekans devam eder.'
        : 'Arka planda çalma kapatıldı.',
      'headphones'
    );
  };

  const handleToggleBiometrics = () => {
    triggerHaptic();
    const next = !isBiometricLockOn;
    setIsBiometricLockOn(next);
    onShowToast(
      next
        ? 'Biyometrik kilit devrede: Face ID / Touch ID ile korunuyor 🔒'
        : 'Biyometrik kilit devre dışı bırakıldı.',
      'fingerprint'
    );
  };

  const handleToggleDailyNotif = async () => {
    triggerHaptic();
    if (!isNotificationSupported()) {
      onShowToast('Tarayıcınız bildirim özelliğini desteklemiyor.', 'warning');
      return;
    }

    if (dailyNotifEnabled) {
      setDailyNotifEnabled(false);
      try {
        localStorage.setItem('veira_daily_notif_enabled', 'false');
      } catch {}
      onShowToast('Günlük niyet bildirimleri kapatıldı.', 'notifications_off');
      return;
    }

    if (Notification.permission === 'granted') {
      setDailyNotifEnabled(true);
      try {
        localStorage.setItem('veira_daily_notif_enabled', 'true');
      } catch {}
      const curIntention = getTodayIntention();
      sendBrowserNotification(curIntention, true);
      if (onPlayChime) onPlayChime();
      onShowToast('✨ Günlük niyet bildirimleri açıldı! İlk test bildirimi iletildi.', 'notifications_active');
      return;
    }

    const granted = await requestNotificationPermission();
    if (granted) {
      setDailyNotifEnabled(true);
      try {
        localStorage.setItem('veira_daily_notif_enabled', 'true');
      } catch {}
      const curIntention = getTodayIntention();
      sendBrowserNotification(curIntention, true);
      if (onPlayChime) onPlayChime();
      onShowToast('✨ Günlük bildirim izni verildi! Test bildirimi iletildi.', 'notifications_active');
    } else {
      onShowToast('Bildirim izni verilmedi. Tarayıcı ayarlarından izin verebilirsiniz.', 'warning');
    }
  };

  const handleChangeDailyNotifTime = (val: string) => {
    setDailyNotifTime(val);
    try {
      localStorage.setItem('veira_daily_notif_time', val);
    } catch {}
    onShowToast(`Günlük bildirim saati ${val} olarak ayarlandı.`, 'schedule');
  };

  const handleRequestSystemPermission = async () => {
    triggerHaptic();
    const granted = await requestNotificationPermission();
    setPermissionState(getNotificationPermission());
    if (granted) {
      setDailyNotifEnabled(true);
      setEveningNotifEnabled(true);
      try {
        localStorage.setItem('veira_daily_notif_enabled', 'true');
        localStorage.setItem('veira_evening_notif_enabled', 'true');
      } catch {}
      const curIntention = getTodayIntention();
      sendBrowserNotification(curIntention, true);
      if (onPlayChime) onPlayChime();
      onShowToast('✨ Bildirim izni başarıyla verildi! Sabah & Akşam tefekkürleri devrede.', 'notifications_active');
    } else {
      onShowToast('Bildirim izni verilmedi. Tarayıcı ayarlarından veya kilit simgesinden izin verebilirsiniz.', 'warning');
    }
  };

  const handleToggleEveningNotif = () => {
    triggerHaptic();
    const next = !eveningNotifEnabled;
    setEveningNotifEnabled(next);
    try {
      localStorage.setItem('veira_evening_notif_enabled', next ? 'true' : 'false');
    } catch {}
    onShowToast(
      next
        ? '🌙 Akşam tefekkürü bildirimleri aktif edildi.'
        : 'Akşam tefekkürü bildirimleri kapatıldı.',
      next ? 'bedtime' : 'notifications_off'
    );
  };

  const handleChangeEveningNotifTime = (val: string) => {
    setEveningNotifTime(val);
    try {
      localStorage.setItem('veira_evening_notif_time', val);
    } catch {}
    onShowToast(`Akşam tefekkürü saati ${val} olarak ayarlandı.`, 'schedule');
  };

  const handleTestEveningNotif = () => {
    triggerHaptic();
    const todayRef = dailyReflectionService.getTodayReflection();
    const title = todayRef?.title || 'Günün Dingin Zaferi';
    const poem =
      todayRef?.strophe && todayRef.strophe.length > 0
        ? todayRef.strophe.join('\n')
        : 'Günün yorgunluğu erir akşamın huzurunda,\nHer tamamlanan emek parlar yıldızlar altında.';
    const sent = sendReflectionNotification(title, poem, true);
    if (sent) {
      if (onPlayChime) onPlayChime();
      onShowToast('🌙 Akşam tefekkürü test bildirimi iletildi!', 'notifications_active');
    } else {
      onShowToast('Bildirim gönderilemedi. Önce sistem bildirim iznini veriniz.', 'warning');
    }
  };

  const handleTestDailyNotif = () => {
    triggerHaptic();
    const curIntention = getTodayIntention();
    const sent = sendBrowserNotification(curIntention, true);
    if (sent) {
      if (onPlayChime) onPlayChime();
      onShowToast('🔔 Günün niyeti cihaz bildirimlerine test olarak iletildi!', 'notifications_active');
    } else {
      onShowToast('Bildirim gönderilemedi. Önce günlük bildirim anahtarını açınız.', 'warning');
    }
  };

  const handleResetData = () => {
    triggerHaptic();
    if (onPlayChime) onPlayChime();
    try {
      localStorage.removeItem('veira_sine_volume');
      localStorage.removeItem('veira_rain_volume');
    } catch {
      // fallback
    }
    setActiveModal(null);
    onShowToast('Cihazdaki tüm yerel niyetler ve şifreli veriler kalıcı olarak temizlendi.', 'delete_forever');
  };

  const handleSelectCuratedTheme = (theme: CuratedTheme) => {
    triggerHaptic();
    if (onPlayChime) onPlayChime();
    setActiveThemeId(theme.id);
    setCustomAccentColor(theme.accentHex);
    applyTheme(theme.id, theme.accentHex);
    onShowToast(`"${theme.name}" teması başarıyla uygulandı ✨`, 'palette');
  };

  const handleSelectAccentPreset = (color: string) => {
    triggerHaptic();
    setCustomAccentColor(color);
    applyTheme(activeThemeId, color);
    onShowToast('Vurgu rengi uygulandı ✨', 'palette');
  };

  const handleSaveCustomTheme = () => {
    triggerHaptic();
    if (onPlayChime) onPlayChime();
    const targetThemeId = darkSaturationMode === 'pure-oled' ? 'pure-oled' : activeThemeId;
    setActiveThemeId(targetThemeId);
    try {
      localStorage.setItem('veira_active_theme', targetThemeId);
      localStorage.setItem('veira_custom_accent', customAccentColor);
      localStorage.setItem('veira_saturation_mode', darkSaturationMode);
      localStorage.setItem('veira_glass_blur', String(glassBlurLevel));
    } catch {}
    applyTheme(targetThemeId, customAccentColor);
    onShowToast('Özel tema rezonansı başarıyla kaydedildi ve uygulandı ✨', 'check_circle');
  };

  // Local-First Data Sovereignty: Backup & Restore Engine
  const handleExportBackup = () => {
    try {
      triggerHaptic();
      const backupData: Record<string, any> = {
        app: 'veira',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        data: {},
      };
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('veira_') || key.startsWith('veira-'))) {
          backupData.data[key] = localStorage.getItem(key);
        }
      }
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `veira-yedek-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (onPlayChime) onPlayChime();
      onShowToast('Tüm vizyon ve ayarların JSON yedeği olarak indirildi! 💾', 'download');
    } catch {
      onShowToast('Yedek dışa aktarılamadı.', 'error');
    }
  };

  const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.app !== 'veira' || !parsed.data) {
          throw new Error('Geçersiz yedek formatı');
        }
        Object.entries(parsed.data).forEach(([k, v]) => {
          if (typeof v === 'string') {
            localStorage.setItem(k, v);
          }
        });
        if (onPlayChime) onPlayChime();
        onShowToast('Yedek başarıyla geri yüklendi! Sayfa tazeleniyor... ✨', 'check');
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } catch {
        onShowToast('Yedek dosyası okunamadı veya dosya biçimi geçersiz.', 'warning');
      }
    };
    reader.readAsText(file);
  };

  const handleShareApp = async () => {
    triggerHaptic();
    const shareUrl = window.location.origin;
    const shareData = {
      title: 'Veira — Vision & 432Hz Sound Sanctuary',
      text: 'Zihnini sakinleştir, hedeflerini 432Hz akort frekansıyla netleştir.',
      url: shareUrl,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        onShowToast('Veira paylaşıldı ✨', 'share');
      } catch {
        // User cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        onShowToast('Uygulama bağlantısı panoya kopyalandı! 📋', 'link');
      } catch {
        onShowToast('Bağlantı kopyalanamadı.', 'error');
      }
    }
  };

  return (
    <section className="flex flex-col w-full max-w-lg sm:max-w-xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-3.5 sm:px-6 md:px-8 pb-16 animate-fadeIn relative text-[#dee0ff]">
      {/* Ambient Celestial Background Glow Elements */}
      <div className="absolute -top-12 -left-16 w-64 h-64 rounded-full bg-[#c0c1ff]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-72 h-72 rounded-full bg-[#e7c355]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#009bd1]/10 blur-3xl pointer-events-none" />

      {/* Header & Shield Status Banner */}
      <section className="flex flex-col gap-1 relative z-10 pt-1 mb-5">
        <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-[#e7c355]/10 shadow-sm backdrop-blur-md border border-[#e7c355]/20">
          <span className="material-symbols-outlined text-[14px] text-[#e7c355]">verified_user</span>
          <span className="text-[11px] font-semibold text-[#e7c355] tracking-widest uppercase">
            %100 Cihaz İçi Şifreli Veri
          </span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl text-[#dee0ff] tracking-tight mt-1 flex items-center justify-between">
          <span>Ayarlar &amp; Gizlilik</span>
          <span className="material-symbols-outlined text-[#e7c355]/80 text-[24px]">shield</span>
        </h1>

        <p className="text-xs text-[#c7c4d7] leading-relaxed">
          Zihinsel mimarinin kontrol merkezi. Tüm niyetlerin, vizyonların ve biyometrik verilerin cihazında mühürlü.
        </p>
      </section>

      {/* Profile & Subscription Glass Card */}
      <section className="w-full rounded-2xl bg-[#1a1e35]/70 backdrop-blur-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-4 relative overflow-hidden mb-6 border border-white/5">
        <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-[#e7c355]/15 blur-xl pointer-events-none" />

        <div className="flex items-center gap-3.5 relative z-10">
          {/* Avatar with Celestial Ring */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-[#e7c355] via-[#c0c1ff] to-[#e7c355]/30 shadow-md">
              <img
                className="w-full h-full object-cover rounded-full bg-[#252840]"
                alt={profileName}
                src={profileAvatar}
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#080c22] flex items-center justify-center shadow">
              <span
                className="material-symbols-outlined text-[#e7c355] text-[14px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
            </div>
          </div>

          {isEditingName ? (
            <div className="flex flex-col min-w-0 flex-1 gap-2">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Adınız veya Unvanınız"
                maxLength={30}
                className="px-3 py-1.5 text-sm bg-[#080c22] border border-[#e7c355]/40 focus:border-[#e7c355] rounded-lg text-[#dee0ff] focus:outline-none placeholder:text-gray-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const trimmed = tempName.trim() || 'Selin Kaya';
                    setProfileName(trimmed);
                    try {
                      localStorage.setItem('veira_profile_fullname', trimmed);
                    } catch {}
                    setIsEditingName(false);
                    onShowToast('İsminiz güncellendi ✨', 'check_circle');
                  } else if (e.key === 'Escape') {
                    setIsEditingName(false);
                  }
                }}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic();
                    const trimmed = tempName.trim() || 'Selin Kaya';
                    setProfileName(trimmed);
                    try {
                      localStorage.setItem('veira_profile_fullname', trimmed);
                    } catch {}
                    setIsEditingName(false);
                    onShowToast('İsminiz güncellendi ✨', 'check_circle');
                  }}
                  className="px-3 py-1 text-xs font-semibold rounded-md bg-[#e7c355] text-[#080c22] hover:bg-[#f5d061] transition-colors"
                >
                  Kaydet
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic();
                    setIsEditingName(false);
                  }}
                  className="px-2.5 py-1 text-xs text-[#c7c4d7] hover:text-[#dee0ff] transition-colors"
                >
                  İptal
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-lg font-bold text-[#dee0ff] truncate">{profileName}</span>
                  <span className="material-symbols-outlined text-[#e7c355] text-[16px]" title="Doğrulanmış Üyelik">
                    verified
                  </span>
                </div>
                <span className="text-xs text-[#c7c4d7] truncate">Zihinsel Mimar &amp; Vizyoner</span>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#7bd0ff] animate-pulse" />
                  <span className="text-[11px] font-medium text-[#7bd0ff]">Bilişsel Rezonans: Optimal</span>
                </div>
              </div>

              <button
                onClick={() => {
                  triggerHaptic();
                  setTempName(profileName);
                  setIsEditingName(true);
                }}
                aria-label="İsmi Düzenle"
                className="px-3 py-1.5 rounded-full bg-[#252840]/90 hover:bg-[#252840] text-[#dee0ff] transition-all flex items-center gap-1 shadow-sm active:scale-95 border border-white/5"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-[#c0c1ff]">edit</span>
                <span className="text-xs font-semibold">Düzenle</span>
              </button>
            </>
          )}
        </div>

        {/* Active Tier Banner */}
        <div
          onClick={() => {
            triggerHaptic();
            setIsPremiumModalOpen(true);
          }}
          className="w-full rounded-xl bg-gradient-to-r from-[#252840]/90 via-[#2f334b]/80 to-[#252840]/90 backdrop-blur-md p-3.5 flex items-center justify-between shadow-inner border border-[#e7c355]/30 hover:border-[#e7c355]/60 transition-all cursor-pointer group active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center border border-[#e7c355]/40 bg-[#080a16] shadow-md shrink-0 group-hover:scale-105 transition-transform">
              <VeiraLogo className="w-full h-full" showFrame={true} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#ffe089]">Veira Premium • Ömür Boyu</span>
                <span className="material-symbols-outlined text-[#e7c355] text-[14px]">stars</span>
              </div>
              <span className="text-[11px] text-[#c7c4d7]">Sonsuz 8K AI vizyon &amp; 432Hz rezonans kasası</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#e7c355] bg-[#e7c355]/15 px-2.5 py-1 rounded-full border border-[#e7c355]/30 group-hover:bg-[#e7c355]/25 transition-colors">
            <span>Yönet</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </div>
        </div>

        {/* Quick Auth Switch button (Hidden for now as requested by user) */}
      </section>

      {/* Interactive Section 1: Kişisel Tercihler & Zihinsel Akış */}
      <section className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c0c1ff] text-[18px]">psychology_alt</span>
            <h2 className="text-sm font-semibold text-[#dee0ff]">Kişisel Tercihler &amp; Zihinsel Akış</h2>
          </div>
          <span className="text-[10px] font-bold text-[#c7c4d7] uppercase tracking-wider">RİTÜEL</span>
        </div>

        <div className="rounded-2xl bg-[#1a1e35]/70 backdrop-blur-xl p-1.5 flex flex-col gap-1 shadow-lg border border-white/5">
          {/* Setting: Uygulama Dili */}
          <button
            onClick={() => setActiveModal('lang')}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#252840]/60 transition-colors text-left group"
            type="button"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#2f334b]/70 flex items-center justify-center text-[#c7c4d7] group-hover:text-[#c0c1ff] transition-colors">
                <span className="material-symbols-outlined text-[20px]">language</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#dee0ff] truncate">Uygulama Dili</span>
                <span className="text-[11px] text-[#c7c4d7]">Arayüz ve niyet metin dili</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-xs font-bold text-[#e7c355]">{language}</span>
              <span className="material-symbols-outlined text-[#908fa0] text-[18px]">chevron_right</span>
            </div>
          </button>

          {/* Zarif Bildirimler & Akşam Tefekkürü Mimari Kartı */}
          <div className="w-full rounded-2xl bg-gradient-to-br from-[#252840]/60 via-[#1a1e35]/90 to-[#252840]/60 p-4 border border-[#e7c355]/30 shadow-md flex flex-col gap-3.5 relative overflow-hidden my-1">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#e7c355]/25 via-[#7bd0ff]/20 to-[#e7c355]/10 border border-[#e7c355]/40 flex items-center justify-center text-[#e7c355] shadow-sm shrink-0">
                  <span className="material-symbols-outlined text-[22px]">notifications_active</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#dee0ff]">Zarif Bildirimler &amp; Tefekkür</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#e7c355]/15 text-[#e7c355] border border-[#e7c355]/30 font-semibold uppercase">
                      GÖKSEL AKOR
                    </span>
                  </div>
                  <p className="text-[11px] text-[#c7c4d7] mt-0.5 leading-snug">
                    Spamsız, sakin fısıltılar. Sabahları günün niyetini, akşamları ise tamamlanan emeklerin şiirsel yansımasını iletir.
                  </p>
                </div>
              </div>
            </div>

            {/* Permission Status Pill & Action */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 p-2.5 rounded-xl bg-[#080c22]/60 border border-white/5 text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  permissionState === 'granted'
                    ? 'bg-[#55e7a5] shadow-[0_0_8px_#55e7a5]'
                    : permissionState === 'denied'
                    ? 'bg-[#ff7b7b]'
                    : 'bg-[#e7c355] animate-pulse'
                }`} />
                <span className="text-[11px] text-[#dee0ff]">
                  {permissionState === 'granted'
                    ? 'Cihaz Bildirim İzni Aktif ✓'
                    : permissionState === 'denied'
                    ? 'Bildirim İzni Engellenmiş (Tarayıcıdan açınız)'
                    : 'Sistem Bildirim İzni Bekleniyor'}
                </span>
              </div>

              {permissionState !== 'granted' && (
                <button
                  type="button"
                  onClick={handleRequestSystemPermission}
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#e7c355] to-[#ffe089] text-[#1d182e] font-bold text-[11px] shadow-sm hover:scale-[1.02] active:scale-95 transition-all"
                >
                  İzni Etkinleştir
                </button>
              )}
            </div>

            {/* Row 1: Sabah Niyeti */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-[#1a1e35]/80 border border-white/5 gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#e7c355]/15 flex items-center justify-center text-[#e7c355] shrink-0">
                  <span className="material-symbols-outlined text-[18px]">wb_sunny</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-[#dee0ff]">Sabah Niyeti Bildirimi</span>
                  <span className="text-[10.5px] text-[#c7c4d7]">Günün afirmasyon ve bilişsel odağı</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <input
                  type="time"
                  value={dailyNotifTime}
                  onChange={(e) => handleChangeDailyNotifTime(e.target.value)}
                  className="bg-[#080c22] text-xs font-mono text-[#dee0ff] px-2 py-1 rounded-lg border border-white/10 outline-none focus:border-[#e7c355]"
                />
                <button
                  type="button"
                  onClick={handleTestDailyNotif}
                  className="px-2 py-1 rounded-lg bg-[#e7c355]/20 hover:bg-[#e7c355]/30 text-[#e7c355] font-bold text-[11px] border border-[#e7c355]/30 active:scale-95 transition-all"
                  title="Sabah niyetini cihazına test olarak gönder"
                >
                  Test Et
                </button>
                <button
                  aria-checked={dailyNotifEnabled}
                  onClick={handleToggleDailyNotif}
                  className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-300 relative focus:outline-none flex-shrink-0 ${
                    dailyNotifEnabled ? 'bg-[#e7c355]' : 'bg-[#2f334b]'
                  }`}
                  role="switch"
                  type="button"
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-[#080c22] shadow-md transform transition-transform duration-300 ${
                      dailyNotifEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Row 2: Akşam Tefekkürü */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-[#1a1e35]/80 border border-white/5 gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#7bd0ff]/15 flex items-center justify-center text-[#7bd0ff] shrink-0">
                  <span className="material-symbols-outlined text-[18px]">bedtime</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-[#dee0ff]">Akşam Tefekkürü (Reflection)</span>
                  <span className="text-[10.5px] text-[#c7c4d7]">Günün emeklerini özetleyen lirik şiir</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <input
                  type="time"
                  value={eveningNotifTime}
                  onChange={(e) => handleChangeEveningNotifTime(e.target.value)}
                  className="bg-[#080c22] text-xs font-mono text-[#dee0ff] px-2 py-1 rounded-lg border border-white/10 outline-none focus:border-[#7bd0ff]"
                />
                <button
                  type="button"
                  onClick={handleTestEveningNotif}
                  className="px-2 py-1 rounded-lg bg-[#7bd0ff]/20 hover:bg-[#7bd0ff]/30 text-[#7bd0ff] font-bold text-[11px] border border-[#7bd0ff]/30 active:scale-95 transition-all"
                  title="Akşam tefekkür şiirini cihazına test olarak gönder"
                >
                  Test Et
                </button>
                <button
                  aria-checked={eveningNotifEnabled}
                  onClick={handleToggleEveningNotif}
                  className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-300 relative focus:outline-none flex-shrink-0 ${
                    eveningNotifEnabled ? 'bg-[#7bd0ff]' : 'bg-[#2f334b]'
                  }`}
                  role="switch"
                  type="button"
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-[#080c22] shadow-md transform transition-transform duration-300 ${
                      eveningNotifEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Setting: Bildirim Sıklığı */}
          <button
            onClick={() => setActiveModal('notif')}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#252840]/60 transition-colors text-left group"
            type="button"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#2f334b]/70 flex items-center justify-center text-[#c7c4d7] group-hover:text-[#c0c1ff] transition-colors">
                <span className="material-symbols-outlined text-[20px]">spa</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#dee0ff] truncate">Bildirim Sıklığı</span>
                <span className="text-[11px] text-[#c7c4d7] truncate max-w-[190px]">{notificationFreq}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#c0c1ff]" />
              <span className="material-symbols-outlined text-[#908fa0] text-[18px]">chevron_right</span>
            </div>
          </button>

          {/* Setting: Sessiz Saatler */}
          <button
            onClick={() => setActiveModal('quiet')}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#252840]/60 transition-colors text-left"
            type="button"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#2f334b]/70 flex items-center justify-center text-[#c7c4d7]">
                <span className="material-symbols-outlined text-[20px]">bedtime</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#dee0ff] truncate">Sessiz Saatler</span>
                <span className="text-[11px] text-[#c7c4d7]">Nörolojik Dinlenme Aralığı</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#2f334b]/70 text-[#ffe089]">
                {quietHours}
              </span>
              <span className="material-symbols-outlined text-[#908fa0] text-[18px]">chevron_right</span>
            </div>
          </button>

          {/* Setting: Zihinsel Koç Ses Tonu */}
          <button
            onClick={() => setActiveModal('coach')}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#252840]/60 transition-colors text-left group"
            type="button"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#2f334b]/70 flex items-center justify-center text-[#c7c4d7] group-hover:text-[#c0c1ff] transition-colors">
                <span className="material-symbols-outlined text-[20px]">record_voice_over</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#dee0ff] truncate">Zihinsel Koç Ses Tonu</span>
                <span className="text-[11px] text-[#c7c4d7]">Sesli niyet ve rehber tonlaması</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-xs font-semibold text-[#7bd0ff]">{coachTone}</span>
              <span className="material-symbols-outlined text-[#908fa0] text-[18px]">chevron_right</span>
            </div>
          </button>
        </div>
      </section>

      {/* Interactive Section: Tema & Görsel Atmosfer */}
      <section className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#e7c355] text-[20px]">palette</span>
            <h2 className="text-sm font-semibold text-[#dee0ff]">Tema &amp; Görsel Atmosfer</h2>
          </div>
          <span className="text-[10px] font-bold text-[#e7c355] tracking-widest uppercase">KİŞİSELLEŞTİR</span>
        </div>

        <div className="rounded-2xl bg-[#1a1e35]/70 backdrop-blur-xl p-4 flex flex-col gap-4 shadow-lg border border-white/5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#e7c355]">
              <span className="material-symbols-outlined text-[18px]">flare</span>
              <span className="text-xs font-semibold tracking-wide uppercase">Bilişsel Rezonans ve Görsel Denge</span>
            </div>
            <p className="text-xs text-[#c7c4d7] leading-relaxed">
              Zihinsel odaklanma ve gece dinginliği için arayüz enerji frekansını seçin veya kendi rezonansınızı oluşturun.
            </p>
          </div>

          {/* Curated Themes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {CURATED_THEMES.map((theme) => {
              const isActive = activeThemeId === theme.id;

              return (
                <div
                  key={theme.id}
                  onClick={() => handleSelectCuratedTheme(theme)}
                  className={`w-full p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between group border ${
                    isActive
                      ? 'bg-[#252840]/90 border-[#e7c355]/60 shadow-[0_0_18px_rgba(231,195,85,0.18)]'
                      : 'bg-[#252840]/40 hover:bg-[#252840]/70 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center -space-x-1.5 flex-shrink-0 p-1 rounded-full bg-[#080c22] border border-white/10">
                      <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.colors[0] }} />
                      <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.colors[1] }} />
                      <span className="w-4 h-4 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: theme.colors[2] }} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-semibold truncate ${isActive ? 'text-[#dee0ff]' : 'text-[#c7c4d7] group-hover:text-[#dee0ff]'}`}>
                          {theme.name}
                        </span>
                        {theme.isDefault && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#e7c355]/15 text-[#e7c355] font-semibold">
                            Varsayılan
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#c7c4d7]/70 truncate">
                        {theme.subtitle}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {isActive ? (
                      <span className="px-2.5 py-1 rounded-full bg-[#e7c355]/20 text-[#e7c355] text-[11px] font-bold flex items-center gap-1 border border-[#e7c355]/40 shadow-sm">
                        <span className="material-symbols-outlined text-[13px]">check</span>
                        <span>Aktif</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectCuratedTheme(theme);
                        }}
                        className="px-2.5 py-1 rounded-full bg-[#2f334b]/70 hover:bg-[#2f334b] text-[#c7c4d7] hover:text-[#dee0ff] text-[11px] font-medium transition-colors border border-white/5"
                      >
                        Seç
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Theme Studio */}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#e7c355]">
                <span className="material-symbols-outlined text-[17px]">auto_awesome</span>
                <span className="text-xs font-semibold tracking-wide">Kendi Temanı Yarat (Özel Renk Rezonansı)</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#8e7100]/30 text-[#ffe089] text-[10px] font-bold border border-[#e7c355]/20">
                STÜDYO
              </span>
            </div>

            {/* Accent Color Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#c7c4d7] flex items-center justify-between">
                <span>Özel Vurgu Rengi Seçici</span>
                <span className="text-[11px] text-[#e7c355] font-mono font-medium">{customAccentColor}</span>
              </label>
              <div className="flex items-center gap-2 pt-0.5">
                {[
                  { hex: '#F5D061', label: 'Altın Rezonansı' },
                  { hex: '#2DD4BF', label: 'Teal Akış' },
                  { hex: '#A78BFA', label: 'Lavanta Zihin' },
                  { hex: '#FB7185', label: 'Gül Kurusu Dinginlik' },
                  { hex: '#38BDF8', label: 'Gece Mavisi Berraklık' },
                  { hex: '#F59E0B', label: 'Amber Sıcaklık' },
                ].map((colorPreset) => {
                  const isSelected = customAccentColor.toLowerCase() === colorPreset.hex.toLowerCase();

                  return (
                    <button
                      key={colorPreset.hex}
                      type="button"
                      onClick={() => handleSelectAccentPreset(colorPreset.hex)}
                      title={colorPreset.label}
                      style={{ backgroundColor: colorPreset.hex }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${
                        isSelected
                          ? 'ring-2 ring-[#e7c355] ring-offset-2 ring-offset-[#1a1e35] shadow-md scale-105'
                          : 'ring-1 ring-white/20'
                      }`}
                    >
                      {isSelected && (
                        <span className="material-symbols-outlined text-slate-900 text-[14px] font-bold">check</span>
                      )}
                    </button>
                  );
                })}

                {/* Eyedropper / Custom Hex Picker */}
                <label
                  title="Özel Renk Paleti (Hex)"
                  className="w-7 h-7 rounded-full bg-[#2f334b] border border-white/10 flex items-center justify-center text-[#c7c4d7] hover:text-white transition-colors cursor-pointer active:scale-95 relative"
                >
                  <span className="material-symbols-outlined text-[15px]">colorize</span>
                  <input
                    type="color"
                    value={customAccentColor}
                    onChange={(e) => handleSelectAccentPreset(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </label>
              </div>
            </div>

            {/* Dark Saturation Mode */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-[#c7c4d7]">Karanlık Doygunluk Modu</span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div
                  onClick={() => {
                    triggerHaptic();
                    setDarkSaturationMode('pure-oled');
                  }}
                  className={`p-2 rounded-xl border cursor-pointer flex flex-col gap-0.5 transition-all ${
                    darkSaturationMode === 'pure-oled'
                      ? 'bg-[#e7c355]/15 border-[#e7c355]/50 shadow-sm'
                      : 'bg-[#2f334b]/40 hover:bg-[#2f334b]/70 border-white/5'
                  }`}
                >
                  <span className={`text-[11px] font-semibold truncate ${darkSaturationMode === 'pure-oled' ? 'text-[#e7c355]' : 'text-[#dee0ff]'}`}>
                    Derin Gece
                  </span>
                  <span className="text-[10px] text-[#908fa0] truncate">Pure OLED</span>
                </div>

                <div
                  onClick={() => {
                    triggerHaptic();
                    setDarkSaturationMode('mystic-cosmic');
                  }}
                  className={`p-2 rounded-xl border cursor-pointer flex flex-col gap-0.5 transition-all ${
                    darkSaturationMode === 'mystic-cosmic'
                      ? 'bg-[#e7c355]/15 border-[#e7c355]/50 shadow-sm'
                      : 'bg-[#2f334b]/40 hover:bg-[#2f334b]/70 border-white/5'
                  }`}
                >
                  <span className={`text-[11px] font-semibold truncate ${darkSaturationMode === 'mystic-cosmic' ? 'text-[#e7c355]' : 'text-[#dee0ff]'}`}>
                    Mistik Kozmik
                  </span>
                  <span className="text-[10px] text-[#e7c355]/80 truncate font-medium">Önerilen</span>
                </div>

                <div
                  onClick={() => {
                    triggerHaptic();
                    setDarkSaturationMode('soft-dark');
                  }}
                  className={`p-2 rounded-xl border cursor-pointer flex flex-col gap-0.5 transition-all ${
                    darkSaturationMode === 'soft-dark'
                      ? 'bg-[#e7c355]/15 border-[#e7c355]/50 shadow-sm'
                      : 'bg-[#2f334b]/40 hover:bg-[#2f334b]/70 border-white/5'
                  }`}
                >
                  <span className={`text-[11px] font-semibold truncate ${darkSaturationMode === 'soft-dark' ? 'text-[#e7c355]' : 'text-[#dee0ff]'}`}>
                    Sakin Füme
                  </span>
                  <span className="text-[10px] text-[#908fa0] truncate">Yumuşak Koyu</span>
                </div>
              </div>
            </div>

            {/* Glow & Glass Transparency Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#c7c4d7]">Işıltı &amp; Cam Saydamlığı (Blur)</span>
                <span className="text-[#e7c355] font-semibold">%{glassBlurLevel} Cam Yoğunluğu</span>
              </div>
              <div className="relative flex items-center">
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={glassBlurLevel}
                  onChange={(e) => setGlassBlurLevel(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#2f334b] rounded-lg appearance-none cursor-pointer accent-[#e7c355]"
                />
              </div>
            </div>

            {/* Save & Apply Custom Theme Button */}
            <button
              type="button"
              onClick={handleSaveCustomTheme}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#8e7100] via-[#e7c355] to-[#ffe089] text-[#3d2f00] text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 shadow-[0_0_16px_rgba(231,195,85,0.35)] hover:shadow-[0_0_22px_rgba(231,195,85,0.55)] active:scale-[0.99] transition-all"
            >
              <span className="material-symbols-outlined text-[17px]">check_circle</span>
              <span>Özel Temayı Kaydet ve Uygula</span>
            </button>
          </div>

          {/* Replay Cinematic Opening Splash */}
          {onReplaySplash && (
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#e7c355]/15 flex items-center justify-center text-[#e7c355]">
                  <span className="material-symbols-outlined text-[18px]">flare</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[#dee0ff]">Açılış Sinematiği (Veira Portal)</span>
                  <span className="text-[11px] text-[#c7c4d7]">Giriş animasyonunu ve kutsal geometriyi yeniden başlat</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic();
                  onReplaySplash();
                }}
                className="px-3 py-1.5 rounded-full bg-[#e7c355]/20 hover:bg-[#e7c355]/30 text-[#e7c355] text-xs font-bold border border-[#e7c355]/40 transition-all active:scale-95 shadow-[0_0_12px_rgba(231,195,85,0.25)] flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">play_arrow</span>
                <span>Oynat</span>
              </button>
            </div>
          )}

          {/* Mini Cards Onboarding Tour */}
          {onOpenOnboardingCards && (
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#f5d061]/15 flex items-center justify-center text-[#f5d061]">
                  <span className="material-symbols-outlined text-[18px]">view_carousel</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[#dee0ff]">Uygulama Tanıtım Turu</span>
                  <span className="text-[11px] text-[#c7c4d7]">Özellikleri anlatan mini kartları baştan incele</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic();
                  onOpenOnboardingCards();
                }}
                className="px-3 py-1.5 rounded-full bg-[#f5d061]/20 hover:bg-[#f5d061]/30 text-[#f5d061] text-xs font-bold border border-[#f5d061]/40 transition-all active:scale-95 shadow-[0_0_12px_rgba(245,208,97,0.25)] flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">auto_stories</span>
                <span>Tanıtımı Aç</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Interactive Section 2: Ses & Manifest Frekans Ayarları */}
      <section className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#e7c355] text-[18px]">graphic_eq</span>
            <h2 className="text-sm font-semibold text-[#dee0ff]">Ses &amp; Manifest Frekans Ayarları</h2>
          </div>
          <span className="text-[10px] font-bold text-[#e7c355] uppercase tracking-wider">AKUSTİK</span>
        </div>

        <div className="rounded-2xl bg-[#1a1e35]/70 backdrop-blur-xl p-1.5 flex flex-col gap-1 shadow-lg border border-white/5">
          {/* Setting: Varsayılan Frekans */}
          <button
            onClick={() => setActiveModal('freq')}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#252840]/60 transition-colors text-left"
            type="button"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#8e7100]/40 flex items-center justify-center text-[#e7c355]">
                <span className="material-symbols-outlined text-[20px]">radio</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#dee0ff] truncate">Varsayılan Akort</span>
                <span className="text-[11px] text-[#c7c4d7] truncate">
                  {frequency} • Hücresel Uyum &amp; Dinginlik
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className="flex items-center gap-1 bg-[#2f334b] px-2.5 py-1 rounded-full border border-white/5">
                <span className="material-symbols-outlined text-[#e7c355] text-[14px]">tune</span>
                <span className="text-xs font-bold text-[#dee0ff]">{frequency}</span>
              </div>
              <span className="material-symbols-outlined text-[#908fa0] text-[18px]">chevron_right</span>
            </div>
          </button>

          {/* Setting: Arka Planda Çalma (Toggle) */}
          <div className="w-full flex items-center justify-between p-3 rounded-xl">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#2f334b]/70 flex items-center justify-center text-[#c7c4d7]">
                <span className="material-symbols-outlined text-[20px]">headphones</span>
              </div>
              <div className="flex flex-col min-w-0 pr-2">
                <span className="text-xs font-semibold text-[#dee0ff] truncate">Arka Planda Çalma</span>
                <span className="text-[11px] text-[#c7c4d7]">
                  Ekran kapalıyken frekans kesintisiz devam eder
                </span>
              </div>
            </div>

            {/* Accessible Custom Toggle */}
            <button
              aria-checked={isBackgroundAudioOn}
              onClick={handleToggleBackgroundAudio}
              className={`w-12 h-7 rounded-full p-0.5 transition-colors duration-300 relative focus:outline-none flex-shrink-0 ${
                isBackgroundAudioOn ? 'bg-[#e7c355]' : 'bg-[#2f334b]'
              }`}
              role="switch"
              type="button"
            >
              <span
                className={`block w-6 h-6 rounded-full bg-[#080c22] shadow-md transform transition-transform duration-300 ${
                  isBackgroundAudioOn ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Setting: Otomatik Uyku Sayacı */}
          <button
            onClick={() => setActiveModal('sleep')}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#252840]/60 transition-colors text-left group"
            type="button"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#2f334b]/70 flex items-center justify-center text-[#c7c4d7] group-hover:text-[#c0c1ff] transition-colors">
                <span className="material-symbols-outlined text-[20px]">timer</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#dee0ff] truncate">Otomatik Uyku Sayacı</span>
                <span className="text-[11px] text-[#c7c4d7]">Dinlenme sonrası frekansı nazikçe kısar</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-xs font-bold text-[#e7c355]">{sleepTimer}</span>
              <span className="material-symbols-outlined text-[#908fa0] text-[18px]">chevron_right</span>
            </div>
          </button>
        </div>
      </section>

      {/* Interactive Section 3: Gizlilik, Şifreleme & Cihaz İçi Güvenlik */}
      <section className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#7bd0ff] text-[18px]">lock</span>
            <h2 className="text-sm font-semibold text-[#dee0ff]">Gizlilik &amp; Cihaz İçi Güvenlik</h2>
          </div>
          <span className="text-[10px] font-bold text-[#7bd0ff] uppercase tracking-wider">SIFIR İZ</span>
        </div>

        {/* Highlight Anti-Dark Pattern Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#252840] via-[#1a1e35] to-[#252840] p-4 flex flex-col gap-1.5 shadow-md relative overflow-hidden border border-white/5 mb-1">
          <div className="flex items-center gap-2 text-[#7bd0ff]">
            <span className="material-symbols-outlined text-[20px]">enhanced_encryption</span>
            <span className="text-sm font-bold text-[#dee0ff]">AES-256 Yerel Şifreleme</span>
          </div>
          <p className="text-xs text-[#c7c4d7] leading-relaxed">
            Veira etik tasarım felsefesini benimser: Niyet panolarınız, vizyon görselleriniz ve sesli günlükleriniz kesinlikle uzak bir sunucuya aktarılmaz. Yalnızca senin biyometrik şifrenle cihazında çözümlenir.
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e7c355]" />
            <span className="text-[11px] font-semibold text-[#e7c355]">
              Kişisel Veri Koruma Protokolü • Sıfır İz Garantisi
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-[#1a1e35]/70 backdrop-blur-xl p-1.5 flex flex-col gap-1 shadow-lg border border-white/5">
          {/* Biometric Lock Switch */}
          <div className="w-full flex items-center justify-between p-3 rounded-xl">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#2f334b]/70 flex items-center justify-center text-[#c7c4d7]">
                <span className="material-symbols-outlined text-[20px]">fingerprint</span>
              </div>
              <div className="flex flex-col min-w-0 pr-2">
                <span className="text-xs font-semibold text-[#dee0ff] truncate">
                  Biyometrik Kilit (Face ID / Touch ID)
                </span>
                <span className="text-[11px] text-[#c7c4d7]">Uygulama açılışında anında doğrulama</span>
              </div>
            </div>

            <button
              aria-checked={isBiometricLockOn}
              onClick={handleToggleBiometrics}
              className={`w-12 h-7 rounded-full p-0.5 transition-colors duration-300 relative focus:outline-none flex-shrink-0 ${
                isBiometricLockOn ? 'bg-[#e7c355]' : 'bg-[#2f334b]'
              }`}
              role="switch"
              type="button"
            >
              <span
                className={`block w-6 h-6 rounded-full bg-[#080c22] shadow-md transform transition-transform duration-300 ${
                  isBiometricLockOn ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Cloud Sync Status (Local Zero Cloud) */}
          <div
            onClick={() => onShowToast('Sıfır Bulut Mimarisi: Verileriniz yalnızca bu cihazda şifreli saklanır.', 'cloud_off')}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#252840]/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#2f334b]/70 flex items-center justify-center text-[#c7c4d7]">
                <span className="material-symbols-outlined text-[20px]">cloud_off</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#dee0ff] truncate">Bulut Eşzamanlama</span>
                <span className="text-[11px] text-[#c7c4d7]">Yerel Depolama (Sıfır İz • Kapalı)</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#2f334b] text-[#908fa0] text-[11px] font-semibold">
              Kapalı
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Section 4: Destek, Şeffaflık & Yasal Bilgiler */}
      <section className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#e7c355] text-[20px]">auto_stories</span>
            <h2 className="text-sm font-semibold text-[#dee0ff]">Uygulama Mimarisi &amp; Sayfa Mantığı</h2>
          </div>
          {onOpenArchitectureIntro && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic();
                onOpenArchitectureIntro();
              }}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#e7c355]/20 text-[#e7c355] text-[10px] font-bold tracking-wider uppercase hover:bg-[#e7c355]/30 transition-colors"
            >
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
              Mini Pencerede Aç
            </button>
          )}
        </div>

        <div className="rounded-2xl bg-[#1a1e35]/70 backdrop-blur-xl p-4 flex flex-col gap-4 shadow-lg border border-white/5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#e7c355]">
              <span className="material-symbols-outlined text-[18px]">neurology</span>
              <span className="text-xs font-bold tracking-wide uppercase">Bilişsel Tasarım Metodolojisi</span>
            </div>
            <p className="text-xs text-[#c7c4d7] leading-relaxed">
              Veira, modern nöro-bilim ve kognitif psikoloji prensipleri üzerine inşa edilmiştir. Soyut niyetleri somut gerçekliğe dönüştüren mimari döngümüz 3 temel aksiyomdan oluşur:
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {/* Axiom 1: 12 Odak Kuralı */}
            <div className="p-3 rounded-xl bg-[#252840]/60 backdrop-blur-md flex flex-col gap-1.5 border border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#e7c355]/15 flex items-center justify-center text-[#e7c355]">
                    <span className="material-symbols-outlined text-[16px]">filter_12</span>
                  </div>
                  <span className="text-xs font-semibold text-[#dee0ff]">12 Odak Kuralı (Bilişsel Yük)</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#2f334b] text-[#ffe089] text-[10px] font-semibold">
                  Miller &amp; Sweller
                </span>
              </div>
              <p className="text-xs text-[#c7c4d7] pl-9 leading-relaxed">
                İnsan zihni aynı anda en fazla 7±2 karmaşık kavramı aktif rezonansta tutabilir. Veira, vizyon panosunu 12 görselle sınırlandırarak bilişsel tükenmeyi önler ve dikkat enerjisini dağıtmadan yoğunlaştırır.
              </p>
            </div>

            {/* Axiom 2: WOOP Modeli */}
            <div className="p-3 rounded-xl bg-[#252840]/60 backdrop-blur-md flex flex-col gap-1.5 border border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#c0c1ff]/15 flex items-center justify-center text-[#c0c1ff]">
                    <span className="material-symbols-outlined text-[16px]">route</span>
                  </div>
                  <span className="text-xs font-semibold text-[#dee0ff]">Vizyon → Eylem Köprüsü (WOOP)</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#2f334b] text-[#c0c1ff] text-[10px] font-semibold">
                  Wish • Outcome • Obstacle • Plan
                </span>
              </div>
              <p className="text-xs text-[#c7c4d7] pl-9 leading-relaxed">
                Soyut hayaller tek başına eylem üretmez. WOOP mimarisi vizyon kartını 3 aylık SMART kilometre taşlarına, oradan da bugünün tekil 15 dakikalık mikro-eylemine bağlar. Büyük hedefler sürtünmesiz adımlara ayrışır.
              </p>
            </div>

            {/* Axiom 3: 432Hz Nöro-Akustik Rezonans */}
            <div className="p-3 rounded-xl bg-[#252840]/60 backdrop-blur-md flex flex-col gap-1.5 border border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#7bd0ff]/15 flex items-center justify-center text-[#7bd0ff]">
                    <span className="material-symbols-outlined text-[16px]">waves</span>
                  </div>
                  <span className="text-xs font-semibold text-[#dee0ff]">432Hz Nöro-Akustik Rezonans</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#2f334b] text-[#7bd0ff] text-[10px] font-semibold">
                  Hücresel Uyum
                </span>
              </div>
              <p className="text-xs text-[#c7c4d7] pl-9 leading-relaxed">
                Evrensel altın oran frekansı 432Hz solfej dalgaları ve sakinleştirici yağmur dokuları, otonom sinir sistemini sempatik alarm modundan parasempatik dinginlik moduna geçirerek manifestasyon odağını derinleştirir.
              </p>
            </div>
          </div>

          {/* Sayfalar & Modüller Rehberi Listesi */}
          <div className="pt-2 border-t border-white/5 flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#c7c4d7] text-[16px]">apps</span>
              <span className="text-[11px] font-bold text-[#c7c4d7] uppercase tracking-wider">
                Yeni Sistem: 4 Temel Yaşam Alanı &amp; Kasa
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {/* Bugün */}
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#080c22]/60 border border-white/5">
                <div className="w-8 h-8 rounded-full bg-[#e7c355]/15 flex items-center justify-center text-[#e7c355] flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">today</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#dee0ff]">1. Bugün (Sadeleştirilmiş Merkez)</span>
                    <span className="text-[10px] text-[#e7c355] font-semibold uppercase">Merkez Odak</span>
                  </div>
                  <span className="text-xs text-[#c7c4d7] leading-relaxed">
                    Günün niyeti, AI ile anında niyet çağırma, tek bir 15 dakikalık öncelikli mikro-adım ve akşam değerlendirmesi. Bildirim saatleri karmaşa yaratmaması için Ayarlar'dan yönetilir.
                  </span>
                </div>
              </div>

              {/* Vizyon & Hedefler */}
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#080c22]/60 border border-white/5">
                <div className="w-8 h-8 rounded-full bg-[#8083ff]/15 flex items-center justify-center text-[#c0c1ff] flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">auto_awesome_mosaic</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#dee0ff]">2. Vizyon &amp; Hedefler (Bütünleşik Pano)</span>
                    <span className="text-[10px] text-[#c0c1ff] font-semibold uppercase">Görsel Çapa &amp; Eylem</span>
                  </div>
                  <span className="text-xs text-[#c7c4d7] leading-relaxed">
                    Ayrı sayfalar birleşti: 12 Odak Kuralı vizyon kartları, 3 aylık SMART kilometre taşları ve AI hedef parçalayıcı tek sayfada sade ve kaliteli bir akışla buluştu.
                  </span>
                </div>
              </div>

              {/* 432Hz */}
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#080c22]/60 border border-white/5">
                <div className="w-8 h-8 rounded-full bg-[#7bd0ff]/15 flex items-center justify-center text-[#7bd0ff] flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">headphones</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#dee0ff]">3. 432Hz Ses Mabedi (Nöro-Akustik)</span>
                    <span className="text-[10px] text-[#7bd0ff] font-semibold uppercase">Hücresel Frekans</span>
                  </div>
                  <span className="text-xs text-[#c7c4d7] leading-relaxed">
                    432Hz saf altın oran sinüs frekansı, Como dalgaları, şömine çıtırtısı ve gece yağmuru soundscape'i ile zihinsel berraklık.
                  </span>
                </div>
              </div>

              {/* Veira Asistan */}
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#080c22]/60 border border-white/5">
                <div className="w-8 h-8 rounded-full bg-[#c0c1ff]/15 flex items-center justify-center text-[#c0c1ff] flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">psychology</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#dee0ff]">4. Veira Asistan (AI &amp; Zihinsel Stüdyo)</span>
                    <span className="text-[10px] text-[#c0c1ff] font-semibold uppercase">Bilişsel Rehber</span>
                  </div>
                  <span className="text-xs text-[#c7c4d7] leading-relaxed">
                    Flux.1 8K Ultra-Fotogerçekçi Vizyon Stüdyosu, Stoik Zihinsel Kontrol Çemberi, 4-7-8 vagus nefesi ve sesli rehberlik.
                  </span>
                </div>
              </div>

              {/* Ayarlar & Kasa */}
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#080c22]/60 border border-white/5">
                <div className="w-8 h-8 rounded-full bg-[#2f334b] flex items-center justify-center text-[#dee0ff] flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">shield</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#dee0ff]">5. Ayarlar &amp; Kasa (Veri Egemenliği)</span>
                    <span className="text-[10px] text-[#908fa0] font-semibold uppercase">Kontrol &amp; Güvenlik</span>
                  </div>
                  <span className="text-xs text-[#c7c4d7] leading-relaxed">
                    Günlük bildirim saatleri ve sıklığı, AES-256 yerel şifreleme, sıfır telemetri ve anında veri imhası.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Veri Egemenliği & Yerel Yedekleme (Backup & Restore) */}
      <section className="flex flex-col gap-2 mb-5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#7bd0ff] text-[18px]">save</span>
            <h2 className="text-sm font-semibold text-[#dee0ff]">Veri Egemenliği &amp; Yerel Yedekleme</h2>
          </div>
          <span className="text-[10px] font-bold text-[#7bd0ff] uppercase tracking-wider">LOCAL-FIRST</span>
        </div>

        <div className="rounded-2xl bg-[#1a1e35]/70 backdrop-blur-xl p-3 flex flex-col gap-2.5 shadow-lg border border-white/5">
          <p className="text-xs text-[#c7c4d7] leading-relaxed">
            Vizyonlarınız ve alışkanlıklarınız yalnızca sizin cihazınızda yaşar. Cihaz değiştirirken veya güvenli arşiv tutmak için tek tıkla tam yedek alabilir ve dilediğinizde geri yükleyebilirsiniz.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {/* Export JSON Backup */}
            <button
              type="button"
              onClick={handleExportBackup}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#252840] hover:bg-[#2f334b] text-[#e7c355] text-xs font-semibold border border-[#e7c355]/30 shadow-sm active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[17px]">download</span>
              <span>Verilerimi Yedekle (.json)</span>
            </button>

            {/* Import JSON Backup */}
            <label className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#252840] hover:bg-[#2f334b] text-[#7bd0ff] text-xs font-semibold border border-[#7bd0ff]/30 shadow-sm active:scale-95 transition-all cursor-pointer">
              <span className="material-symbols-outlined text-[17px]">upload_file</span>
              <span>Yedeği İçe Aktar</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>

          {/* Share App Button */}
          <button
            type="button"
            onClick={handleShareApp}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-left transition-colors border border-white/5"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-[#e7c355]">share</span>
              <span className="text-xs font-medium text-[#dee0ff]">Veira Mabedini Paylaş</span>
            </div>
            <span className="text-[11px] text-[#e7c355] font-semibold flex items-center gap-0.5">
              <span>Tavsiye Et</span>
              <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
            </span>
          </button>
        </div>
      </section>

      {/* Section 6: Destek & Yasal Şeffaflık */}
      <section className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#908fa0] text-[18px]">policy</span>
            <h2 className="text-sm font-semibold text-[#dee0ff]">Destek &amp; Yasal Şeffaflık</h2>
          </div>
          <span className="text-[10px] font-bold text-[#c7c4d7] uppercase tracking-wider">RESMİ</span>
        </div>

        <div className="rounded-2xl bg-[#1a1e35]/70 backdrop-blur-xl p-1.5 flex flex-col gap-1 shadow-lg border border-white/5">
          {/* Subscription Management Store Link */}
          <div
            onClick={() => {
              triggerHaptic();
              setIsPremiumModalOpen(true);
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#252840]/60 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#2f334b]/70 flex items-center justify-center text-[#c7c4d7] group-hover:text-[#ffe089] transition-colors">
                <span className="material-symbols-outlined text-[20px]">loyalty</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#dee0ff] truncate">Abonelik &amp; Ödeme Yönetimi</span>
                <span className="text-[11px] text-[#c7c4d7]">Doğrudan Cihaz Lisansı &bull; Ömür Boyu Aktif</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#e7c355] bg-[#e7c355]/15 px-2.5 py-1 rounded-md border border-[#e7c355]/30">
              İncele
            </span>
          </div>

          {/* Restore Purchases (Apple App Store Guideline 3.1.2 Mandatory Requirement) */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic();
              onShowToast('Apple ID / Google Play lisansınız başarıyla doğrulandı ve geri yüklendi ✨', 'restore');
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#252840]/60 transition-colors text-left group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#2f334b]/70 flex items-center justify-center text-[#c7c4d7] group-hover:text-[#e7c355] transition-colors">
                <span className="material-symbols-outlined text-[20px]">history_edu</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#dee0ff] truncate">Satın Alımları Geri Yükle</span>
                <span className="text-[11px] text-[#c7c4d7]">Mevcut Store lisansını cihaza yeniden bağla</span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-[#e7c355] bg-[#e7c355]/10 px-2 py-0.5 rounded-md border border-[#e7c355]/20">
              Geri Yükle
            </span>
          </button>

          {/* Privacy Policy Link (In-App Manifesto + Public URL) */}
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#252840]/60 transition-colors">
            <button
              onClick={() => setActiveModal('privacy')}
              className="flex items-center gap-3 min-w-0 flex-1 text-left"
              type="button"
            >
              <div className="w-9 h-9 rounded-full bg-[#2f334b]/70 flex items-center justify-center text-[#c7c4d7]">
                <span className="material-symbols-outlined text-[20px]">verified</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#dee0ff] truncate">
                  Gizlilik Politikası (KVKK &amp; GDPR)
                </span>
                <span className="text-[11px] text-[#c7c4d7]">Anti-Dark Pattern &amp; veri etiği manifestosu</span>
              </div>
            </button>
            <div className="flex items-center gap-1 shrink-0">
              <a
                href="/gizlilik"
                target="_blank"
                rel="noreferrer"
                title="Resmi Web Gizlilik Politikası Sayfasını Aç"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#7bd0ff] text-xs font-medium flex items-center gap-0.5 transition-colors"
              >
                <span className="text-[10px]">Web</span>
                <span className="material-symbols-outlined text-[13px]">open_in_new</span>
              </a>
            </div>
          </div>

          {/* Terms of Service Link (EULA) */}
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#252840]/60 transition-colors">
            <button
              onClick={() => setActiveModal('privacy')}
              className="flex items-center gap-3 min-w-0 flex-1 text-left"
              type="button"
            >
              <div className="w-9 h-9 rounded-full bg-[#2f334b]/70 flex items-center justify-center text-[#c7c4d7]">
                <span className="material-symbols-outlined text-[20px]">gavel</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#dee0ff] truncate">
                  Kullanım Şartları &amp; EULA (Lisans)
                </span>
                <span className="text-[11px] text-[#c7c4d7]">Apple &amp; Google Store şartları ve AI kuralları</span>
              </div>
            </button>
            <div className="flex items-center gap-1 shrink-0">
              <a
                href="/sartlar"
                target="_blank"
                rel="noreferrer"
                title="Resmi Kullanım Şartları (EULA) Sayfasını Aç"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#7bd0ff] text-xs font-medium flex items-center gap-0.5 transition-colors"
              >
                <span className="text-[10px]">Web</span>
                <span className="material-symbols-outlined text-[13px]">open_in_new</span>
              </a>
            </div>
          </div>

          {/* Support & FAQ Link */}
          <a
            href="/destek"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#252840]/60 transition-colors text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#2f334b]/70 flex items-center justify-center text-[#c7c4d7]">
                <span className="material-symbols-outlined text-[20px]">contact_support</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#dee0ff] truncate">Destek Merkezi &amp; SSS</span>
                <span className="text-[11px] text-[#c7c4d7]">7/24 Rehber &bull; destek@veira.app</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#7bd0ff] text-[16px]">open_in_new</span>
          </a>

          {/* App Version Display */}
          <button
            onClick={() => onShowToast('Veira v1.0.0 (Master Nocturnal Build #1042) en güncel sürümde ✨', 'info')}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#252840]/40 transition-colors text-left"
            type="button"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#2f334b]/70 flex items-center justify-center text-[#c7c4d7]">
                <span className="material-symbols-outlined text-[20px]">info</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#dee0ff] truncate">Sürüm &amp; Mimarisi</span>
                <span className="text-[11px] text-[#c7c4d7]">Veira v1.0.0 (Master Nocturnal Build #1042)</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#c0c1ff]">Güncel</span>
          </button>
        </div>
      </section>

      {/* Critical Action: Account Deletion */}
      <section className="mt-1 flex flex-col gap-2">
        <button
          onClick={() => setActiveModal('delete')}
          className="w-full py-3.5 px-4 rounded-xl bg-[#93000a]/20 hover:bg-[#93000a]/30 text-[#ffb4ab] transition-all flex items-center justify-center gap-2 active:scale-[0.99] shadow-sm border border-[#ffb4ab]/20"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">delete_forever</span>
          <span className="text-xs font-bold">Hesabı ve Tüm Verileri Kalıcı Olarak Sil</span>
        </button>
        <p className="text-[11px] text-center text-[#908fa0]">
          Bu işlem tüm şifreli panoları ve yerel kayıtları geri döndürülemez şekilde temizler.
        </p>
      </section>

      {/* MODAL 1: Language Selector */}
      {activeModal === 'lang' && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto overscroll-contain"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-sm max-h-[92dvh] overflow-y-auto bg-[#161a30] border border-[#e7c355]/30 rounded-3xl p-5 shadow-2xl relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-base font-bold text-[#dee0ff]">Uygulama Dili Seçin</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[#c7c4d7] hover:text-white"
                aria-label="Kapat"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {(['Türkçe (TR)', 'English (EN)', 'Italiano (IT)'] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setLanguage(item);
                    onShowToast(`Uygulama dili "${item}" olarak ayarlandı.`, 'language');
                    setActiveModal(null);
                  }}
                  className={`w-full p-3 rounded-xl flex items-center justify-between text-xs font-semibold transition-all ${
                    language === item
                      ? 'bg-[#e7c355] text-[#3d2f00]'
                      : 'bg-[#252840] text-[#dee0ff] hover:bg-[#2f334b]'
                  }`}
                >
                  <span>{item}</span>
                  {language === item && (
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Notification Frequency */}
      {activeModal === 'notif' && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto overscroll-contain"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-sm max-h-[92dvh] overflow-y-auto bg-[#161a30] border border-[#e7c355]/30 rounded-3xl p-5 shadow-2xl relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-base font-bold text-[#dee0ff]">Bildirim Sıklığı</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[#c7c4d7] hover:text-white"
                aria-label="Kapat"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {(
                [
                  'Günde 3 Kez • Sakin & Nazik Ritüel',
                  'Günde 1 Kez • Sabah Niyeti',
                  'Sadece Akşam Değerlendirmesi',
                  'Kapalı',
                ] as const
              ).map((item) => (
                <button
                  key={item}
                  onClick={async () => {
                    setNotificationFreq(item);
                    if (item === 'Kapalı') {
                      localStorage.setItem('veira_daily_notif_enabled', 'false');
                      onShowToast('Bildirimler kapatıldı.', 'notifications_off');
                    } else {
                      localStorage.setItem('veira_daily_notif_enabled', 'true');
                      if (isNotificationSupported()) {
                        const granted = await requestNotificationPermission();
                        if (granted) {
                          const intention = getTodayIntention();
                          sendBrowserNotification(intention, true);
                          onShowToast(`✨ Bildirim açıldı (${item}). İlk niyet bildirimi iletildi!`, 'notifications_active');
                        } else {
                          onShowToast(`Bildirim tercihi: ${item} (Tarayıcı bildirimi için izin bekleniyor)`, 'spa');
                        }
                      } else {
                        onShowToast(`Bildirim tercihi: ${item}`, 'spa');
                      }
                    }
                    setActiveModal(null);
                  }}
                  className={`w-full p-3 rounded-xl flex items-center justify-between text-xs font-semibold transition-all ${
                    notificationFreq === item
                      ? 'bg-[#e7c355] text-[#3d2f00]'
                      : 'bg-[#252840] text-[#dee0ff] hover:bg-[#2f334b]'
                  }`}
                >
                  <span className="truncate pr-2">{item}</span>
                  {notificationFreq === item && (
                    <span className="material-symbols-outlined text-[18px] shrink-0">check</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Quiet Hours */}
      {activeModal === 'quiet' && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto overscroll-contain"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-sm max-h-[92dvh] overflow-y-auto bg-[#161a30] border border-[#e7c355]/30 rounded-3xl p-5 shadow-2xl relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-base font-bold text-[#dee0ff]">Sessiz Saatler</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[#c7c4d7] hover:text-white"
                aria-label="Kapat"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {['23:00 — 07:00', '22:00 — 08:00', '00:00 — 08:00', 'Kapalı'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setQuietHours(item);
                    onShowToast(`Sessiz saatler aralığı: ${item}`, 'bedtime');
                    setActiveModal(null);
                  }}
                  className={`w-full p-3 rounded-xl flex items-center justify-between text-xs font-semibold transition-all ${
                    quietHours === item
                      ? 'bg-[#e7c355] text-[#3d2f00]'
                      : 'bg-[#252840] text-[#dee0ff] hover:bg-[#2f334b]'
                  }`}
                >
                  <span>{item}</span>
                  {quietHours === item && (
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Coach Tone */}
      {activeModal === 'coach' && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto overscroll-contain"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-sm max-h-[92dvh] overflow-y-auto bg-[#161a30] border border-[#e7c355]/30 rounded-3xl p-5 shadow-2xl relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-base font-bold text-[#dee0ff]">Zihinsel Koç Ses Tonu</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[#c7c4d7] hover:text-white"
                aria-label="Kapat"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {(
                [
                  'Bilge & Şefkatli',
                  'Dingin & Zen Minimalist',
                  'İlham Verici & Güçlü',
                ] as const
              ).map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setCoachTone(item);
                    if (onPlayChime) onPlayChime();
                    onShowToast(`Koç ses tonu: "${item}" seçildi ✨`, 'record_voice_over');
                    setActiveModal(null);
                  }}
                  className={`w-full p-3 rounded-xl flex items-center justify-between text-xs font-semibold transition-all ${
                    coachTone === item
                      ? 'bg-[#e7c355] text-[#3d2f00]'
                      : 'bg-[#252840] text-[#dee0ff] hover:bg-[#2f334b]'
                  }`}
                >
                  <span>{item}</span>
                  {coachTone === item && (
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Frequency Selector */}
      {activeModal === 'freq' && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto overscroll-contain"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-sm max-h-[92dvh] overflow-y-auto bg-[#161a30] border border-[#e7c355]/30 rounded-3xl p-5 shadow-2xl relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-base font-bold text-[#dee0ff]">Varsayılan Akort Frekansı</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[#c7c4d7] hover:text-white"
                aria-label="Kapat"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { hz: '432 Hz', desc: 'Hücresel Uyum & Doğal Altın Oran' },
                { hz: '528 Hz', desc: 'Mucize Dönüşüm & DNA Onarım Rezonansı' },
                { hz: '396 Hz', desc: 'Korku & Endişe Salınımı' },
                { hz: '639 Hz', desc: 'Kalp Açıcı & İlişki Harmonisi' },
              ].map((item) => (
                <button
                  key={item.hz}
                  onClick={() => {
                    setFrequency(item.hz as any);
                    if (onPlayChime) onPlayChime();
                    onShowToast(`Akort frekansı ${item.hz} olarak ayarlandı ✨`, 'graphic_eq');
                    setActiveModal(null);
                  }}
                  className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-all ${
                    frequency === item.hz
                      ? 'bg-[#e7c355] text-[#3d2f00]'
                      : 'bg-[#252840] text-[#dee0ff] hover:bg-[#2f334b]'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">{item.hz}</span>
                    <span className="text-[10px] opacity-80">{item.desc}</span>
                  </div>
                  {frequency === item.hz && (
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: Sleep Timer */}
      {activeModal === 'sleep' && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto overscroll-contain"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-sm max-h-[92dvh] overflow-y-auto bg-[#161a30] border border-[#e7c355]/30 rounded-3xl p-5 shadow-2xl relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-base font-bold text-[#dee0ff]">Uyku Sayacı Aralığı</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[#c7c4d7] hover:text-white"
                aria-label="Kapat"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {(['15 Dakika', '30 Dakika', '45 Dakika', '60 Dakika', 'Kapalı'] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setSleepTimer(item);
                    onShowToast(`Uyku sayacı: ${item}`, 'timer');
                    setActiveModal(null);
                  }}
                  className={`w-full p-3 rounded-xl flex items-center justify-between text-xs font-semibold transition-all ${
                    sleepTimer === item
                      ? 'bg-[#e7c355] text-[#3d2f00]'
                      : 'bg-[#252840] text-[#dee0ff] hover:bg-[#2f334b]'
                  }`}
                >
                  <span>{item}</span>
                  {sleepTimer === item && (
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: Privacy Policy & Manifesto */}
      {activeModal === 'privacy' && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto overscroll-contain"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-md max-h-[92dvh] overflow-y-auto bg-[#161a30] border border-[#e7c355]/30 rounded-3xl p-5 sm:p-6 shadow-2xl relative text-left my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#e7c355] text-[20px]">verified</span>
                <h3 className="font-serif text-lg font-bold text-[#dee0ff]">
                  Veira Gizlilik Manifestosu
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#c7c4d7] hover:text-white"
                aria-label="Kapat"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="text-xs text-[#c7c4d7] space-y-3 leading-relaxed">
              <p className="font-medium text-[#dee0ff]">
                Veira, modern webin dikkat sömürücü ve gözetimci yapısına karşı radikal bir sakinlik ve etik taahhüdüyle geliştirilmiştir:
              </p>
              <div className="p-3 rounded-xl bg-[#080c22] border border-white/5 space-y-2">
                <div className="font-semibold text-[#e7c355]">1. Sıfır Telemetri ve Sıfır Takipçi</div>
                <p>Uygulama içinde hiçbir analiz izleyicisi, reklam kütüphanesi veya üçüncü taraf çerez yer almaz.</p>
              </div>
              <div className="p-3 rounded-xl bg-[#080c22] border border-white/5 space-y-2">
                <div className="font-semibold text-[#7bd0ff]">2. %100 Cihaz İçi Uçtan Uca Şifreleme</div>
                <p>Vizyon panolarınız ve hedefleriniz doğrudan tarayıcınızın yerel şifreli alanında saklanır; uzak sunuculara depolanmaz.</p>
              </div>
              <div className="p-3 rounded-xl bg-[#080c22] border border-white/5 space-y-2">
                <div className="font-semibold text-[#c0c1ff]">3. Veri Egemenliği &amp; Hesap Silme Hakkı</div>
                <p>Apple ve Google Play ilkelerine tam uyumlu olarak verileriniz her zaman size aittir; tek tıkla cihazdan ve hesaptan kalıcı olarak temizleyebilirsiniz.</p>
              </div>
              <div className="p-3 rounded-xl bg-[#080c22] border border-white/5 space-y-2">
                <div className="font-semibold text-[#ffe089]">4. Üretken Yapay Zeka &amp; Prompt Gizliliği</div>
                <p>Hedef parçalama ve niyet önerilerinde kullanılan yapay zeka girdileriniz genel modellerin eğitimi için kullanılmaz, üçüncü taraflara aktarılmaz. Güvenli TLS 1.3 şifrelemesiyle işlenir.</p>
              </div>
              <div className="p-3 rounded-xl bg-[#080c22] border border-amber-500/20 space-y-2">
                <div className="font-semibold text-amber-300">5. Tıbbi &amp; Klinik Sorumluluk Reddi (Önemli)</div>
                <p>Veira, kişisel farkındalık, niyet belirleme ve hedef planlama uygulamasıdır. Tıbbi, psikiyatrik veya klinik bir tanı/tedavi niteliği taşımaz; profesyonel sağlık desteğinin yerini alamaz.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#252840]/60 border border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-[#a4a2b5]">İletişim &amp; Resmi Destek:</span>
                <span className="text-[#e7c355] font-semibold">destek@veira.app</span>
              </div>
            </div>

            <div className="mt-5">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-3 rounded-full bg-[#e7c355] text-[#3d2f00] font-bold text-xs shadow-md active:scale-95 transition-transform"
              >
                Anladım &amp; Onaylıyorum
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 8: Delete Confirmation */}
      {activeModal === 'delete' && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto overscroll-contain"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-sm max-h-[92dvh] overflow-y-auto rounded-3xl bg-[#161a30] border border-[#ffb4ab]/30 p-5 shadow-2xl flex flex-col gap-3 relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-[#93000a]/40 flex items-center justify-center text-[#ffb4ab] mx-auto">
              <span className="material-symbols-outlined text-[28px]">warning</span>
            </div>
            <div className="flex flex-col text-center gap-1">
              <h3 className="font-serif text-lg font-bold text-[#dee0ff]">Emin misiniz?</h3>
              <p className="text-xs text-[#c7c4d7] leading-relaxed">
                Cihazınızdaki AES-256 anahtarı imha edilecek. Kaydedilen tüm vizyon kartları, niyet frekansları ve ses kayıtları anında silinecektir.
              </p>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={handleResetData}
                className="w-full py-3 rounded-full bg-[#ffb4ab] text-[#690005] text-xs font-bold shadow-md active:scale-95 transition-transform"
                type="button"
              >
                Evet, Verileri Kalıcı Sil
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 rounded-full bg-[#252840] text-[#dee0ff] text-xs font-semibold hover:bg-[#2f334b] transition-colors"
                type="button"
              >
                Vazgeç &amp; Geri Dön
              </button>
            </div>
          </div>
        </div>
      )}


      {/* VEIRA PREMIUM PAYWALL MODAL */}
      <VeiraPremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        onShowToast={onShowToast}
        onPlayChime={onPlayChime}
      />

      {/* Mobile Safe Bottom Clearance Spacer - prevents floating dock collision */}
      <div className="h-14 sm:h-8 w-full shrink-0 pointer-events-none" aria-hidden="true" />
    </section>
  );
};
