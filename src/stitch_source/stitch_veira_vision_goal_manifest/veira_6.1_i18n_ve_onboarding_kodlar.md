# VEIRA - 6.1: i18N VE ONBOARDING KODLARI (EKSİKSİZ VE KOPYALA-YAPIŞTIR)
**Sürüm:** 1.0 | **Tarih:** 2025/2026
**Adım:** 6.1 - Dil Altyapısı (i18n), Tema Sabitleri ve 3 Adımlı Mistik Lüks Onboarding Deneyimi

Aşağıdaki dosyaları sırasıyla projenizde belirtilen dosya yollarına oluşturup içeriklerini birebir yapıştırın. Hiçbir kod kısaltılmamış veya eksik bırakılmamıştır.

---

## 1. DİL DOSYALARI (i18n JSON)

### Dosya Yolu: `assets/translations/tr.json`
```json
{
  "app_name": "Veira",
  "tagline": "Zihinsel Vizyon ve Eylem Mimarisi",
  "common": {
    "continue": "Devam Et",
    "start": "Vizyonumu Başlat",
    "skip": "Şimdilik Atla",
    "save": "Kaydet",
    "cancel": "Vazgeç",
    "back": "Geri",
    "loading": "Yükleniyor..."
  },
  "onboarding": {
    "step_counter": "Adım {step} / 3",
    "step1_title": "2026 / 2027 Vizyonun",
    "step1_subtitle": "Bu yıl hayatında en çok hangi alanda parlamak, büyümek ve derinleşmek istiyorsun?",
    "step1_helper": "En çok odaklanmak istediğin 1 veya 2 alanı seçebilirsin.",
    "step2_title": "Kalbindeki Büyük Niyet",
    "step2_subtitle": "Bu alandaki en büyük hayalini, sanki gerçekleşmiş gibi serbestçe yaz.",
    "step2_placeholder": "Örn: Como Gölü kıyısında uzaktan çalışırken sağlıklı, huzurlu ve fit bir bedene sahip olmak...",
    "step2_ai_badge": "VEIRA AI KOÇU",
    "step2_ai_transforming": "Hedefin SMART ve 15 dakikalık eyleme dönüştürülüyor...",
    "step2_ai_suggestion_title": "Dönüştürülen SMART Hedef:",
    "step2_ai_daily_step_title": "Bugünkü 15 Dakikalık Mikro-Adım:",
    "step3_title": "Vizyonunun Görsel Tohumu",
    "step3_subtitle": "Zihnini her gün bu duyguya bağlayacak ilk estetik ilham görselini seç veya yükle.",
    "step3_upload_button": "Galeriden Fotoğraf Seç",
    "step3_camera_button": "Anlık Fotoğraf Çek",
    "step3_curated_title": "Veya İlham Verici Mistik Koleksiyondan Seç",
    "step3_preview_badge": "Mini Vizyon Panon Hazır!",
    "step3_aha_quote": "Bugün attığın her 15 dakikalık küçük adım, yarının büyük vizyonunu inşa eder."
  },
  "categories": {
    "career": "Kariyer & Bolluk",
    "health": "Beden & Sağlık",
    "spirit": "Ruhsal Denge",
    "relationships": "Aşk & İlişkiler",
    "travel": "Yeni Ufuklar & Seyahat",
    "creativity": "Yaratıcılık & Sanat"
  }
}
```

