# VEIRA - PROJE KURULUM REHBERİ, KLASÖR YAPISI VE ORTAM YAPILANDIRMASI
**Sürüm:** 1.0 (Geliştirici Kurulum Kılavuzu) | **Tarih:** 2025/2026
**Ürün:** Veira (Mindful Vision & Action Architecture)
**Mimari:** Clean Architecture (Feature-First) + Flutter (Dart) + Riverpod 2.x + Supabase

---

## 1. GELİŞTİRİCİ BİLGİSAYARINA KURULMASI GEREKENLER (SIFIRDAN BAŞLANGIÇ)

Hiçbir teknik ön bilginiz olmadığını varsayarak, uygulamanın çalışması için bilgisayarınızda kurulu olması gereken temel araçlar şunlardır:

### A. Temel Araçlar
1. **VS Code (Visual Studio Code):** Kod editörü. (https://code.visualstudio.com)
   * *VS Code Eklentileri:* "Flutter", "Dart", "Supabase", "Error Lens", "Material Icon Theme".
2. **Flutter SDK (3.24+ / 3.27+ Önerilen):**
   * *Mac için:* Terminal'den `brew install --cask flutter` veya https://docs.flutter.dev/get-started/install/macos adresinden indirin.
   * *Windows için:* https://docs.flutter.dev/get-started/install/windows adresinden indirin ve `PATH` ortam değişkenine ekleyin.
   * Kurulumu doğrulamak için terminalde şu komutu çalıştırın:
     ```bash
     flutter doctor
     ```
3. **Mobil Emülatörler:**
   * **iOS (Mac Gerektirir):** App Store'dan **Xcode** indirin ve açıp lisans sözleşmesini onaylayın. Ardından Terminal'e `open -a Simulator` yazın.
   * **Android (Mac veya Windows):** **Android Studio** indirin. "Virtual Device Manager" üzerinden Pixel 8 veya Galaxy S24 emülatörü oluşturun.
4. **Git:** Versiyon kontrol sistemi (Terminal'de `git --version` ile kontrol edin).

---

## 2. ADIM ADIM PROJE OLUŞTURMA VE HAZIRLIK KOMUTLARI

Aşağıdaki komutları sırasıyla Terminal (Mac) veya PowerShell (Windows) üzerinde çalıştırın:

```bash
# 1. Projeyi oluşturun (Türkçe & İngilizce destekli, temiz isim)
flutter create --org com.veira --project-name veira --platforms=ios,android veira

# 2. Proje klasörüne girin
cd veira

# 3. Gerekli klasör iskeletini oluşturun (Bash / Mac)
mkdir -p assets/fonts assets/icons assets/images assets/audio assets/translations
mkdir -p lib/core/{constants,theme,network,services,utils,widgets}
mkdir -p lib/features/{onboarding,auth,home,goals,vision_board,manifest,paywall,settings}
```

---

## 3. `pubspec.yaml` (EKSİKSİZ VE KİLİTLİ BAĞIMLILIK PAKETLERİ)

Projenizin kök dizinindeki `pubspec.yaml` dosyasını açın ve içeriğini aşağıdakiyle birebir değiştirin:

```yaml
name: veira
description: "Veira - Mindful Vision & Action Architecture"
publish_to: "none"
version: 1.0.0+1

environment:
  sdk: ">=3.2.0 <4.0.0"
  flutter: ">=3.24.0"

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter

  # --- DURUM YÖNETİMİ & MİMARİ ---
  flutter_riverpod: ^2.6.1
  riverpod_annotation: ^2.6.1

  # --- VERİTABANI & ÇEVRİMDIŞI ÖNBELLEK ---
  supabase_flutter: ^2.8.0
  hive_flutter: ^1.1.0

  # --- SES & ARKA PLAN MÜZİK MİKSERİ (Calm Seviyesi) ---
  just_audio: ^0.9.42
  audio_service: ^0.18.17
  audio_session: ^0.1.21

  # --- BİLDİRİM & ARKA PLAN GÖREVİ (iOS 64 Kısıtı Çözümü) ---
  flutter_local_notifications: ^18.0.1
  timezone: ^0.9.4
  workmanager: ^0.5.2

  # --- VİZYON PANOSU & GRAFİK MOTORU ---
  flutter_image_compress: ^2.3.0
  image_picker: ^1.1.2
  path_provider: ^2.1.5
  share_plus: ^10.1.2
  gallery_saver_updated: ^3.0.0

  # --- TİPOGRAFİ, İKON & LÜKS TASARIM BİLEŞENLERİ ---
  google_fonts: ^6.2.1
  flutter_svg: ^2.0.16
  glassmorphism_ui: ^0.3.0
  cached_network_image: ^3.4.1
  vibration: ^2.0.1

  # --- YERELLEŞTİRME & DİL (i18n) ---
  intl: ^0.19.0

  # --- ABONELİK & MONETİZASYON ---
  purchases_flutter: ^8.4.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^5.0.0
  build_runner: ^2.4.13
  riverpod_generator: ^2.6.2

flutter:
  uses-material-design: true

  assets:
    - assets/icons/
    - assets/images/
    - assets/audio/
    - assets/translations/
```

---

## 4. DETAYLI PROJE KLASÖR YAPISI (CLEAN ARCHITECTURE - FEATURE-FIRST)

Uygulamanın kodları `lib/` dizininde modüler, okunması ve bakımı kolay bir hiyerarşide yapılandırılmıştır:

```
veira/
├── assets/
│   ├── audio/                 # 432Hz ambient ve yağmur ses kayıtları
│   ├── icons/                 # Özel SVG ikon seti
│   ├── images/                # Arka plan dokuları ve polaroid çerçeve maskeleri
│   └── translations/
│       ├── tr.json            # Türkçe sözlük dosyası
│       └── en.json            # İngilizce sözlük dosyası
│
├── lib/
│   ├── main.dart              # Uygulama başlangıç noktası (Supabase & Hive init)
│   │
│   ├── core/                  # Tüm uygulamada paylaşılan ortak çekirdek
│   │   ├── constants/
│   │   │   ├── api_constants.dart       # Supabase URL & Anon Key sabitleri
│   │   │   └── app_constants.dart       # 12 görsel kuralı, 15 dk süre limitleri
│   │   ├── theme/
│   │   │   ├── app_colors.dart          # Mistik Gece hex kodları (#080A16, #F5D061 vb.)
│   │   │   ├── app_typography.dart      # Playfair Display ve Plus Jakarta Sans tanımları
│   │   │   └── app_theme.dart           # Glassmorphism ve Dark Theme ThemeData yapılandırması
│   │   ├── services/
│   │   │   ├── audio_service_manager.dart # just_audio 2 kanallı ses mikseri servisi
│   │   │   ├── notification_scheduler.dart# 7 günlük kayan bildirim motoru (iOS 64 limitine uygun)
│   │   │   └── storage_service.dart     # Cihaz içi yerel dosya ve şifreli depolama
│   │   └── widgets/
│   │       ├── glass_card.dart          # Yeniden kullanılabilir cam efektli kart bileşeni
│   │       ├── golden_button.dart       # Lüks altın gradyanlı aksiyon butonu
│   │       └── animated_wave.dart       # 432Hz ses dalgası görselleştiricisi
│   │
│   └── features/              # Ekran bazlı modüller (Clean Architecture)
│       ├── onboarding/        # Dil seçimi, 3 adımlı karşılama ve ilk niyet
│       │   ├── presentation/  # OnboardingView & Dil Seçici Widget'ı
│       │   └── providers/     # Onboarding akış kontrolcüsü (Riverpod)
│       │
│       ├── home/              # Ana Sayfa Dashboard (Günün Niyeti & 15 Dk Eylem Döngüsü)
│       │   ├── presentation/  # HomeView, StreakWidget, ProgressRingsWidget
│       │   └── providers/     # DailyRoutineNotifier
│       │
│       ├── goals/             # SMART Hedefler ve 3 Aylık Kilometre Taşları
│       │   ├── data/          # GoalsRepository (Supabase + Yerel Drift/Hive)
│       │   ├── domain/        # GoalModel, MicroActionModel
│       │   └── presentation/  # GoalDetailView, AddGoalBottomSheet
│       │
│       ├── vision_board/      # 60 FPS 12 Görselli Pano Editörü
│       │   ├── domain/        # BoardItemModel (Pozisyon, Açı, Katman, Hedef ID)
│       │   ├── presentation/  # VisionBoardCanvasView, PolaroidStickerWidget
│       │   └── providers/     # CanvasInteractionNotifier (Pan, Zoom, Rotate)
│       │
│       ├── manifest/          # Sürükleyici 432Hz Tam Ekran Nefes & Afirmasyon Modu
│       │   ├── presentation/  # ManifestPlayerView, SoundMixerSheet
│       │   └── providers/     # ManifestAudioNotifier
│       │
│       ├── paywall/           # 7 Günlük Şeffaf Deneme & Apple/Google Uyumlu Paywall
│       │   ├── presentation/  # TransparentPaywallView, FeatureComparisonTable
│       │   └── providers/     # SubscriptionNotifier (RevenueCat entegrasyonu)
│       │
│       └── settings/          # Dil Değiştirici, Bildirim Sıklığı, Veri Dışa Aktarma & Hesap Silme
│           └── presentation/  # SettingsView, PrivacyCenterView
```

---

## 5. ÇEVRESEL DEĞİŞKENLER VE GÜVENLİK AYARLARI (`.env` VE NATIVE CONFIG)

### A. `.env` Dosyası (Proje Kök Dizininde Oluşturulacak)
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
REVENUECAT_APPLE_KEY=appl_your_revenuecat_key
REVENUECAT_GOOGLE_KEY=goog_your_revenuecat_key
```

### B. iOS Yapılandırması (`ios/Runner/Info.plist`)
Arka planda kesintisiz müzik ve bildirimler için `ios/Runner/Info.plist` içerisine `<dict>` etiketinin altına şu izinleri ekleyeceğiz:
```xml
<!-- Arka Planda 432Hz Müzik Çalma İzni (Calm Seviyesi) -->
<key>UIBackgroundModes</key>
<array>
    <string>audio</string>
    <string>fetch</string>
    <string>processing</string>
</array>

<!-- Fotoğraf Galerisi Seçim İzni -->
<key>NSPhotoLibraryUsageDescription</key>
<string>Veira, vizyon panonuza kendi fotoğraflarınızı ekleyebilmeniz için galeri izni gerektirir.</string>

<!-- Kamera İzni (Opsiyonel fotoğraf çekimi için) -->
<key>NSCameraUsageDescription</key>
<string>Veira, anlık fotoğraf çekip vizyon panonuza ekleyebilmeniz için kamera izni gerektirir.</string>
```

### C. Android Yapılandırması (`android/app/src/main/AndroidManifest.xml`)
`<manifest>` etiketinin hemen altına şu izinler eklenir:
```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
<uses-permission android:name="android.permission.WAKE_LOCK"/>
<uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK"/>
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/>
```

---

## 6. İLK TEST VE ÇALIŞTIRMA KOMUTU

Kurulumu test etmek ve uygulamanın boş iskeletini ayağa kaldırmak için:

```bash
# Bağımlılık paketlerini indirin
flutter pub get

# Simülatör veya cihazınız bağlıyken çalıştırın
flutter run
```
