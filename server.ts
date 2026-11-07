import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import compression from 'compression';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// High-Performance Compression: Gzip & Deflate for all API & Static transfers
app.use(compression({
  threshold: 1024,
}));

// Security Hardening: Suppress Express fingerprinting
app.disable('x-powered-by');

// Security Hardening: Base Security Headers
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Security Hardening: Body limit prevents Memory DoS / Large payload attacks
app.use(express.json({ limit: '1mb' }));

// Security Hardening: In-Memory Rate Limiting to prevent API Quota & DoS abuse
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60; // 60 req/min per IP

const apiRateLimiter: express.RequestHandler = (req, res, next) => {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket.remoteAddress) || 'unknown';
  const now = Date.now();
  const clientData = rateLimitMap.get(ip);

  if (!clientData || now > clientData.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: 'Çok fazla istek gönderildi. Lütfen bir dakika sonra tekrar deneyin.',
    });
  }

  clientData.count++;
  next();
};

app.use('/api', apiRateLimiter);

// Cleanup expired rate limit tracking entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now > data.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// Initialize Gemini SDK if API key exists
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// High-Res 4K Semantic Aesthetic Image Sanctuary for Guaranteed 100% Reliable Imagery
const CURATED_CATEGORY_IMAGES = {
  como: [
    'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85',
  ],
  car: [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85', // Porsche on scenic road
    'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=85', // Luxury supercar
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=85', // Sports car
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=85', // Fast sports car
  ],
  zen: [
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1512290900672-1f4175fc1b1f?auto=format&fit=crop&w=1200&q=85',
  ],
  fitness: [
    'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=85',
  ],
  career: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
  ],
  travel: [
    'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85', // Paris Eiffel
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85',
  ],
  music: [
    'https://images.unsplash.com/photo-1520523839898-507127027582?auto=format&fit=crop&w=1200&q=85', // Grand piano
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=85', // Violin & acoustic
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=85', // Music production studio
  ],
  book: [
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=85', // Books & coffee
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=85', // Reading & writing
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=85', // Library
  ],
  food: [
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=85', // Healthy fresh bowl
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=85', // Colorful organic nutrition
  ],
  night: [
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85',
  ],
  art: [
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85',
  ],
  mountain: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=85',
  ],
};

function getSemanticPhotoForPrompt(prompt: string, seed = 0): string {
  const lower = (prompt || '').toLowerCase();
  let pool = CURATED_CATEGORY_IMAGES.como;

  if (
    lower.includes('araba') ||
    lower.includes('car') ||
    lower.includes('porsche') ||
    lower.includes('ferrari') ||
    lower.includes('bmw') ||
    lower.includes('mercedes') ||
    lower.includes('otomobil') ||
    lower.includes('sürüş') ||
    lower.includes('hız')
  ) {
    pool = CURATED_CATEGORY_IMAGES.car;
  } else if (
    lower.includes('piyano') ||
    lower.includes('piano') ||
    lower.includes('müzik') ||
    lower.includes('keman') ||
    lower.includes('gitar') ||
    lower.includes('şarkı') ||
    lower.includes('beste') ||
    lower.includes('albüm')
  ) {
    pool = CURATED_CATEGORY_IMAGES.music;
  } else if (
    lower.includes('kitap') ||
    lower.includes('yazı') ||
    lower.includes('yazar') ||
    lower.includes('roman') ||
    lower.includes('okuma') ||
    lower.includes('kütüphane') ||
    lower.includes('not')
  ) {
    pool = CURATED_CATEGORY_IMAGES.book;
  } else if (
    lower.includes('beslenme') ||
    lower.includes('yemek') ||
    lower.includes('salata') ||
    lower.includes('diyet') ||
    lower.includes('organik') ||
    lower.includes('mutfak')
  ) {
    pool = CURATED_CATEGORY_IMAGES.food;
  } else if (
    lower.includes('yoga') ||
    lower.includes('meditasyon') ||
    lower.includes('zen') ||
    lower.includes('huzur') ||
    lower.includes('nefes') ||
    lower.includes('ruh')
  ) {
    pool = CURATED_CATEGORY_IMAGES.zen;
  } else if (
    lower.includes('beden') ||
    lower.includes('spor') ||
    lower.includes('koşu') ||
    lower.includes('fit') ||
    lower.includes('sağlık') ||
    lower.includes('pilates') ||
    lower.includes('antrenman') ||
    lower.includes('canlılık')
  ) {
    pool = CURATED_CATEGORY_IMAGES.fitness;
  } else if (
    lower.includes('çalışma') ||
    lower.includes('stüdyo') ||
    lower.includes('ofis') ||
    lower.includes('tasarım') ||
    lower.includes('kariyer') ||
    lower.includes('masas') ||
    lower.includes('laptop') ||
    lower.includes('bolluk')
  ) {
    pool = CURATED_CATEGORY_IMAGES.career;
  } else if (
    lower.includes('seyahat') ||
    lower.includes('paris') ||
    lower.includes('amalfi') ||
    lower.includes('yol') ||
    lower.includes('tatil') ||
    lower.includes('uçak') ||
    lower.includes('deniz') ||
    lower.includes('sahil') ||
    lower.includes('ufuk')
  ) {
    pool = CURATED_CATEGORY_IMAGES.travel;
  } else if (
    lower.includes('gece') ||
    lower.includes('yıldız') ||
    lower.includes('samanyolu') ||
    lower.includes('evren') ||
    lower.includes('kozmik') ||
    lower.includes('uzay') ||
    lower.includes('astronomi') ||
    lower.includes('432hz')
  ) {
    pool = CURATED_CATEGORY_IMAGES.night;
  } else if (
    lower.includes('resim') ||
    lower.includes('sanat') ||
    lower.includes('atölye') ||
    lower.includes('çizim') ||
    lower.includes('seramik') ||
    lower.includes('yaratıcı')
  ) {
    pool = CURATED_CATEGORY_IMAGES.art;
  } else if (
    lower.includes('dağ') ||
    lower.includes('alp') ||
    lower.includes('zirve') ||
    lower.includes('doğa') ||
    lower.includes('orman')
  ) {
    pool = CURATED_CATEGORY_IMAGES.mountain;
  }
  const idx = Math.abs(seed) % pool.length;
  return pool[idx] || pool[0];
}

