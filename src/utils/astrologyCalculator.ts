/**
 * Veira Cosmos Astrological Engine
 * Sade, samimi ve herkesin kolayca anlayabileceği astroloji hesaplama ve anlamlandırma motoru.
 */

export interface NatalChartData {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  birthPlace: string;
  sun: {
    sign: string;
    glyph: string;
    element: string;
    house: number;
    title: string;
    description: string;
    manifestation: string;
    strokeColor: string;
  };
  moon: {
    sign: string;
    glyph: string;
    element: string;
    house: number;
    title: string;
    description: string;
    manifestation: string;
    strokeColor: string;
  };
  rising: {
    sign: string;
    glyph: string;
    element: string;
    house: number;
    title: string;
    description: string;
    manifestation: string;
    strokeColor: string;
  };
  peakWindow: {
    start: string;
    end: string;
    label: string;
  };
  lifeAreas: {
    money: {
      sign: string;
      signGlyph: string;
      title: string;
      subtitle: string;
      tip: string;
      matchPercent: number;
      imageUrl: string;
    };
    wellness: {
      sign: string;
      signGlyph: string;
      title: string;
      subtitle: string;
      tip: string;
      matchPercent: number;
      imageUrl: string;
    };
    career: {
      sign: string;
      signGlyph: string;
      title: string;
      subtitle: string;
      tip: string;
      matchPercent: number;
      imageUrl: string;
    };
  };
  alignmentPercent: number;
  dailyAdvice: {
    title: string;
    subtitle: string;
    description: string;
    step: string;
    durationMinutes: number;
  };
  transits: Array<{
    icon: string;
    title: string;
    subtitle: string;
    description: string;
    statusBadge: string;
    timeWindow: string;
  }>;
}

const ZODIAC_SIGNS = [
  { name: 'Koç', glyph: '♈︎', element: 'Ateş', startMonth: 3, startDay: 21 },
  { name: 'Boğa', glyph: '♉︎', element: 'Toprak', startMonth: 4, startDay: 20 },
  { name: 'İkizler', glyph: '♊︎', element: 'Hava', startMonth: 5, startDay: 21 },
  { name: 'Yengeç', glyph: '♋︎', element: 'Su', startMonth: 6, startDay: 21 },
  { name: 'Aslan', glyph: '♌︎', element: 'Ateş', startMonth: 7, startDay: 23 },
  { name: 'Başak', glyph: '♍︎', element: 'Toprak', startMonth: 8, startDay: 23 },
  { name: 'Terazi', glyph: '♎︎', element: 'Hava', startMonth: 9, startDay: 23 },
  { name: 'Akrep', glyph: '♏︎', element: 'Su', startMonth: 10, startDay: 23 },
  { name: 'Yay', glyph: '♐︎', element: 'Ateş', startMonth: 11, startDay: 22 },
  { name: 'Oğlak', glyph: '♑︎', element: 'Toprak', startMonth: 12, startDay: 22 },
  { name: 'Kova', glyph: '♒︎', element: 'Hava', startMonth: 1, startDay: 20 },
  { name: 'Balık', glyph: '♓︎', element: 'Su', startMonth: 2, startDay: 19 },
];

export function getSunSignIndex(month: number, day: number): number {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 0; // Koç
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 1; // Boğa
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 2; // İkizler
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 3; // Yengeç
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 4; // Aslan
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 5; // Başak
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 6; // Terazi
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 7; // Akrep
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 8; // Yay
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 9; // Oğlak
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 10; // Kova
  return 11; // Balık
}

export function getRisingSignIndex(sunIndex: number, hour: number, minute: number): number {
  const totalHours = (hour + minute / 60 - 6 + 24) % 24;
  const signShift = Math.floor(totalHours / 2);
  return (sunIndex + signShift) % 12;
}

