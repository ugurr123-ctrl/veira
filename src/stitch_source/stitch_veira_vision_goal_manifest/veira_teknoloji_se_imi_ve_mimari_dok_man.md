# VEIRA - TEKNOLOJİ SEÇİMİ, MİMARİ TASARIM VE VERİTABANI ŞEMASI
**Sürüm:** 1.0 (Teknik Mimar Dokümanı) | **Tarih:** 2025/2026
**Ürün:** Veira (Mindful Vision & Action Architecture)

---

## 1. TEKNOLOJİ SEÇİMİ VE GEREKÇELİ ANALİZ

Veira'nın başarısı üç kritik teknik ayağa dayanmaktadır:
1. Parmakla akıcı çalışan, çok katmanlı, 60 FPS çalışan ve yüksek çözünürlüklü dışa aktarma (render) yapabilen Vision Board Düzenleyicisi.
2. Arka planda ve kilit ekranında asla kesilmeyen, 2 kanallı ses mikseri (ambient + binaural sesler).
3. iOS (64 bildirim sınırı) ve Android için batarya tüketmeyen akıllı yerel bildirim döngüsü.

### A. Mobil Çerçeve Kıyaslaması: Flutter vs. React Native (Expo SDK 52+)

| Değerlendirme Kriteri | Flutter (Dart) | React Native + Expo (TypeScript) | Veira İçin Karar & Neden? |
| :--- | :--- | :--- | :--- |
| **Vision Board Düzenleyicisi (Canvas & 60 FPS)** | Skia/Impeller render motoru ile bağımsız C++ çizim katmanı. Parmak hareketleri, rotasyon, katman sırası ve `RepaintBoundary` ile 4K/duvar kağıdı kalitesinde piksel kaybı olmadan dışa aktarma çok kolay ve kararlıdır. | React Native Skia (`@shopify/react-native-skia`) veya `react-native-view-shot` gerektirir. Köprü (bridge/JSI) üzerinden seri dokunmatik jestler bazı orta segment Android cihazlarda mikro takılmalar yaratabilir. | **Flutter (1 Puan Önde):** Doğal 2D çizim motoru ve `CustomPainter` sayesinde vizyon panosu performansı kusursuzdur. |
| **Arka Planda Müzik & Ses Mikseri** | `just_audio` + `audio_service`. iOS AudioSession ve Android MediaPlayer/ExoPlayer entegrasyonu oturmuştur. Kilit ekranı kontrolleri, 2 kanal eşzamanlı miksaj (yağmur + piyano) sorunsuz çalışır. | `expo-audio` veya `react-native-track-player`. Son sürümlerde oldukça iyileşti ancak arka plan servis senkronizasyonu sürüm yükseltmelerinde kırılgan olabiliyor. | **Flutter (Eşit / Hafif Önde):** `audio_service` arka plan kararlılığında endüstri standardıdır. |
| **Widget (iOS Kilit Ekranı / Ana Ekran)** | `home_widget` paketi (Native Swift / Kotlin arayüzü gerektirir). | `expo-widgets` veya custom native modül. Her iki ekosistemde de widget için Swift/SwiftUI (iOS) ve Kotlin/Glance (Android) kodu yazılır. | **Berabere:** Widget mimarisi OS seviyesinde native yazılır. |
| **Geliştirme Hızı & Kodun Temizliği** | Tek dille (Dart) tip güvenliği, sıfır köprü bağımlılığı, hazır State Management (Riverpod / Bloc), deterministik derleme. | TypeScript yaygın, web geliştiricileri için tanıdık ancak paket sürüm uyumsuzlukları sık yaşanabilir. | **Flutter:** Proje mimarisinin deterministik kalması ve görsel tutarlılık için üstündür. |

> **NİHAİ SEÇİM: FLUTTER (Dart) + RIVERPOD STATE MANAGEMENT**
> **Gerekçe:** Veira standart bir form doldurma uygulaması değildir; Pinterest estetiğinde bir grafik motoru (Vision Board) ve Calm kalitesinde bir ses mimarisidir. Flutter'ın donanım hızlandırmalı Impeller motoru, panoda 12 görsel serbestçe dönerken dahi 60-120 FPS akıcılığı garanti eder.

---

### B. Backend ve Veritabanı Seçimi: Supabase vs. Firebase

| Kriter | Firebase (Google) | Supabase (PostgreSQL Tabanlı) | Veira İçin Karar & Neden? |
| :--- | :--- | :--- | :--- |
| **Veri Modeli & İlişkiler** | NoSQL (Firestore). Hedefler, mikro adımlar ve vizyon panosu öğeleri arasındaki ilişkileri kurmak için denormalizasyon gerekir. | İlişkisel PostgreSQL. Hedef → Mikro Görev → Board Görseli hiyerarşisi SQL ile son derece temiz ve atomik modellenir. | **Supabase (Açık Ara Önde)** |
| **Gizlilik & Veri İzolasyonu** | Karmaşık Firestore Security Rules. | **Row-Level Security (RLS):** Her kullanıcının verisi ve fotoğrafı yalnızca kendi `auth.uid()` belirteciyle şifreli olarak okunur. | **Supabase** |
| **Cihaz İçi & Çevrimdışı (Offline-First)** | Firestore yerel önbellek sunar ancak şema üzerinde katı SQL sorguları çalışmaz. | **PowerSync** veya yerel **Drift / Isar** yerel SQLite motoru + Supabase Sync ile %100 çevrimdışı çalışma ve senkronizasyon. | **Supabase** |
| **Maliyet ve Kilitleme (Vendor Lock-in)** | Okuma/yazma başına ücretlendirilir. Kullanıcı panosunu her açtığında 15 belge okuması faturalandırılır; sürpriz fatura riski vardır. | Açık kaynaklı PostgreSQL; sabit paket ($25/ay veya ücretsiz katman). Sürpriz fatura çıkarmaz. | **Supabase** |