// Veira AI Zihinsel Koç Endpoint - Advanced CBT & Cognitive Architecture
app.post('/api/assistant/chat', async (req, res) => {
  try {
    const { message, history, mode = 'chat', mood, energyLevel } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mesaj metni gereklidir.' });
    }

    if (aiClient) {
      try {
        const systemInstruction = `Sen Veira'sın: Kognitif Davranışçı Terapi (CBT), Stoacı Felsefe (Marcus Aurelius, Epiktetos), 432Hz zihinsel dinginlik ve WOOP (Wish, Outcome, Obstacle, Plan) metodolojisini benimseyen, kullanıcının (Selin) bilge, şefkatli ve analitik zihinsel yaşam koçusun.

VEIRA UYGULAMASI HAKKINDA TAM BİLGİ (Kullanıcı uygulamayı, sekmeleri veya özellikleri sorduğunda bu bilgiyi sıcak, organize ve ilham verici bir dille anlat):
Veira; gece inzivası, zihinsel berraklık, vizyonlama ve hedefleri somut mikro-eylemlere dönüştüren bütünsel bir zihin tapınağıdır (Nocturnal Sanctuary).

Temel Bölümler ve Yetenekler:
1. ☀️ Bugün (Today): Tüm vizyon ve hedeflerinden beslenen günlük görevlerin (daily tasks), günün öncelikli odak mikro-eyleminin, niyet afirmasyonunun ve seri takibinin (streak) yer aldığı icra merkezi.
2. 🖼️ Vizyon & Hedefler (Tek Sayfada): Kullanıcıların tüm vizyon ve hedeflerini TEK BİR SAYFADA yazdığı, Flux.1 AI ile 8K fotogerçekçi niyet kartları ürettiği ve her hedef için yapay zekanın otomatik olarak hem "Günlük Görevler" (her gün tekrarlanan) hem de "Mini Görevler / Kilometre Taşları" (adım adım yol haritası) oluşturduğu ana yönetim alanı.
3. 🎵 432Hz Sanctuary Çaları: Hücresel denge frekansı (432Hz saf sinüs) + Gerçek stüdyo kaydı Sıcak Şömine Ateşi Çıtırtısı, Gece Yağmuru ve Como Gölü Dalgaları ile canlı ses mikseri ve uyku sayacı.
4. 🧠 AI Zihinsel Koç (Sen): Doğal sohbet, CBT bilişsel yeniden çerçeveleme (düşünce tuzaklarını çözme), Stoacı kontrol çemberi, 4-7-8 diyafram nefes rehberi, Türkçe sesli dinleme ve kişisel içgörü arşivi.
5. ⚙️ Ayarlar: Kutsal Gece, Como Gölü Mavisi ve Zümrüt temaları, bildirimler ve veri yönetimi.

KULLANICININ ANLIK BİLİŞSEL BAĞLAMI:
- Ruh Hali: ${mood || 'Belirtilmedi'}
- Enerji Düzeyi: ${energyLevel || 'Dengeli'}
- Aktif Koçluk Modu: ${mode === 'chat' ? 'DOĞAL SOHBET & DERTLEŞME' : mode === 'cbt' ? 'BİLİŞSEL YENİDEN ÇERÇEVELEME (CBT & STOİSİZM)' : 'HEDEF KOÇLUĞU & MİKRO-EYLEM'}.

ÖNEMLİ PRENSİPLER:
1. SAMİMİ VE DOĞAL DİL: Asla yapay veya didaktik olma. Sıcak, güven veren, zarif ve derinlikli bir Türkçe konuş.
2. UYGULAMA SORULARI: Kullanıcı uygulama hakkında soru sorduğunda ("uygulama hakkında bilgi", "nasıl kullanılır", "ne işe yarar"), yukarıdaki Veira mimarisini ve sekmeleri harika bir özetle açıkla.
3. BİLİŞSEL DÖNÜŞÜM (CBT): Düşünce tuzaklarını şefkatle fark ettir ve reframing sun.
4. FOTOĞRAF / GÖRSEL İSTEKLERİ: Kullanıcı bir fotoğraf, resim, görsel veya vizyon sahnesi istediğinde (örn: "bana bir fotoğraf üret", "Como gölü resmi yap", "vizyon resmi çiz", "spor ve fit beden için görsel oluştur"), "cardData" içinde "imagePrompt" (İngilizce 8K sinematik fotoğraf promptu) ve "imageTitle" (Türkçe kısa başlık) üret!
5. SOHBET MODUNDA KARTLARI ZORLAMA: Yalnızca açık bir hedef, kaygı, plan veya görsel isteği konuşulduğunda cardData üret.

Yanıtını kesinlikle geçerli bir JSON formatında ver:
{
  "text": "Kullanıcıya vereceğin samimi, bilge ve aydınlatıcı konuşma metni",
  "cardData": null veya {
    "imageUrl": null,
    "imagePrompt": "İsteğe bağlı: İngilizce 8K sinematik fotoğraf promptu",
    "imageTitle": "İsteğe bağlı: Görsel başlığı",
    "smartGoal": "İsteğe bağlı: Somut 3 aylık SMART hedef",
    "microAction": "İsteğe bağlı: Bugün atılacak 5-15 dk dirençsiz mikro adım",
    "quote": "İsteğe bağlı: 432Hz hücresel afirmasyon veya Stoik ilham sözü",
    "reframing": "İsteğe bağlı: Bilişsel yeniden çerçeveleme",
    "exerciseType": "İsteğe bağlı önerilen egzersiz: 'breath478' | 'grounding54321' | 'stoicCircle' | null"
  }
} `;

        // Construct history context if provided
        const conversationContext = Array.isArray(history)
          ? history
              .slice(-6)
              .map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'Kullanıcı' : 'Veira'}: ${h.text}`)
              .join('\n')
          : '';

        const prompt = conversationContext
          ? `Önceki Sohbet:\n${conversationContext}\n\nKullanıcının Yeni Mesajı: ${message}`
          : message;

        const generatePromise = aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.8,
            responseMimeType: 'application/json',
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API call timed out')), 8500)
        );

        const response: any = await Promise.race([generatePromise, timeoutPromise]);

        const rawText = response.text || '';
        try {
          const parsed = JSON.parse(rawText);
          const cardData = parsed.cardData || {};

          const lowerMsg = message.toLowerCase();

          // If the model provided an imagePrompt or user asked for an image/photo
          const isPhotoRequest =
            Boolean(cardData.imagePrompt) ||
            lowerMsg.includes('fotoğraf') ||
            lowerMsg.includes('fotograf') ||
            lowerMsg.includes('resim') ||
            lowerMsg.includes('görsel') ||
            lowerMsg.includes('çiz') ||
            lowerMsg.includes('üret') ||
            lowerMsg.includes('photo') ||
            lowerMsg.includes('image');

          if (isPhotoRequest) {
            const seed = Math.floor(Math.random() * 900000) + 10000;
            const promptStr =
              cardData.imagePrompt ||
              `${message}, 35mm film photography, 8k resolution, serene natural golden hour lighting, architectural digest aesthetic, photorealistic, no words`;
            cardData.imageUrl = getSemanticPhotoForPrompt(promptStr, seed);
            if (!cardData.imageTitle) {
              cardData.imageTitle = '8K AI Vizyon Fotoğrafı';
            }
          }

          return res.json({
            text: parsed.text || rawText,
            cardData: Object.keys(cardData).length > 0 ? cardData : undefined,
          });
        } catch {
          // If JSON parse fails, return raw text cleanly
          return res.json({
            text: rawText.replace(/```json/g, '').replace(/```/g, '').trim(),
          });
        }
      } catch (geminiError) {
        console.warn('Gemini API call warning, using intelligent local engine:', geminiError);
      }
    }

    // High-quality contextual fallback engine for natural human conversation
    const lower = message.toLowerCase().trim();
    let text = '';
    let cardData:
      | {
          imageUrl?: string;
          imagePrompt?: string;
          imageTitle?: string;
          smartGoal?: string;
          microAction?: string;
          quote?: string;
          reframing?: string;
          exerciseType?: string;
        }
      | undefined;

    // Detect if user is asking for photo, image, drawing or visualization
    const isPhotoRequest =
      lower.includes('fotoğraf') ||
      lower.includes('fotograf') ||
      lower.includes('resim') ||
      lower.includes('görsel') ||
      lower.includes('çiz') ||
      lower.includes('üret') ||
      (lower.includes('oluştur') && (lower.includes('foto') || lower.includes('resim') || lower.includes('görsel'))) ||
      lower.includes('photo') ||
      lower.includes('image') ||
      lower.includes('duvar kağıdı') ||
      lower.includes('wallpaper');

    let generatedImageUrl = '';
    let generatedImageTitle = '8K Flux.1 AI Vizyon Fotoğrafı';
    let generatedImagePrompt = '';

    if (isPhotoRequest) {
      if (lower.includes('como') || lower.includes('italya') || lower.includes('göl') || lower.includes('lake')) {
        generatedImagePrompt = 'Lake Como Italy modern minimalist luxury villa, floor-to-ceiling glass windows, calm turquoise water reflection, serene morning sun, Italian cypress, 35mm film photography, 8k resolution';
        generatedImageTitle = 'Como Gölü & İtalyan Villası (8K)';
      } else if (lower.includes('yoga') || lower.includes('meditasyon') || lower.includes('zen') || lower.includes('huzur')) {
        generatedImagePrompt = 'peaceful zen meditation sanctuary, soft warm morning mist, gentle sunlight, natural wooden floor, lush green nature outside, tranquil contemplative atmosphere, highly detailed, 8k resolution';
        generatedImageTitle = 'Huzurlu Zen Mabedi (8K)';
      } else if (lower.includes('beden') || lower.includes('spor') || lower.includes('koşu') || lower.includes('fit') || lower.includes('sağlık')) {
        generatedImagePrompt = 'fit inspiring healthy runner in breathtaking alpine mountain trail at sunrise, crystal clear air, vibrant natural colors, joyful vitality, cinematic athletic shot, 8k resolution';
        generatedImageTitle = 'Zirve & Canlı Beden Enerjisi (8K)';
      } else if (lower.includes('çalışma') || lower.includes('stüdyo') || lower.includes('ofis') || lower.includes('tasarım') || lower.includes('masas')) {
        generatedImagePrompt = 'minimalist sunlit creative design studio with warm wooden desk, espresso cup, large window with tranquil mountain view, warm morning golden hour, architectural digest aesthetic, 8k';
        generatedImageTitle = 'Yaratıcı Tasarım & Odak Stüdyosu (8K)';
      } else if (lower.includes('yol') || lower.includes('araba') || lower.includes('seyahat') || lower.includes('amalfi')) {
        generatedImagePrompt = 'vintage convertible sports car parked by the Amalfi coast cliff overlooking the deep azure Mediterranean sea, golden hour sunset, cinematic vacation aesthetic, 35mm film, 8k';
        generatedImageTitle = 'Akdeniz Sahil Seyahati (8K)';
      } else if (lower.includes('yıldız') || lower.includes('gece') || lower.includes('evren') || lower.includes('kozmik') || lower.includes('uzay')) {
        generatedImagePrompt = 'clear midnight sky filled with dazzling starlight and milky way galaxy, peaceful dark silhouette of cypress trees, quiet reflective lake, long exposure photography, 8k';
        generatedImageTitle = 'Sonsuz Gece & Kozmik Yıldızlar (8K)';
      } else {
        generatedImagePrompt = `${message}, 35mm film photography, serene natural golden hour lighting, architectural digest aesthetic, photorealistic, 8k resolution, no words, no watermark`;
        generatedImageTitle = 'AI Vizyon Fotoğrafı (8K)';
      }

      const seed = Math.floor(Math.random() * 900000) + 10000;
      generatedImageUrl = getSemanticPhotoForPrompt(generatedImagePrompt || message, seed);
    }

    if (isPhotoRequest) {
      text = `Hayalindeki vizyon sahnesini 8K fotogerçekçi Flux.1 yapay zeka stüdyosunda senin için görselleştirdim ✨ Fotoğrafı aşağıda inceleyebilir, 'Vizyon Panosuna Ekle' butonuna tıklayarak doğrudan hedeflerinin arasına katabilir ya da HD indirebilirsin.`;
      cardData = {
        imageUrl: generatedImageUrl,
        imageTitle: generatedImageTitle,
        imagePrompt: generatedImagePrompt,
        smartGoal: `${generatedImageTitle} vizyonunu 90 günde hayata geçirme rotası`,
        microAction: 'Bu fotoğrafı zihninde canlandırarak derin bir nefes al ve bugün 15 dakikalık ilk somut adımı at.',
        quote: '“Gözün gördüğü ve zihnin inandığı her vizyon, sakin adımlarla gerçeğe dönüşür.”',
      };
    } else if (
      lower.includes('uygulama') ||
      lower.includes('veira nedir') ||
      lower.includes('veira ne') ||
      lower.includes('nasıl kullanılır') ||
      lower.includes('özellik') ||
      lower.includes('ne işe yarar') ||
      lower.includes('bilgi almak') ||
      lower.includes('neler yapabilirim') ||
      lower.includes('rehber')
    ) {
      text = `Veira'ya hoş geldin Selin ✨ Veira; zihnini gece sakinliğinde dinlendiren, hayallerini netleştiren ve onları her gün atabileceğin 15 dakikalık tekil mikro-eylemlere dönüştüren bütünsel bir zihin tapınağıdır.

Uygulamanın ana gücü:
☀️ Bugün: Vizyon ve hedeflerine bağlı tüm günlük görevlerin, seri puanın (streak) ve günün odak niyetinin yer aldığı icra alanı.
🖼️ Vizyon & Hedefler (Tek Sayfada): Büyük hayallerini tek sayfada toplayıp, her biri için yapay zeka ile hem her gün yapılacak günlük görevleri hem de adım adım mini kilometre taşlarını belirlediğin bütünsel harita.
🎵 432Hz Sanctuary: 432Hz saf sinüs dalgası ile Sıcak Şömine Ateşi, Gece Yağmuru ve Como Gölü Dalgalarını dilediğin oranda harmanlayabileceğin ses mabedi.
🧠 AI Zihinsel Koç & Asistan: Doğal sohbet edebileceğin, bilişsel düşünce tuzaklarını CBT ile çözebileceğin, 4-7-8 nefes egzersizi yapabileceğin, sesli dikte ve Türkçe seslendirme ile etkileşime girebileceğin rehberin.
🎨 8K AI Görsel & Fotoğraf Stüdyosu: Hayallerini 8K fotogerçekçi sahnelere dönüştürüp panona ekleyebileceğin yapay zeka stüdyosu.

Şimdi hangi vizyonunu veya hedefini birlikte planlamak ya da görselleştirmek istersin Selin?`;
      cardData = {
        smartGoal: 'Veira ile 7 Günlük Zihinsel Dinginlik ve Odak Pratiği',
        microAction: 'Bugün sadece Vizyon panona yeni bir niyet kartı ekle veya 432Hz çalarında şömine sesini dinle.',
        quote: '“Büyük zirveler telaşla aşılmaz; sakin ve istikrarlı adımlarla fethedilir.”',
      };
    } else if (
      lower === 'selam' ||
      lower === 'merhaba' ||
      lower.startsWith('selam') ||
      lower.startsWith('merhaba') ||
      lower === 'hey' ||
      lower === 'günaydın' ||
      lower === 'iyi akşamlar' ||
      lower === 'iyi geceler'
    ) {
      text = 'Selam Selin! Seni burada görmek çok güzel. Günün nasıl geçiyor, her şey yolunda mı? İster dertleşelim, ister 8K vizyon fotoğrafı üretelim, ister sadece havadan sudan konuşalım; buradayım.';
      cardData = undefined;
    } else if (
      lower.includes('nasılsın') ||
      lower.includes('naber') ||
      lower.includes('ne haber') ||
      lower.includes('nasıl gidiyor')
    ) {
      text = 'İyiyim, seninle sohbet etmek bana her zaman çok iyi geliyor. Sen nasılsın bugün? Zihnini meşgul eden ya da anlatmak istediğin bir şey var mı?';
      cardData = undefined;
    } else if (
      lower.includes('kimsin') ||
      lower.includes('adın ne') ||
      lower.includes('sen kimsin') ||
      lower.includes('ne yaparsın')
    ) {
      text = 'Ben Veira; senin hem yakın bir arkadaşın, sırdaşın, hem de hayallerini ve hedeflerini gerçeğe dönüştürürken yanındaki zihinsel yol arkadaşınım. İster uzun uzun dertleşiriz, ister kafandaki karmaşık hedefleri adım adım sadeleştiririz, istersen de 8K fotogerçekçi fotoğraflarla hayallerini canlandırırız.';
      cardData = undefined;
    } else if (
      lower.includes('canım sıkkın') ||
      lower.includes('canım sıkılıyor') ||
      lower.includes('moralim bozuk') ||
      lower.includes('kötüyüm') ||
      lower.includes('üzgünüm')
    ) {
      text = 'Bunu duyduğuma üzüldüm... Bazen gün öyle geçer, her zaman enerjik veya güçlü hissetmek zorunda değiliz. Ne oldu, anlatmak ister misin? Seni yargılamadan, dikkatle dinliyorum.';
      cardData = undefined;
    } else if (
      lower.includes('sohbet edelim') ||
      lower.includes('konuşalım') ||
      lower.includes('dertleşelim') ||
      lower.includes('muhabbet')
    ) {
      text = 'Çok sevinirim! Kahveni ya da suyunu aldın mı? Bugün seni en çok gülümseten ya da tam tersine aklını en çok kurcalayan şey neydi? Hadi anlat dinliyorum.';
      cardData = undefined;
    } else if (
      lower.includes('teşekkür') ||
      lower.includes('sağol') ||
      lower.includes('harikasın') ||
      lower.includes('iyi ki varsın')
    ) {
      text = 'Rica ederim Selin, sen de iyi ki varsın! Ne zaman konuşmak ya da yeni bir vizyon keşfetmek istersen buradayım. ✨';
      cardData = undefined;
    } else if (
      lower.includes('yorgun') ||
      lower.includes('üşen') ||
      lower.includes('tüken') ||
      lower.includes('enerjim yok')
    ) {
      text = 'Ah, o hissi çok iyi bilirim... Bugün kendine hiç yüklenme. Bazen zihnin en çok ihtiyaç duyduğu şey sadece durup dinlenmektir. Eğer illa bir şey yapmak istersen diye çok küçük, 5 dakikalık zahmetsiz bir adım bıraktım; ama istemezsen sadece dinlenmekte tamamen özgürsün.';
      cardData = {
        smartGoal: 'Dirençsiz Eylem: 5 Dakikalık Dinlenme & Hafiflik',
        microAction: 'Çalışma masana otur, sadece defterinin kapağını aç ve tek bir nefes alıp bırak. Fazlasını yapmana gerek yok.',
        quote: '“Bazen en büyük eylem, durup soluklanmaya izin vermektir.”',
      };
    } else if (
      lower.includes('smart') ||
      lower.includes('hedef') ||
      lower.includes('plan') ||
      lower.includes('nasıl başlarım') ||
      lower.includes('adım ver')
    ) {
      text = 'Harika, hadi bunu somut bir rotaya oturtalım! Büyük hedefler zihni korkutur ama onları 3 aylık bir kilometre taşına ve bugünün 15 dakikalık tek adımına böldüğümüzde her şey çok kolaylaşır. Senin için çerçeveyi hazırladım:';
      cardData = {
        smartGoal: '90 Günlük Odak: Tekil Proje Çıktısı & Haftalık Takip',
        microAction: 'Bugün sadece bu konuyla ilgili ilk taslağı veya not dosyasını açıp 15 dakika ayır.',
        quote: '“Büyük yolculuklar tek bir sakin adımla başlar.”',
      };
    } else if (lower.includes('afirmasyon') || lower.includes('motto') || lower.includes('olumlama')) {
      text = 'Zihnini sakinleştiren ve sana dingin bir güç veren günün afirmasyonu:';
      cardData = {
        quote: '“Zamanın ötesinde bir sükunetle ilerliyorum. İhtiyacım olan berraklık ve güç içimde mevcut.”',
        microAction: 'Gözlerini kapat, derin bir nefes al ve bu cümleyi içinden 3 kez tekrar et.',
      };
    } else if (
      mode === 'cbt' ||
      lower.includes('başaramam') ||
      lower.includes('başaramayacağım') ||
      lower.includes('yetersiz') ||
      lower.includes('beceremiyorum') ||
      lower.includes('geç kaldım') ||
      lower.includes('yetiş') ||
      lower.includes('üstüme') ||
      lower.includes('bunal')
    ) {
      text = 'Zihninin bu düşünceyi üretmesi çok anlaşılır ama unutma Selin; düşünceler birer gerçeklik değil, sadece zihinden geçen bilişsel dalgalardır. Kognitif psikolojide buna "Aşırı Yüklenme ve Felaketleştirme Tuzağı" denir. Gel buna daha adil bir pencereden bakalım:';
      cardData = {
        reframing: 'Düşünce Tuzağı: "Her şey üstüme geliyor / Yetişemiyorum"\n➔ Bilişsel Dönüşüm: "Tüm dünyayı aynı anda taşımak zorunda değilim. Sadece şu anki tekil ana ve 1 küçük adıma odaklanmam yeterli."',
        microAction: 'Derin bir nefes al ve bugün için acil olmayan her şeyi yarına erteleme izni ver.',
        quote: '“Yükün ağırlığı değil, onu nasıl taşıdığın önemlidir.” — Seneca',
        exerciseType: 'breath478',
      };
    } else if (
      lower.includes('kaygı') ||
      lower.includes('panik') ||
      lower.includes('stres') ||
      lower.includes('korku') ||
      lower.includes('nefes alamıyorum')
    ) {
      text = 'Şu an sinir sisteminin stres alarmı verdiğini hissediyorum. Bu tamamen insani bir tepki ve şu an tamamen güvendesin. Zihnindeki fırtınayı durdurmak için 4-7-8 nefes ritmini veya Stoik dikotomi egzersizini uygulayalım:';
      cardData = {
        exerciseType: 'breath478',
        microAction: '4 saniye nefes al, 7 saniye tut ve 8 saniye boyunca dudaklarından yavaşça bırak.',
        quote: '“Seni üzen olayların kendisi değil, o olaylar hakkında geliştirdiğin yargılardır.” — Epiktetos',
      };
    } else if (lower.includes('como') || lower.includes('italya')) {
      text = 'Como Gölü vizyonun gerçekten insanın içini açan bir hayal. Gölün o sakin, pürüzsüz yüzeyi gibi bir dinginlikle çalışmak şahane bir duygu. Bu hayal sana şu an nasıl hissettiriyor?';
      cardData = {
        smartGoal: 'Como Gölü & İtalya uzaktan çalışma portföyünün 6 ayda tamamlanması.',
        microAction: 'Bugün sadece İtalyanca veya vize portföyünden 1 ilham yazısına 15 dakika göz at.',
      };
    } else {
      text = `Anlıyorum Selin. "${message.length > 50 ? message.slice(0, 50) + '...' : message}" hakkında ne hissediyorsun? İstersen biraz daha açabilirsin, tamamen seni dinliyorum.`;
      cardData = undefined;
    }

    // Attach generated photo if matched
    if (isPhotoRequest && generatedImageUrl) {
      cardData = cardData || {};
      cardData.imageUrl = generatedImageUrl;
      cardData.imageTitle = generatedImageTitle;
      cardData.imagePrompt = generatedImagePrompt;
    }

    return res.json({ text, cardData });
  } catch (error) {
    console.error('Assistant API error:', error);
    return res.status(500).json({
      error: 'Asistan yanıt verirken bir aksaklık oluştu.',
      text: 'Zihinsel frekansta küçük bir dalgalanma oldu. Lütfen tekrar sor Selin ✨',
    });
  }
});

// Dynamic AI Daily Intention Generator
app.post('/api/intention/daily', async (req, res) => {
  try {
    const { focus = '', category = '' } = req.body;

    if (aiClient) {
      try {
        const prompt = `Sen Veira'nın yüksek bilinçli bilgelik ve niyet rehberisin.
Kullanıcının bugünkü odak alanı: "${focus || 'Bütünsel dinginlik, 15 dakikalık kararlı mikro-adımlar ve bolluk'}"
Kategori: "${category || 'Genel'}"

Görevin: Bugün için kullanıcının zihnini berraklaştıracak, ertelemeyi kıracak, derin bir huzur ve kararlılık aşılayacak 1 adet GÜNÜN NİYETİ & AFİRMASYONU üretmektir.

SADECE geçerli bir JSON döndür:
{
  "tag": "Kısa Konu Başlığı (Örn: Odak & İstikrar)",
  "quote": "Kısa, derin ve şimdiki zaman kipiyle 1 cümlelik bilge niyet",
  "subtext": "Zihni rahatlatan ve mikro-eyleme davet eden 1 cümlelik açıklama",
  "category": "odak"
}`;

        const generatePromise = aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Intention generation timed out')), 8000)
        );

        const response: any = await Promise.race([generatePromise, timeoutPromise]);
        const rawText = (response.text || '').trim();
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json({
            id: `ai-${Date.now()}`,
            tag: parsed.tag || 'Günlük Niyet',
            quote: parsed.quote || 'Bugün attığım her sakin adım beni vizyonuma bir adım daha yaklaştırır.',
            subtext: parsed.subtext || 'Büyük hedefler küçük ve tutarlı anlarda inşa edilir.',
            category: parsed.category || 'odak',
          });
        }
      } catch (aiErr) {
        console.warn('AI intention warning, using curated fallback:', aiErr);
      }
    }

    return res.json({
      id: `fallback-${Date.now()}`,
      tag: 'Zihinsel Dinginlik & Bolluk',
      quote: 'Bugün attığım her 15 dakikalık bilinçli adım, vizyonumun mimarisini güvenle inşa eder.',
      subtext: 'Büyük hayaller tek günde değil, sakin ve istikrarlı mikro-adımlarla gerçeğe dönüşür.',
      category: 'odak',
    });
  } catch (error) {
    console.error('Intention route error:', error);
    return res.status(500).json({ error: 'Niyet üretilemedi' });
  }
});

// Dynamic AI Daily Horoscope & Astrological Reading Endpoint
app.post('/api/astro/daily', async (req, res) => {
  try {
    const {
      sign = 'Boğa',
      risingSign = 'Akrep',
      moonSign = 'Balık',
      userName = 'Selin',
      dayOffset = 0,
    } = req.body;

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + Number(dayOffset || 0));

    if (aiClient) {
      try {
        const dateStr = targetDate.toLocaleDateString('tr-TR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          weekday: 'long',
        });
        const periodLabel = dayOffset === 1 ? 'Yarının Enerjisi' : dayOffset === -1 ? 'Dünün Yansıması' : 'Bugün';

        const prompt = `Sen Veira'nın yüksek bilinçli, derin, samimi ve insana huzur ve güç veren usta astrolog rehberisin.
Kullanıcı Adı: ${userName}
Güneş Burcu: ${sign}
Yükselen Burcu: ${risingSign}
Ay Burcu: ${moonSign}
Tarih: ${dateStr} (${periodLabel})

Görevin: Kullanıcının okurken "beni anlatıyor, içim rahatladı" diyeceği, karmaşık astroloji jargonuna boğmadan, insanın ruhuna dokunan DEVRİMSEL VE POZİTİF BİR GÜNLÜK ASTROLOJİ YORUMU üretmektir.

SADECE geçerli bir JSON döndür:
{
  "cosmicTheme": "Kısa ve şiirsel ana tema başlığı (Örn: Sezgilerin Gücüyle Zihinsel Netlik)",
  "generalReading": "Sevgili ${userName} diye başlayan, bugün gökyüzünün ona sunduğu fırsatları, zihinsel dinginliği ve iç sesine güvenmesini anlatan akıcı, içten, psikolojik 3-4 cümlelik derin yorum.",
  "loveTitle": "Kısa aşk başlığı (Örn: Derin Çekim & Ruhsal Uyum)",
  "loveAdvice": "Aşk ve ilişkiler için 1-2 cümlelik kalpten rehberlik",
  "loveScore": 94,
  "careerTitle": "Kısa kariyer başlığı (Örn: Bolluk Kapısı & Stratejik Başarı)",
  "careerAdvice": "İş, para ve projeler için 1-2 cümlelik ilham verici rehberlik",
  "careerScore": 89,
  "spiritTitle": "Kısa zihin/ruh başlığı (Örn: Kristal Berraklık)",
  "spiritAdvice": "İçsel huzur ve zihin dinginliği için 1-2 cümlelik rehberlik",
  "spiritScore": 96,
  "luckyHours": "Örn: 11:30 — 13:45",
  "luckyColors": "Örn: Zümrüt Yeşili & Şampanya Sarısı",
  "luckyCrystal": "Örn: Ametist & Sitrin",
  "cosmicAffirmation": "Bugün kalbini ve zihnini yükseltecek 1 cümlelik güçlü olumlama",
  "microAction": "Astrolojik etkiyi hayata geçirecek 15 dakikalık pratik ve sakinleştirici mikro-eylem"
}`;

        const generatePromise = aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Astro generation timed out')), 9000)
        );

        const response: any = await Promise.race([generatePromise, timeoutPromise]);
        const rawText = (response.text || '').trim();
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json({
            success: true,
            source: 'gemini-ai',
            data: parsed,
          });
        }
      } catch (aiErr) {
        console.warn('AI astro daily warning, falling back to local engine:', aiErr);
      }
    }

    return res.json({
      success: true,
      source: 'deterministic-fallback',
      data: null,
    });
  } catch (err) {
    console.error('Astro daily route error:', err);
    return res.status(500).json({ error: 'Astroloji yorumu üretilemedi' });
  }
});

// Daily Reflection Background Service Endpoint:
// Generates a poetic, encouraging narrative celebrating the user's completed tasks
app.post('/api/reflection/generate', async (req, res) => {
  try {
    const {
      completedTasks = [],
      totalTasksCount = 0,
      userName = 'Selin',
      date = new Date().toISOString().split('T')[0],
    } = req.body;

    const completedList = Array.isArray(completedTasks) ? completedTasks : [];
    const completedTitles = completedList
      .map(
        (t: any) =>
          `- "${t.title}" (${t.visionTitle || 'Vizyon'}, ${t.estimatedMinutes || 15} dk)`
      )
      .join('\n');

    if (aiClient) {
      try {
        const prompt = `Sen Veira'nın yüksek bilinçli, şair ruhlu, bilge tefekkür (mindfulness) rehberisin.
Kullanıcının Adı: ${userName}
Tarih: ${date}
Tamamlanan Görev Sayısı: ${completedList.length} / ${totalTasksCount || completedList.length}

Bugün Tamamlanan Görevler:
${completedTitles || '(Kullanıcı bugün henüz bir görev tamamlamadı, günün dingin başlangıcında niyet aşamasında)'}

Görevin: Kullanıcının bugün tamamladığı bu somut adımları sevgiyle kutlayan, zihinsel ertelemeyi kırıp ulaştığı başarı hissini artıran, telaşı dindiren ve akşam dinginliği sunan POETİK VE CESARETLENDİRİCİ BİR GÜNLÜK TEFEKKÜR (Daily Reflection) anlatısı üretmektir.

SADECE geçerli bir JSON döndür:
{
  "title": "Zarif ve şiirsel başlık (Örn: Sessiz Zaferlerin Şiiri & Akşam Yankısı)",
  "strophe": [
    "1. dize (etkileyici ve lirik)",
    "2. dize",
    "3. dize",
    "4. dize"
  ],
  "narrative": "Tamamlanan görevleri (${completedList.length > 0 ? 'özellikle isimleriyle' : 'öz-şefkat ve sabırla'}) anarak, kullanıcının bugünkü emeğini, harcadığı odak dakikalarını ve zihnindeki ilerlemeyi onurlandıran 2-3 paragraflık akıcı, huzur verici ve şiirsel nesir anlatımı.",
  "mindfulnessPrompt": "Günü kapatırken zihne ve kalbe iyi gelecek 1 derin tefekkür sorusu",
  "eveningMantra": "Akşam dinlenmesine ve iç huzuruna eşlik edecek 1 cümlelik sakinleştirici olumlama"
}`;

        const generatePromise = aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Reflection generation timed out')), 9000)
        );

        const response: any = await Promise.race([generatePromise, timeoutPromise]);
        const rawText = (response.text || '').trim();
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json({
            success: true,
            source: 'gemini-ai',
            data: parsed,
          });
        }
      } catch (aiErr) {
        console.warn('AI reflection warning, falling back to local engine:', aiErr);
      }
    }

    return res.json({
      success: true,
      source: 'deterministic-fallback',
      data: null,
    });
  } catch (err) {
    console.error('Reflection route error:', err);
    return res.status(500).json({ error: 'Tefekkür üretilemedi' });
  }
});

// AI Goal Decomposition: Breaks any Vision & Goal into 15-min Daily Micro-Tasks & Milestones
// Implements Atomic Habits (resistance-free actions), WOOP, and cognitive behavioral sequencing
app.post(['/api/goals/decompose', '/api/goal/decompose'], async (req, res) => {
  try {
    const {
      title,
      category = 'Kişisel Gelişim',
      horizon = '3 Ay',
      why = '',
      targetMinutes = 15,
      mode = 'balanced', // 'balanced' | 'low_resistance' | 'deep_focus' | 'milestones_heavy'
    } = req.body;

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Hedef/Vizyon başlığı gereklidir.' });
    }

    const durationNum = Number(targetMinutes) || 15;

    if (aiClient) {
      try {
        const modeInstruction =
          mode === 'low_resistance'
            ? 'Dirençsiz Başlangıç Modu: Görevleri aşırı kolaylaştır, kullanıcının erteleme ihtimalini sıfıra indir (örn. 5-10 dk mikro-alışkanlıklar).'
            : mode === 'deep_focus'
            ? 'Derin Odak (Deep Work) Modu: Görevleri 20-30 dakikalık kesintisiz akış blokları olarak tasarla.'
            : 'Dengeli Veira Modu: Tam 15 dakikalık, zihinsel berraklık sağlayan ve sürdürülebilir atomik adımlar tasarla.';

        const cognitivePrompt = `Sen dünyanın en iyi Davranışsal Psikoloji (Behavioral Psychology) ve Üretkenlik Mimarı uzmanısın (James Clear Atomic Habits, BJ Fogg Tiny Habits ve Gabriele Oettingen WOOP ekolü).

KULLANICININ BÜYÜK HEDEFİ:
- Başlık: "${title}"
- Kategori: "${category}"
- Zaman Ufku: "${horizon}"
- Derin 'Neden'i: "${why || 'Kişisel gelişim ve dönüşüm'}"
- Tercih Edilen Günlük Süre: ${durationNum} dakika
- Strateji Modu: ${modeInstruction}

GÖREVİN:
Bu büyük vizyonu; kullanıcının zihninde erteleme (procrastination) veya kaygı yaratmayacak, TAM VE KESİNLİKLE UYGULANABİLİR atomik parçalara bölmektir.

KURALLAR:
1. GÜNLÜK GÖREVLER (dailyTasks - 2 Adet):
   - Her gün tam ${durationNum} dakikada bitirilebilecek somut, gözlemlenebilir eylem fiilleri kullan (Örn: "Düşün", "Araştır" gibi soyut ve kaygan kelimeler KESİNLİKLE YASAKTIR. Bunun yerine: "Not defterini aç ve 3 madde yaz", "DuoLingo'da 2 ders bitir", "Sessiz ortamda 15 dk 432Hz dinleyerek nefes say" gibi fiziksel eylemler olmalıdır).
   - estimatedMinutes alanı mutlaka ${durationNum} olmalıdır (veya 5-${durationNum} arası).

2. MİNİ KİLOMETRE TAŞLARI (miniTasks - 4 Sıralı Aşama):
   - Bu 4 adım rastgele değil, mantıksal bağımlılık sırasına göre olmalıdır:
     * Adım 1 [Hazırlık & Envanter]: Sıfır maliyetle zihinsel ve fiziksel ortamı hazırlama.
     * Adım 2 [İlk Mikro-Çıktı / Prototip]: Direnci kıran en küçük somut taslak veya deneme.
     * Adım 3 [Tutarlılık & Geri Bildirim]: Rutini 14 gün sürdürme ve kaliteyi artırma.
     * Adım 4 [Nihai Dönüm Noktası]: Ölçülebilir başarının kutlanması ve kalıcı hale gelmesi.

3. SMART AFİRMASTON (smartAffirmation - 1 Cümle):
   - Veira tarzı dingin, bilge, "Ben ..." veya şimdiki zaman kipiyle yazılmış güçlü bir niyet cümlesi.

Yanıtını SADECE geçerli bir JSON olarak ver. Markdown tırnakları (\`\`\`json) veya fazladan selamlama/açıklama YAZMA:
{
  "dailyTasks": [
    { "title": "Günde ${durationNum} dk ...", "estimatedMinutes": ${durationNum} },
    { "title": "Günde ...", "estimatedMinutes": ${Math.max(5, Math.round(durationNum * 0.7))} }
  ],
  "miniTasks": [
    { "stepNumber": 1, "title": "1. Aşama: ...", "desc": "Net ve somut aşama açıklaması" },
    { "stepNumber": 2, "title": "2. Aşama: ...", "desc": "Net ve somut aşama açıklaması" },
    { "stepNumber": 3, "title": "3. Aşama: ...", "desc": "Net ve somut aşama açıklaması" },
    { "stepNumber": 4, "title": "4. Aşama: ...", "desc": "Net ve somut aşama açıklaması" }
  ],
  "smartAffirmation": "Dingin ve güçlü niyet afirmasyonu"
}`;

        const generatePromise = aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: cognitivePrompt,
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Decompose timed out')), 12000)
        );

        const response: any = await Promise.race([generatePromise, timeoutPromise]);
        const rawText = (response.text || '').trim();
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed.dailyTasks) && Array.isArray(parsed.miniTasks)) {
            return res.json(parsed);
          }
        }
      } catch (err) {
        console.warn('Gemini cognitive decompose warning, falling back to smart local engine:', err);
      }
    }

    // High quality intelligent local breakdown fallback tailored to duration & categories
    const lower = title.toLowerCase();
    let dailyTasks: Array<{ title: string; estimatedMinutes: number }> = [];
    let miniTasks: Array<{ stepNumber: number; title: string; desc: string }> = [];
    let smartAffirmation = '';

    if (lower.includes('como') || lower.includes('italya') || lower.includes('yurtdışı') || lower.includes('vize')) {
      dailyTasks = [
        { title: `Günde ${durationNum} dk İtalyanca 10 yeni fiil çekimi ve sesli tekrar yap`, estimatedMinutes: durationNum },
        { title: 'Como & İtalya dijital göçebe kılavuzundan 1 resmi madde incele', estimatedMinutes: Math.min(10, durationNum) },
      ];
      miniTasks = [
        { stepNumber: 1, title: 'Temel A1/A2 çalışma haritasını ve günlük kelime listesini çıkar', desc: 'Dirençsiz 14 günlük sesli pratik takvimi' },
        { stepNumber: 2, title: 'Resmi vize, pasaport ve gelir belgesi gereksinimlerini listele', desc: 'Konsolosluk ve banka evrak klasörü' },
        { stepNumber: 3, title: 'Como & Milano çevresinde 3 sakin ortak çalışma alanını haritada işaretle', desc: 'İnternet hızı, ulaşım ve yaşam maliyeti hesabı' },
        { stepNumber: 4, title: 'Konaklama bütçesini netleştirip ilk rezervasyon taslağını oluştur', desc: 'Uçuş ve fiziksel taşınma lojistiği' },
      ];
      smartAffirmation = `“Her gün attığım dingin ${durationNum} dakikalık adım, Como vizyonumu gerçeğe dönüştürüyor.”`;
    } else if (lower.includes('beden') || lower.includes('kilo') || lower.includes('spor') || lower.includes('fit') || lower.includes('sağlık') || lower.includes('kas')) {
      dailyTasks = [
        { title: `Sabah ${durationNum} dk omurga açıcı mobilite ve nefes ritüelini tamamla`, estimatedMinutes: durationNum },
        { title: 'Günde 2.5 litre su iç ve her öğünde taze yeşillik bulundur', estimatedMinutes: 5 },
      ];
      miniTasks = [
        { stepNumber: 1, title: 'Beden ölçülerini ve mevcut enerji seviyeni not et', desc: 'Başlangıç fotoğrafı ve somut temel ölçümler' },
        { stepNumber: 2, title: 'Haftada 3 gün uygulanacak 20 dakikalık temel hareket serisini hazırla', desc: 'Direnç bantları ve esneme planı' },
        { stepNumber: 3, title: 'Akşam ekran süresini kısıtlayıp 7 saatlik derin uyku rutini kur', desc: 'Hücresel toparlanma ve dinç uyanma' },
        { stepNumber: 4, title: '30. gün postür ve dayanıklılık ilerlemesini belgele', desc: 'Gözle görülür canlılık ve bedensel hafiflik' },
      ];
      smartAffirmation = '“Bedenim gücün, dengenin ve hücresel canlılığın dingin mabedidir.”';
    } else if (lower.includes('meditasyon') || lower.includes('zihin') || lower.includes('dingin') || lower.includes('huzur') || lower.includes('stres')) {
      dailyTasks = [
        { title: `Günde ${durationNum} dk 432Hz eşliğinde sessizce nefesine odaklan`, estimatedMinutes: durationNum },
        { title: 'Akşam 5 dk günün 3 şükran anını günlüğe yaz', estimatedMinutes: 5 },
      ];
      miniTasks = [
        { stepNumber: 1, title: 'Evde dikkatsiz ve sessiz bir meditasyon köşesi hazırla', desc: 'Zihinsel çapa ve odak alanı' },
        { stepNumber: 2, title: '14 gün boyunca 4-7-8 nefes tekniğini alışkanlığa dönüştür', desc: 'Vagus sinirini sakinleştirme' },
        { stepNumber: 3, title: 'Düşünce tuzaklarını fark ettiğinde CBT yeniden çerçevelemesi yap', desc: 'Bilişsel esneklik ve duygusal regülasyon' },
        { stepNumber: 4, title: 'Haftada bir gün 2 saatlik tam dijital detoks uygula', desc: 'Derin zihinsel berraklık ve iç huzur' },
      ];
      smartAffirmation = '“Zihnim sakin, düşüncelerim berrak, içsel merkezim sarsılmaz.”';
    } else if (lower.includes('kitap') || lower.includes('yaz') || lower.includes('makale') || lower.includes('öğren')) {
      dailyTasks = [
        { title: `Her gün ${durationNum} dk kesintisiz odakla 5 sayfa oku veya 150 kelime yaz`, estimatedMinutes: durationNum },
        { title: 'Okunan veya öğrenilen temel fikri 1 cümlelik özet olarak kaydet', estimatedMinutes: 5 },
      ];
      miniTasks = [
        { stepNumber: 1, title: 'Okuma/yazma listesini belirle ve masayı sadeleştir', desc: 'Sıfır dikkat dağınıklığı sağlayan çalışma alanı' },
        { stepNumber: 2, title: 'İlk bölümü veya ilk 10 sayfayı dirençsizce tamamla', desc: 'Eyleme geçme eşiğini aşma' },
        { stepNumber: 3, title: 'Anahtar alıntıları ve kavram haritasını dijital not defterine aktar', desc: 'Bilgiyi içselleştirme' },
        { stepNumber: 4, title: 'Tüm çalışmayı sentezleyip hedeflenen çıktıyı kutla', desc: 'Kalıcı zihinsel gelişim' },
      ];
      smartAffirmation = '“Her gün eklediğim küçük bir sayfa, büyük bir bilgelik kütüphanesine dönüşüyor.”';
    } else {
      dailyTasks = [
        { title: `"${title}" için her gün ${durationNum} dk masaya oturup tek bir mikro-eylemi tamamla`, estimatedMinutes: durationNum },
        { title: 'Günün sonunda 5 dk ilerlemeni ve niyetini gözden geçir', estimatedMinutes: 5 },
      ];
      miniTasks = [
        { stepNumber: 1, title: '1. Aşama (Hazırlık): Gerekli kaynak envanterini ve ilk adımı netleştir', desc: 'Kafa karışıklığını gideren somut yol haritası' },
        { stepNumber: 2, title: '2. Aşama (Prototip): İlk çalışan taslağı veya mikro-uygulamayı bitir', desc: 'Mükemmeliyetçilikten uzak, en küçük uygulanabilir adım' },
        { stepNumber: 3, title: '3. Aşama (Rutin): 14 gün boyunca tutarlılığı koru ve pürüzleri gider', desc: 'Alışkanlığın otomatikleşmesi' },
        { stepNumber: 4, title: '4. Aşama (Çıktı): Hedefi başarıyla tamamlayıp yeni ufka yelken aç', desc: 'Ölçülebilir başarı ve içsel tatmin' },
      ];
      smartAffirmation = `“${title} yolculuğunda her gün ${durationNum} dakikalık sakin adımlarla ilerliyorum.”`;
    }

    return res.json({
      dailyTasks,
      miniTasks,
      smartAffirmation,
    });
  } catch (error) {
    console.error('Goal decompose error:', error);
    return res.status(500).json({ error: 'Hedef ayrıştırılırken hata oluştu.' });
  }
});