export function getMoonSignIndex(year: number, month: number, day: number, hour: number): number {
  const refDate = new Date(Date.UTC(2000, 0, 6, 18, 14));
  const birth = new Date(Date.UTC(year, month - 1, day, hour));
  const diffDays = (birth.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24);
  const lunarCycle = 27.321661;
  const signsTravelled = (diffDays / (lunarCycle / 12)) % 12;
  const rawIndex = Math.floor(9 + signsTravelled) % 12;
  return (rawIndex + 12) % 12;
}

// Sade, anlaşılır Güneş Burcu açıklamaları (Karakterin & Temel Enerjin)
const SUN_DESCRIPTIONS: Record<string, { summary: string; detail: string }> = {
  Koç: {
    summary: 'Cesur, enerjik, öncü ve kararlı bir lidersin.',
    detail: 'Harekete geçmekten çekinmezsin. Karşına çıkan zorluklar sana geri adım attırmak yerine azmini güçlendirir.',
  },
  Boğa: {
    summary: 'Sabırlı, üretken, güven arayan ve azimlisin.',
    detail: 'Başladığın işi sonuna kadar götürürsün. Hayatında kaliteye, huzura ve sağlam temellere çok önem verirsin.',
  },
  İkizler: {
    summary: 'Meraklı, iletişimi güçlü, zeki ve hızlı uyum sağlayan birisin.',
    detail: 'Yeni fikirler öğrenmek, insanlarla bağlantı kurmak ve çok yönlü düşünmek senin en büyük gücün.',
  },
  Yengeç: {
    summary: 'Duyarlı, koruyucu, sezgileri kuvvetli ve sevdiklerine bağlısın.',
    detail: 'İçten bağlar kurarsın. Kendi alanında huzurlu ve güvende hissetmek enerjini en çok besleyen şeydir.',
  },
  Aslan: {
    summary: 'Özgüvenli, cömert, ışıltılı ve ilham veren bir duruşun var.',
    detail: 'Yaratıcılığınla çevrene ışık saçarsın. Doğal bir caziben ve takdir edilmeyi seven sıcak bir kalbin var.',
  },
  Başak: {
    summary: 'Detaycı, çalışkan, düzenli ve pratik çözümler üreten birisin.',
    detail: 'Karmaşık işleri kolayca toparlarsın. İyileştirmek, faydalı olmak ve disiplin senin hayat felsefendir.',
  },
  Terazi: {
    summary: 'Zarif, adil, uzlaşmacı ve estetik zevki yüksek bir karakterin var.',
    detail: 'İlişkilerinde dengeyi korumayı seversin. Çatışmalardan uzak durup güzellik ve uyum yaratmaya odaklanırsın.',
  },
  Akrep: {
    summary: 'Güçlü sezgili, tutkulu, kararlı ve derin bir zihne sahipsin.',
    detail: 'Gözlem yeteneğin çok keskindir. Kolay kolay pes etmezsin; zorlukları içsel gücünle avantaja çevirirsin.',
  },
  Yay: {
    summary: 'İyimser, özgür ruhlu, keşfetmeyi seven ve vizyoner birisin.',
    detail: 'Yeni ufuklar, seyahatler ve bilgi peşinde koşarsın. Yaşam enerjin çevrendekilere de umut aşılar.',
  },
  Oğlak: {
    summary: 'Disiplinli, sorumluluk sahibi, hedef odaklı ve güvenilirdir.',
    detail: 'Adım adım zirveye tırmanmayı seversin. Kalıcı başarılar inşa etmek ve sözünün eri olmak senin damgandır.',
  },
  Kova: {
    summary: 'Özgün, yenilikçi, bağımsız ve geleceği öngören bir zekan var.',
    detail: 'Sıradan kalıplara sığmazsın. İlerici fikirlerinle fark yaratır, özgürlüğünden asla taviz vermezsin.',
  },
  Balık: {
    summary: 'Şefkatli, derin sezgili, hayal gücü geniş ve duyarlı bir ruhsun.',
    detail: 'İnsanların duygularını hemen hissedersin. Sanat, sakinlik ve iç huzur senin en büyük sığınağındır.',
  },
};

