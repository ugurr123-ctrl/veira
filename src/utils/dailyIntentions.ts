export interface DailyIntention {
  id: string;
  tag: string;
  quote: string;
  subtext: string;
  category: 'odak' | 'bolluk' | 'dinginlik' | 'canlilik' | 'cesaret' | 'sukran';
}

export const CURATED_INTENTIONS: DailyIntention[] = [
  {
    id: 'int-1',
    tag: 'Odak & İstikrar',
    quote: 'Bugün attığım her 15 dakikalık bilinçli adım, vizyonumun mimarisini güvenle inşa eder.',
    subtext: 'Büyük hayaller tek günde değil; sakin, dirençsiz ve kararlı mikro-adımlarla somutlaşır.',
    category: 'odak',
  },
  {
    id: 'int-2',
    tag: 'Bolluk & Çekim',
    quote: 'Evrenin sınırsız zenginliği ve yaratıcı enerjisi bugün zihnimden ve ellerimden akıyor.',
    subtext: 'Eksiklik korkusundan sıyrılıp kendi değerimin ve sunduğum faydanın farkındayım.',
    category: 'bolluk',
  },
  {
    id: 'int-3',
    tag: 'Zihinsel Dinginlik',
    quote: 'Kaosun ortasında sarsılmaz bir dinginlik var; ben o dinginliğin tam merkezindeyim.',
    subtext: 'Düşünceler gelir ve geçer. Derin bir nefes alıp ana kökleniyorum.',
    category: 'dinginlik',
  },
  {
    id: 'int-4',
    tag: 'Beden & Canlılık',
    quote: 'Bedenim gücün, sağlığın ve hücresel yenilenmenin kutsal mabedidir.',
    subtext: 'Bugün bedenime şefkatle kulak veriyor, onu doğru besin ve hareketle ödüllendiriyorum.',
    category: 'canlilik',
  },
  {
    id: 'int-5',
    tag: 'Cesur Eylem',
    quote: 'Mükemmel anı beklemiyorum; başladığım anı mükemmelleştiriyorum.',
    subtext: 'Korku bir rehberdir, engel değil. Bugün beni heyecanlandıran ilk adımı atıyorum.',
    category: 'cesaret',
  },
  {
    id: 'int-6',
    tag: 'Derin Şükran',
    quote: 'Sahip olduğum her nefes ve imkan için kalpten teşekkür ediyorum.',
    subtext: 'Şükran, frekansımı anında yükseltir ve yaşamıma daha fazlasını çeker.',
    category: 'sukran',
  },
  {
    id: 'int-7',
    tag: 'Yaratıcı Güç',
    quote: 'Bugün ilham dolu çözümler üretmeye ve zihnimi sınırsız olasılıklara açmaya niyet ediyorum.',
    subtext: 'Karşılaştığım her zorluk, zekamı ve vizyonumu bileyen bir fırsattır.',
    category: 'odak',
  },
  {
    id: 'int-8',
    tag: 'Zamanın Efendisi',
    quote: 'Zaman beni yönetmiyor; ben zamanı sevgiyle ve bilinçli önceliklerle yönetiyorum.',
    subtext: 'Acele etmeden, gecikmeden, her anın ritminde ve akışındayım.',
    category: 'dinginlik',
  },
  {
    id: 'int-9',
    tag: 'İçsel Değer',
    quote: 'Varlığım başlı başına bir armağan; dış onaya değil, kendi özüme güveniyorum.',
    subtext: 'Başkalarıyla kıyaslamayı bırakıp kendi benzersiz yolumda ışıldıyorum.',
    category: 'bolluk',
  },
  {
    id: 'int-10',
    tag: 'Hafiflik & Bırakış',
    quote: 'Bana artık hizmet etmeyen kontrol ihtiyacını, kaygıyı ve şüpheyi sevgiyle serbest bırakıyorum.',
    subtext: 'Bıraktığım boşluk, hayatın taze mucizeleriyle ve dinginlikle doluyor.',
    category: 'dinginlik',
  },
  {
    id: 'int-11',
    tag: 'Como & Özgür Yaşam',
    quote: 'Ruhumun ait olduğu göl kıyısındaki dingin ve özgür yaşam adım adım bana yaklaşıyor.',
    subtext: 'Gözlerimi kapatıp oradaki havayı içime çekiyorum; vizyonum şimdiden gerçeğimdir.',
    category: 'bolluk',
  },
  {
    id: 'int-12',
    tag: 'Yüksek Frekans',
    quote: 'Bugün yaydığım sakin enerji, çevremdeki herkesi ve olayları uyuma davet ediyor.',
    subtext: '432Hz zihinsel frekansındayım; huzurum dış dünyadaki gürültülerden etkilenmez.',
    category: 'dinginlik',
  },
  {
    id: 'int-13',
    tag: 'Atomik İlerleme',
    quote: 'Günde sadece %1 daha iyi olmak, bir yılda beni 37 kat dönüştürür.',
    subtext: 'Küçük adımların birikimli mucizesine güveniyorum. Bugünün 15 dakikası paha biçilemez.',
    category: 'odak',
  },
  {
    id: 'int-14',
    tag: 'Canlı Enerji',
    quote: 'Her hücrem yaşam sevinci, berraklık ve taze oksijenle dolup taşıyor.',
    subtext: 'Omurgamı dikleştiriyor, derin nefes alıyor ve varlığımın hafifliğini kutluyorum.',
    category: 'canlilik',
  },
  {
    id: 'int-15',
    tag: 'Bilinçli Sadelik',
    quote: 'Hayatımı ve zihnimi sadeleştirdikçe gerçek zenginliğin berraklığını yaşıyorum.',
    subtext: 'Gereksiz yükleri bırakıyor; sadece vizyonuma ve huzuruma katkı sağlayan şeyleri seçiyorum.',
    category: 'dinginlik',
  },
  {
    id: 'int-16',
    tag: 'Manyetik Çekim',
    quote: 'Ben doğru frekanstayken doğru insanlar, fırsatlar ve bolluk bana kendiliğinden akar.',
    subtext: 'Kovalayan değil, çeken enerjideyim. Güven ve teslimiyet içindeyim.',
    category: 'bolluk',
  },
  {
    id: 'int-17',
    tag: 'Öz Şefkat',
    quote: 'Hatalarıma ve yavaşlıklarıma şefkatle yaklaşıyorum; ben her gün öğrenen ve büyüyen bir varlığım.',
    subtext: 'Kendime en yakın dostuma davranır gibi anlayışla ve sevgiyle davranıyorum.',
    category: 'dinginlik',
  },
  {
    id: 'int-18',
    tag: 'Kararlılık',
    quote: 'Duygularım değişebilir ama niyetim ve vizyonum yıldızlar kadar sabittir.',
    subtext: 'Motivasyona değil, sevgiyle kurduğum günlük ritüele güveniyorum.',
    category: 'cesaret',
  },
  {
    id: 'int-19',
    tag: 'Işıltılı Neşe',
    quote: 'Bugün küçük anlardaki sihirleri, bir fincan kahvenin kokusunu ve gökyüzünün rengini fark ediyorum.',
    subtext: 'Neşe bir hedef değil, yolculuğun ta kendisidir.',
    category: 'sukran',
  },
  {
    id: 'int-20',
    tag: 'Sonsuz Güven',
    quote: 'Hayat benim için işliyor, bana karşı değil. Her şey en yüksek hayrıma gelişiyor.',
    subtext: 'Korku daraltır, güven genişletir. Bugün kalbimi sonuna kadar genişletiyorum.',
    category: 'bolluk',
  },
  {
    id: 'int-21',
    tag: 'Zihinsel Keskinlik',
    quote: 'Zihnim kristal berraklığında; neyi seçeceğimi ve nereye odaklanacağımı tam olarak biliyorum.',
    subtext: 'Dikkat dağıtıcılara nazikçe teşekkür edip ana hedefime geri dönüyorum.',
    category: 'odak',
  },
];

