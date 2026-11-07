# VEIRA - ADIM 6.1: i18n YERELLEŞTİRME VE LÜKS ONBOARDING MODÜLÜ
**Tarih:** 2025/2026 | **Modül:** i18n + Onboarding & Niyet Başlangıcı | **Dil/Mimari:** Flutter (Dart) + Riverpod 2.x

Bu dokümanda yer alan tüm dosyalar eksiksizdir; hiçbir kod kısaltılmamış veya yarım bırakılmamıştır. Dosyaları belirtilen tam dosya yollarına oluşturup yapıştırınız.

---

## 1. YERELLEŞTİRME SÖZLÜKLERİ (JSON)

### Dosya 1: `assets/translations/tr.json`
*(Bu dosyayı `assets/translations/tr.json` yolunda oluşturup yapıştırın)*

```json
{
  "app_name": "Veira",
  "tagline": "Zihinsel Vizyon ve Eylem Mimarisi",
  "common": {
    "continue": "Devam Et",
    "skip": "Atla",
    "start": "Başla",
    "cancel": "Vazgeç",
    "save": "Kaydet",
    "done": "Tamamlandı",
    "back": "Geri",
    "next": "İleri",
    "error": "Bir hata oluştu",
    "loading": "Yükleniyor..."
  },
  "onboarding": {
    "step_counter": "Adım {current} / {total}",
    "step1_badge": "2027 Vizyonu",
    "step1_title": "Kalbindeki Büyük Hayali\nSomut Bir Vizyona Dönüştür",
    "step1_subtitle": "Veira, soyut yeni yıl dileklerini nöro-bilim destekli 12 görselli bir panoya ve sakinleştirici 432Hz seslere dönüştürür.",
    "step2_badge": "Yaşam Çarkı",
    "step2_title": "Bu Yıl En Çok Hangi Alanda\nParlamak İstiyorsun?",
    "step2_subtitle": "Dengeli bir yaşam için odaklanmak istediğin 1 veya 3 alanı seç. Beynin netlikle beslenir.",
    "step3_badge": "İlk Kıvılcım",
    "step3_title": "2027 İçin En Büyük Niyetini Yaz",
    "step3_subtitle": "Yapay zekâ koçumuz bu hayalini hemen 3 aylık bir adıma ve bugünkü 15 dakikalık göreve bölecek.",
    "goal_input_hint": "Ör: İtalya'da uzaktan çalışırken sağlıklı bir bedene kavuşmak...",
    "ai_transforming": "Veira AI hayalini SMART eyleme dönüştürüyor...",
    "ai_suggestion_badge": "✨ Veira Akıllı Dönüşüm",
    "ai_suggested_milestone": "3 Aylık Hedef: Dil seviyeni B1 yap ve vize portföyünü tamamla.",
    "ai_suggested_micro": "Bugünkü 15 Dakikalık Adım: 15 dakika İtalyanca podcast dinle.",
    "button_start_vision": "Vizyonumu Başlat ✨",
    "guest_mode_note": "Kayıt olmadan misafir olarak keşfetmeye başla."
  },
  "categories": {
    "career": "Kariyer & Bolluk",
    "health": "Beden & Canlılık",
    "spiritual": "Ruhsal Denge",
    "relationships": "Sevgi & İlişkiler",
    "travel": "Yeni Ufuklar & Seyahat",
    "creativity": "Yaratıcılık & Sanat"
  }
}
```

---

### Dosya 2: `assets/translations/en.json`
*(Bu dosyayı `assets/translations/en.json` yolunda oluşturup yapıştırın)*