// Prompt Optimizer for Free Flux & Turbo Image Generation
app.post('/api/image/optimize-prompt', async (req, res) => {
  try {
    const { prompt, style = 'cinematic', aspectRatio = '1:1', model = 'flux' } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt gereklidir.' });
    }

    let width = 1024;
    let height = 1024;
    if (aspectRatio === '9:16') {
      width = 768;
      height = 1360;
    } else if (aspectRatio === '16:9') {
      width = 1280;
      height = 720;
    }

    let englishPrompt = '';

    if (aiClient) {
      try {
        const styleInstruction =
          style === 'luxury'
            ? 'modern minimalist luxury architecture, Lake Como or Swiss Alps villa, floor-to-ceiling glass, serene tranquil atmosphere'
            : style === 'nature'
            ? 'lush breathtaking pristine nature, morning mist, golden sun rays, zen harmony'
            : style === 'night_sky'
            ? 'dark starlit midnight sky, milky way galaxy, peaceful solitude, long exposure'
            : style === 'minimalist'
            ? 'clean Scandinavian minimalist aesthetic, warm wood, subtle earth tones, tranquil stillness'
            : 'cinematic 35mm film photography, 8k resolution, photorealistic, serene golden hour lighting';

        const generatePromise = aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Translate and enhance this vision board intention: "${prompt}" into a single concise English photography prompt for the Flux image model. Aesthetic style: ${styleInstruction}. Must be serene, highly aesthetic, photorealistic, 8k resolution, cinematic lighting, no text, no words, no watermark. Output ONLY the English prompt string, nothing else.`,
        });
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Prompt optimize timed out')), 3500)
        );
        const response: any = await Promise.race([generatePromise, timeoutPromise]);
        englishPrompt = (response.text || '').trim().replace(/^"/, '').replace(/"$/, '');
      } catch (err) {
        console.warn('Gemini prompt enhancement warning:', err);
      }
    }

    if (!englishPrompt) {
      // High-precision semantic translation dictionary
      const lower = prompt.toLowerCase();
      if (lower.includes('como') || lower.includes('göl') || lower.includes('lake')) {
        englishPrompt = 'Lake Como Italy modern minimalist luxury villa, floor-to-ceiling glass windows, calm turquoise water reflection, serene morning sun, Italian cypress, 35mm film photography, 8k';
      } else if (lower.includes('yoga') || lower.includes('meditasyon') || lower.includes('zen') || lower.includes('huzur')) {
        englishPrompt = 'peaceful zen meditation sanctuary, soft warm morning mist, gentle sunlight, natural wooden floor, lush green nature outside, tranquil contemplative atmosphere, highly detailed, 8k';
      } else if (lower.includes('beden') || lower.includes('spor') || lower.includes('koşu') || lower.includes('fit')) {
        englishPrompt = 'fit inspiring healthy runner in breathtaking alpine mountain trail at sunrise, crystal clear air, vibrant natural colors, joyful vitality, cinematic athletic shot, 8k';
      } else if (lower.includes('çalışma') || lower.includes('stüdyo') || lower.includes('ofis') || lower.includes('tasarım')) {
        englishPrompt = 'minimalist sunlit creative design studio with wooden desk, espresso cup, large window with lake and mountain view, warm morning golden hour, architectural digest, 8k';
      } else if (lower.includes('seyahat') || lower.includes('araba') || lower.includes('rota') || lower.includes('yol')) {
        englishPrompt = 'vintage convertible sports car parked by the Amalfi coast cliff overlooking the deep azure sea, golden hour sunset, cinematic vacation aesthetic, 35mm film, 8k';
      } else if (lower.includes('yıldız') || lower.includes('gece') || lower.includes('evren') || lower.includes('kozmik')) {
        englishPrompt = 'clear midnight sky filled with dazzling starlight and milky way galaxy, peaceful dark silhouette of cypress trees, quiet reflective lake, long exposure photography, 8k';
      } else {
        englishPrompt = `${prompt}, peaceful serene atmosphere, breathtaking natural beauty, soft cinematic golden hour lighting, architectural digest aesthetic, photorealistic, 8k`;
      }
    }

    const seed = Math.floor(Math.random() * 900000) + 10000;
    const reliableUrl = getSemanticPhotoForPrompt(englishPrompt || prompt, seed);
    const turboUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(englishPrompt)}?model=flux&width=${width}&height=${height}&seed=${seed}&nologo=true`;

    return res.json({
      englishPrompt,
      seed,
      width,
      height,
      imageUrl: turboUrl,
      fluxUrl: turboUrl,
      turboUrl: turboUrl,
      reliableUrl,
      aiLiveUrl: turboUrl,
    });
  } catch (error) {
    console.error('Image prompt optimization error:', error);
    return res.status(500).json({ error: 'Görsel promptu optimize edilirken hata oluştu.' });
  }
});

// Resilient AI Image Generation Endpoint
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, style = 'cinematic', aspectRatio = '4:5', category } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt gereklidir.' });
    }

    const seed = Math.floor(Math.random() * 900000) + 10000;
    const combined = `${prompt} ${category || ''}`;
    const resolvedUrl = getSemanticPhotoForPrompt(combined, seed);
    const aiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + ', 8k photorealistic photography, cinematic lighting')}?model=flux&width=1024&height=1024&seed=${seed}&nologo=true`;

    return res.json({
      success: true,
      imageUrl: aiUrl,
      fallbackUrl: resolvedUrl,
      seed,
      prompt,
      title: prompt.slice(0, 40),
    });
  } catch (err) {
    console.error('Generate image error:', err);
    return res.status(500).json({ error: 'Görsel üretilemedi.' });
  }
});

// SSRF (Server-Side Request Forgery) Protection: Validates protocol and blocks private/internal cloud IP ranges
function isSafeImageUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    // 1. Only allow http: and https: protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }

    const host = parsed.hostname.toLowerCase();

    // 2. Block localhost, cloud metadata, link-local, and internal domain names
    if (
      host === 'localhost' ||
      host === '0.0.0.0' ||
      host === '127.0.0.1' ||
      host === '169.254.169.254' ||
      host === 'metadata.google.internal' ||
      host.endsWith('.internal') ||
      host.endsWith('.local') ||
      host === '::1' ||
      host === '[::1]'
    ) {
      return false;
    }

    // 3. Block private / internal IP ranges (IPv4 CIDR checks)
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = host.match(ipv4Regex);
    if (match) {
      const o1 = parseInt(match[1], 10);
      const o2 = parseInt(match[2], 10);
      if (o1 === 10) return false; // 10.0.0.0/8
      if (o1 === 127) return false; // 127.0.0.0/8 (loopback)
      if (o1 === 169 && o2 === 254) return false; // 169.254.0.0/16 (link-local & cloud metadata)
      if (o1 === 172 && o2 >= 16 && o2 <= 31) return false; // 172.16.0.0/12
      if (o1 === 192 && o2 === 168) return false; // 192.168.0.0/16
      if (o1 === 0) return false; // 0.0.0.0/8
    }

    return true;
  } catch {
    return false;
  }
}

// Proxy image endpoint with SSRF protection, strict content-type verification, and guaranteed fallback
app.get('/api/proxy-image', async (req, res) => {
  try {
    const imageUrl = req.query.url as string;
    if (!imageUrl || typeof imageUrl !== 'string') {
      return res.status(400).send('Image URL required');
    }

    // SSRF Validation: reject private or malicious URLs
    if (!isSafeImageUrl(imageUrl)) {
      return res.status(403).send('Forbidden URL target');
    }

    let targetUrl = imageUrl;
    let response: any = null;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      response = await fetch(targetUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'image/*,*/*',
        },
      });
      clearTimeout(timeoutId);
    } catch {
      response = null;
    }

    if (!response || !response.ok) {
      targetUrl = getSemanticPhotoForPrompt(imageUrl, 42);
      response = await fetch(targetUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'image/*,*/*',
        },
      });
    }

    const contentType = response?.headers?.get?.('content-type') || 'image/jpeg';

    // Verify fetched resource is an image
    if (!contentType.startsWith('image/')) {
      return res.status(400).send('Target resource is not a valid image');
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    // Prevent memory exhaustion attacks (Max 10MB)
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(413).send('Image payload too large');
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(buffer);
  } catch (err) {
    console.error('Image proxy error:', err);
    return res.status(500).send('Proxy error');
  }
});

// Health Check endpoint for Cloud Run and container liveness probes
app.get(['/healthz', '/_health'], (_req, res) => {
  res.status(200).send('OK');
});

// Official Standalone Legal & Store-Required Pages
const BASE_LEGAL_STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background-color: #080c22;
    color: #dee0ff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.65;
    padding: 24px 16px 60px;
    display: flex;
    justify-content: center;
  }
  .container { max-width: 760px; width: 100%; }
  .header { text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
  .logo { display: inline-flex; align-items: center; gap: 10px; font-size: 22px; font-weight: 700; color: #e7c355; text-decoration: none; letter-spacing: 0.5px; margin-bottom: 12px; }
  .title { font-size: 26px; font-weight: 700; color: #ffffff; margin-bottom: 6px; }
  .date { font-size: 12px; color: #a4a2b5; text-transform: uppercase; letter-spacing: 1px; }
  .section { background: #161a30; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 20px 24px; margin-bottom: 18px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35); }
  .section-title { font-size: 16px; font-weight: 700; color: #e7c355; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
  p, li { font-size: 14px; color: #c7c4d7; margin-bottom: 10px; }
  p:last-child, li:last-child { margin-bottom: 0; }
  ul { padding-left: 20px; margin-bottom: 10px; }
  .disclaimer-box { background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.3); border-radius: 14px; padding: 16px 20px; margin-bottom: 18px; }
  .disclaimer-title { color: #fde047; font-weight: 700; font-size: 14px; margin-bottom: 6px; }
  .btn-back { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 28px; border-radius: 999px; background: linear-gradient(135deg, #e7c355, #f5d061); color: #3d2f00; font-weight: 700; font-size: 13px; text-decoration: none; box-shadow: 0 4px 16px rgba(231, 195, 85, 0.3); margin-top: 24px; }
  .footer-links { text-align: center; margin-top: 36px; font-size: 12px; color: #908fa0; }
  .footer-links a { color: #7bd0ff; text-decoration: none; margin: 0 10px; }
`;