### Dosya Yolu: `assets/translations/en.json`
```json
{
  "app_name": "Veira",
  "tagline": "Mindful Vision & Action Architecture",
  "common": {
    "continue": "Continue",
    "start": "Ignite My Vision",
    "skip": "Skip for now",
    "save": "Save",
    "cancel": "Cancel",
    "back": "Back",
    "loading": "Loading..."
  },
  "onboarding": {
    "step_counter": "Step {step} of 3",
    "step1_title": "Your 2026 / 2027 Vision",
    "step1_subtitle": "In which realm of life do you wish to radiate, expand, and find deepest alignment this year?",
    "step1_helper": "Select 1 or 2 focal pillars of your life wheel.",
    "step2_title": "Your Soul's True Intention",
    "step2_subtitle": "Describe your greatest ambition freely, as if it is already unfolding.",
    "step2_placeholder": "E.g., Working remotely by Lake Como while nurturing a vibrant, calm, and fit body...",
    "step2_ai_badge": "VEIRA AI COACH",
    "step2_ai_transforming": "Transforming into a SMART goal and 15-min action...",
    "step2_ai_suggestion_title": "Refined SMART Goal:",
    "step2_ai_daily_step_title": "Today's 15-Minute Micro-Action:",
    "step3_title": "The Visual Seed of Your Vision",
    "step3_subtitle": "Select or upload the aesthetic visual that anchors your mind to this state of being.",
    "step3_upload_button": "Choose from Gallery",
    "step3_camera_button": "Capture Photo",
    "step3_curated_title": "Or Pick from the Curated Mystical Vault",
    "step3_preview_badge": "Your First Vision Capsule is Ready!",
    "step3_aha_quote": "Every 15-minute conscious step you take today crafts the architecture of your tomorrow."
  },
  "categories": {
    "career": "Career & Abundance",
    "health": "Body & Vitality",
    "spirit": "Spiritual Peace",
    "relationships": "Love & Kinship",
    "travel": "Horizons & Travel",
    "creativity": "Creativity & Craft"
  }
}
```

---

## 2. ÇEKİRDEK TEMA VE RENK PALETİ

### Dosya Yolu: `lib/core/theme/app_colors.dart`
```dart
import 'package:flutter/material.dart';

/// Veira Mistik Lüks Gece Renk Paleti (Nocturnal Serenity)
class AppColors {
  AppColors._();

  // Ana Arka Plan ve Uzay Zemin Tonları
  static const Color spaceDeepNavy = Color(0xFF080A16);
  static const Color spaceDarkSurface = Color(0xFF0E1228);
  static const Color nocturneIndigo = Color(0xFF111633);
  static const Color containerLow = Color(0xFF161A30);
  static const Color containerMid = Color(0xFF1E2342);

  // Lüks Altın Vurgu Tonları (Celestial Gold)
  static const Color celestialGold = Color(0xFFF5D061);
  static const Color starlightChampagne = Color(0xFFFDF4DC);
  static const Color amberMuted = Color(0xFFD4AF37);

  // Mistik ve Yaşam Çarkı Çakra Renkleri
  static const Color mysticViolet = Color(0xFF6366F1);
  static const Color auroraRose = Color(0xFFEC4899);
  static const Color etherealTeal = Color(0xFF2DD4BF);
  static const Color skySerenity = Color(0xFF38BDF8);

  // Metin Tonları
  static const Color pureMoonWhite = Color(0xFFF8FAFC);
  static const Color stardustMuted = Color(0xFF94A3B8);
  static const Color slateSubtle = Color(0xFF64748B);

  // Cam ve Kenarlık (Glassmorphism)
  static const Color glassBorder = Color(0x1AFFFFFF); // 10% beyaz kenar
  static const Color glassFill = Color(0x1F111633);   // 12% saydam indigo
  static const Color glassFillActive = Color(0x3D6366F1); // Aktif mor saydamlık

  // Gradyanlar
  static const LinearGradient goldGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Color(0xFFF5D061),
      Color(0xFFE5B93B),
      Color(0xFFC7951E),
    ],
  );

  static const LinearGradient mysticalHeroGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [
      Color(0xFF1A1F45),
      Color(0xFF0E1228),
      Color(0xFF080A16),
    ],
  );

  static const LinearGradient cardBorderGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Color(0x4DF5D061),
      Color(0x1AFFFFFF),
      Color(0x3D6366F1),
    ],
  );
}
```