> **NİHAİ SEÇİM: SUPABASE (PostgreSQL + Auth + Storage + Edge Functions)**
> **Gerekçe:** Güçlü RLS (satır güvenliği), temiz ilişkisel veri yapısı, Edge Functions (AI API proxy'si için) ve gizlilik odaklı mimarisiyle Veira'nın değer önerisiyle %100 uyumludur.

---

## 2. SİSTEM MİMARİSİ VE BİLEŞEN DİYAGRAMI

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       VEIRA FLUTTER MOBİL UYGULAMASI                    │
│                                                                         │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌─────────────┐  │
│  │ Vision Board Engine   │  │ Dual-Audio Engine     │  │ Local AI &  │  │
│  │ (CustomPainter/Canvas)│  │ (just_audio mikser)   │  │ Scheduler   │  │
│  └───────────┬───────────┘  └───────────┬───────────┘  └──────┬──────┘  │
│              │                          │                     │         │
│  ┌───────────▼──────────────────────────▼─────────────────────▼──────┐  │
│  │          RIVERPOD STATE MANAGEMENT & OFFLINE CACHE (Hive/Drift)   │  │
│  └──────────────────────────────────┬────────────────────────────────┘  │
└─────────────────────────────────────┼───────────────────────────────────┘
                                      │ (HTTPS / WSS / JWT)
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           SUPABASE CLOUD                                │
│                                                                         │
│  ┌───────────────────┐  ┌──────────────────────┐  ┌──────────────────┐  │
│  │ Supabase Auth     │  │ PostgreSQL DB (RLS)  │  │ Encrypted Bucket │  │
│  │ (Apple/Google/OTP)│  │ (Goals, Steps, Boards│  │ (User Photos)    │  │
│  └───────────────────┘  └──────────────────────┘  └──────────────────┘  │
│                                     ▲                                   │
│                                     │                                   │
│  ┌──────────────────────────────────┴────────────────────────────────┐  │
│  │ SUPABASE EDGE FUNCTIONS (Deno / TypeScript API Gateway)            │  │
│  │  - OpenAI / Claude Proxy (API Key koruması)                        │  │
│  │  - Rate Limiting (Kullanıcı başına günlük 5 dinamik AI isteği)    │  │
│  │  - Input Sanitization & Maskeleme (Kişisel veriyi filtreleme)      │  │
│  └──────────────────────────────────┬────────────────────────────────┘  │
└─────────────────────────────────────┼───────────────────────────────────┘
                                      ▼
             ┌────────────────────────────────────────────────┐
             │ AI SAĞLAYICISI (OpenAI GPT-4o-mini / Claude)   │
             │ Hedef Analizi, SMART Öneri & Mikro-Adım Üretici│
             └────────────────────────────────────────────────┘
```

---

## 3. VERİTABANI ŞEMASI (POSTGRESQL & SUPABASE SQL)

Tüm tablolarda **Row-Level Security (RLS)** aktiftir; hiçbir kullanıcı diğerinin hedefini veya fotoğrafını okuyamaz.

```sql
-- 1. PROFİLLER TABLOSU (Kullanıcı tercihleri, dil ve bildirim ayarları)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    preferred_language VARCHAR(5) DEFAULT 'tr', -- 'tr' veya 'en'
    target_year INT NOT NULL DEFAULT 2026,
    notification_frequency INT DEFAULT 3, -- Günde kaç bildirim
    quiet_hours_start TIME DEFAULT '23:00',
    quiet_hours_end TIME DEFAULT '07:00',
    motivation_tone VARCHAR(20) DEFAULT 'gentle', -- 'gentle', 'calm', 'energetic', 'tough_love'
    streak_count INT DEFAULT 0,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HEDEFLER TABLOSU (SMART Hedefler)
CREATE TABLE public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category VARCHAR(30) NOT NULL, -- 'career', 'finance', 'health', 'relationships', 'growth', 'travel', etc.
    title TEXT NOT NULL,
    emotional_why TEXT, -- "Neden önemli?" duygusal motivatör
    target_date DATE,
    priority INT DEFAULT 1, -- 1: Yüksek, 2: Orta, 3: Düşük
    progress_percentage INT DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    is_completed BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MİKRO EYLEMLER TABLOSU (Günlük 15 Dakikalık Adımlar - Visus Köprüsü)
CREATE TABLE public.micro_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action_text TEXT NOT NULL,
    estimated_minutes INT DEFAULT 15,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    scheduled_for_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. VISION BOARD TABLOSU
CREATE TABLE public.vision_boards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    year INT NOT NULL,
    title TEXT NOT NULL DEFAULT '2026 Vizyonum',
    template_type VARCHAR(30) DEFAULT 'magazine', -- 'grid', 'polaroid', 'minimal', 'magazine', 'luxury_dark', 'tri_zone'
    aspect_ratio VARCHAR(20) DEFAULT '9:16', -- 'wallpaper', '9:16', '1:1', '4:3'
    background_color VARCHAR(10) DEFAULT '#0B0D1B',
    background_texture_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BOARD ÖĞELERİ TABLOSU (Maksimum 12 Görsel Kuralı)
CREATE TABLE public.board_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID NOT NULL REFERENCES public.vision_boards(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL, -- Tıklanınca açılacak hedef
    image_storage_path TEXT NOT NULL, -- Cihaz yerel dosya yolu veya Supabase Storage path
    pos_x FLOAT NOT NULL DEFAULT 0.0,
    pos_y FLOAT NOT NULL DEFAULT 0.0,
    scale FLOAT NOT NULL DEFAULT 1.0,
    rotation FLOAT NOT NULL DEFAULT 0.0,
    layer_order INT NOT NULL DEFAULT 0,
    affirmation_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- GÜVENLİK (ROW-LEVEL SECURITY AKTİVASYONU)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.micro_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vision_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_items ENABLE ROW LEVEL SECURITY;

-- Kullanıcı sadece kendi verisini yönetebilir
CREATE POLICY "Users can only manage their own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can only manage their own goals" ON public.goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only manage their own actions" ON public.micro_actions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only manage their own boards" ON public.vision_boards FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only manage their own board items" ON public.board_items 
    FOR ALL USING (board_id IN (SELECT id FROM public.vision_boards WHERE user_id = auth.uid()));
```

---

## 4. AKILLI BİLDİRİM VE MOTİVASYON MİMARİSİ (iOS 64 KISITI ÇÖZÜMÜ)

### iOS 64 Bildirim Limiti Problemi
* Apple, bir iOS uygulamasının işletim sistemine aynı anda en fazla **64 yerel bildirim** kaydetmesine izin verir.
* Günde 5 bildirim alan bir kullanıcı, 13 gün sonra hiçbir bildirim alamaz hale gelir.

### Veira "Rolling 7-Day Window" Algoritması:
1. **Yerel Şablonlu AI Motoru:** Sunucuya her bildirim için gitmek yerine, kullanıcının seçtiği tona (Nazik, Sakin, Enerjik, Sert Koç) ve hedeflerine göre 30 adet dinamik kalıp cihazda önceden birleştirilir:
   * *Örnek Kalıp:* `"{isim}, {hedef_yili} yılındaki {hedef_basligi} hedefin seni bekliyor. Bugün sadece {mikro_adim_sure} dakikanı ayır."`
2. **Kayan Pencere (Rolling Scheduler):**
   * Kullanıcı uygulamayı her açtığında sistem önceden kalan bildirimleri siler.
   * Yalnızca **önümüzdeki 7 günün** bildirimlerini planlar (Günde 3 bildirim * 7 gün = 21 bildirim; 64 sınırının çok altında, güvenli bölge).
3. **Arka Plan Görevi (Background Fetch / Workmanager):**
   * Kullanıcı uygulamayı birkaç gün açmasa dahi OS Background Task tetiklenerek sessizce sonraki 7 günü yeniden doldurur.
4. **Sessiz Saatler Filtresi:** Kullanıcının seçtiği aralıkta (ör. 23:00 - 07:00) asla bildirim tetiklenmez.

---

## 5. MALİYET VE AI RATE-LIMITING HESABI (1.000 AKTİF KULLANICI İÇİN)

* **Model Tercihi:** GPT-4o-mini veya Claude 3.5 Haiku (Yüksek mantık yürütme, çok düşük token maliyeti).
* **Ortalama Çağrı:** 
  * Giriş: ~250 token (Kullanıcının yazdığı hedef + sistem rolü + kategori kuralları).
  * Çıkış: ~150 token (SMART hedef, 3 aylık kilometre taşı, 15 dakikalık tek mikro-adım).
  * Toplam: 400 token/çağrı (~$0.0001 per call).
* **Kullanım Senaryosu (1.000 Aktif Kullanıcı / Ay):**
  * Kullanıcı başına ayda ortalama 6 yeni hedef veya SMART revizyonu = 6.000 çağrı/ay.
  * Aylık Tahmini LLM Maliyeti: **6.000 * $0.0001 = ~$0.60 - $1.50 / Ay** (İhmal edilebilir düzeyde ekonomik).
* **Supabase Maliyeti:** Ücretsiz Başlangıç Katmanı (İlk 50.000 aylık aktif kullanıcıya kadar veritabanı ve auth ücretsiz; Pro plana geçilirse sabit $25/ay).
* **Toplam 1.000 Kullanıcı Altyapı Maliyeti:** **~$0 - $25 / Ay**.