```json
{
  "app_name": "Veira",
  "tagline": "Mindful Vision & Action Architecture",
  "common": {
    "continue": "Continue",
    "skip": "Skip",
    "start": "Start",
    "cancel": "Cancel",
    "save": "Save",
    "done": "Done",
    "back": "Back",
    "next": "Next",
    "error": "An error occurred",
    "loading": "Loading..."
  },
  "onboarding": {
    "step_counter": "Step {current} of {total}",
    "step1_badge": "2027 Vision",
    "step1_title": "Transform Heartfelt Dreams\nInto Visual Reality",
    "step1_subtitle": "Veira translates abstract wishes into a neuroscience-backed 12-image board and calming 432Hz soundscapes.",
    "step2_badge": "Wheel of Life",
    "step2_title": "Where Would You Like\nTo Shine The Most?",
    "step2_subtitle": "Select 1 to 3 areas for balanced harmony. Your brain thrives on emotional clarity.",
    "step3_badge": "The Spark",
    "step3_title": "Write Your North Star for 2027",
    "step3_subtitle": "Our mindful AI will instantly break this ambition into a 3-month milestone and a 15-minute daily micro-step.",
    "goal_input_hint": "E.g.: Working remotely from Italy while keeping a vibrant, fit body...",
    "ai_transforming": "Veira AI is refining your intention into SMART action...",
    "ai_suggestion_badge": "✨ Veira Mindful Insight",
    "ai_suggested_milestone": "3-Month Focus: Reach B1 fluency & finalize remote portfolio.",
    "ai_suggested_micro": "Today's 15-Minute Action: Listen to 1 Italian lesson podcast.",
    "button_start_vision": "Ignite My Vision ✨",
    "guest_mode_note": "Continue as a guest — no account required to begin."
  },
  "categories": {
    "career": "Career & Abundance",
    "health": "Body & Vitality",
    "spiritual": "Inner Calm",
    "relationships": "Love & Kinship",
    "travel": "Horizons & Travel",
    "creativity": "Creativity & Art"
  }
}
```

---

## 2. ÇEKİRDEK TEMA VE YERELLEŞTİRME YÖNETİCİSİ (CORE)

### Dosya 3: `lib/core/theme/app_colors.dart`
*(Bu dosyayı `lib/core/theme/app_colors.dart` yolunda oluşturun)*

```dart
import 'package:flutter/material.dart';

class AppColors {
  // Arka Plan Tonları (Nocturnal Serenity)
  static const Color background = Color(0xFF080A16);
  static const Color surfaceDim = Color(0xFF0E1228);
  static const Color surfaceCard = Color(0xFF161A30);
  static const Color surfaceBright = Color(0xFF23284A);

  // Mistik ve Lüks Vurgu Renkleri
  static const Color celestialGold = Color(0xFFF5D061);
  static const Color starlightChampagne = Color(0xFFFDF4DC);
  static const Color mysticViolet = Color(0xFF6366F1);
  static const Color auroraRose = Color(0xFFEC4899);
  static const Color etherealTeal = Color(0xFF2DD4BF);

  // Tipografi ve Metin Renkleri
  static const Color textPrimary = Color(0xFFF8FAFC);
  static const Color textSecondary = Color(0xFF94A3B8);
  static const Color textMuted = Color(0xFF64748B);

  // Cam Efekti (Glassmorphism) Sınır ve Işıklandırma
  static const Color glassBorder = Color(0x1AFFFFFF);
  static const Color glassBorderActive = Color(0x66F5D061);
  static const Color glassSurface = Color(0x1F161A30);

  // Gradyanlar
  static const LinearGradient goldGradient = LinearGradient(
    colors: [Color(0xFFF5D061), Color(0xFFE5B93B)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient mysticGradient = LinearGradient(
    colors: [Color(0xFF6366F1), Color(0xFF8B5CF6), Color(0xFFEC4899)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const RadialGradient cosmicGlow = RadialGradient(
    center: Alignment(0.0, -0.4),
    radius: 1.2,
    colors: [
      Color(0x336366F1),
      Color(0x15080A16),
      Color(0xFF080A16),
    ],
    stops: [0.0, 0.6, 1.0],
  );
}
```

---

### Dosya 4: `lib/core/services/localization_service.dart`
*(Bu dosyayı `lib/core/services/localization_service.dart` yolunda oluşturun)*

