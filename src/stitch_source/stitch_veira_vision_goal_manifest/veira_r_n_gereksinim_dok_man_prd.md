# VEIRA - ÜRÜN GEREKSİNİM DOKÜMANI (PRD)
**Sürüm:** 1.0 (MVP & Yol Haritası) | **Tarih:** 2025/2026
**Ürün:** Veira (Mindful Vision & Action Architecture)
**Rol:** Kıdemli Ürün Yöneticisi, Mobil Mimar & UI/UX Tasarımcısı

---

## 1. ÜRÜN TANIMI VE DEĞER ÖNERİSİ

* **Tek Cümlelik Tanım:** Veira; yeni yıl hedeflerini estetik bir vizyon panosuna (Vision Board), sakinleştirici ses manzaralarına (Manifest Modu) ve günlük 15 dakikalık mikro-eylemlere dönüştüren nöro-bilim destekli hibrit mobil uygulamadır.
* **Hedef Kitle:** 18-45 yaş, kişisel gelişim, niyet belirleme, estetik planlama, mindfulness ve hedef odaklı yaşam disiplinine ilgi duyan global ve Türkiye kullanıcıları.
* **Temel Döngü (Core Loop):**
  `HEDEF BELİRLE → VİZYONA DÖNÜŞTÜR → SÜRÜKLEYİCİ MANİFEST ET → GÜNLÜK MİKRO-ADIMI TAMAMLA → İLERLEMEYİ KUTLA`

---

## 2. KAPSAM STRATEJİSİ: MVP (v1.0) vs. v2.0 YOL HARİTASI

Kullanıcıyı boğmadan en yüksek değeri ilk günden sunmak ve App Store/Google Play lansmanını kusursuz yapmak adına özellikler iki faza ayrılmıştır:

| Özellik Grubu | MVP (v1.0) - Lansman Sürümü | v2.0 - Sonraki Sürüm | Neden Ayrıldı? (Gerekçe & Risk) |
| :--- | :--- | :--- | :--- |
| **Dil ve Yerelleştirme** | Tam TR ve EN desteği (i18n dosyaları, cihaz diline göre otomatik seçim, ayarlardan değişim). | Ek diller (DE, ES, FR, JP). | MVP'de çekirdek pazarlara (TR + Global İngilizce) odaklanma. |
| **Giriş ve Kimlik** | Misafir Modu (sıfır bariyer), Apple ile Giriş, Google ile Giriş, E-posta OTP / Sihirli Bağlantı. | Sosyal profil senkronizasyonu, çoklu cihaz aile paylaşımı. | Kullanıcı ilk değeri görmeden hesap zorunluluğu olmamalı. |
| **Hedef Modülü** | 9 Kategori (Kariyer, Finans, Sağlık, İlişkiler vb.), SMART analizi önerisi, bitiş tarihi, bağlı mikro-eylemler, ilerleme takibi. | Takvim entegrasyonu (Google Calendar / Apple Calendar sync). | Çekirdek hedef-eylem bağı MVP'de oturmalı; takvim API karmaşıklığı v2'ye bırakıldı. |
| **Vision Board** | Maksimum 12 görsel kuralı, 6 özel şablon (Grid, Polarid, Minimal, Dergi, Lüks Koyu, 3-Bölgeli), serbest katman/döndürme/ölçekleme, metin/afirmasyon, yerel cihaz içi arka plan silme, HD dışa aktarma (Duvar kağıdı ve 9:16). | **AI Gelecek Simülasyonu (Fotoğraftan AI görsel üretme):** Kullanıcı fotoğrafından 10 yıl sonraki halini çizen model. | **v2'ye bırakılma nedeni:** Yüksek GPU API maliyetleri ($0.04-$0.10/çağrı), yüz tanıma gizlilik riskleri ve halüsinasyon riski. |
| **Manifest Müzik & Modu** | 7 Kategori, 432Hz/528Hz tonlar, ortam sesleri (yağmur, okyanus, piyano), 2 kanallı ses mikseri, arka planda çalma, uyku sayacı, tam ekran akan afirmasyon modu. | Kullanıcının kendi sesini kaydedip binaural frekansla remikslemesi, topluluk meditasyonları. | Ses kayıt filtreleme ve miks motoru MVP'de ses gecikmesi/performans riski yaratabilir. |
| **Akıllı Bildirimler** | Yerel bildirim motoru (iOS 64 limitine uygun rolling scheduler), sessiz saatler, kişiselleştirilmiş 4 ton (Nazik, Sakin, Enerjik, Sert Koç), akşam check-in. | Sunucu taraflı anlık LLM bildirimleri (APNs/FCM worker). | Maliyet tasarrufu ve çevrimdışı çalışabilirlik için MVP'de yerel şablonlu AI motoru. |
| **Widget** | iOS & Android Kilit Ekranı ve Ana Ekran Widget'ı (Günün Afirmasyonu + Günün Tek Mikro-Adımı). | İnteraktif vision board animasyonlu widget'ı. | OS widget bellek limitleri (özellikle iOS 30MB sınırı) doğrultusunda MVP hafif tutulur. |
| **Monetizasyon** | RevenueCat entegrasyonu, 7 günlük ücretsiz deneme, Yıllık ($29.99) ve Aylık ($4.99), yerel şeffaf Paywall. | Hediye abonelik, ömür boyu (Lifetime) lisans seçeneği. | Dönüşüm hunisini (funnel) sade tutup ölçümlemek için. |