// Sade, anlaşılır Ay Burcu açıklamaları (İç Dünyan & Duygusal İhtiyaçların)
const MOON_DESCRIPTIONS: Record<string, { summary: string; detail: string }> = {
  Koç: {
    summary: 'Duygularını hızlı ve net yaşar, beklemekten hoşlanmazsın.',
    detail: 'İçinde sürekli bir heyecan vardır. Rahatlamak için hareket etmek veya yeni bir şeye başlamak sana iyi gelir.',
  },
  Boğa: {
    summary: 'Huzur, sakinlik ve güven ortamı sana iyi gelir.',
    detail: 'Duygusal olarak dengelisin. Karmaşadan uzak, rahat ve lezzetli anlar iç dünyanı hemen toparlar.',
  },
  İkizler: {
    summary: 'Duygularını konuşarak ve paylaşarak anlarsın.',
    detail: 'Zihnin çok aktiftir. Hislerini bir dostunla paylaşmak veya yazmak içindeki stresi hemen azaltır.',
  },
  Yengeç: {
    summary: 'Derin bağlar, sevgi dolu bir yuva ve anlayış ararsın.',
    detail: 'Sezgilerin adeta bir pusuladır. Sevdiklerinle baş başa kalıp sıcak bir ortamda dinlenmek sana şifa olur.',
  },
  Aslan: {
    summary: 'Sevilmek, değer görmek ve sıcaklıkla kucaklanmak istersin.',
    detail: 'Duygularında cömert ve gururlusun. Neşeli etkinlikler ve takdir edilmek içindeki çocuğu sevindirir.',
  },
  Başak: {
    summary: 'İç dünyanda düzen ve faydalı olma arzusu vardır.',
    detail: 'Belirsizlik seni yorar. Günlük işlerini sıraya koyup etrafını düzenlemek kafanı hızla rahatlatır.',
  },
  Terazi: {
    summary: 'Duygusal dengede kalmak ve huzurlu ilişkiler kurmak istersin.',
    detail: 'Yalnızlık yerine sevdiklerinle uyum içinde olmak ve estetik bir ortamda bulunmak seni sakinleştirir.',
  },
  Akrep: {
    summary: 'Duygularını çok derin, tutkulu ve sessizce yaşarsın.',
    detail: 'Herkesle hemen açılmazsın ama güvendiğin insanlara sonsuz sadakat duyarsın. Güçlü bir içsel yenilenme gücün var.',
  },
  Yay: {
    summary: 'İçsel olarak iyimser ve özgürlüğüne düşkünsün.',
    detail: 'Duygusal baskıya gelemezsin. Açık havada yürümek veya yeni planlar yapmak ruhunu hemen ferahlatır.',
  },
  Oğlak: {
    summary: 'Duygularını kontrol altında tutmayı ve sağlam durmayı tercih edersin.',
    detail: 'Zayıf görünmekten hoşlanmazsın. Somut hedeflerine doğru ilerlediğini görmek iç huzurunu sağlar.',
  },
  Kova: {
    summary: 'Hislerine mantıkla yaklaşır, zihinsel bağımsızlığına önem verirsin.',
    detail: 'Duygularında boğulmak yerine sakin bir mesafe koyarsın. Kendine ait zaman geçirmek seni yeniler.',
  },
  Balık: {
    summary: 'Çok hassas, şefkatli ve sezgileri olağanüstü bir iç dünyan var.',
    detail: 'Çevrenin enerjisinden çabuk etkilenirsin. Müzik dinlemek, su kenarında olmak ve dinlenmek ruhunu arındırır.',
  },
};