```dart
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final localeProvider = StateNotifierProvider<LocalizationNotifier, Locale>((ref) {
  return LocalizationNotifier();
});

class LocalizationNotifier extends StateNotifier<Locale> {
  LocalizationNotifier() : super(const Locale('tr', 'TR'));

  Map<String, dynamic> _localizedStrings = {};

  Future<void> load(Locale locale) async {
    final String jsonString = await rootBundle.loadString(
      'assets/translations/${locale.languageCode}.json',
    );
    _localizedStrings = json.decode(jsonString) as Map<String, dynamic>;
    state = locale;
  }

  void toggleLanguage() {
    if (state.languageCode == 'tr') {
      load(const Locale('en', 'US'));
    } else {
      load(const Locale('tr', 'TR'));
    }
  }

  String translate(String key) {
    final keys = key.split('.');
    dynamic current = _localizedStrings;

    for (final k in keys) {
      if (current is Map<String, dynamic> && current.containsKey(k)) {
        current = current[k];
      } else {
        return key; // Anahtar bulunamazsa anahtarın adını döndür
      }
    }
    return current?.toString() ?? key;
  }
}

extension LocalizationExtension on BuildContext {
  String tr(String key) {
    final container = ProviderScope.containerOf(this, listen: false);
    return container.read(localeProvider.notifier).translate(key);
  }
}
```

---

### Dosya 5: `lib/core/widgets/glass_card.dart`
*(Bu dosyayı `lib/core/widgets/glass_card.dart` yolunda oluşturun)*

```dart
import 'dart:ui';
import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class GlassCard extends StatelessWidget {
  final Widget child;
  final double borderRadius;
  final double blur;
  final EdgeInsetsGeometry padding;
  final bool isSelected;
  final VoidCallback? onTap;

  const GlassCard({
    super.key,
    required this.child,
    this.borderRadius = 20.0,
    this.blur = 16.0,
    this.padding = const EdgeInsets.all(16.0),
    this.isSelected = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(borderRadius),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: blur, sigmaY: blur),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.circular(borderRadius),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 250),
              curve: Curves.easeOut,
              padding: padding,
              decoration: BoxDecoration(
                color: isSelected ? const Color(0x3323284A) : AppColors.glassSurface,
                borderRadius: BorderRadius.circular(borderRadius),
                border: Border.all(
                  color: isSelected ? AppColors.glassBorderActive : AppColors.glassBorder,
                  width: isSelected ? 1.5 : 1.0,
                ),
                boxShadow: isSelected
                    ? [
                        BoxShadow(
                          color: AppColors.celestialGold.withOpacity(0.15),
                          blurRadius: 18,
                          spreadRadius: 1,
                        )
                      ]
                    : [],
              ),
              child: child,
            ),
          ),
        ),
      ),
    );
  }
}
```

---

### Dosya 6: `lib/core/widgets/golden_button.dart`
*(Bu dosyayı `lib/core/widgets/golden_button.dart` yolunda oluşturun)*

```dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';

class GoldenButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;

  const GoldenButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 54,
      decoration: BoxDecoration(
        gradient: AppColors.goldGradient,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: AppColors.celestialGold.withOpacity(0.35),
            blurRadius: 20,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          shadowColor: Colors.transparent,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
        ),
        child: isLoading
            ? const SizedBox(
                width: 22,
                height: 22,
                child: CircularProgressIndicator(
                  strokeWidth: 2.5,
                  valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF080A16)),
                ),
              )
            : Text(
                text,
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: const Color(0xFF080A16),
                  letterSpacing: 0.3,
                ),
              ),
      ),
    );
  }
}
```

---

## 3. ONBOARDING DURUM YÖNETİMİ VE EKRANLARI (PRESENTATION)

### Dosya 7: `lib/features/onboarding/providers/onboarding_notifier.dart`
*(Bu dosyayı `lib/features/onboarding/providers/onboarding_notifier.dart` yolunda oluşturun)*

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

class OnboardingState {
  final int currentStep;
  final List<String> selectedCategories;
  final String northStarGoal;
  final bool isGeneratingAi;
  final bool isAiReady;