### Dosya Yolu: `lib/core/theme/app_typography.dart`
```dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

/// Veira Tipografi Sistemi (Playfair Display + Plus Jakarta Sans)
/// Türkçe karakterler (ğ, ü, ş, ı, ö, ç, İ) eksiksiz desteklenir.
class AppTypography {
  AppTypography._();

  // Serif Başlıklar (Playfair Display)
  static TextStyle displayH1({Color color = AppColors.pureMoonWhite}) {
    return GoogleFonts.playfairDisplay(
      fontSize: 28,
      fontWeight: FontWeight.bold,
      color: color,
      letterSpacing: -0.5,
      height: 1.25,
    );
  }

  static TextStyle displayH2({Color color = AppColors.pureMoonWhite}) {
    return GoogleFonts.playfairDisplay(
      fontSize: 22,
      fontWeight: FontWeight.w600,
      color: color,
      letterSpacing: -0.3,
      height: 1.3,
    );
  }

  static TextStyle displayH3({Color color = AppColors.starlightChampagne}) {
    return GoogleFonts.playfairDisplay(
      fontSize: 18,
      fontWeight: FontWeight.w500,
      color: color,
      height: 1.35,
    );
  }

  // Geometrik Gövde Metinleri (Plus Jakarta Sans)
  static TextStyle bodyLarge({Color color = AppColors.pureMoonWhite}) {
    return GoogleFonts.plusJakartaSans(
      fontSize: 15,
      fontWeight: FontWeight.normal,
      color: color,
      height: 1.5,
    );
  }

  static TextStyle bodyMedium({Color color = AppColors.stardustMuted}) {
    return GoogleFonts.plusJakartaSans(
      fontSize: 13.5,
      fontWeight: FontWeight.normal,
      color: color,
      height: 1.45,
    );
  }

  static TextStyle caption({Color color = AppColors.stardustMuted, bool isBold = false}) {
    return GoogleFonts.plusJakartaSans(
      fontSize: 11.5,
      fontWeight: isBold ? FontWeight.w600 : FontWeight.w500,
      color: color,
      letterSpacing: 0.5,
    );
  }

  static TextStyle goldenButtonText = GoogleFonts.plusJakartaSans(
    fontSize: 15,
    fontWeight: FontWeight.w700,
    color: const Color(0xFF1F1600),
    letterSpacing: 0.3,
  );
}
```

---

## 3. YERELLEŞTİRME VE DİL SERVİSİ (i18n CONTROLLER)

### Dosya Yolu: `lib/core/services/localization_service.dart`
```dart
import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Desteklenen Diller
enum AppLanguage { tr, en }

/// Seçili dili saklayan ve yöneten StateProvider
final currentLanguageProvider = StateNotifierProvider<LanguageNotifier, AppLanguage>((ref) {
  return LanguageNotifier();
});

class LanguageNotifier extends StateNotifier<AppLanguage> {
  LanguageNotifier() : super(AppLanguage.tr);

  void setLanguage(AppLanguage language) {
    state = language;
  }

  void toggleLanguage() {
    state = (state == AppLanguage.tr) ? AppLanguage.en : AppLanguage.tr;
  }
}

/// JSON sözlüklerini yükleyip önbelleğe alan servis sağlayıcısı
final translationsProvider = FutureProvider<Map<String, dynamic>>((ref) async {
  final lang = ref.watch(currentLanguageProvider);
  final jsonString = await rootBundle.loadString(
    'assets/translations/${lang == AppLanguage.tr ? 'tr' : 'en'}.json',
  );
  return json.decode(jsonString) as Map<String, dynamic>;
});

/// Kolay çeviri anahtar çözümleme uzantısı
extension TranslationHelper on Map<String, dynamic> {
  String tr(String keyPath, {Map<String, String>? params}) {
    final keys = keyPath.split('.');
    dynamic current = this;

    for (final key in keys) {
      if (current is Map<String, dynamic> && current.containsKey(key)) {
        current = current[key];
      } else {
        return keyPath; // Anahtar bulunamazsa yolu döner
      }
    }

    String result = current.toString();
    if (params != null) {
      params.forEach((paramKey, paramValue) {
        result = result.replaceAll('{$paramKey}', paramValue);
      });
    }
    return result;
  }
}
```

---

## 4. YENİDEN KULLANILABİLİR LÜKS WIDGET'LAR (CAM KART VE ALTIN BUTON)

### Dosya Yolu: `lib/core/widgets/glass_card.dart`
```dart
import 'dart:ui';
import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class GlassCard extends StatelessWidget {
  final Widget child;
  final double borderRadius;
  final double blurAmount;
  final Color? backgroundColor;
  final Border? border;
  final EdgeInsetsGeometry padding;
  final VoidCallback? onTap;

  const GlassCard({
    super.key,
    required this.child,
    this.borderRadius = 20.0,
    this.blurAmount = 16.0,
    this.backgroundColor,
    this.border,
    this.padding = const EdgeInsets.all(16.0),
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final cardContent = ClipRRect(
      borderRadius: BorderRadius.circular(borderRadius),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: blurAmount, sigmaY: blurAmount),
        child: Container(
          padding: padding,
          decoration: BoxDecoration(
            color: backgroundColor ?? AppColors.glassFill,
            borderRadius: BorderRadius.circular(borderRadius),
            border: border ?? Border.all(color: AppColors.glassBorder, width: 1.0),
          ),
          child: child,
        ),
      ),
    );

    if (onTap != null) {
      return Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(borderRadius),
          onTap: onTap,
          child: cardContent,
        ),
      );
    }

    return cardContent;
  }
}
```