// Sade, anlaşılır Yükselen Burç açıklamaları (Dışarıya Yansıttığın Enerji / İlk İzlenim)
const RISING_DESCRIPTIONS: Record<string, { summary: string; detail: string }> = {
  Koç: {
    summary: 'Dışarıdan enerjik, kendinden emin ve girişimci görünürsün.',
    detail: 'Ortama girdiğinde hemen fark edilirsin. Hızlı kararlar alır ve beklemeyi sevmezsin.',
  },
  Boğa: {
    summary: 'Dışarıya güven veren, sakin, sağlam ve kararlı bir hava yayarsın.',
    detail: 'Acele etmezsin ama adımların çok nettir. İnsanlar senin yanındayken kendini güvende hisseder.',
  },
  İkizler: {
    summary: 'Güler yüzlü, meraklı, konuşkan ve cana yakın bir ilk izlenim bırakırsın.',
    detail: 'Gözlerin canlıdır, sohbeti hemen başlatırsın ve her konuya kolayca ayak uydurursun.',
  },
  Yengeç: {
    summary: 'Sıcak, sevecen, koruyucu ve güven verici bir duruşun var.',
    detail: 'İnsanlara şefkatle yaklaşırsın. Samimi tavırların çevrendekilerin sana çabucak güvenmesini sağlar.',
  },
  Aslan: {
    summary: 'Işıltılı, dik duruşlu, etkileyici ve dikkat çeken bir auraya sahipsin.',
    detail: 'Girdiğin odada enerjin hemen hissedilir. Doğal bir zarafet ve özgüvenle hareket edersin.',
  },
  Başak: {
    summary: 'Kibar, derli toplu, dikkatli ve zeki bir izlenim verirsin.',
    detail: 'Gözlemcisin ve detayları asla kaçırmazsın. Güvenilir ve özenli tarzın insanlarda saygı uyandırır.',
  },
  Terazi: {
    summary: 'Çok zarif, sempatik, dengeli ve hoşsohbet bir enerjin vardır.',
    detail: 'Giyiminde ve tarzında estetik ön plandadır. İnsanlarla kolayca köprü kurar ve sevgiyle karşılanırsın.',
  },
  Akrep: {
    summary: 'Derin bakışlı, gizemli, güçlü ve karizmatik bir duruşun var.',
    detail: 'İlk başta mesafeli durabilirsin ama auran çok çekicidir. İnsanlar senin içsel gücünü hemen hisseder.',
  },
  Yay: {
    summary: 'Neşeli, açık sözlü, dinamik ve pozitif bir enerji yayarsın.',
    detail: 'Gülümsemen samimidir. İnsanlara ilham verir ve maceraya hazır bir hava bırakırsın.',
  },
  Oğlak: {
    summary: 'Ciddi, olgun, saygıdeğer ve işini bilen bir izlenim uyandırırsın.',
    detail: 'Boş konuşmazsın. Duruşun oturaklıdır ve insanlar sana hemen sorumluluk emanet etmek ister.',
  },
  Kova: {
    summary: 'Farklı, özgün, modern ve zeki bir tarzın vardır.',
    detail: 'Kalıplara uymazsın. Arkadaş canlısı ama bağımsız tavrın seni ilgi çekici kılar.',
  },
  Balık: {
    summary: 'Yumuşak, nazik, hülyalı ve büyüleyici bir enerjin var.',
    detail: 'Gözlerin derin ve anlamlıdır. İnsanları yargılamadan dinleyen sakinleştirici bir havan vardır.',
  },
};