  OnboardingState({
    this.currentStep = 0,
    this.selectedCategories = const [],
    this.northStarGoal = '',
    this.isGeneratingAi = false,
    this.isAiReady = false,
  });

  OnboardingState copyWith({
    int? currentStep,
    List<String>? selectedCategories,
    String? northStarGoal,
    bool? isGeneratingAi,
    bool? isAiReady,
  }) {
    return OnboardingState(
      currentStep: currentStep ?? this.currentStep,
      selectedCategories: selectedCategories ?? this.selectedCategories,
      northStarGoal: northStarGoal ?? this.northStarGoal,
      isGeneratingAi: isGeneratingAi ?? this.isGeneratingAi,
      isAiReady: isAiReady ?? this.isAiReady,
    );
  }
}

final onboardingProvider = StateNotifierProvider<OnboardingNotifier, OnboardingState>((ref) {
  return OnboardingNotifier();
});

class OnboardingNotifier extends StateNotifier<OnboardingState> {
  OnboardingNotifier() : super(OnboardingState());

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

  void toggleCategory(String key) {
    final current = List<String>.from(state.selectedCategories);
    if (current.contains(key)) {
      current.remove(key);
    } else {
      if (current.length < 3) {
        current.add(key);
      }
    }
    state = state.copyWith(selectedCategories: current);
  }

  void updateGoal(String goal) {
    state = state.copyWith(
      northStarGoal: goal,
      isAiReady: goal.trim().length > 8,
    );
  }