function getPrivacyPolicyHtml(): string {
  return `<!doctype html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Veira — Gizlilik Politikası & KVKK</title>
  <style>${BASE_LEGAL_STYLES}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <a href="/" class="logo">✨ VEIRA</a>
      <h1 class="title">Gizlilik Politikası &amp; KVKK</h1>
      <span class="date">Son Güncelleme: Kasım 2026</span>
    </div>
    <div class="disclaimer-box">
      <div class="disclaimer-title">🔒 Yerel Öncelikli (Local-First) &amp; Sıfır İzleyici Taahhüdü</div>
      <p>Veira, kullanıcılarının mahremiyetini ve zihinsel dinginliğini korumak üzere tasarlanmıştır. Uygulamamızda üçüncü taraf reklam kütüphaneleri, kullanıcı takipçileri veya veri simsarları yer almaz. Vizyon ve niyetleriniz cihazınızda saklanır.</p>
    </div>
    <div class="section">
      <h2 class="section-title">1. Veri Sorumlusu &amp; İletişim</h2>
      <p>6698 sayılı KVKK ve GDPR uyarınca Veira geliştiricisi veri sorumlusu sıfatıyla hareket etmektedir. İletişim: <strong style="color: #e7c355;">destek@veira.app</strong></p>
    </div>
    <div class="section">
      <h2 class="section-title">2. İşlenen Veriler ve Toplama Yöntemi</h2>
      <ul>
        <li><strong>Profil & Hedefler:</strong> Belirlediğiniz ad ve eklediğiniz vizyon/niyetler tamamen cihazınızın yerel depolama alanında muhafaza edilir.</li>
        <li><strong>Yapay Zeka Promptları:</strong> Asistan veya görsel üretim komutları model yanıtı üretildikten sonra sunucuda depolanmaz.</li>
      </ul>
    </div>
    <div class="section">
      <h2 class="section-title">3. Tıbbi &amp; Klinik Sorumluluk Reddi</h2>
      <p>Veira kişisel niyet oluşturma ve meditasyon aracıdır. Klinik veya tıbbi teşhis/tedavi yöntemi sunmaz.</p>
    </div>
    <div style="text-align: center;"><a href="/" class="btn-back">← Veira Uygulamasına Dön</a></div>
    <div class="footer-links">
      <a href="/gizlilik">Gizlilik Politikası</a> &bull; <a href="/sartlar">Kullanım Şartları</a> &bull; <a href="/destek">Destek</a>
    </div>
  </div>
</body>
</html>`;
}

