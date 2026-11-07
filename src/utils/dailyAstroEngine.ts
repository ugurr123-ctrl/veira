/**
 * Veira Cosmic Daily Astrology Engine
 * Her gün tarihe ve burçlara göre dinamik olarak değişen,
 * insanların okumaktan keyif alacağı, derin, psikolojik ve samimi günlük astroloji motoru.
 */

export interface DailyHoroscope {
  dateStr: string; // YYYY-MM-DD
  dateFormatted: string; // "6 Kasım 2026, Cuma"
  sign: string; // "Boğa", "Akrep", vb.
  glyph: string; // "♉︎"
  element: string; // "Toprak"
  moonPhase: {
    name: string; // "Büyüyen Hilal"
    percent: number; // 48
    glyph: string; // "🌒"
    sign: string; // "Yengeç"
  };
  planetaryTransit: string; // "Venüs & Neptün Üçgeni • Güneş Akrep Dönemi"
  cosmicTheme: string; // "Sezgilerin Gücüyle Zihinsel Netlik"
  generalReading: string; // Zengin, akıcı ve moral veren günlük yorum
  love: {
    score: number;
    title: string;
    advice: string;
  };
  career: {
    score: number;
    title: string;
    advice: string;
  };
  spirit: {
    score: number;
    title: string;
    advice: string;
  };
  luckyHours: string; // "10:30 — 12:45"
  luckyColors: string; // "Zümrüt Yeşili & Şampanya"
  luckyCrystal: string; // "Ametist & Sitrin"
  cosmicAffirmation: string; // "Zaman benim lehimde akıyor..."
  microAction: string; // "Bugün 15 dakika en çok ertelediğin işin ilk adımını at."
  transits: Array<{
    title: string;
    badge: string;
    desc: string;
    icon: string;
  }>;
}

export const ALL_ZODIAC_SIGNS = [
  { name: 'Koç', glyph: '♈︎', element: 'Ateş', ruler: 'Mars' },
  { name: 'Boğa', glyph: '♉︎', element: 'Toprak', ruler: 'Venüs' },
  { name: 'İkizler', glyph: '♊︎', element: 'Hava', ruler: 'Merkür' },
  { name: 'Yengeç', glyph: '♋︎', element: 'Su', ruler: 'Ay' },
  { name: 'Aslan', glyph: '♌︎', element: 'Ateş', ruler: 'Güneş' },
  { name: 'Başak', glyph: '♍︎', element: 'Toprak', ruler: 'Merkür' },
  { name: 'Terazi', glyph: '♎︎', element: 'Hava', ruler: 'Venüs' },
  { name: 'Akrep', glyph: '♏︎', element: 'Su', ruler: 'Plüton & Mars' },
  { name: 'Yay', glyph: '♐︎', element: 'Ateş', ruler: 'Jüpiter' },
  { name: 'Oğlak', glyph: '♑︎', element: 'Toprak', ruler: 'Satürn' },
  { name: 'Kova', glyph: '♒︎', element: 'Hava', ruler: 'Uranüs & Satürn' },
  { name: 'Balık', glyph: '♓︎', element: 'Su', ruler: 'Neptün & Jüpiter' },
];

const TURKISH_DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const TURKISH_MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

/**
 * Format date in Turkish (e.g. 6 Kasım 2026, Cuma)
 */
export function formatTurkishDate(d: Date): string {
  const day = d.getDate();
  const month = TURKISH_MONTHS[d.getMonth()];
  const year = d.getFullYear();
  const dayName = TURKISH_DAYS[d.getDay()];
  return `${day} ${month} ${year}, ${dayName}`;
}

/**
 * Simple pseudo-random hash generator based on date and sign
 */