// Helper: Calculate deterministic day index (day of the year)
export function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime() + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

// Get the intention for today based on calendar date or user override
export function getTodayIntention(): DailyIntention {
  try {
    const custom = localStorage.getItem('veira_active_daily_intention');
    if (custom) {
      const parsed = JSON.parse(custom);
      if (parsed && parsed.quote) return parsed;
    }
  } catch {
    // fallback
  }

  const dayIndex = getDayOfYear();
  const index = Math.abs(dayIndex) % CURATED_INTENTIONS.length;
  return CURATED_INTENTIONS[index];
}

// Cycle to next intention or pick a random fresh one
export function cycleNextIntention(currentId?: string): DailyIntention {
  const currentIndex = CURATED_INTENTIONS.findIndex((i) => i.id === currentId);
  const nextIndex = (currentIndex + 1) % CURATED_INTENTIONS.length;
  const nextIntention = CURATED_INTENTIONS[nextIndex];
  try {
    localStorage.setItem('veira_active_daily_intention', JSON.stringify(nextIntention));
  } catch {
    // ignore
  }
  return nextIntention;
}

export function getRandomIntention(): DailyIntention {
  const randomIndex = Math.floor(Math.random() * CURATED_INTENTIONS.length);
  const picked = CURATED_INTENTIONS[randomIndex];
  try {
    localStorage.setItem('veira_active_daily_intention', JSON.stringify(picked));
  } catch {
    // ignore
  }
  return picked;
}