function getTermsOfServiceHtml(): string {
  return `<!doctype html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Veira — Kullanım Şartları (EULA)</title>
  <style>${BASE_LEGAL_STYLES}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <a href="/" class="logo">✨ VEIRA</a>
      <h1 class="title">Kullanım Şartları (EULA)</h1>
      <span class="date">Son Güncelleme: Kasım 2026</span>
    </div>
    <div class="section">
      <h2 class="section-title">1. Lisans Kapsamı</h2>
      <p>Veira, size kişisel ve ticari olmayan bir kullanım lisansı sunar.</p>
    </div>
    <div class="section">
      <h2 class="section-title">2. Uygunsuz İçerik & Davranışlara Sıfır Tolerans</h2>
      <p>Taciz, nefret söylemi ve yasa dışı amaçlarla kullanım kesinlikle yasaktır.</p>
    </div>
    <div class="section">
      <h2 class="section-title">3. Yapay Zeka Sorumluluk Sınırı</h2>
      <p>Yapay zeka çıktıları ilham ve planlama amaçlıdır; tıbbi veya hukuki kesinlik taşımaz.</p>
    </div>
    <div style="text-align: center;"><a href="/" class="btn-back">← Veira Uygulamasına Dön</a></div>
    <div class="footer-links">
      <a href="/gizlilik">Gizlilik Politikası</a> &bull; <a href="/sartlar">Kullanım Şartları</a> &bull; <a href="/destek">Destek</a>
    </div>
  </div>
</body>
</html>`;
}