### Dosya Yolu: `lib/core/widgets/golden_button.dart`
```dart
import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_typography.dart';

class GoldenButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final IconData? icon;

  const GoldenButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.isLoading = false,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    final isDisabled = onPressed == null || isLoading;

    return Container(
      width: double.infinity,
      height: 54,
      decoration: BoxDecoration(
        gradient: isDisabled
            ? null
            : AppColors.goldGradient,
        color: isDisabled ? AppColors.containerLow : null,
        borderRadius: BorderRadius.circular(27),
        boxShadow: isDisabled
            ? []
            : [
                BoxShadow(
                  color: AppColors.celestialGold.withOpacity(0.35),
                  blurRadius: 18,
                  offset: const Offset(0, 6),
                ),
              ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(27),
          onTap: isDisabled ? null : onPressed,
          child: Center(
            child: isLoading
                ? const SizedBox(
                    width: 24,
                    height: 24,
                    child: CircularProgressIndicator(
                      strokeWidth: 2.5,
                      color: Color(0xFF1F1600),
                    ),
                  )
                : Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(text, style: AppTypography.goldenButtonText),
                      if (icon != null) ...[
                        const SizedBox(width: 8),
                        Icon(icon, size: 18, color: const Color(0xFF1F1600)),
                      ],
                    ],
                  ),
          ),
        ),
      ),
    );
  }
}
```

---

## 5. ONBOARDING STATE YÖNETİMİ (RIVERPOD PROVIDER)

### Dosya Yolu: `lib/features/onboarding/providers/onboarding_provider.dart`
```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Onboarding Veri Modeli
class OnboardingState {
  final int currentStep; // 0, 1, 2
  final List<String> selectedCategories;
  final String rawIntention;
  final String smartGoalSuggestion;
  final String dailyMicroAction;
  final bool isGeneratingAi;
  final String? selectedImageUrl;

  const OnboardingState({
    this.currentStep = 0,
    this.selectedCategories = const ['career'],
    this.rawIntention = '',
    this.smartGoalSuggestion = '',
    this.dailyMicroAction = '',
    this.isGeneratingAi = false,
    this.selectedImageUrl,
  });

  OnboardingState copyWith({
    int? currentStep,
    List<String>? selectedCategories,
    String? rawIntention,
    String? smartGoalSuggestion,
    String? dailyMicroAction,
    bool? isGeneratingAi,
    String? selectedImageUrl,
  }) {
    return OnboardingState(
      currentStep: currentStep ?? this.currentStep,
      selectedCategories: selectedCategories ?? this.selectedCategories,
      rawIntention: rawIntention ?? this.rawIntention,
      smartGoalSuggestion: smartGoalSuggestion ?? this.smartGoalSuggestion,
      dailyMicroAction: dailyMicroAction ?? this.dailyMicroAction,
      isGeneratingAi: isGeneratingAi ?? this.isGeneratingAi,
      selectedImageUrl: selectedImageUrl ?? this.selectedImageUrl,
    );
  }
}

final onboardingProvider = StateNotifierProvider<OnboardingNotifier, OnboardingState>((ref) {
  return OnboardingNotifier();
});

class OnboardingNotifier extends StateNotifier<OnboardingState> {
  OnboardingNotifier() : super(const OnboardingState());

  void setStep(int step) {
    state = state.copyWith(currentStep: step);
  }

  void nextStep() {
    if (state.currentStep < 2) {
      state = state.copyWith(currentStep: state.currentStep + 1);
    }
  }

  void previousStep() {
    if (state.currentStep > 0) {
      state = state.copyWith(currentStep: state.currentStep - 1);
    }
  }

  void toggleCategory(String categoryKey) {
    final list = List<String>.from(state.selectedCategories);
    if (list.contains(categoryKey)) {
      if (list.length > 1) {
        list.remove(categoryKey);
      }
    } else {
      if (list.length >= 2) {
        list.removeAt(0); // Maksimum 2 odak alanı kuralı
      }
      list.add(categoryKey);
    }
    state = state.copyWith(selectedCategories: list);
  }

  void updateIntention(String text) {
    state = state.copyWith(rawIntention: text);
    // Canlı SMART ve 15 dk mikro adım simülasyonu
    _simulateSmartTransform(text);
  }

  void selectImage(String imageUrl) {
    state = state.copyWith(selectedImageUrl: imageUrl);
  }

  Future<void> _simulateSmartTransform(String input) async {
    if (input.trim().length < 8) {
      state = state.copyWith(
        smartGoalSuggestion: '',
        dailyMicroAction: '',
        isGeneratingAi: false,
      );
      return;
    }

    state = state.copyWith(isGeneratingAi: true);
    await Future.delayed(const Duration(milliseconds: 600));

    // Kategoriye ve kullanıcı niyetine göre yerel akıllı SMART kural motoru (MVP)
    final category = state.selectedCategories.isNotEmpty ? state.selectedCategories.first : 'career';
    String smartText = '';
    String microText = '';

    if (category == 'career') {
      smartText = '3 Ay İçinde: Portföyünü tamamla ve haftada 3 uluslararası müşteriye teklif sun.';
      microText = 'Bugünkü 15 Dk: Portföyündeki en iyi projeyi seç ve 3 cümlelik başarı özetini yaz.';
    } else if (category == 'health') {
      smartText = '90 Günde: Haftada 4 gün 30 dk kardiyo/yoga yap ve enerji seviyeni %40 artır.';
      microText = 'Bugünkü 15 Dk: Yoga matını çıkar, 15 dakikalık nefes ve esneme serisini tamamla.';
    } else if (category == 'spirit') {
      smartText = 'Her Sabah: 10 dakika meditasyon ve akşam 432Hz ses dalgası ile niyet tazele.';
      microText = 'Bugünkü 15 Dk: Sakin bir odaya geç, kulaklığını tak ve 432Hz frekansı aç.';
    } else {
      smartText = 'Hedefin 3 Aylık Döneme Bölündü: İlk kilometre taşını 45 gün içinde tamamla.';
      microText = 'Bugünkü 15 Dk: Bu vizyona giden yolda önüne çıkacak tek bir engeli ve çözümünü yaz.';
    }

    state = state.copyWith(
      smartGoalSuggestion: smartText,
      dailyMicroAction: microText,
      isGeneratingAi: false,
    );
  }
}
```