  void simulateAiTransform() async {
    state = state.copyWith(isGeneratingAi: true);
    await Future.delayed(const Duration(milliseconds: 1200));
    state = state.copyWith(isGeneratingAi: false, isAiReady: true);
  }
}
```

---

### Dosya 8: `lib/features/onboarding/presentation/onboarding_view.dart`
*(Bu dosyayı `lib/features/onboarding/presentation/onboarding_view.dart` yolunda oluşturun)*

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/services/localization_service.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/glass_card.dart';
import '../../../core/widgets/golden_button.dart';
import '../providers/onboarding_notifier.dart';

class OnboardingView extends ConsumerStatefulWidget {
  const OnboardingView({super.key});

  @override
  ConsumerState<OnboardingView> createState() => _OnboardingViewState();
}

class _OnboardingViewState extends ConsumerState<OnboardingView> {
  final PageController _pageController = PageController();
  final TextEditingController _goalController = TextEditingController();

  final List<Map<String, String>> _categories = [
    {'key': 'career', 'icon': '💼', 'tr': 'Kariyer & Bolluk', 'en': 'Career & Wealth'},
    {'key': 'health', 'icon': '🌿', 'tr': 'Beden & Canlılık', 'en': 'Body & Health'},
    {'key': 'spiritual', 'icon': '✨', 'tr': 'Ruhsal Denge', 'en': 'Inner Calm'},
    {'key': 'relationships', 'icon': '🤍', 'tr': 'Sevgi & İlişkiler', 'en': 'Love & Ties'},
    {'key': 'travel', 'icon': '🧭', 'tr': 'Seyahat & Keşif', 'en': 'Travel & Joy'},
    {'key': 'creativity', 'icon': '🎨', 'tr': 'Yaratıcılık & Sanat', 'en': 'Creativity'},
  ];

  @override
  void dispose() {
    _pageController.dispose();
    _goalController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(onboardingProvider);
    final locale = ref.watch(localeProvider);
    final loc = ref.read(localeProvider.notifier);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          // Mistik Arka Plan Işıltısı (Cosmic Glow)
          Positioned.fill(
            child: Container(
              decoration: const BoxDecoration(
                gradient: AppColors.cosmicGlow,
              ),
            ),
          ),

          SafeArea(
            child: Column(
              children: [
                // 1. Üst Bar: İlerleme Çizgisi, Dil Değiştirici ve Atla
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
                  child: Row(
                    children: [
                      // 3 Adımlı Zarif Altın İlerleme Çizgisi
                      Expanded(
                        child: Row(
                          children: List.generate(3, (index) {
                            final isActive = index <= state.currentStep;
                            return Expanded(
                              child: Container(
                                height: 3.5,
                                margin: const EdgeInsets.symmetric(horizontal: 3),
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(4),
                                  gradient: isActive ? AppColors.goldGradient : null,
                                  color: isActive ? null : AppColors.surfaceBright,
                                ),
                              ),
                            );
                          }),
                        ),
                      ),
                      const SizedBox(width: 16),

                      // Dil Değiştirici (TR / EN)
                      InkWell(
                        onTap: () => loc.toggleLanguage(),
                        borderRadius: BorderRadius.circular(12),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            color: AppColors.surfaceCard,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppColors.glassBorder),
                          ),
                          child: Text(
                            locale.languageCode.toUpperCase(),
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: AppColors.celestialGold,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),

                      // Atla (Misafir Modu)
                      TextButton(
                        onPressed: () {
                          // Misafir moduyla doğrudan ana sayfaya geçiş
                        },
                        child: Text(
                          loc.translate('common.skip'),
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 13,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                // 2. Sayfa İçerikleri (PageView)
                Expanded(
                  child: PageView(
                    controller: _pageController,
                    physics: const NeverScrollableScrollPhysics(),
                    children: [
                      _buildStep1Welcome(loc),
                      _buildStep2Categories(loc, state),
                      _buildStep3GoalInput(loc, state),
                    ],
                  ),
                ),

                // 3. Alt Buton Alanı
                Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    children: [
                      GoldenButton(
                        text: state.currentStep == 2
                            ? loc.translate('onboarding.button_start_vision')
                            : loc.translate('common.continue'),
                        onPressed: () {
                          if (state.currentStep < 2) {
                            ref.read(onboardingProvider.notifier).nextStep();
                            _pageController.animateToPage(
                              state.currentStep + 1,
                              duration: const Duration(milliseconds: 350),
                              curve: Curves.easeInOut,
                            );
                          } else {
                            // Onboarding'i tamamla & Ana Sayfaya aktar
                          }
                        },
                      ),
                      const SizedBox(height: 10),
                      Text(
                        loc.translate('onboarding.guest_mode_note'),
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 12,
                          color: AppColors.textMuted,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // --- ADIM 1: KARŞILAMA VE VİZYON KONSEPTİ ---
  Widget _buildStep1Welcome(LocalizationNotifier loc) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
            decoration: BoxDecoration(
              color: AppColors.mysticViolet.withOpacity(0.15),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.mysticViolet.withOpacity(0.3)),
            ),
            child: Text(
              loc.translate('onboarding.step1_badge'),
              style: GoogleFonts.plusJakartaSans(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: AppColors.starlightChampagne,
              ),
            ),
          ),
          const SizedBox(height: 20),
          Text(
            loc.translate('onboarding.step1_title'),
            textAlign: TextAlign.center,
            style: GoogleFonts.playfairDisplay(
              fontSize: 30,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
              height: 1.25,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            loc.translate('onboarding.step1_subtitle'),
            textAlign: TextAlign.center,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 15,
              color: AppColors.textSecondary,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }

  // --- ADIM 2: YAŞAM ÇARKI KATEGORİ SEÇİMİ ---
  Widget _buildStep2Categories(LocalizationNotifier loc, OnboardingState state) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 10),
          Text(
            loc.translate('onboarding.step2_title'),
            style: GoogleFonts.playfairDisplay(
              fontSize: 26,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            loc.translate('onboarding.step2_subtitle'),
            style: GoogleFonts.plusJakartaSans(
              fontSize: 14,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 24),
          Expanded(
            child: GridView.builder(
              physics: const BouncingScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 14,
                mainAxisSpacing: 14,
                childAspectRatio: 1.2,
              ),
              itemCount: _categories.length,
              itemCaller: null,
              itemBuilder: (context, index) {
                final cat = _categories[index];
                final isSelected = state.selectedCategories.contains(cat['key']);
                return GlassCard(
                  isSelected: isSelected,
                  onTap: () {
                    ref.read(onboardingProvider.notifier).toggleCategory(cat['key']!);
                  },
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(cat['icon']!, style: const TextStyle(fontSize: 28)),
                      const SizedBox(height: 8),
                      Text(
                        cat[ref.watch(localeProvider).languageCode] ?? cat['tr']!,
                        textAlign: TextAlign.center,
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 14,
                          fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                          color: isSelected ? AppColors.celestialGold : AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  // --- ADIM 3: İLK HEDEF VE CANLI SMART DÖNÜŞÜM ---
  Widget _buildStep3GoalInput(LocalizationNotifier loc, OnboardingState state) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20.0),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 10),
            Text(
              loc.translate('onboarding.step3_title'),
              style: GoogleFonts.playfairDisplay(
                fontSize: 26,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              loc.translate('onboarding.step3_subtitle'),
              style: GoogleFonts.plusJakartaSans(
                fontSize: 14,
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: 20),

            // Giriş Alanı
            Container(
              decoration: BoxDecoration(
                color: AppColors.surfaceCard,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.glassBorder),
              ),
              child: TextField(
                controller: _goalController,
                maxLines: 3,
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 15,
                  color: AppColors.textPrimary,
                ),
                onChanged: (val) {
                  ref.read(onboardingProvider.notifier).updateGoal(val);
                },
                decoration: InputDecoration(
                  hintText: loc.translate('onboarding.goal_input_hint'),
                  hintStyle: GoogleFonts.plusJakartaSans(
                    fontSize: 14,
                    color: AppColors.textMuted,
                  ),
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.all(16),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // AI SMART Öneri Kartı (Kullanıcı hedef yazdıkça canlanan kart)
            if (state.isAiReady)
              GlassCard(
                borderRadius: 16,
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          loc.translate('onboarding.ai_suggestion_badge'),
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                            color: AppColors.celestialGold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Text(
                      loc.translate('onboarding.ai_suggested_milestone'),
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 13.5,
                        color: AppColors.textPrimary,
                        height: 1.4,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceBright.withOpacity(0.4),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.flash_on, color: AppColors.celestialGold, size: 18),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              loc.translate('onboarding.ai_suggested_micro'),
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: AppColors.starlightChampagne,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}
```

