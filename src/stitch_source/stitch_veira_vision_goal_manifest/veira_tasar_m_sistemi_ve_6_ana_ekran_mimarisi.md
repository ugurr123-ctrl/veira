# VEIRA - TASARIM SİSTEMİ, GÖRSEL KİMLİK VE 6 ANA EKRAN MİMARİSİ
**Sürüm:** 1.0 (UI/UX Tasarım Şartnamesi) | **Tarih:** 2025/2026
**Ürün:** Veira (Mindful Vision & Action Architecture)
**Tasarım Dili:** Mistik Lüks, Sakin Gece Atmosferi (Nocturnal Serenity), Cam Efekti (Glassmorphism)

---

## 1. GÖRSEL KİMLİK VE TASARIM PRENSİPLERİ

Veira, standart bir görev takip aracı veya sıradan bir kolaj uygulaması değildir. **Calm ve Headspace'in ruhani dinlendiriciliğini**, **Pinterest'in yüksek görsel estetiğini** ve **Finch'in motive edici samimiyetini** lüks bir gece atmosferinde birleştirir.

### A. Renk Paleti (Hex Kodları ve Kullanım Alanları)

| Token Adı | Hex Değeri | Rolü ve Psikolojik Etkisi |
| :--- | :--- | :--- |
| **Space Deep Navy** (Arka Plan) | `#080A16` | Ana ekran arka planı; sonsuz uzay ve gece gökyüzü hissi. |
| **Nocturne Indigo** (Kart & Cam Zemin) | `#111633` | Glassmorphic kart arka planları (15-40% saydamlık + 20px blur ile). |
| **Celestial Gold** (Vurgu & Aksiyon) | `#F5D061` | Birincil butonlar, streak alevleri, tamamlanan hedefler, yıldız efektleri. |
| **Starlight Champagne** (İkincil Altın) | `#FDF4DC` | Özel başlıklar, afirmasyon ışıltıları, ödül rozetleri. |
| **Mystic Violet** (Yaratıcılık & Ruhsallık) | `#6366F1` | Kategori çipleri, müzik frekans halkaları, aktif tab vurgusu. |
| **Aurora Rose** (Şafak Pembesi Vurgusu) | `#EC4899` | "İlişkiler" ve "Sevgi" kategorisi, kalp mikro etkileşimleri. |
| **Ethereal Teal** (Şifa & Zihin Vurgusu) | `#2DD4BF` | "Sağlık" ve "Mindfulness" kategorisi, tamamlandı tikleri. |
| **Pure Moon White** (Birincil Metin) | `#F8FAFC` | Başlıklar ve okunması zorunlu ana metinler (100% opaklık). |
| **Stardust Muted** (İkincil Metin) | `#94A3B8` | Alt yazılar, 15 dakikalık süre etiketleri, tarih sayaçları. |
| **Glass Border** (Cam Kenarlık) | `rgba(255, 255, 255, 0.08)` | 1px kalınlığında, kartların derinlik kazanmasını sağlayan ışık kırılması. |

---

### B. Tipografi Sistemi (Türkçe Karakter Desteği Doğrulanmış)

1. **Başlık Fontu: Playfair Display / Cormorant Garamond**
   * *Nitelik:* Zarif, editoryal, lüks dergi kapağı hissi.
   * *Türkçe Karakter Kontrolü:* `ğ, ü, ş, ı, ö, ç, İ` karakterleri Google Fonts üzerinde eksiksiz ve orantılıdır.
   * *Hiyerarşi:*
     * H1 (Günün Niyeti / Yıl Vizyonu): 28px - Bold (Cavitational Gold veya Beyaz)
     * H2 (Kart Başlıkları & Kategoriler): 20px - SemiBold
     * H3 (Alt Bölüm Başlıkları): 16px - Medium

2. **Gövde Fontu: Plus Jakarta Sans / Inter**
   * *Nitelik:* Geometrik, ultra okunaklı, ekran boyutuna göre nefes alan aralıklar.
   * *Hiyerarşi:*
     * Body Large (Mikro-Eylem Metni): 15px - Regular / line-height: 22px
     * Body Medium (Hedef Açıklamaları): 14px - Regular / line-height: 20px
     * Caption / Tag (Süre, Kategori, Sayaç): 12px - Medium / letter-spacing: 0.5px

---

## 2. DETAYLI WIREFRAME VE 6 ANA EKRAN DÜZENİ