function getHash(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Calculate real astronomical moon phase for a given date
 */
export function calculateMoonPhase(d: Date): { name: string; percent: number; glyph: string; sign: string } {
  // Known reference new moon: 2000-01-06 18:14 UTC
  const ref = new Date(Date.UTC(2000, 0, 6, 18, 14));
  const diffDays = (d.getTime() - ref.getTime()) / (1000 * 60 * 60 * 24);
  const synodicMonth = 29.53058867;
  const phaseCycle = (diffDays % synodicMonth + synodicMonth) % synodicMonth;
  const percent = Math.round((phaseCycle / synodicMonth) * 100);

  // Approximate moon zodiac sign (27.32 days cycle)
  const siderealCycle = 27.321661;
  const moonSignIndex = Math.floor(((diffDays % siderealCycle + siderealCycle) % siderealCycle / (siderealCycle / 12)) + 9) % 12;
  const moonSignName = ALL_ZODIAC_SIGNS[moonSignIndex]?.name || 'Boğa';

  if (phaseCycle < 1.84) return { name: 'Yeni Ay', percent: 1, glyph: '🌑', sign: moonSignName };
  if (phaseCycle < 7.38) return { name: 'Büyüyen Hilal', percent, glyph: '🌒', sign: moonSignName };
  if (phaseCycle < 9.22) return { name: 'İlk Dördün', percent: 50, glyph: '🌓', sign: moonSignName };
  if (phaseCycle < 14.76) return { name: 'Büyüyen Şişkin Ay', percent, glyph: '🌔', sign: moonSignName };
  if (phaseCycle < 16.61) return { name: 'Dolunay', percent: 99, glyph: '🌕', sign: moonSignName };
  if (phaseCycle < 22.15) return { name: 'Küçülen Şişkin Ay', percent, glyph: '🌖', sign: moonSignName };
  if (phaseCycle < 23.99) return { name: 'Son Dördün', percent: 50, glyph: '🌗', sign: moonSignName };
  return { name: 'Küçülen Hilal', percent, glyph: '🌘', sign: moonSignName };
}

// 20 İlham Verici Kozmik Tema Havuzu
const COSMIC_THEMES = [
  'Sezgilerin Gücü & Zihinsel Netlik',
  'İçsel Dinginlik & Kalıcı Değer İnşası',
  'Cesur İtici Güç & Yeni Ufuklar',
  'Bolluk Akışı & Derin Kalp Frekansı',
  'Sakin Kararlılık & Vizyon Uyanışı',
  'Yaratıcı Çözümler & Stratejik Adımlar',
  'Ruhsal Şifa & Geçmişi Özgür Bırakma',
  'Özgüven Kıvılcımı & Manyetik Çekim',
  'Zamanın Efendisi Olmak & Odak',
  'Yüksek Uyum & Kalıcı Ruhsal Bağlar',
  'Dönüşümün Gücü & Netleşen Hedefler',
  'Hafifleyen Zihin & Yükselen Enerji',
  'Bilinçli Eylem & Hayallerin Somutlaşması',
  'Kalbin Pusulası & Sezgisel Rehberlik',
  'Kutsal Akış & Erteleme Tuzağını Kırmak',
  'İlham Dolu Başlangıçlar & Yeni Kapılar',
  'Sarsılmaz Köklenme & Şükran Alanı',
  'Göz Kamaştıran Parlayış & Liderlik',
  'Bilinçli Dinlenme & Derin Şarj',
  'Kozmik Koruma & Sonsuz Olasılıklar',
];

// Burçlara ve elementlere özel detaylı yorum bileşenleri
const ELEMENT_WISDOM: Record<string, string[]> = {
  Ateş: [
    'Bugün içindeki kıvılcımı doğru yöne odakladığında kimsenin durduramayacağı bir ivme yakalayacaksın. Aceleyle değil, sakin bir özgüvenle attığın adımlar mucizeler doğuruyor.',
    'Enerjin ve çekim alanın oldukça yüksek. Etrafındakilere ilham verecek, liderlik gerektiren durumlarda doğal bir rehber gibi öne çıkacaksın.',
    'Ertelediğin o cesur konuşma veya proje için gökyüzü sana tam destek veriyor. İçindeki hevesi disiplinle birleştirdiğinde sonuç büyüleyici olacak.',
  ],
  Toprak: [
    'Bugün gökyüzü sabırla inşa ettiğin her emeği sağlam temellerle koruyor. Pratik zekân ve sakinliğin, çevrendeki kaotik durumların en büyük sığınağı olacak.',
    'Maddi ve manevi değerlerini büyütmek için son derece verimli bir göksel açı var. Acele etmeden, adım adım ilerlemenin meyvelerini topluyorsun.',
    'Bedenine ve yaşam alanına gösterdiğin özen, zihnini de ferahlatacak. Bugün küçük bir detayı çözmek, zihnindeki büyük bir düğümü anında çözecek.',
  ],
  Hava: [
    'Zihinsel berraklığın ve iletişim gücün bugün tepe noktasında. Fikirlerini doğru insanlarla paylaştığında ummadığın kapıların aralandığını göreceksin.',
    'Merak ettiğin, öğrenmek istediğin veya çözmeye çalıştığın stratejik bir konuda "Eureka" anı yaşayabilirsin. Zihnindeki fırtınayı kağıda dökmek sana müthiş iyi gelecek.',
    'İlişkilerinde açık ve şeffaf bir dil kullanmak, uzun süredir hissedilen bir yanlış anlaşılmayı sevgiyle dağıtacak. Akışa güven.',
  ],
  Su: [
    'Sezgilerin bugün adeta bir pusula gibi çalışıyor. Mantığının henüz açıklayamadığı şeyleri kalbin çoktan biliyor; ilk hissettiğin duyguya güven.',
    'Duygusal derinliğin ve yaratıcı hayal gücün en yüksek oktavda. Kendine şefkat göstermek, başkalarını anlamaktan çok daha öncelikli bugün.',
    'Ruhunu dinlendirecek, su kenarında kısa bir yürüyüş veya sakinleştirici bir frekans dinlemek zihnindeki tüm ağırlıkları su gibi akıtıp götürecek.',
  ],
};

const PLANETARY_TRANSITS_LIBRARY = [
  'Venüs & Jüpiter Uyumu (Bolluk & Şans Açısı)',
  'Güneş & Satürn Üçgeni (Sarsılmaz Odak & Başarı)',
  'Merkür & Uranüs Sekstili (Zekice Fikirler & Çözümler)',
  'Ay & Neptün Kavuşumu (Rüya Sezgileri & İlham)',
  'Mars & Plüton Destekleyici Açısı (Yenilmez İrade)',
  'Güneş & Ay Trinesi (İçsel Denge & Huzur)',
  'Venüs Boğa Geçişi (Aşkta Kalıcılık & Zarafet)',
  'Merkür İleri Harekette (Pürüzsüz İletişim & Anlaşmalar)',
];

const LUCKY_CRYSTALS_LIBRARY = [
  'Ametist & Sitrin (Zihinsel Berraklık ve Bolluk)',
  'Pembe Kuvars & Selenit (Koşulsuz Sevgi ve Arınma)',
  'Lapis Lazuli & Pirit (Kariyer Başarısı ve Bilgelik)',
  'Aventurin & Dumanlı Kuvars (Şans ve Köklenme)',
  'Akuamarin & Labradorit (Sezgi ve Yaratıcılık)',
  'Kaplan Gözü & Obsidyen (Cesaret ve Koruma)',
];

const LUCKY_COLORS_LIBRARY = [
  'Zümrüt Yeşili & Şampanya Sarısı',
  'Gece Mavisi & Işıltılı Gümüş',
  'Lavanta & Gül Kurusu',
  'Kraliyet Moru & Altın Işıltısı',
  'Deniz Kabuğu Beyazı & Mercan',
  'Toprak Kahvesi & Kehribar',
];

const DAILY_AFFIRMATIONS_LIBRARY = [
  'Bugün attığım her sakin adım, büyük vizyonumun taşlarını sağlamca yerine oturtuyor.',
  'Evrenin sonsuz zenginliği ve huzuru şu an hayatıma zahmetsizce akıyor.',
  'Zaman benim lehimde işliyor; acele etmiyor, sadece odaklanıyorum.',
  'Kendi değerimin ve yeteneklerimin farkındayım; kapılar bana sevgiyle açılıyor.',
  'Geçmişi sevgiyle bırakıyor, bugünün sunduğu taptaze olasılıkları kucaklıyorum.',
  'Zihnim dingin, kalbim açık ve adımlarım kararlı.',
  'Beni heyecanlandıran hayallerime doğru güvenle ve neşeyle yürüyorum.',
];

const DAILY_MICRO_ACTIONS_LIBRARY = [
  'Bugün 15 dakika telefonunu sessize al ve en çok ertelediğin işin ilk adımını sakince at.',
  '15 dakikanı derin nefes alarak gökyüzüne bakmaya veya sakin bir yürüyüşe ayır.',
  'Sana ilham veren bir hayalini vizyon panona yeni bir fotoğraf veya not olarak ekle.',
  'Kalpten değer verdiğin birine içten bir teşekkür veya takdir mesajı gönder.',
  'Bugün sadece 15 dakika boyunca dikkatin dağılmadan tek bir hedefe odaklan.',
  'Çalışma alanındaki gereksiz bir eşyayı kaldır ve zihninde yeni bir yer aç.',
];

/**
 * Deterministic Daily Horoscope Generator
 * Date + Sign bazlı hesaplar, böylece her gün otomatik değişir ve asla aynı kalmaz.
 */
export function generateDailyHoroscope(
  signName: string,
  date: Date = new Date(),
  userName: string = 'Selin'
): DailyHoroscope {
  const signObj = ALL_ZODIAC_SIGNS.find((s) => s.name === signName) || ALL_ZODIAC_SIGNS[1]; // default Boğa
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const dateFormatted = formatTurkishDate(date);

  // Hash seed combining date and sign
  const seed = `${dateStr}-${signObj.name}`;
  const h = getHash(seed);

  // Calculate Moon Phase & Moon Sign
  const moon = calculateMoonPhase(date);

  // Pick theme, wisdom, transit, etc.
  const themeIndex = (h + signObj.name.length) % COSMIC_THEMES.length;
  const cosmicTheme = COSMIC_THEMES[themeIndex];

  const wisdomList = ELEMENT_WISDOM[signObj.element] || ELEMENT_WISDOM['Toprak'];
  const elementWisdom = wisdomList[h % wisdomList.length];

  const transitIndex = (h + day) % PLANETARY_TRANSITS_LIBRARY.length;
  const planetaryTransit = PLANETARY_TRANSITS_LIBRARY[transitIndex];

  // Love, Career, Spirit scores (82 to 99 range for positive psychological reinforcement)
  const loveScore = 82 + ((h * 7) % 17);
  const careerScore = 80 + ((h * 13) % 19);
  const spiritScore = 84 + ((h * 19) % 16);

  // Lucky Hours
  const startH = 9 + (h % 9); // 09:00 - 17:00
  const startM = (h % 4) * 15;
  const endH = startH + 1 + (h % 2);
  const endM = ((startM + 30) % 60);
  const luckyHours = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')} — ${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

  const luckyColors = LUCKY_COLORS_LIBRARY[(h + 2) % LUCKY_COLORS_LIBRARY.length];
  const luckyCrystal = LUCKY_CRYSTALS_LIBRARY[(h + 4) % LUCKY_CRYSTALS_LIBRARY.length];
  const cosmicAffirmation = DAILY_AFFIRMATIONS_LIBRARY[(h + 1) % DAILY_AFFIRMATIONS_LIBRARY.length];
  const microAction = DAILY_MICRO_ACTIONS_LIBRARY[(h + 3) % DAILY_MICRO_ACTIONS_LIBRARY.length];

  // Personalized narrative paragraph
  const generalReading = `Sevgili ${userName}, bugün gökyüzünde ${planetaryTransit} açısı ve ${moon.sign} burcundaki ${moon.name} sana özel bir çekim alanı yaratıyor. ${elementWisdom} Hayatındaki önceliklerini netleştirmek ve kalıcı adımlar atmak için iç sesine kulak ver. Evren bugün senin huzurla attığın her sakin adımı cömertçe destekliyor.`;

  // Love, Career, Spirit details
  const loveAdvice =
    loveScore > 90
      ? 'Kalp çakran yüksek rezonansta. Samimi bir sohbet veya küçük bir jest kalıcı bir yakınlaşma sağlayabilir.'
      : 'Kendi sınırlarını ve içsel sevgini koruma günü. Kendine vereceğin şefkat, ilişkilerine de huzur olarak yansıyacak.';

  const careerAdvice =
    careerScore > 90
      ? 'Maddi konularda ve stratejik planlamalarda şans senin yanında. Yeni bir fikir veya adım bereket kapısı açabilir.'
      : 'Büyük kararları aceleye getirmeden, mevcut projelerini sağlamlaştırıp detayları mükemmelleştirme zamanı.';

  const spiritAdvice =
    spiritScore > 90
      ? 'Zihnin olağanüstü berrak. Meditasyon, 432Hz müzik veya 15 dakikalık sessizlik sana aradığın ilhamı getirecek.'
      : 'Düşünce karmaşasını kenara bırakıp ana odaklan. Derin bir nefes al ve her şeyin zamanında çözüleceğine güven.';

  return {
    dateStr,
    dateFormatted,
    sign: signObj.name,
    glyph: signObj.glyph,
    element: signObj.element,
    moonPhase: moon,
    planetaryTransit,
    cosmicTheme,
    generalReading,
    love: {
      score: loveScore,
      title: loveScore > 90 ? 'Derin Çekim & Ruhsal Uyum' : 'Duygusal Denge & Öz-Şefkat',
      advice: loveAdvice,
    },
    career: {
      score: careerScore,
      title: careerScore > 90 ? 'Bolluk Kapısı & Stratejik Başarı' : 'İstikrarlı İlerleme & Düzen',
      advice: careerAdvice,
    },
    spirit: {
      score: spiritScore,
      title: spiritScore > 90 ? 'Kristal Berraklık & Yüksek Sezgi' : 'İçsel Sükunet & Şarj Olma',
      advice: spiritAdvice,
    },
    luckyHours,
    luckyColors,
    luckyCrystal,
    cosmicAffirmation,
    microAction,
    transits: [
      {
        title: planetaryTransit,
        badge: 'Günün Ana Transitı',
        desc: `${signObj.name} için sezgisel ve pratik gücü artıran göksel hizalanma.`,
        icon: 'stars',
      },
      {
        title: `Ay ${moon.sign} Burcunda (${moon.name})`,
        badge: 'Duygusal Faz',
        desc: 'İçsel niyetleri somutlaştırmak ve zihni sakinleştirmek için ideal zemin.',
        icon: 'bedtime',
      },
      {
        title: `${signObj.ruler} Gezegen Koruması`,
        badge: 'Yönetici Güç',
        desc: `${signObj.name} burcunun yönetici gezegeni bugün kararlılık ve zarafet bahşediyor.`,
        icon: 'public',
      },
    ],
  };
}

/**
 * =========================================================================
 * 1. DİNAMİK GÜNLÜK MİZAÇ & ELEMENT DENGESİ MOTORU
 * Her gün tarihe ve burca göre element ağırlıklarını ve mizaç yorumunu günceller.
 * =========================================================================
 */
export interface DailyTemperamentData {
  dateFormatted: string;
  waterPercent: number;
  earthPercent: number;
  firePercent: number;
  airPercent: number;
  dominantElement: string;
  dominantSign: string;
  temperamentTitle: string;
  dailyInterpretation: string;
  balancingAdvice: string;
  bodilyState: string;
}

export function calculateDailyTemperament(
  date: Date = new Date(),
  signName: string = 'Boğa'
): DailyTemperamentData {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const seed = `${year}-${month}-${day}-${signName}-temperament`;
  const h = getHash(seed);
  const moon = calculateMoonPhase(date);

  // Dynamic distribution around user's base sign element
  const baseElement = ALL_ZODIAC_SIGNS.find((s) => s.name === signName)?.element || 'Toprak';

  let water = 20 + ((h * 3) % 22);
  let earth = 20 + ((h * 7) % 22);
  let fire = 15 + ((h * 5) % 20);
  let air = 15 + ((h * 11) % 20);

  // Boost based on Moon sign and base element
  if (moon.sign === 'Yengeç' || moon.sign === 'Akrep' || moon.sign === 'Balık') water += 8;
  if (moon.sign === 'Boğa' || moon.sign === 'Başak' || moon.sign === 'Oğlak') earth += 8;
  if (moon.sign === 'Koç' || moon.sign === 'Aslan' || moon.sign === 'Yay') fire += 8;
  if (moon.sign === 'İkizler' || moon.sign === 'Terazi' || moon.sign === 'Kova') air += 8;

  if (baseElement === 'Su') water += 10;
  if (baseElement === 'Toprak') earth += 10;
  if (baseElement === 'Ateş') fire += 10;
  if (baseElement === 'Hava') air += 10;

  // Normalize to 100%
  const total = water + earth + fire + air;
  const waterPercent = Math.round((water / total) * 100);
  const earthPercent = Math.round((earth / total) * 100);
  const firePercent = Math.round((fire / total) * 100);
  const airPercent = 100 - (waterPercent + earthPercent + firePercent);

  // Determine dominant
  const elements = [
    { name: 'Su', p: waterPercent, trait: 'Sezgi, Duygusal Zenginlik & Empati' },
    { name: 'Toprak', p: earthPercent, trait: 'İstikrar, Sarsılmaz Disiplin & Maddeleşme' },
    { name: 'Ateş', p: firePercent, trait: 'Tutku, Yaşam Gücü & Eylem Cesareti' },
    { name: 'Hava', p: airPercent, trait: 'Zihinsel Netlik, Vizyon & Stratejik İletişim' },
  ].sort((a, b) => b.p - a.p);

  const top1 = elements[0];
  const top2 = elements[1];

  const temperamentTitle = `${top1.name} & ${top2.name} Uyumlu Mizaç`;

  const dailyInterpretation = `Bugün gökyüzünde Ay'ın ${moon.sign} geçişiyle ${top1.name} elementi %${top1.p} seviyesinde baskın durumda. ${top1.trait} enerjisi, ${top2.name} elementinin (%${top2.p}) pratikliğiyle birleşiyor. Kararlarında acele etmek yerine içsel sezgilerine güvenmek, sana günün en stratejik avantajını kazandıracak.`;

  const balancingAdvice =
    top1.name === 'Su'
      ? 'Su elementi yüksekken duygusal dalgalanmaları önlemek için 10 dakika topraklanma yürüyüşü yap veya bitki çayı eşliğinde sessizce nefesine odaklan.'
      : top1.name === 'Toprak'
      ? 'Toprak elementi yüksekken aşırı katı planlardan kaçın; gününe hafif müzik ve küçük yaratıcı molalar ekleyerek zihnini esnet.'
      : top1.name === 'Ateş'
      ? 'Ateş enerjisi yüksekken ani tepkiler yerine bu gücü ertelediğin zor bir projeyi tek oturuşta bitirmek için kanalize et.'
      : 'Hava elementi yüksekken zihinsel yorgunluğu önlemek için ekran süreni sınırla ve derin nefes egzersizleriyle bedenine geri dön.';

  const bodilyState = `${top1.name} Ağırlıklı • Sakin Kalp Ritmi & Yüksek Odak`;

  return {
    dateFormatted: formatTurkishDate(date),
    waterPercent,
    earthPercent,
    firePercent,
    airPercent,
    dominantElement: top1.name,
    dominantSign: `${top1.name} (%${top1.p}) & ${top2.name} (%${top2.p})`,
    temperamentTitle,
    dailyInterpretation,
    balancingAdvice,
    bodilyState,
  };
}

/**
 * =========================================================================
 * 2. DİNAMİK GÜNLÜK & HAFTALIK GEZEGEN YORUMLARI MOTORU
 * Her gün/hafta değişen transit dereceleri, ev konumları ve derin psikolojik tavsiyeler.
 * =========================================================================
 */
export interface DynamicPlanetData {
  id: string;
  name: string;
  symbol: string;
  sign: string;
  house: string;
  degree: string;
  theme: string;
  weeklyForecast: string;
  dailyAdvice: string;
  statusBadge: string;
  isRetrograde?: boolean;
}

export function generateDynamicPlanets(
  date: Date = new Date(),
  signName: string = 'Boğa'
): DynamicPlanetData[] {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekNumber = Math.ceil(day / 7);
  const seed = `${year}-${month}-w${weekNumber}-${signName}`;
  const h = getHash(seed);

  return [
    {
      id: 'sun',
      name: 'Güneş',
      symbol: '☉',
      sign: signName,
      house: '10. Ev MC',
      degree: `${18 + (h % 11)}° ${signName}`,
      theme: 'Kariyer Mirası & Özgüven Rezonansı',
      weeklyForecast: `Bu hafta Güneş, ${signName} burcunun 10. evinde parlarken profesyonel alanda yeteneklerini çekinmeden sergilemeni destekliyor.`,
      dailyAdvice: 'Bugün üst düzey yetkililerle veya ortaklarla yapacağın görüşmelerde net ve sakin duruşunla fark yaratacaksın.',
      statusBadge: 'Kozmik Merkez',
    },
    {
      id: 'moon',
      name: 'Ay',
      symbol: '☽',
      sign: calculateMoonPhase(date).sign,
      house: '4. Ev Nadir',
      degree: `${12 + ((h * 3) % 15)}° ${calculateMoonPhase(date).sign}`,
      theme: 'Duygusal Güven & Yuva Sükûneti',
      weeklyForecast: `Ay bu hafta ${calculateMoonPhase(date).sign} burcunda ilerlerken iç sesini dinlemek ve evinde huzurlu bir sığınak yaratmak önem kazanıyor.`,
      dailyAdvice: 'Akşam saatlerinde 432Hz frekansı ve loş ışıkta dinlenmek aurandaki tüm günün yorgunluğunu temizleyecek.',
      statusBadge: 'Günlük Hızlı Faz',
    },
    {
      id: 'rising',
      name: 'Yükselen (ASC)',
      symbol: 'Asc',
      sign: 'Akrep',
      house: '1. Ev Başlangıcı',
      degree: `${8 + (h % 7)}° Akrep`,
      theme: 'Karizma & Manyetik Çekim',
      weeklyForecast: 'İlk izlenimlerdeki derinliğin ve sezgisel gözlem gücün insanlarda derin bir saygı uyandırıyor.',
      dailyAdvice: 'Sözcüklerini özenle seç; bugün kuracağın tek bir samimi cümle kapalı kapıları aralayabilir.',
      statusBadge: 'Kişisel Maske',
    },
    {
      id: 'mercury',
      name: 'Merkür',
      symbol: '☿',
      sign: 'İkizler',
      house: '3. Ev Zihin',
      degree: `${14 + (h % 12)}° İkizler`,
      theme: 'Keskin Zeka & Stratejik İletişim',
      weeklyForecast: 'Merkür düz hareketteyken yazılı projeler, sözleşmeler ve fikir alışverişleri için en verimli göksel dönemdesin.',
      dailyAdvice: 'Aklına gelen yeni vizyon fikirlerini hemen not al; birkaçı önümüzdeki aylarda büyük bir projeye dönüşebilir.',
      statusBadge: 'Doğrudan Akış',
    },
    {
      id: 'venus',
      name: 'Venüs',
      symbol: '♀',
      sign: 'Balık',
      house: '11. Ev Vizyon',
      degree: `${21 + (h % 8)}° Balık`,
      theme: 'Yüce Aşk, Estetik & Zenginlik',
      weeklyForecast: 'Venüs Balık burcunda yücelirken sanatsal yaratıcılığın ve dostluk ilişkilerindeki cömertliğin zirvede.',
      dailyAdvice: 'İlişkilerinde affedici ve anlayışlı ol; sevdiklerine yapacağın küçük bir jest kalıcı bir yakınlaşma sağlayacak.',
      statusBadge: 'Yücelimde',
    },
    {
      id: 'mars',
      name: 'Mars',
      symbol: '♂',
      sign: 'Oğlak',
      house: '2. Ev Değerler',
      degree: `${9 + (h % 14)}° Oğlak`,
      theme: 'Pratik Eylem & Sarsılmaz Disiplin',
      weeklyForecast: 'Mars Oğlak burcunda en yüksek disiplinini sergiliyor. Hedeflerini ertelemek yerine adım adım inşa etme haftası.',
      dailyAdvice: 'Fiziksel enerjini sabah saatlerinde en zorlu görevine ayır; zihnin berrakken engelleri hızla aşacaksın.',
      statusBadge: 'Güçlü Konum',
    },
    {
      id: 'jupiter',
      name: 'Jüpiter',
      symbol: '♃',
      sign: 'Boğa',
      house: '10. Ev Genişleme',
      degree: `${16 + (h % 10)}° Boğa`,
      theme: 'Büyük Bereket & Maddi Genişleme',
      weeklyForecast: 'Bolluk gezegeni Jüpiter burcunda ilerlerken uzun vadeli yatırımlar ve vizyon projeleri için göksel kapılar açık.',
      dailyAdvice: 'Kendini küçük düşüncelerle sınırlama; evren senin cömertçe genişlemeni ve değer üretmeni istiyor.',
      statusBadge: 'Büyük Şans',
    },
    {
      id: 'saturn',
      name: 'Satürn',
      symbol: '♄',
      sign: 'Balık',
      house: '8. Ev Dönüşüm',
      degree: `${11 + (h % 6)}° Balık`,
      theme: 'Zamanın Bilgeliği & Sabır Sınavı',
      weeklyForecast: 'Satürn seni acelecilikten koruyarak sağlam temeller atmanı sağlıyor. Sabırla ektiğin tohumlar kalıcı olacak.',
      dailyAdvice: 'Bugün zaman yönetimine sadık kal; kısa vadeli hazlar yerine uzun vadeli huzuru tercih et.',
      statusBadge: 'Karmik Öğretmen',
    },
  ];
}

/**
 * =========================================================================
 * 3. GÜNÜN TRANSİTLERİ & CANLI AÇILAR MOTORU
 * Her gün değişen göksel açılar, tam dereceler, zirve saatler ve günlük pratik rehber.
 * =========================================================================
 */
export interface DynamicDailyTransit {
  id: string;
  title: string;
  aspectDegree: string;
  badge: string;
  peakHours: string;
  impactTheme: string;
  detailedReading: string;
  practicalTip: string;
  icon: string;
  resonanceTone: string;
}

export function generateDailyTransits(
  date: Date = new Date(),
  signName: string = 'Boğa'
): DynamicDailyTransit[] {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const seed = `${year}-${month}-${day}-${signName}-transits`;
  const h = getHash(seed);
  const moon = calculateMoonPhase(date);

  const transitPool: DynamicDailyTransit[] = [
    {
      id: 't1',
      title: 'Venüs Üçgen Neptün (120°)',
      aspectDegree: '120° Uyumlu Üçgen Açı',
      badge: 'Günün Zirve Açısı',
      peakHours: '10:30 — 16:45',
      impactTheme: 'Sanatsal İlham, Aşk & Sezgisel Zenginlik',
      detailedReading: `Bugün Venüs ile Neptün arasındaki 120° su üçgeni, ${signName} için yaratıcı ilham kapılarını ardına kadar açıyor. Duygusal bağlarda şefkat, estetik projelerde ise olağanüstü bir vizyon akışı sunuyor.`,
      practicalTip: 'Bugün önemli bir tasarım veya ilişki konuşması için en uygun saatler 11:00 ile 15:30 arasıdır.',
      icon: 'auto_awesome',
      resonanceTone: '#00dce6',
    },
    {
      id: 't2',
      title: `Ay ${moon.sign} Burcunda (${moon.name})`,
      aspectDegree: `${moon.percent}% Aydınlanma`,
      badge: 'Canlı Ay Fazı',
      peakHours: 'Tüm Gün Aktif',
      impactTheme: 'Bilinçaltı Berraklığı & Niyet Manyetizması',
      detailedReading: `Ay'ın ${moon.sign} burcundaki seyri, duygusal merkezini güçlendiriyor. Zihinsel karmaşayı arkada bırakıp içsel sükunetine sığınmak için gökyüzü sana tam destek veriyor.`,
      practicalTip: 'Akşam saatlerinde günün tefekkürünü okuyup 3 derin niyetini zihninde canlandır.',
      icon: 'bedtime',
      resonanceTone: '#d5baff',
    },
    {
      id: 't3',
      title: 'Güneş Sekstil Satürn (60°)',
      aspectDegree: '60° Pratik Fırsat Açısı',
      badge: 'Kalıcı Başarı',
      peakHours: '09:00 — 14:00',
      impactTheme: 'Özdisiplin, Güvenilirlik & Miras İnşası',
      detailedReading: `Güneş ve Satürn uyumu, atacağın adımların sağlam ve uzun ömürlü olmasını sağlıyor. İrade gücün yüksek; ertelediğin stratejik bir görevi tamamlamak için kusursuz bir gün.`,
      practicalTip: 'Günün en zorlu veya dikkat isteyen işini ilk sıraya al; beklenmedik bir hızla çözeceksin.',
      icon: 'verified',
      resonanceTone: '#f5d061',
    },
    {
      id: 't4',
      title: 'Merkür Trine Jüpiter (120°)',
      aspectDegree: '120° Bereket Açısı',
      badge: 'Fırsat & Şans',
      peakHours: '14:00 — 19:30',
      impactTheme: 'Zihinsel Genişleme, Anlaşmalar & Müjde',
      detailedReading: `Zihin gezegeni Merkür ile şans gezegeni Jüpiter arasındaki uyum, iyi haberler ve karlı fikirler getiriyor. İletişim trafiğin bereketli ve yapıcı akacak.`,
      practicalTip: 'Yeni bir teklif sunmak veya uzun süredir beklediğin bir kişiye yazmak için bu açıyı kullan.',
      icon: 'stars',
      resonanceTone: '#ffe484',
    },
    {
      id: 't5',
      title: 'Mars Sekstil Uranüs (60°)',
      aspectDegree: '60° Dinamik Dönüşüm',
      badge: 'Yenilikçi Güç',
      peakHours: '16:00 — 21:00',
      impactTheme: 'Alışılmışın Dışına Çıkma & Cesur Adım',
      detailedReading: 'Geleneksel yöntemlerin tıkandığı yerde sana yenilikçi ve sıra dışı bir çıkış yolu sunan dinamik bir ivme.',
      practicalTip: 'Rutin bir alışkanlığını bugün bilinçli olarak farklı yap; zihninde yeni nöral yollar açılacak.',
      icon: 'bolt',
      resonanceTone: '#ff9d5c',
    },
  ];

  // Rotate based on hash so each day highlights different transits
  const startIndex = h % transitPool.length;
  const result: DynamicDailyTransit[] = [];
  for (let i = 0; i < 4; i++) {
    result.push(transitPool[(startIndex + i) % transitPool.length]);
  }
  return result;
}