---

## 6. ONBOARDING ANA EKRANI VE 3 ADIMLI DENEYİM

### Dosya Yolu: `lib/features/onboarding/presentation/onboarding_view.dart`
```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/services/localization_service.dart';
import '../../../core/widgets/glass_card.dart';
import '../../../core/widgets/golden_button.dart';
import '../providers/onboarding_provider.dart';

class OnboardingView extends ConsumerStatefulWidget {
  const OnboardingView({super.key});

  @override
  ConsumerState<OnboardingView> createState() => _OnboardingViewState();
}

class _OnboardingViewState extends ConsumerState<OnboardingView> {
  final TextEditingController _intentionController = TextEditingController();

  @override
  void dispose() {
    _intentionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final translationsAsync = ref.watch(translationsProvider);
    final onboardingState = ref.watch(onboardingProvider);
    final onboardingNotifier = ref.read(onboardingProvider.notifier);
    final currentLang = ref.watch(currentLanguageProvider);
    final langNotifier = ref.read(currentLanguageProvider.notifier);

    return Scaffold(
      backgroundColor: AppColors.spaceDeepNavy,
      body: translationsAsync.when(
        loading: () => const Center(
          child: CircularProgressIndicator(color: AppColors.celestialGold),
        ),
        error: (err, stack) => Center(
          child: Text('Dil yüklenemedi: $err', style: AppTypography.bodyMedium()),
        ),
        data: (t) {
          return SafeArea(
            child: Column(
              children: [
                // 1. ÜST BAR: İlerleme Çizgisi + Dil Seçici (TR/EN) + Atla Butonu
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
                  child: Row(
                    children: [
                      // 3 Adımlı Altın İlerleme Çubukları
                      Expanded(
                        child: Row(
                          children: List.generate(3, (index) {
                            final isActive = index <= onboardingState.currentStep;
                            return Expanded(
                              child: Container(
                                height: 3.5,
                                margin: EdgeInsets.only(right: index < 2 ? 8.0 : 0.0),
                                decoration: BoxDecoration(
                                  color: isActive
                                      ? AppColors.celestialGold
                                      : AppColors.containerMid,
                                  borderRadius: BorderRadius.circular(2),
                                  boxShadow: isActive
                                      ? [
                                          BoxShadow(
                                            color: AppColors.celestialGold.withOpacity(0.5),
                                            blurRadius: 6,
                                          )
                                        ]
                                      : null,
                                ),
                              ),
                            );
                          }),
                        ),
                      ),
                      const SizedBox(width: 16),

                      // Dil Değiştirici Buton (TR / EN)
                      InkWell(
                        borderRadius: BorderRadius.circular(12),
                        onTap: () => langNotifier.toggleLanguage(),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            border: Border.all(color: AppColors.glassBorder),
                            borderRadius: BorderRadius.circular(12),
                            color: AppColors.containerLow,
                          ),
                          child: Text(
                            currentLang == AppLanguage.tr ? 'EN' : 'TR',
                            style: AppTypography.caption(
                              color: AppColors.celestialGold,
                              isBold: true,
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(width: 12),

                      // Misafir Olarak Atla Butonu
                      TextButton(
                        onPressed: () {
                          // Ana Sayfaya doğrudan yönlendirme (Misafir modu)
                          Navigator.pushReplacementNamed(context, '/home');
                        },
                        child: Text(
                          t.tr('common.skip'),
                          style: AppTypography.caption(color: AppColors.stardustMuted),
                        ),
                      ),
                    ],
                  ),
                ),

                // 2. ORTA İÇERİK (ADIM 1, 2 VEYA 3)
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12.0),
                    child: _buildCurrentStep(
                      context,
                      step: onboardingState.currentStep,
                      t: t,
                      state: onboardingState,
                      notifier: onboardingNotifier,
                    ),
                  ),
                ),

                // 3. ALT AKSİYON BUTONLARI
                Padding(
                  padding: const EdgeInsets.fromLTRB(24, 8, 24, 20),
                  child: Row(
                    children: [
                      if (onboardingState.currentStep > 0) ...[
                        IconButton(
                          onPressed: () => onboardingNotifier.previousStep(),
                          icon: const Icon(Icons.arrow_back_ios_new, size: 20, color: AppColors.pureMoonWhite),
                        ),
                        const SizedBox(width: 12),
                      ],
                      Expanded(
                        child: GoldenButton(
                          text: onboardingState.currentStep == 2
                              ? t.tr('common.start')
                              : t.tr('common.continue'),
                          icon: onboardingState.currentStep == 2
                              ? Icons.auto_awesome
                              : Icons.arrow_forward,
                          onPressed: () {
                            if (onboardingState.currentStep < 2) {
                              onboardingNotifier.nextStep();
                            } else {
                              // Onboarding tamamlandı -> Ana Sayfaya geç
                              Navigator.pushReplacementNamed(context, '/home');
                            }
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  // --- ADIM SAYFALARI ---
  Widget _buildCurrentStep(
    BuildContext context, {
    required int step,
    required Map<String, dynamic> t,
    required OnboardingState state,
    required OnboardingNotifier notifier,
  }) {
    switch (step) {
      case 0:
        return _buildStep1LifeWheel(t, state, notifier);
      case 1:
        return _buildStep2Intention(t, state, notifier);
      case 2:
        return _buildStep3VisionSeed(t, state, notifier);
      default:
        return const SizedBox.shrink();
    }
  }

  // ADIM 1: YAŞAM ÇARKI & PARLAMAK İSTENEN ALAN
  Widget _buildStep1LifeWheel(
    Map<String, dynamic> t,
    OnboardingState state,
    OnboardingNotifier notifier,
  ) {
    final categories = [
      {'key': 'career', 'icon': Icons.trending_up, 'title': t.tr('categories.career'), 'color': AppColors.celestialGold},
      {'key': 'health', 'icon': Icons.spa, 'title': t.tr('categories.health'), 'color': AppColors.etherealTeal},
      {'key': 'spirit', 'icon': Icons.nightlight_round, 'title': t.tr('categories.spirit'), 'color': AppColors.mysticViolet},
      {'key': 'relationships', 'icon': Icons.favorite, 'title': t.tr('categories.relationships'), 'color': AppColors.auroraRose},
      {'key': 'travel', 'icon': Icons.explore, 'title': t.tr('categories.travel'), 'color': AppColors.skySerenity},
      {'key': 'creativity', 'icon': Icons.palette, 'title': t.tr('categories.creativity'), 'color': AppColors.starlightChampagne},
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(t.tr('onboarding.step1_title'), style: AppTypography.displayH1()),
        const SizedBox(height: 8),
        Text(t.tr('onboarding.step1_subtitle'), style: AppTypography.bodyLarge(color: AppColors.stardustMuted)),
        const SizedBox(height: 6),
        Text(t.tr('onboarding.step1_helper'), style: AppTypography.caption(color: AppColors.celestialGold)),
        const SizedBox(height: 24),

        // 6'lı Kategori Grid Kartları
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollException(),
          itemCount: categories.length,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            mainAxisSpacing: 14,
            crossAxisSpacing: 14,
            childAspectRatio: 1.15,
          ),
          itemBuilder: (context, index) {
            final item = categories[index];
            final key = item['key'] as String;
            final isSelected = state.selectedCategories.contains(key);
            final color = item['color'] as Color;

            return GlassCard(
              borderRadius: 18,
              backgroundColor: isSelected ? AppColors.glassFillActive : AppColors.glassFill,
              border: Border.all(
                color: isSelected ? AppColors.celestialGold : AppColors.glassBorder,
                width: isSelected ? 1.5 : 1.0,
              ),
              onTap: () => notifier.toggleCategory(key),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: color.withOpacity(0.15),
                      shape: BoxShape.circle,
                      border: Border.all(color: color.withOpacity(0.3)),
                    ),
                    child: Icon(item['icon'] as IconData, color: color, size: 22),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    item['title'] as String,
                    textAlign: TextAlign.center,
                    style: AppTypography.caption(
                      color: isSelected ? AppColors.pureMoonWhite : AppColors.stardustMuted,
                      isBold: isSelected,
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }

  // ADIM 2: BÜYÜK NİYET VE AI SMART DÖNÜŞÜMÜ
  Widget _buildStep2Intention(
    Map<String, dynamic> t,
    OnboardingState state,
    OnboardingNotifier notifier,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(t.tr('onboarding.step2_title'), style: AppTypography.displayH1()),
        const SizedBox(height: 8),
        Text(t.tr('onboarding.step2_subtitle'), style: AppTypography.bodyLarge(color: AppColors.stardustMuted)),
        const SizedBox(height: 20),

        // Metin Giriş Alanı (Glassmorphic Input)
        GlassCard(
          borderRadius: 18,
          padding: const EdgeInsets.all(16),
          child: TextField(
            controller: _intentionController,
            maxLines: 4,
            style: AppTypography.bodyLarge(),
            cursorColor: AppColors.celestialGold,
            decoration: InputDecoration(
              hintText: t.tr('onboarding.step2_placeholder'),
              hintStyle: AppTypography.bodyMedium(color: AppColors.slateSubtle),
              border: InputBorder.none,
            ),
            onChanged: (val) => notifier.updateIntention(val),
          ),
        ),

        const SizedBox(height: 20),

        // AI SMART Canlı Dönüşüm Kartı
        if (state.isGeneratingAi) ...[
          Center(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.celestialGold),
                ),
                const SizedBox(width: 10),
                Text(t.tr('onboarding.step2_ai_transforming'), style: AppTypography.caption(color: AppColors.celestialGold)),
              ],
            ),
          ),
        ] else if (state.smartGoalSuggestion.isNotEmpty) ...[
          GlassCard(
            borderRadius: 20,
            backgroundColor: const Color(0x336366F1),
            border: Border.all(color: AppColors.mysticViolet.withOpacity(0.5), width: 1.2),
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.mysticViolet,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        t.tr('onboarding.step2_ai_badge'),
                        style: AppTypography.caption(color: Colors.white, isBold: true),
                      ),
                    ),
                    const Spacer(),
                    const Icon(Icons.auto_awesome, color: AppColors.celestialGold, size: 18),
                  ],
                ),
                const SizedBox(height: 12),
                Text(t.tr('onboarding.step2_ai_suggestion_title'), style: AppTypography.caption(color: AppColors.celestialGold, isBold: true)),
                const SizedBox(height: 4),
                Text(state.smartGoalSuggestion, style: AppTypography.bodyLarge()),
                const Divider(color: AppColors.glassBorder, height: 24),
                Text(t.tr('onboarding.step2_ai_daily_step_title'), style: AppTypography.caption(color: AppColors.etherealTeal, isBold: true)),
                const SizedBox(height: 4),
                Text(state.dailyMicroAction, style: AppTypography.bodyLarge(color: AppColors.pureMoonWhite)),
              ],
            ),
          ),
        ],
      ],
    );
  }

  // ADIM 3: VİZYONUN GÖRSEL TOHUMU (AHA! MOMENT)
  Widget _buildStep3VisionSeed(
    Map<String, dynamic> t,
    OnboardingState state,
    OnboardingNotifier notifier,
  ) {
    final curatedImages = [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', // Sahil & Dinginlik
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', // Lüks & Şehir
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80', // Meditasyon & Doğa
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80', // Çalışma & Yaratıcılık
    ];

    final activeImage = state.selectedImageUrl ?? curatedImages.first;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(t.tr('onboarding.step3_title'), style: AppTypography.displayH1()),
        const SizedBox(height: 8),
        Text(t.tr('onboarding.step3_subtitle'), style: AppTypography.bodyLarge(color: AppColors.stardustMuted)),
        const SizedBox(height: 20),

        // Mini Polaroid Vizyon Kapsülü (Önizleme)
        Center(
          child: Container(
            width: 240,
            padding: const EdgeInsets.fromLTRB(12, 12, 12, 18),
            decoration: BoxDecoration(
              color: AppColors.containerLow,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.celestialGold.withOpacity(0.4), width: 1.2),
              boxShadow: [
                BoxShadow(
                  color: AppColors.celestialGold.withOpacity(0.18),
                  blurRadius: 25,
                  spreadRadius: 2,
                ),
              ],
            ),
            child: Column(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Image.network(
                    activeImage,
                    height: 240,
                    width: double.infinity,
                    fit: BoxFit.cover,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  state.rawIntention.isNotEmpty ? state.rawIntention : "2027 Büyük Vizyonum ✨",
                  textAlign: TextAlign.center,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: AppTypography.displayH3(color: AppColors.celestialGold),
                ),
              ],
            ),
          ),
        ),

        const SizedBox(height: 24),
        Text(t.tr('onboarding.step3_curated_title'), style: AppTypography.caption(color: AppColors.stardustMuted)),
        const SizedBox(height: 12),

        // 4 Hazır Mistik Fotoğraf Koleksiyonu Seçici
        SizedBox(
          height: 72,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: curatedImages.length,
            separatorBuilder: (_, __) => const SizedBox(width: 12),
            itemBuilder: (context, index) {
              final img = curatedImages[index];
              final isSelected = (img == activeImage);

              return GestureDetector(
                onTap: () => notifier.selectImage(img),
                child: Container(
                  width: 72,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(
                      color: isSelected ? AppColors.celestialGold : AppColors.glassBorder,
                      width: isSelected ? 2.5 : 1.0,
                    ),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Image.network(img, fit: BoxFit.cover),
                  ),
                ),
              );
            },
          ),
        ),

        const SizedBox(height: 24),

        // İlham Alıntısı Kartı
        GlassCard(
          borderRadius: 16,
          backgroundColor: AppColors.glassFill,
          child: Row(
            children: [
              const Icon(Icons.format_quote, color: AppColors.celestialGold, size: 28),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  t.tr('onboarding.step3_aha_quote'),
                  style: AppTypography.caption(color: AppColors.pureMoonWhite),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
```

---

## 7. `main.dart` ENTEGRASYONU VE TEST

Aşağıdaki kodu `lib/main.dart` dosyanıza yapıştırarak doğrudan simülatörde veya gerçek cihazda test edebilirsiniz:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/theme/app_colors.dart';
import 'features/onboarding/presentation/onboarding_view.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    const ProviderScope(
      child: VeiraApp(),
    ),
  );
}

class VeiraApp extends StatelessWidget {
  const VeiraApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Veira',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: AppColors.spaceDeepNavy,
        useMaterial3: true,
      ),
      home: const OnboardingView(),
      routes: {
        '/onboarding': (context) => const OnboardingView(),
        '/home': (context) => const Scaffold(
              backgroundColor: AppColors.spaceDeepNavy,
              body: Center(
                child: Text(
                  'Ana Sayfa (6.2 Adımında Kodlanacak ✨)',
                  style: TextStyle(color: AppColors.celestialGold, fontSize: 18),
                ),
              ),
            ),
      },
    );
  }
}
```