// Notification System for Daily Intention
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;
  try {
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      localStorage.setItem('veira_daily_notif_enabled', 'true');
      return true;
    }
    return false;
  } catch (e) {
    console.warn('Notification permission error:', e);
    return false;
  }
}

// Dispatches browser notification + sound
export function sendBrowserNotification(intention: DailyIntention, isTest: boolean = false): boolean {
  if (!isNotificationSupported()) return false;

  if (Notification.permission !== 'granted') {
    return false;
  }

  try {
    const title = isTest
      ? '✨ Veira • Günün Niyeti (Bildirim Testi)'
      : '✨ Veira • Günün Niyeti & Afirmasyonu';

    const options: NotificationOptions = {
      body: `"${intention.quote}"\n— ${intention.subtext}`,
      icon: '/icon.svg',
      badge: '/icon.svg',
      tag: 'veira-daily-intention',
      silent: false,
    };

    const notif = new Notification(title, options);
    notif.onclick = () => {
      window.focus();
      notif.close();
    };

    if (!isTest) {
      const todayStr = new Date().toISOString().split('T')[0];
      localStorage.setItem('veira_last_notified_date', todayStr);
    }
    return true;
  } catch (err) {
    console.warn('Error sending notification:', err);
    return false;
  }
}

// Dispatches evening poetic reflection browser notification
export function sendReflectionNotification(titleText: string, verseText: string, isTest: boolean = false): boolean {
  if (!isNotificationSupported()) return false;
  if (Notification.permission !== 'granted') return false;

  try {
    const title = isTest
      ? `🌙 Veira • Akşam Tefekkürü (Test)`
      : `🌙 Veira • ${titleText}`;

    const options: NotificationOptions = {
      body: verseText,
      icon: '/icon.svg',
      badge: '/icon.svg',
      tag: 'veira-evening-reflection',
      silent: false,
    };

    const notif = new Notification(title, options);
    notif.onclick = () => {
      window.focus();
      notif.close();
    };
    return true;
  } catch (err) {
    console.warn('Error sending reflection notification:', err);
    return false;
  }
}

// Check and trigger daily notification if scheduled and not sent today
export function checkAndTriggerDailyNotification(
  onInAppNotification?: (intention: DailyIntention) => void
): boolean {
  const enabled = localStorage.getItem('veira_daily_notif_enabled');
  if (enabled === 'false') return false;

  const todayStr = new Date().toISOString().split('T')[0];
  const lastDate = localStorage.getItem('veira_last_notified_date');

  // If already notified today, do nothing
  if (lastDate === todayStr) {
    return false;
  }

  const intention = getTodayIntention();
  const sent = sendBrowserNotification(intention, false);

  if (onInAppNotification) {
    onInAppNotification(intention);
  }

  localStorage.setItem('veira_last_notified_date', todayStr);
  return sent;
}