---

## 3. MoSCoW ÖNCELİKLENDİRME MATRİSİ

### MUST HAVE (Olmazsa Olmaz - MVP Başarısı İçin Zorunlu)
1. **Misafir Odaklı Onboarding:** Kullanıcı kayıt olmadan 3 dakika içinde ilk hedefini koyup vision board taslağını oluşturabilmeli.
2. **Vision-to-Action Köprüsü:** Panodaki herhangi bir görsele tıklandığında bağlı hedefin ve "Bugünkü 15 Dakikalık Mikro-Adım"ın açılması.
3. **Estetik Vision Board Motoru:** Mobil ekranda parmakla akıcı sürükle-bırak, pinch-to-zoom, katman sırası ve yüksek çözünürlüklü (duvar kağıdı oranında) filigransız kaydetme.
4. **Kesintisiz Arka Plan Müzik Çalar:** Kilit ekranında kapanmayan, uyku zamanlayıcılı, 432Hz/yağmur mikseri.
5. **Akıllı Yerel Bildirim Zamanlayıcı:** iOS'un 64 yerel bildirim sınırını aşmayan, uygulamaya her girişte önümüzdeki 7 günü yeniden planlayan algoritma.
6. **TR / EN Kusursuz i18n Altyapısı:** Tüm sistemin (metinler, tarih formatları, AI yönlendirmeleri) çift dilli çalışması.
7. **Apple & Google Uyumlu Şeffaf Paywall & Hesap Silme:** İptal şartları net, tek tıkla cihazdan ve buluttan tüm veriyi silme yeteneği.

### SHOULD HAVE (Yüksek Değerli - MVP'ye Dahil Edilecekler)
1. **Cihaz İçi Arka Plan Temizleme:** Kullanıcı fotoğraflarındaki kişiyi portre gibi kesip panoya sticker olarak yerleştirme (sunucuya göndermeden).
2. **Akşam Check-In Döngüsü:** "Bugün hedefin için 15 dakika ayırabildin mi?" (Evet / Hayır / Yarın Telafi Et).
3. **Streak & İlerleme Kutlaması:** Lottie tabanlı zarif altın parçacıklı kutlama mikro-etkileşimi.
4. **Ana Ekran Widget'ı:** Kilit ekranı ve ana ekranda panonun küçük bir parçası ve günün niyeti.

### COULD HAVE (Kaynak ve Zaman Kalırsa Eklenecekler)
1. **Dinamik Gün Işığı Teması:** Sabah şafak pembesi, gündüz altın sarısı, gece derin lacivert temaya otomatik geçiş.
2. **PDF Olarak Yazdırılabilir A4 Dışa Aktarma:** Fiziksel panosuna asmak isteyenler için yüksek DPI PDF render.

### WON'T HAVE (v1.0'da Kesinlikle Olmayacaklar)
1. Üçüncü taraf sunucuya yüz/biyometrik fotoğraf gönderen yapay zeka jeneratörleri.
2. Karmaşık sosyal ağ / arkadaş ekleme / beğeni mekanizmaları (uygulamanın mahrem ve içe dönük kalması için).
3. Web platformu (ilk fazda yalnızca yerel mobil deneyim).

---