Her ekran; mobil cihaz oranında (390x844 / iPhone 15 & modern Android standardı), mistik lüks gece atmosferinde ve cam efekti katmanlarıyla tasarlanmıştır.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           VEIRA 6 ÇEKİRDEK EKRAN ŞEMASI                         │
│                                                                                 │
│  [1. ONBOARDING & VİZYON]  [2. ANA SAYFA (DÖNGÜ)]    [3. HEDEF VE EYLEM DETAYI] │
│  - Yıl & Yaşam Çarkı Seçimi- Günün Niyeti & Streak    - SMART Hedef & Neden     │
│  - İlk Hedef & SMART Öneri - 15 Dk Tek Mikro-Adım     - 15 Dk Günlük Adım Check │
│  - 3 Dakikalık Hızlı Değer - 3 Halkalı İlerleme      - Bağlı Vision Board Resmi │
│                                                                                 │
│  [4. VİZYON PANOSU EDİTÖRÜ][5. MANİFEST MODU PLAYER]  [6. ŞEFFAF PAYWALL & AYAR]│
│  - 12 Görsel Kuralı        - 432Hz Yağmur/Piyano Mikser- 7 Günlük Deneme        │
│  - Çok Katmanlı Canvas     - Akan Afirmasyonlar       - Net İptal & Veri Silme  │
│  - Polaroid/Dergi Şablonu  - Tam Ekran Nefes Animasyon- Apple/Google Uyumu      │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

### EKRAN 1: İLHAM VERİCİ ONBOARDING & İLK HEDEF (The "Aha!" Moment)
* **Amaç:** Kullanıcıyı kayıt formuyla boğmadan ilk 3 dakikada vizyonunu hissettirmek.
* **Üst Bölüm:** İlerleme çizgisi (3 adımlı zarif altın çizgi) + Dil Değiştirici (TR/EN) + "Atla" (Misafir modu).
* **Başlık Alanı:** `Playfair Display` serif fontla *"2027 Yılında En Çok Hangi Alanda Parlamak İstiyorsun?"*
* **Orta Alan (Yaşam Çarkı Çipleri):** Mistik cam efektli 6 kategori kartı (Kariyer & Bolluk, Beden & Sağlık, Ruhsal Denge, Aşk & İlişkiler, Yeni Ufuklar/Seyahat, Yaratıcılık). Seçilen kart altın ışıltıyla aydınlanır.
* **İlk Hedef Giriş Kutusu:** *"Kalbinden geçen büyük hedefi yaz..."* (Örnek: "Bali'de uzaktan çalışırken sağlıklı ve dingin bir bedene sahip olmak").
* **AI SMART Canlı Dönüşüm Kartı:** Kullanıcı yazdıkça kartın altında beliren yumuşak mor ışıltılı kutu:
  * *Veira AI Önerisi:* "Hedefin SMART hale getirildi: 3 Ayda 5 kg ver ve haftada 3 gün yoga yap. Bugünkü 15 dakikalık ilk adım: 15 dakika yoga matını hazırla."
* **Alt Buton:** Altın gradyan parlamalı *"Vizyonumu Başlat"* butonu.

---

### EKRAN 2: ANA SAYFA (Günlük Eylem & Niyet Döngüsü - Dashboard)
* **Amaç:** Günün her anında huzur veren, karmaşadan uzak, tek eyleme odaklayan ana merkez.
* **Üst Bar:** Selamlama ("İyi akşamlar, Selin ✨"), Günlük Seri ("🔥 14 Gün Streak") ve Profil/Ayarlar ikonu.
* **Hero Kart (Günün Niyeti & Afirmasyonu):**
  * Zengin cam dokusu (Glassmorphism), arka planda yavaşça dönen aurora gradyanı.
  * İtalik serif fontla: *"Bugün attığım her küçük adım, 2027 vizyonumun bir parçası."*
  * Dinle butonu (432Hz sesli afirmasyon başlatıcı).
* **Günün Tek Eylemi (Visus-Action Köprüsü):**
  * Öne çıkan büyük kart: Solunda ilgili vizyon görselinin minyatür kırpıntısı, sağında eylem metni:
  * *"Hedef: İtalya'ya Taşınma | Bugünkü 15 Dakika: 1 İtalyanca podcast dinle."*
  * Sağda tek dokunuşluk altın onay halkası (Check-in). Tıklanınca parçacık kutlaması patlar.
* **Yaşam Çarkı İlerleme Halkaları:** 3 iç içe geçmiş neon çember (Kariyer %75, Sağlık %40, Ruhsal %90).
* **Hızlı Erişim Barı:** [Vizyon Panom (12 Görsel)] - [Manifest Müzik Çalar] - [Yeni Hedef Ekle].

---

### EKRAN 3: HEDEF DETAYI VE MİKRO-EYLEM PLANI (Vision-to-Action)
* **Amaç:** Soyut hayalleri 3 aylık kilometre taşlarına ve 15 dakikalık görevlere bölen şeffaf görünüm.
* **Üst Görsel:** Kullanıcının bu hedefe bağladığı estetik vizyon panosu fotoğrafı (ör. Como Gölü kıyısında çalışma alanı). Fotoğraf üzerinde "Neden Önemli?" etiketi.
* **Duygusal Motivatör Kartı:** *"Neden Yapıyorum? → Aileme özgür bir yaşam sunmak ve yaratıcılığımı tam kapasite kullanmak için."*
* **SMART Analiz & Metrik Göstergesi:** İlerleme çubuğu (%45), Kalan Gün (142 Gün), Öncelik Derecesi: Yüksek (Altın Yıldız).
* **3 Aylık Kilometre Taşları (Milestones):**
  * Q1: Vize evraklarını tamamla (Tamamlandı ✔)
  * Q2: Şirket kurulumunu yap (Devam ediyor ⏳)
  * Q3: Ev kirala ve uçak biletini al (Planlandı)