// Sade Günün Tavsiyeleri
const DAILY_ADVICE: Record<string, { title: string; subtitle: string; description: string; step: string }> = {
  Koç: {
    title: 'Harekete Geçme ve Başlama Zamanı',
    subtitle: 'Koç Ateşi ile Güçlü Adım',
    description: 'Aklındaki bir fikri daha fazla erteleme. İlk adımı atmak için bugün gökyüzü sana cesaret veriyor.',
    step: 'Ertelediğin tek bir işi belirle ve ilk 15 dakikasını hemen tamamla.',
  },
  Boğa: {
    title: 'Düzenini ve Hedefini Sağlamlaştır',
    subtitle: 'Boğa Kararlılığı ile Netlik',
    description: 'Sabrının karşılığını alma zamanı. Hedeflerini netleştirip acele etmeden sağlam bir adım atabilirsin.',
    step: 'Günün en önemli görevini seç, dikkat dağıtıcıları kapat ve 15 dakika sadece ona odaklan.',
  },
  İkizler: {
    title: 'Zihnini Netleştir ve İletişim Kur',
    subtitle: 'İkizler Zekası ile İletişim',
    description: 'Kafandaki fikirleri toparlama ve önemli bir konuşmayı ya da yazışmayı tamamlama günü.',
    step: 'Uzun süredir ertelediğin önemli bir mesajı, e-postayı veya planı 15 dakikada bitir.',
  },
  Yengeç: {
    title: 'Kendi Alanına ve Enerjine Odaklan',
    subtitle: 'Yengeç Şefkati ile İç Huzur',
    description: 'Bugün dışarıdaki gürültüden uzaklaşıp kendi niyetlerine odaklanmak sana çok iyi gelecek.',
    step: '15 dakika boyunca sessiz bir alanda oturup günün hedefini ve hislerini gözden geçir.',
  },
  Aslan: {
    title: 'Kendini Göster ve Yeteneğine Güven',
    subtitle: 'Aslan Özgüveni ile Parlama',
    description: 'Yeteneklerini saklama günü değil. Yapabileceğin şeyleri güvenle ortaya koy.',
    step: 'Gelecek planların için önemli bir taslağı veya çalışmayı 15 dakikada tamamla.',
  },
  Başak: {
    title: 'Küçük Bir Düzen Büyük Fark Yaratır',
    subtitle: 'Başak Düzeni ile Kolaylık',
    description: 'Gözünde büyüyen bir işi küçük parçalara ayırıp hemen çözebilirsin.',
    step: 'Masandaki ya da telefonundaki dağınıklığı toparla ve 15 dakika odaklanarak çalış.',
  },
  Terazi: {
    title: 'Dengeyi Koru ve Kararını Ver',
    subtitle: 'Terazi Zarafeti ile Uyum',
    description: 'İki seçenek arasında kararsız kaldıysan kalbinin sesini dinle ve netleş.',
    step: 'Ertelediğin bir kararı kağıda dök ve 15 dakikada ilk pratik adımı planla.',
  },
  Akrep: {
    title: 'Derin Odaklanma ve Kararlılık',
    subtitle: 'Akrep İradesi ile Güç',
    description: 'Bugün odaklanma gücün en üst seviyede. Zihnini dağıtan şeyleri eleyip sonuca odaklan.',
    step: 'En zorlandığın görevi seç ve 15 dakika boyunca dikkatin dağılmadan ilerle.',
  },
  Yay: {
    title: 'Geniş Düşün ve Yeni Bir Kapı Aç',
    subtitle: 'Yay İyimserliği ile Vizyon',
    description: 'Günlük dertlerin ötesine bak. Uzun vadeli hedefin için umut dolu bir hamle yap.',
    step: 'Kendini geliştirecek bir makale oku, video izle veya planını 15 dakika gözden geçir.',
  },
  Oğlak: {
    title: 'Adım Adım Başarıya İlerle',
    subtitle: 'Oğlak Disiplini ile Sağlam Adım',
    description: 'Büyük hedefler sabırlı küçük adımlarla kazanılır. Bugün attığın adım geleceğine yatırım olacak.',
    step: 'Geleceğin için önemli bir görevin ilk aşamasını 15 dakikada bitir.',
  },
  Kova: {
    title: 'Yaratıcı Bir Çözüm Üret',
    subtitle: 'Kova Özgünlüğü ile Yenilik',
    description: 'Klasik yöntemleri bir kenara bırak. Farklı ve pratik bir bakış açısıyla işini kolaylaştır.',
    step: 'Seni tıkayan bir probleme 15 dakika yeni bir gözle bak ve çözümü yaz.',
  },
  Balık: {
    title: 'İç Sesine Kulak Ver ve Sakinleş',
    subtitle: 'Balık Dinginliği ile Huzur',
    description: 'Sezgilerin sana doğru yolu gösteriyor. Zihnini sakinleştirip niyetlerine inan.',
    step: '15 dakika dinlendirici bir müzik eşliğinde hayalini gözünde canlandır ve not al.',
  },
};