## 4. KULLANICI YOLCULUKLARI VE DETAYLI AKIŞLAR (USER FLOWS)

```
[AÇILIŞ & DİL TESPİTİ]
         │
         ▼
[3 EKRANLI ONBOARDING (Vizyon & Yaşam Çarkı)] ──► [HEDEF YILI SEÇİMİ (2026/2027)]
         │
         ▼
[İLK HEDEFİNİ YAZ] ──► [AI SMART & MİKRO-ADIM ÖNERİSİ] ──► [FOTOĞRAF EKLE]
         │
         ▼
[OTOMATİK VİZYON PANOSU ÖNİZLEME (Şablon Seç)] ──► [DÜZENLEYİCİ (Estetik Dokunuşlar)]
         │
         ▼
[MANİFEST MODU DENEYİMİ (1 Dk Müzik + Görsel Akışı)] ──► [MİSAFİR OLARAK DEVAM / KAYIT]
         │
         ▼
[ANA SAYFA & GÜNLÜK DÖNGÜ (Widget + Bildirim İzni + Akşam Check-in)]
```

### Akış 1: İlk Kurulum ve "Aha! Moment" (İlk 3 Dakika)
1. Kullanıcı uygulamayı açar, cihaz diline göre TR veya EN karşılar.
2. "2027'de hayatının hangi alanında parlamak istiyorsun?" sorusuyla Yaşam Çarkı kategorileri seçilir.
3. Kullanıcı ilk büyük hedefini yazar (Örnek: "Kendi işimi kurup İtalya'ya taşınmak").
4. Sistem bunu SMART hale getirir: "3 Aylık Adım: Şirket modelini netleştir. Bugünkü Adım: 15 dakika pazar araştırması oku."
5. Kullanıcı galerisinden 1 fotoğraf ekler veya estetik öneri seçer.
6. 10 saniyelik 432Hz ambient müzik eşliğinde ilk mini vision board'u parlar. Kullanıcı uygulamanın ruhunu hisseder ("Aha! Moment").

### Akış 2: Günlük Mikro-Eylem Döngüsü (Daily Habit)
1. Sabah 08:30: Bildirim gelir ("Günün Niyeti: Selin, bugün sadece 15 dakika tasarım taslağına bak.").
2. Kullanıcı bildirime dokunur; doğrudan hedefin altındaki tek adımlı onay kutusuna (Check-in) gider.
3. Kullanıcı "Tamamladım" dediğinde zarif bir parıltı animasyonu oynar, streak 1 gün artar.

---

## 5. FONKSİYONEL OLMAYAN GEREKSİNİMLER (NFR)

1. **Performans:** Vision board düzenleyicisinde sürükleme ve zoom işlemleri 60 FPS'nin altına düşmemelidir.
2. **Çevrimdışı Çalışma (Offline-First):** İnternet bağlantısı kesildiğinde yerel SQLite/WatermelonDB/Hive veritabanı tam işlevsel kalmalı, indirilen müzikler çalmalı, bağlantı gelince arka planda senkronize olmalıdır.
3. **Pil ve Bellek Optimizasyonu:** Müzik çalar arka planda çalışırken CPU kullanımı %3'ün altında kalmalıdır.
4. **Gizlilik & Güvenlik:**
   * Kullanıcı fotoğrafları varsayılan olarak yalnızca cihazın yerel depolama alanında (`DocumentDirectory`) tutulur.
   * Bulut senkronizasyonu seçilirse görseller şifreli kullanıcı klasörüne (Row-Level Security) yüklenir.
   * Fotoğraflar hiçbir koşulda model eğitimi için kullanılmaz.

---

## 6. DOĞRULAMA VE DİKKAT EDİLECEK HUSUSLAR
1. **AI API Hacmi:** İlk onboarding sırasında OpenAI/Claude API çağrısı sunucu proxy'si (Edge Function) üzerinden yapılmalıdır. Maliyet kontrolü için hazır şablonlu kural motoru ile LLM hibrit kullanılacaktır (kullanıcı başına günlük max 5 dinamik AI isteği).
2. **Depolama Alanı:** Kullanıcının yüklediği yüksek çözünürlüklü fotoğraflar panoya eklenirken cihazda otomatik olarak 1080x1920 / 2K çözünürlüğe optimize edilerek sıkıştırılmalı; 50 MB'lık ham RAW fotoğraflar bellek çökmesine yol açmamalıdır.