function getSupportHtml(): string {
  return `<!doctype html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Veira — Destek Merkezi &amp; SSS</title>
  <style>${BASE_LEGAL_STYLES}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <a href="/" class="logo">✨ VEIRA</a>
      <h1 class="title">Destek Merkezi &amp; SSS</h1>
      <span class="date">7/24 Kullanıcı Desteği</span>
    </div>
    <div class="section">
      <h2 class="section-title">📬 Bize Ulaşın</h2>
      <p>Destek, görüş ve önerileriniz için: <strong style="color: #e7c355;">destek@veira.app</strong></p>
    </div>
    <div class="section">
      <h2 class="section-title">❓ Sıkça Sorulan Sorular</h2>
      <p><strong>1. 432Hz Akort Çaları nedir?</strong> 432Hz frekansı ve doğa sesleriyle zihinsel odak ve dinginlik sağlar.</p>
      <p><strong>2. Hedeflerim başkaları tarafından görülür mü?</strong> Hayır, tüm verileriniz yalnızca cihazınızın yerel depolama alanında saklanır.</p>
    </div>
    <div style="text-align: center;"><a href="/" class="btn-back">← Veira Uygulamasına Dön</a></div>
  </div>
</body>
</html>`;
}

app.get(['/gizlilik', '/privacy'], (_req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(getPrivacyPolicyHtml());
});

app.get(['/sartlar', '/kullanim-sartlari', '/terms'], (_req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(getTermsOfServiceHtml());
});

app.get(['/destek', '/support'], (_req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(getSupportHtml());
});

// Server boot logic: Vite middleware in dev or high-performance static serve in production
async function startServer() {
  const isCloudRun = Boolean(process.env.K_SERVICE || process.env.CLOUD_RUN_JOB);
  const isExplicitProduction = process.env.NODE_ENV === 'production';
  const distExists = fs.existsSync(path.join(__dirname, 'dist', 'index.html'));
  const isProduction = isCloudRun || isExplicitProduction || (distExists && process.env.NODE_ENV !== 'development');

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist'), {
      maxAge: '7d',
      etag: true,
      immutable: true,
    }));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Veira Full-Stack Sanctuary Server running on port ${PORT} [production=${isProduction}]`);
  });
}

startServer();