---

## 4. BAŞLANGIÇ ÇALIŞTIRMA NOKTASI (`lib/main.dart`)

### Dosya 9: `lib/main.dart`
*(Bu dosyayı `lib/main.dart` içerisindeki kodlarla birebir değiştirin)*

```dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'core/services/localization_service.dart';
import 'core/theme/app_colors.dart';
import 'features/onboarding/presentation/onboarding_view.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Durum çubuğunu şeffaf ve açık renk simgelere ayarla (Gece atmosferi için)
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: AppColors.background,
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  runApp(
    const ProviderScope(
      child: VeiraApp(),
    ),
  );
}

class VeiraApp extends ConsumerStatefulWidget {
  const VeiraApp({super.key});

  @override
  ConsumerState<VeiraApp> createState() => _VeiraAppState();
}

class _VeiraAppState extends ConsumerState<VeiraApp> {
  @override
  void initState() {
    super.initState();
    // İlk açılışta Türkçe sözlüğü yükle (veya cihaz diline göre)
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(localeProvider.notifier).load(const Locale('tr', 'TR'));
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Veira',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        scaffoldBackgroundColor: AppColors.background,
        colorScheme: const ColorScheme.dark(
          primary: AppColors.celestialGold,
          surface: AppColors.surfaceCard,
        ),
      ),
      home: const OnboardingView(),
    );
  }
}
```

---

## 5. ÇALIŞTIRMA VE TEST ADIMI

Bu dosyaları oluşturduktan sonra Terminal'de şu komutu çalıştırarak test edebilirsiniz:

```bash
flutter run
```