* **Bugünün 15 Dakikalık Mikro-Adımı:** Tek bir odak görevi + Yapay zeka ile "Adımı küçült" butonu (kullanıcı üşenirse adımı 5 dakikaya indirir).

---

### EKRAN 4: VİZYON PANOSU DÜZENLEYİCİSİ (Pinterest / Canva Estetiğinde)
* **Amaç:** 60 FPS hızında çalışan, 12 görsel kuralına dayalı, parmak jestleriyle yönetilen lüks pano editörü.
* **Canvas Alanı (Telefon Duvar Kağıdı Oranı 9:16):**
  * Gece mavisi arka plan üzerinde 12 adet serbestçe konumlandırılmış polaroid ve dergi kupürü.
  * Fotoğrafların köşelerinde zarif altın pinler ve bant efektleri.
  * Merkezde: 1 Numaralı Ana Yaşam Hedefi (En büyük görsel).
* **Katman & Düzenleme Araç Çubuğu:**
  * [Fotoğraf Ekle (+)] [Şablonlar (Dergi, Lüks Koyu, Polaroid)] [Arka Plan Temizle (Cihaz İçi)] [Metin/Afirmasyon] [Katman Sırası].
* **Kritik Kural Uyarısı:** Görsel sayısı 11/12 olduğunda zarifçe parlayan sayaç: *"Odak sınırındasın: Beynin en net 12 niyetle çalışır."*
* **Dışa Aktarma Butonu:** "Filigransız HD Duvar Kağıdı İndir" ve "Kilit Ekranı Olarak Ayarla".

---

### EKRAN 5: SÜRÜKLEYİCİ MANİFEST MODU & MÜZİK MİKSERİ (Calm Seviyesi)
* **Amaç:** Kullanıcıyı derin bir görselleştirme ve meditasyon transına sokan ses/görüntü deneyimi.
* **Tam Ekran Görsel Akışı:** Kullanıcının panosundaki 12 görsel, hafif bir zoom ve nefes alma (Ken Burns efekti) ile ekranda yavaşça kayar.
* **Ses Manzarası Mikseri (Çift Kanallı):**
  * Kanal 1 (Frekans & Melodi): 432 Hz Mucize Tonu veya Derin Piyano Ambient (Ses: %80).
  * Kanal 2 (Doğa Efekti): Gece Yağmuru veya Orman Rüzgarı (Ses: %40).
* **Ses Dalgası Görselleştirmesi:** Ekranın alt kısmında müziğin ritmine göre dalgalanan altın ve mor ışık dalgası (Waveform visualizer).
* **Akan Afirmasyonlar:** Görsellerin altında yumuşakça belirip kaybolan kişiselleştirilmiş motivasyon metinleri.
* **Zamanlayıcı:** 15 Dk Odaklanma / 30 Dk Uyku Zamanlayıcısı (Süre bitince ses yavaşça kısılarak kapanır - fade out).

---

### EKRAN 6: ŞEFFAF VE GÜVEN VEREN PAYWALL (Anti-Dark Pattern)
* **Amaç:** App Store şikayetlerini sıfırlayan, kullanıcının güvenle 7 günlük denemeyi başlatacağı şeffaf ekran.
* **Başlık:** *"Veira Premium: Hayallerini Günlük Disipline Dönüştür."*
* **Şeffaf Zaman Çizelgesi (Timeline of Trust):**
  * **Bugün:** Anında tüm şablonlara, sınırsız 432Hz müziklere ve AI koçuna erişim. (Ücret: 0 TL).
  * **5. Gün:** Bildirimle hatırlatma: "Deneme süreniz 2 gün sonra bitiyor, dilediğiniz an tek tıkla iptal edebilirsiniz."
  * **7. Gün:** Yıllık plan başlar ($29.99 / 499 TL).
* **Öne Çıkan Özellikler:**
  * ✨ 12 Görselli Sınırsız HD Duvar Kağıdı Dışa Aktarma (Filigransız)
  * 🎵 Çevrimdışı Kesintisiz Manifest Müzik Mikseri & Kilit Ekranı Çaları
  * 🧠 AI Destekli SMART Hedef Analizi ve Kişiselleştirilmiş Bildirimler
  * 🔒 %100 Cihaz İçi Gizlilik (Fotoğraflarınız sunucuya gitmez)
* **Butonlar:** [7 Günlük Ücretsiz Denemeyi Başlat] ve altında [Aboneliği Geri Yükle] - [Kullanım Koşulları & Gizlilik].