/**
 * Kişiselleştirilmiş, sadeleştirilmiş doğum haritası ve astrolojik veriler
 */
export function calculateNatalChart(params: {
  name?: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}): NatalChartData {
  const name = params.name?.trim() || 'Selin';
  const [yearStr, monthStr, dayStr] = params.birthDate.split('-');
  const year = parseInt(yearStr || '1998', 10);
  const month = parseInt(monthStr || '5', 10);
  const day = parseInt(dayStr || '14', 10);

  const [hourStr, minStr] = params.birthTime.split(':');
  const hour = parseInt(hourStr || '14', 10);
  const minute = parseInt(minStr || '30', 10);

  const sunIdx = getSunSignIndex(month, day);
  const risingIdx = getRisingSignIndex(sunIdx, hour, minute);
  const moonIdx = getMoonSignIndex(year, month, day, hour);

  const sunSign = ZODIAC_SIGNS[sunIdx];
  const risingSign = ZODIAC_SIGNS[risingIdx];
  const moonSign = ZODIAC_SIGNS[moonIdx];

  // Kişisel en verimli saatler (doğum saatine göre dengelenmiş odak aralığı)
  const startHour = Math.max(0, (hour - 1) % 24);
  const endHour = (hour + 2) % 24;
  const startStr = `${String(startHour).padStart(2, '0')}:00`;
  const endStr = `${String(endHour).padStart(2, '0')}:30`;

  const sunHouse = ((sunIdx - risingIdx + 12) % 12) + 1;
  const moonHouse = ((moonIdx - risingIdx + 12) % 12) + 1;

  const sunInfo = SUN_DESCRIPTIONS[sunSign.name] || SUN_DESCRIPTIONS['Boğa'];
  const moonInfo = MOON_DESCRIPTIONS[moonSign.name] || MOON_DESCRIPTIONS['Balık'];
  const risingInfo = RISING_DESCRIPTIONS[risingSign.name] || RISING_DESCRIPTIONS['Akrep'];
  const adviceInfo = DAILY_ADVICE[sunSign.name] || DAILY_ADVICE['Boğa'];

  return {
    name,
    birthDate: params.birthDate,
    birthTime: params.birthTime,
    birthPlace: params.birthPlace || 'İstanbul',
    sun: {
      sign: sunSign.name,
      glyph: sunSign.glyph,
      element: sunSign.element,
      house: sunHouse,
      title: `Güneş Burcun: ${sunSign.name}`,
      description: `${sunInfo.summary} ${sunInfo.detail}`,
      manifestation: sunInfo.summary,
      strokeColor: '#ffe05c',
    },
    moon: {
      sign: moonSign.name,
      glyph: moonSign.glyph,
      element: moonSign.element,
      house: moonHouse,
      title: `Ay Burcun: ${moonSign.name}`,
      description: `${moonInfo.summary} ${moonInfo.detail}`,
      manifestation: moonInfo.summary,
      strokeColor: '#00f2fe',
    },
    rising: {
      sign: risingSign.name,
      glyph: risingSign.glyph,
      element: risingSign.element,
      house: 1,
      title: `Yükselen Burcun: ${risingSign.name}`,
      description: `${risingInfo.summary} ${risingInfo.detail}`,
      manifestation: risingInfo.summary,
      strokeColor: '#d5baff',
    },
    peakWindow: {
      start: startStr,
      end: endStr,
      label: 'ODAK SAATLERİ',
    },
    lifeAreas: {
      money: {
        sign: sunSign.name,
        signGlyph: sunSign.glyph,
        title: 'Maddi Güç & Para',
        subtitle: 'Bolluk ve Kazanç',
        tip: 'Emeklerinin karşılığını alma ve bütçeni doğru yönlendirme dönemi.',
        matchPercent: 88,
        imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuByPw1SPYrS7Z8OkvJW_0mj5jbh-asSI0Ar7J5P_cv2GzaWrgGQ2ZMcAyevrWnktM9m1QenvfC3_0LYDT-iCUqrlCvmImHXuf2hgKw_UU21X0YvkGwLvzJAR2tSewuGcseuoxO7co0AFcn3E8s59u4C3kKQo7FpS1DkoEtjxU5-QN1Sk9mm9__QE6yyPM3tz2ZMJmlZY-AXZ0MYOBSzf7HSTsBcWaHLud7qPbdEoAc',
      },
      wellness: {
        sign: moonSign.name,
        signGlyph: moonSign.glyph,
        title: 'Beden & Zindelik',
        subtitle: 'Sağlık ve Huzur',
        tip: 'Düzenli uyku, hafif beslenme ve temiz hava sana müthiş enerji verecek.',
        matchPercent: 94,
        imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuD8mLHdpKhEs3N45kMM63lpyvVHMc2lNm5xUFw4ENQn2q0gZH3_zj5LmRomy3kh9V-i217XlnXSk8v2KUG7UfjdxXS3nXJSk800kgqxdA7bCnzpB5nXSgTKOfGgK3jRxkmpa66EvbvDmmZlYepZmpuzW0RgXM84nzAaPIxc2-Lit9WW_A5W5NYEYOFvOgKLYsg5VV-3ossDGfgYtvER88ZjzivpwrBbzTUFURINfwg',
      },
      career: {
        sign: risingSign.name,
        signGlyph: risingSign.glyph,
        title: 'Kariyer & Başarı',
        subtitle: 'İş ve Gelecek',
        tip: 'Kendine ve yeteneklerine güvenip yeni adımlar atma zamanındasın.',
        matchPercent: 96,
        imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCmjjPwagQM0UXPnqyhd4wfopjua6rc_z_D6tUYSY-y4co71qOcCBdnt10dRixdx2bOYz4Z2xpCVEPRZUh8mBSm11fzQnRc6rBYyddtZbJhsuT9jwo3GlYVKupHrmhQYLLtw79G3HkukL8bGVfQs6cg024HQQ2_FnvuBEJ2-gm9-C0kh2_FHzZ3G6bQh5MmYF_eXHNULwNxUSq7HR5dRIBb0NZo8przdzhw8FgePqI',
      },
    },
    alignmentPercent: 98,
    dailyAdvice: {
      title: adviceInfo.title,
      subtitle: adviceInfo.subtitle,
      description: adviceInfo.description,
      step: adviceInfo.step,
      durationMinutes: 15,
    },
    transits: [
      {
        icon: 'stars',
        title: 'Fırsatlar ve Şans Enerjisi',
        subtitle: 'Günün Destekleyici Etkisi',
        description: `İlişkilerinde uyum, yeni başlangıçlar ve güzel haberler için destekleyici bir enerji var. Özellikle saat ${startStr} - ${endStr} arası çok verimli.`,
        statusBadge: 'GÜÇLÜ',
        timeWindow: `${startStr} - ${endStr}`,
      },
      {
        icon: 'task_alt',
        title: 'Disiplin ve Planlama Zamanı',
        subtitle: 'Uzun Vadeli Düzen',
        description: 'Ertelediğin işleri sıraya koyup tamamlamak için gökyüzü sana odaklanma ve sabır gücü veriyor.',
        statusBadge: 'AKTİF',
        timeWindow: 'Tüm Gün Etkili',
      },
    ],
  };
}

const STORAGE_KEY = 'veira_user_birth_chart';

export function getStoredNatalChart(): NatalChartData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveStoredNatalChart(data: NatalChartData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // fallback
  }
}

export function clearStoredNatalChart(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // fallback
  }
}
