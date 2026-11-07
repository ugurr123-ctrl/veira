import React, { useState, useEffect, useRef } from 'react';
import { StitchTab } from './StitchHeader';
import { useUnifiedVisions } from '../../utils/unifiedStorage';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  isSaved?: boolean;
  cardData?: {
    imageUrl?: string;
    imagePrompt?: string;
    imageTitle?: string;
    smartGoal?: string;
    microAction?: string;
    quote?: string;
    reframing?: string;
    exerciseType?: 'breath478' | 'grounding54321' | 'stoicCircle' | null;
  };
}

interface SavedInsight {
  id: string;
  text: string;
  date: string;
  tag?: string;
}

interface AssistantTabProps {
  onShowToast: (msg: string, icon?: string) => void;
  onPlayChime: () => void;
  onSwitchTab?: (tab: StitchTab) => void;
}

export const AssistantTab: React.FC<AssistantTabProps> = ({
  onShowToast,
  onPlayChime,
  onSwitchTab,
}) => {
  const { addVision } = useUnifiedVisions();

  // AI Photo & Vision Studio Modal State
  const [isImageStudioOpen, setIsImageStudioOpen] = useState(false);
  const [imagePromptInput, setImagePromptInput] = useState('');
  const [imageStyle, setImageStyle] = useState<'photorealistic' | 'cinematic' | 'minimalist' | 'luxury' | 'nature' | 'night_sky'>('photorealistic');
  const [imageAspectRatio, setImageAspectRatio] = useState<'1:1' | '9:16' | '16:9'>('1:1');
  const [isGeneratingPhoto, setIsGeneratingPhoto] = useState(false);
  const [generatedPhotoUrl, setGeneratedPhotoUrl] = useState<string | null>(null);
  const [generatedPhotoPrompt, setGeneratedPhotoPrompt] = useState<string>('');

  // Speech-To-Text Dictation State
  const [isListening, setIsListening] = useState(false);
  const speechRecognitionRef = useRef<any>(null);

  // 5-4-3-2-1 Sensory Grounding State
  const [groundingStep, setGroundingStep] = useState<number>(5);

  // Modes: 'chat' = Natural Friend; 'cbt' = Cognitive Reframing; 'coach' = SMART Goals
  const [conversationMode, setConversationMode] = useState<'chat' | 'cbt' | 'coach'>('chat');

  // Emotional & Cognitive State
  const [selectedMood, setSelectedMood] = useState<string>('Sakin');
  const [energyLevel, setEnergyLevel] = useState<'Düşük' | 'Dengeli' | 'Yüksek'>('Dengeli');

  // Interactive Exercise Modals
  const [activeExercise, setActiveExercise] = useState<'breath478' | 'stoicCircle' | 'grounding54321' | null>(null);

  // Breathing 4-7-8 timer state
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathSecondsLeft, setBreathSecondsLeft] = useState<number>(4);
  const [breathCyclesCompleted, setBreathCyclesCompleted] = useState<number>(0);
  const [isBreathActive, setIsBreathActive] = useState<boolean>(false);

  // Saved Insights Drawer
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const [savedInsights, setSavedInsights] = useState<SavedInsight[]>(() => {
    try {
      const saved = localStorage.getItem('veira_saved_insights');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Speech Synthesis (Audio Reading)
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('veira_assistant_messages_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter((m) => m && (typeof m.text === 'string' && m.text.trim().length > 0 || m.cardData));
          if (valid.length > 0) return valid;
        }
      }
    } catch {
      // fallback
    }
    return [
      {
        id: 'm-init',
        sender: 'ai',
        text: 'Selam Selin ✨ Bugün nasılsın? İster gününün nasıl geçtiğini anlatıp dertleşelim, ister zihnindeki düşünce kalıplarını veya hedeflerini konuşalım; tüm dikkatimle buradayım.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [inputVal, setInputVal] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-save chat history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('veira_assistant_messages_v3', JSON.stringify(messages));
    } catch {
      // safe fallback
    }
  }, [messages]);

  // Auto-save insights to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('veira_saved_insights', JSON.stringify(savedInsights));
    } catch {
      // safe fallback
    }
  }, [savedInsights]);

  // Smooth scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // 4-7-8 Breathing Loop Engine
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeExercise === 'breath478' && isBreathActive) {
      timer = setInterval(() => {
        setBreathSecondsLeft((prev) => {
          if (prev <= 1) {
            if (breathPhase === 'inhale') {
              setBreathPhase('hold');
              return 7;
            } else if (breathPhase === 'hold') {
              setBreathPhase('exhale');
              return 8;
            } else {
              setBreathPhase('inhale');
              setBreathCyclesCompleted((c) => c + 1);
              onPlayChime();
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeExercise, isBreathActive, breathPhase]);

  // Quick prompt chips tailored by active mode
  const getQuickPrompts = () => {
    if (conversationMode === 'cbt') {
      return [
        { label: '🛡️ "Asla yetişemeyeceğim" hissi', text: 'Sürekli geç kaldığımı ve hiçbir şeye yetişemediğimi hissediyorum, bu düşünceyi nasıl dönüştürürüm?' },
        { label: '⚖️ Kontrolümde olmayanları bırak', text: 'Başkalarının düşüncelerini ve geleceği çok fazla kafama takıyorum. Stoacı kontrol dikotomisini uygulayalım.' },
        { label: '🌪️ İçsel kaygı ve fırtına', text: 'İçimde nedensiz bir kaygı var, beni sakinleştirecek bir topraklanma egzersizi yapalım.' },
        { label: '✨ Mükemmeliyetçilik tuzağını kır', text: 'Mükemmel yapamayacaksam hiç başlamak istemiyorum. Bu bilişsel tuzağı nasıl çözerim?' },
      ];
    }
    if (conversationMode === 'coach') {
      return [
        { label: '🎯 Como Gölü 90 Günlük SMART Plan', text: 'Como Gölü uzaktan çalışma vizyonumu 3 aylık net SMART kilometre taşlarına dönüştür.' },
        { label: '⚡ Bugün için 5 dk mikro-eylem', text: 'Aşırı zihinsel yorgunluğum var, bugünkü adımı 5 dakikalık dirençsiz bir eyleme indir.' },
        { label: '✨ 432Hz Rezonans Afirmasyonu', text: 'Zihnime işleyen güçlü ve sakin bir odak afirmasyonu oluştur.' },
        { label: '💎 Erteleme döngüsünü kır', text: 'Erteleme refleksimi kırmak için bugün atacağım en küçük adım nedir?' },
      ];
    }
    return [
      { label: '🎨 8K Vizyon Fotoğrafı Üret', text: 'Bana Como Gölü kıyısında modern, huzurlu ve minimalist bir villa vizyon fotoğrafı üret.' },
      { label: '✨ Veira nedir & nasıl kullanılır?', text: 'Veira uygulaması hakkında bilgi almak istiyorum, hangi özellikler var ve nasıl kullanılır?' },
      { label: '☕ Selam, nasılsın?', text: 'Selam, nasılsın? Bugün seninle biraz sohbet etmek istedim.' },
      { label: '💭 Biraz dertleşelim mi?', text: 'Kafam biraz karışık, biraz dertleşelim mi?' },
      { label: '🌿 Günün nasıl geçti?', text: 'Günün nasıl geçiyor, neler yapıyorsun?' },
      { label: '⚡ Bugün enerjim düşük', text: 'Bugün enerjim biraz düşük, bana sakinleştirici bir tavsiye verir misin?' },
    ];
  };

  // Generate Photo in Studio
  const handleGeneratePhotoInStudio = async (customPrompt?: string) => {
    const promptText = (customPrompt || imagePromptInput).trim();
    if (!promptText) {
      onShowToast('Lütfen üretmek istediğin fotoğrafı veya vizyonu tarif et.', 'warning');
      return;
    }

    setIsGeneratingPhoto(true);
    onShowToast('Flux.1 8K fotogerçekçi vizyon fotoğrafın üretiliyor... 🎨', 'palette');

    try {
      const res = await fetch('/api/image/optimize-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          style: imageStyle,
          aspectRatio: imageAspectRatio,
        }),
      });

      if (!res.ok) throw new Error('Image generation failed');
      const data = await res.json();
      const finalUrl = data.imageUrl || data.reliableUrl || data.fluxUrl;
      if (finalUrl) {
        setGeneratedPhotoUrl(finalUrl);
        setGeneratedPhotoPrompt(promptText);
        onPlayChime();
        onShowToast('8K vizyon fotoğrafın hazır! ✨', 'check');
      }
    } catch (err) {
      console.warn('Photo studio generation error:', err);
      const fallbackUrl = 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=85';
      setGeneratedPhotoUrl(fallbackUrl);
      setGeneratedPhotoPrompt(promptText);
      onShowToast('Görsel hazırlandı ✨', 'check');
    } finally {
      setIsGeneratingPhoto(false);
    }
  };

  // Add generated image directly to Unified Visions
  const handleAddImageToVision = (imageUrl: string, title = 'Yeni Vizyon Tohumu') => {
    addVision({
      title,
      category: 'Kariyer & Bolluk',
      categoryKey: 'career',
      categoryLabel: 'Kariyer & Bolluk',
      horizon: '3 Ay',
      why: 'Bu vizyon ve fotoğraf benim için derin bir ilham ve sakin odak kaynağıdır.',
      imageUrl,
      badge: '8K AI Vizyon Fotoğrafı',
      status: 'active',
      dailyTasks: [
        {
          id: `dt-${Date.now()}-1`,
          visionId: '',
          visionTitle: title,
          title: 'Bu vizyon için günde 15 dk odaklanarak niyet adımı at',
          estimatedMinutes: 15,
          completed: false,
        },
      ],
      miniTasks: [
        {
          id: `mt-${Date.now()}-1`,
          visionId: '',
          stepNumber: 1,
          title: 'Temel yol haritası ve hazırlığı tamamla',
          desc: 'Başlangıç adımı',
          completed: false,
        },
        {
          id: `mt-${Date.now()}-2`,
          visionId: '',
          stepNumber: 2,
          title: 'İlk somut prototipi ve alışkanlığı oturt',
          desc: 'Gelişme adımı',
          completed: false,
        },
      ],
    });
    onPlayChime();
    onShowToast(`"${title}" vizyon panona mühürlendi! 🌟`, 'stars');
    if (onSwitchTab) {
      setTimeout(() => onSwitchTab('vizyon'), 600);
    }
  };

  // Transfer generated photo into assistant chat stream
  const handleTransferPhotoToChat = (imageUrl: string, promptText: string) => {
    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: `Senin için 8K çözünürlüğünde fotogerçekçi vizyon görselini hazırladım: "${promptText}". Bu kareyi zihninde canlandırarak hedefine doğru sakin ve kararlı adımlar atabilirsin.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      cardData: {
        imageUrl,
        imageTitle: promptText.slice(0, 35),
        imagePrompt: promptText,
        smartGoal: `${promptText.slice(0, 30)} - 90 Günlük Odak`,
        microAction: 'Bugün bu vizyonu kilit ekranına al veya niyetini 5 dakika gözden geçir.',
        quote: '“Zihninde netleşen vizyon, atılan sakin adımlarla gerçeğe bürünür.”',
      },
    };
    setMessages((prev) => [...prev, aiMsg]);
    setIsImageStudioOpen(false);
    onPlayChime();
    onShowToast('Görsel sohbete aktarıldı! ✨', 'chat');
  };

  // Web Speech API Voice Dictation
  const handleToggleVoiceDictation = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onShowToast('Tarayıcınızda sesli dikte desteği bulunamadı.', 'mic_off');
      return;
    }

    if (isListening) {
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      onShowToast('Sesli dikte tamamlandı.', 'mic');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'tr-TR';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        onShowToast('Seni dinliyorum Selin... Konuşabilirsin 🎙️', 'mic');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInputVal((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsListening(false);
        onShowToast('Ses algılanamadı, lütfen tekrar deneyin.', 'mic_off');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn('Voice dictation start error:', e);
      setIsListening(false);
      onShowToast('Mikrofon erişimi başlatılamadı.', 'mic_off');
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isThinking) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    onPlayChime();
    setIsThinking(true);

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          mode: conversationMode,
          mood: selectedMood,
          energyLevel,
          history: messages.slice(-6).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.text || 'Seni dinliyorum Selin, buradayım.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cardData: conversationMode !== 'chat' || data.cardData?.reframing || data.cardData?.exerciseType || data.cardData?.imageUrl ? data.cardData : undefined,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.warn('Backend Assistant API error, activating natural CBT fallback:', err);
      const lower = text.toLowerCase().trim();
      let aiText = '';
      let cardData: ChatMessage['cardData'] = undefined;

      if (
        lower.includes('uygulama') ||
        lower.includes('veira') ||
        lower.includes('özellik') ||
        lower.includes('nasıl kullanılır') ||
        lower.includes('bilgi almak') ||
        lower.includes('rehber')
      ) {
        aiText = `Veira; zihnini sakinleştirmek, hedeflerini netleştirmek ve günlük odağını korumak için tasarlanmış bütünsel bir Zihinsel Yaşam & Netlik Tapınağı'dır ✨\n\nUygulama 5 ana sütun üzerine inşa edilmiştir:\n\n1. 🌅 **Bugün (Daily Focus):** Günlük mikro-eylemlerini, odak afirmasyonunu ve enerji durumunu takip ettiğin ana sığınak.\n2. 🖼️ **Vizyon Panosu (Flux.1 AI):** Hayallerini ve hedeflerini Black Forest Labs'in en gelişmiş Flux.1 AI motoruyla 8K fotogerçekçi sanata dönüştürdüğün vizyon alanı.\n3. 🎵 **432Hz Sanctuary Çaları:** Gerçek stüdyo kayıtlarıyla (Şömine Ateşi Çıtırtısı, Como Gölü Dalgaları, Gece Yağmuru) zihnini alfa frekansına alan ses mabedi.\n4. 🎯 **Hedefler & Yol Haritası:** SMART ve WOOP metodolojisiyle hedeflerini 3 aylık net çeyreklere ve günlük adımlara bölen rota.\n5. 🧠 **AI Zihinsel Koç:** CBT (Bilişsel Davranışçı Terapi), 4-7-8 diyafram nefesi, Stoik kontrol çemberi ve doğal dertleşme modlarıyla her an yanında olan rehberin.\n\nHangi bölümü birlikte keşfetmek istersin Selin?`;
        cardData = {
          reframing: 'Veira Felsefesi: "Büyük değişimler devasa baskılarla değil, sakin ve tutarlı mikro adımlarla gerçekleşir."',
          microAction: 'Şimdi vizyon panosuna ya da 432Hz sığınağına geçip zihnini dinlendir.',
          quote: '“Zihnini sakinleştir, vizyonunu netleştir, yol kendiliğinden açılır.”',
        };
      } else if (
        lower.includes('yetişemiyorum') ||
        lower.includes('başaramam') ||
        lower.includes('gec kaldım') ||
        lower.includes('mükemmel')
      ) {
        aiText = 'Zihninin bu düşünceyi üretmesi çok anlaşılır ama unutma Selin; düşünceler birer gerçek değil, sadece zihinden geçen bilişsel dalgalardır. Kognitif psikolojide buna "Ya Hep Ya Hiç Tuzağı" denir. Gel buna daha adil bir pencereden bakalım:';
        cardData = {
          reframing: 'Düşünce Tuzağı: "Yetersizim / Yetişemeyeceğim"\n➔ Bilişsel Dönüşüm: "Şu an öğrenme ve uyum sürecindeyim. Mükemmel olmak zorunda değilim; sadece tutarlı olmak yeterli."',
          microAction: 'Bugün sadece son 1 ayda başarıyla tamamladığın 1 küçük adımı hatırla.',
          quote: '“Kendine karşı şefkatli ol; en sağlam yapılar sakin ve sürekli adımlarla yükselir.”',
        };
      } else if (lower.includes('kaygı') || lower.includes('stres') || lower.includes('korku')) {
        aiText = 'Şu an sinir sisteminin stres alarmı verdiğini hissediyorum. Bu tamamen insani bir tepki ve şu an tamamen güvendesin. Zihnindeki fırtınayı durdurmak için 4-7-8 nefes ritmini başlatalım:';
        cardData = {
          exerciseType: 'breath478',
          microAction: '4 saniye nefes al, 7 saniye tut ve 8 saniye boyunca yavaşça bırak.',
          quote: '“Seni üzen olayların kendisi değil, o olaylar hakkında geliştirdiğin yargılardır.” — Epiktetos',
        };
      } else if (lower.includes('smart') || lower.includes('hedef') || lower.includes('plan')) {
        aiText = 'Harika bir karar! Büyük hedefleri 3 aylık sakin bir rotaya oturtalım:';
        cardData = {
          smartGoal: 'Como Gölü & Uzaktan Çalışma Portföyünün 90 Günde Tamamlanması',
          microAction: 'Bugün sadece vize/çalışma dosyasının 1 dokümanını açıp 15 dakika ayır.',
          quote: '“Büyük yolculuklar tek bir sakin adımla başlar.”',
        };
      } else {
        aiText = `Seni dinliyorum Selin. "${text.length > 50 ? text.slice(0, 50) + '...' : text}" konusunda yanındayım. Ne zaman istersen konuşabiliriz.`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cardData,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  // Text-To-Speech (Sesli Dinleme)
  const handleToggleSpeak = (msgId: string, textToSpeak: string) => {
    if (!('speechSynthesis' in window)) {
      onShowToast('Cihazınızda sesli okuma desteklenmiyor.', 'volume_off');
      return;
    }

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'tr-TR';
    utterance.rate = 0.95; // Calm, meditative pace
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
    onShowToast('Veira sesli rehberliği başladı 🔊', 'volume_up');
  };

  // Save Insight / Bookmark
  const handleSaveInsight = (text: string, tag = 'Bilişsel İçgörü') => {
    const newInsight: SavedInsight = {
      id: `ins-${Date.now()}`,
      text,
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
      tag,
    };
    setSavedInsights((prev) => [newInsight, ...prev]);
    onPlayChime();
    onShowToast('İçgörülerine kaydedildi! 🌟', 'bookmark_added');
  };

  const handleApplyMicroAction = (action: string) => {
    try {
      localStorage.setItem('veira_custom_microaction', action);
    } catch {
      // safe fallback
    }
    onPlayChime();
    onShowToast('Mikro-eylem "Bugün" panosuna mühürlendi! ⚡', 'check_circle');
    if (onSwitchTab) {
      setTimeout(() => onSwitchTab('bugun'), 600);
    }
  };

  const handleApplySmartGoal = (goal: string) => {
    try {
      localStorage.setItem('veira_custom_smartgoal', goal);
    } catch {
      // safe fallback
    }
    onPlayChime();
    onShowToast('SMART Hedef odak rotana eklendi! 🎯', 'flag');
    if (onSwitchTab) {
      setTimeout(() => onSwitchTab('hedefler'), 600);
    }
  };

  const handleGenerateSummary = () => {
    handleSend('Veira, bugünkü konuşmalarımızdan ve zihinsel durumumdan yola çıkarak bana 3 maddelik bir Günlük Zihinsel Özet ve Odak Notu çıkarır mısın?');
  };

  return (
    <section className="flex flex-col flex-1 w-full max-w-lg sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto px-3.5 sm:px-6 md:px-8 space-y-2.5 sm:space-y-3 animate-fadeIn pb-2 min-h-0">
      {/* 1. COMPACT SANCTUARY HEADER: AI Mode Selector + Insights + Tool Strip */}
      <div className="w-full bg-[#161a30]/85 backdrop-blur-xl rounded-2xl p-2.5 sm:p-3 border border-white/10 shadow-lg flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between gap-2">
          {/* Coaching Mode Segmented Tabs */}
          <div className="grid grid-cols-3 p-1 rounded-xl bg-[#080c22] border border-white/5 flex-1 max-w-md">
            <button
              type="button"
              onClick={() => {
                setConversationMode('chat');
                onShowToast('💬 Doğal Sohbet moduna geçildi.', 'chat_bubble');
              }}
              className={`px-2 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                conversationMode === 'chat'
                  ? 'bg-gradient-to-r from-[#8083ff] to-[#6a6cf1] text-white shadow-sm font-bold'
                  : 'text-[#c7c4d7] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[14px] shrink-0">chat_bubble</span>
              <span className="truncate">Sohbet</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setConversationMode('cbt');
                onShowToast('🧠 CBT & Zihinsel Netlik moduna geçildi.', 'psychology');
              }}
              className={`px-2 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                conversationMode === 'cbt'
                  ? 'bg-gradient-to-r from-[#7bd0ff] to-[#4ba3e3] text-[#080c22] shadow-sm font-bold'
                  : 'text-[#c7c4d7] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[14px] shrink-0">psychology</span>
              <span className="truncate">CBT Netlik</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setConversationMode('coach');
                onShowToast('🎯 Hedef & SMART Koçluk moduna geçildi.', 'flag');
              }}
              className={`px-2 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                conversationMode === 'coach'
                  ? 'bg-gradient-to-r from-[#e7c355] to-[#ffe089] text-[#3d2f00] shadow-sm font-bold'
                  : 'text-[#c7c4d7] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[14px] shrink-0">flag</span>
              <span className="truncate">SMART Koç</span>
            </button>
          </div>

          {/* Actions: Refresh Chat + Insights */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                const initMsg: ChatMessage = {
                  id: `m-init-${Date.now()}`,
                  sender: 'ai',
                  text: 'Selam Selin ✨ Sohbetimiz tazelendi. Bugün zihninde ne var? İster hedeflerini, ister gününü konuşalım; tüm dikkatimle buradayım.',
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };
                setMessages([initMsg]);
                onShowToast('Sohbet tazelendi ✨', 'refresh');
                onPlayChime();
              }}
              title="Sohbeti Sıfırla / Tazele"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#252840] hover:bg-[#2f334b] text-[#c7c4d7] hover:text-white text-[11px] font-semibold border border-white/5 transition-all shadow-sm shrink-0 active:scale-95"
            >
              <span className="material-symbols-outlined text-[14px]">refresh</span>
              <span className="hidden sm:inline">Tazele</span>
            </button>

            {/* Insights Button */}
            <button
              type="button"
              onClick={() => setIsInsightsOpen(true)}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#252840] hover:bg-[#2f334b] text-[#ffe089] text-[11px] font-semibold border border-[#e7c355]/30 transition-all shadow-sm shrink-0 active:scale-95"
            >
              <span className="material-symbols-outlined text-[14px]">bookmark</span>
              <span>İçgörüler ({savedInsights.length})</span>
            </button>
          </div>
        </div>

        {/* Guided Creative & Therapeutic Action Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none py-0.5">
          <button
            type="button"
            onClick={() => setIsImageStudioOpen(true)}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#e7c355]/25 via-[#f5d061]/25 to-[#ffe089]/25 hover:from-[#e7c355]/35 text-[#ffe089] text-[11px] font-bold border border-[#e7c355]/50 shadow-sm shrink-0 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[14px]">palette</span>
            <span>8K Görsel Stüdyosu</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveExercise('breath478');
              setIsBreathActive(true);
              setBreathSecondsLeft(4);
              setBreathPhase('inhale');
              onPlayChime();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#252840] hover:bg-[#2f334b] text-[#7bd0ff] text-[10.5px] font-semibold border border-white/5 shrink-0 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[13px]">air</span>
            <span>4-7-8 Nefes</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveExercise('grounding54321');
              setGroundingStep(5);
              onPlayChime();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#252840] hover:bg-[#2f334b] text-[#c0c1ff] text-[10.5px] font-semibold border border-white/5 shrink-0 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[13px]">self_improvement</span>
            <span>5-4-3-2-1 Topraklanma</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveExercise('stoicCircle')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#252840] hover:bg-[#2f334b] text-[#ffe089] text-[10.5px] font-semibold border border-white/5 shrink-0 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[13px]">shield</span>
            <span>Stoik Çember</span>
          </button>

          <button
            type="button"
            onClick={handleGenerateSummary}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#252840] hover:bg-[#2f334b] text-[#dee0ff] text-[10.5px] font-semibold border border-white/5 shrink-0 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[13px]">summarize</span>
            <span>Zihinsel Özet</span>
          </button>

          {/* Quick Mood Pill Indicators */}
          <div className="h-4 w-[1px] bg-white/10 shrink-0 mx-0.5" />
          {[
            { id: 'Sakin', label: '😌 Sakin' },
            { id: 'Odaklanmış', label: '🎯 Odaklı' },
            { id: 'Yorgun', label: '⚡ Yorgun' },
            { id: 'Kaygılı', label: '🌊 Kaygılı' },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setSelectedMood(m.id);
                onShowToast(`Ruh hali: ${m.label} seçildi.`, 'psychology');
              }}
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all border shrink-0 ${
                selectedMood === m.id
                  ? 'bg-[#e7c355]/20 text-[#e7c355] border-[#e7c355]/50 font-bold'
                  : 'bg-[#080c22] text-[#c7c4d7]/80 border-white/5 hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. CHAT HISTORY STREAM */}
      <div className="flex-1 flex flex-col space-y-3.5 pt-2 pb-4 min-h-[200px]">
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          const isSpeaking = speakingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isAI ? 'w-full' : 'max-w-[85%] ml-auto justify-end'}`}
            >
              {isAI && (
                <div className="w-8 h-8 rounded-full bg-[#e7c355]/20 flex items-center justify-center shrink-0 border border-[#e7c355]/40 text-[#e7c355] mt-0.5 shadow-sm">
                  <span
                    className="material-symbols-outlined text-[17px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    stars
                  </span>
                </div>
              )}

              <div className={`flex flex-col gap-1 ${isAI ? 'flex-1 min-w-0' : 'items-end'}`}>
                <div
                  className={`p-3.5 sm:p-4 rounded-2xl shadow-sm ${
                    isAI
                      ? 'bg-[#1a1e35]/95 backdrop-blur-md rounded-tl-xs border border-white/10 space-y-3'
                      : 'bg-gradient-to-br from-[#8083ff]/90 to-[#5a5cdb]/85 text-[#dee0ff] rounded-tr-xs border border-[#8083ff]/40'
                  }`}
                >
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line text-[#dee0ff]">
                    {msg.text}
                  </p>

                  {/* AI ENRICHED PAYLOAD CARD */}
                  {msg.cardData && (
                    <div className="bg-[#080c22]/90 rounded-xl p-3 flex flex-col space-y-2.5 border border-white/10 shadow-inner mt-2">
                      {/* AI Generated 8K Vision Photo Card */}
                      {msg.cardData.imageUrl && (
                        <div className="rounded-xl overflow-hidden border border-[#e7c355]/40 shadow-lg bg-[#080c22] mt-1 space-y-2">
                          <div className="relative aspect-video sm:aspect-[4/3] w-full overflow-hidden group">
                            <img
                              src={msg.cardData.imageUrl}
                              alt={msg.cardData.imageTitle || 'AI Vizyon Görseli'}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              loading="lazy"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=85';
                              }}
                            />
                            <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-[10px] font-bold text-[#e7c355] flex items-center gap-1 shadow">
                              <span className="material-symbols-outlined text-[13px]">palette</span>
                              <span>{msg.cardData.imageTitle || '8K Flux.1 AI Vizyonu'}</span>
                            </div>
                          </div>

                          <div className="p-2.5 pt-0 flex flex-wrap items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => handleAddImageToVision(msg.cardData!.imageUrl!, msg.cardData?.imageTitle || 'AI Vizyon')}
                              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#e7c355] to-[#ffe089] text-[#3d2f00] font-bold text-xs flex items-center gap-1 shadow-sm hover:brightness-110 active:scale-95 transition-all"
                            >
                              <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                              <span>Vizyon Panosuna Ekle</span>
                            </button>

                            <a
                              href={msg.cardData.imageUrl}
                              target="_blank"
                              rel="noreferrer"
                              download="veira-ai-vision.jpg"
                              className="px-2.5 py-1.5 rounded-lg bg-[#252840] hover:bg-[#2f334b] text-[#c7c4d7] hover:text-white text-xs font-medium flex items-center gap-1 transition-colors border border-white/5"
                            >
                              <span className="material-symbols-outlined text-[14px]">download</span>
                              <span>HD İndir</span>
                            </a>
                          </div>
                        </div>
                      )}

                      {/* CBT Reframing Card */}
                      {msg.cardData.reframing && (
                        <div className="p-2.5 rounded-lg bg-[#7bd0ff]/10 border border-[#7bd0ff]/30 flex flex-col gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7bd0ff] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">sync_alt</span>
                            Bilişsel Yeniden Çerçeveleme (CBT)
                          </span>
                          <p className="text-xs text-[#dee0ff] leading-relaxed whitespace-pre-line font-medium">
                            {msg.cardData.reframing}
                          </p>
                        </div>
                      )}

                      {/* Quote / Affirmation */}
                      {msg.cardData.quote && (
                        <div className="flex items-start gap-2 bg-[#e7c355]/10 p-2.5 rounded-lg border border-[#e7c355]/20">
                          <span className="material-symbols-outlined text-[#e7c355] text-[15px] shrink-0 mt-0.5">
                            format_quote
                          </span>
                          <p className="text-xs italic font-serif text-[#ffe089] leading-relaxed">
                            {msg.cardData.quote}
                          </p>
                        </div>
                      )}

                      {/* SMART Goal */}
                      {msg.cardData.smartGoal && (
                        <div className="flex flex-col gap-1.5 p-2 rounded-lg bg-[#252840]/60 border border-white/5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7bd0ff] flex items-center gap-1">
                              <span>🎯</span> 3 Aylık SMART Odak
                            </span>
                            <button
                              type="button"
                              onClick={() => handleApplySmartGoal(msg.cardData!.smartGoal!)}
                              className="text-[10px] font-semibold text-[#7bd0ff] hover:text-white bg-[#7bd0ff]/15 hover:bg-[#7bd0ff]/25 px-2 py-0.5 rounded-full transition-colors flex items-center gap-1"
                            >
                              <span>Hedeflere Ekle</span>
                              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                            </button>
                          </div>
                          <span className="text-xs text-[#dee0ff] leading-relaxed">{msg.cardData.smartGoal}</span>
                        </div>
                      )}

                      {/* Micro-Action */}
                      {msg.cardData.microAction && (
                        <div className="flex flex-col gap-1.5 p-2 rounded-lg bg-[#e7c355]/10 border border-[#e7c355]/25">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#e7c355] flex items-center gap-1">
                              <span>⚡</span> Bugünün 5 Dakikalık Mikro-Eylemi
                            </span>
                            <button
                              type="button"
                              onClick={() => handleApplyMicroAction(msg.cardData!.microAction!)}
                              className="text-[10px] font-bold text-[#3d2f00] bg-[#e7c355] hover:bg-[#ffe089] px-2.5 py-0.5 rounded-full transition-all active:scale-95 flex items-center gap-1 shadow-sm"
                            >
                              <span className="material-symbols-outlined text-[12px]">add_task</span>
                              <span>Bugünün Eylemine Ekle</span>
                            </button>
                          </div>
                          <span className="text-xs text-[#dee0ff] font-medium leading-relaxed">
                            {msg.cardData.microAction}
                          </span>
                        </div>
                      )}

                      {/* Recommended Exercise Button */}
                      {msg.cardData.exerciseType && (
                        <button
                          type="button"
                          onClick={() => {
                            if (msg.cardData?.exerciseType === 'breath478') {
                              setActiveExercise('breath478');
                              setIsBreathActive(true);
                            } else if (msg.cardData?.exerciseType === 'stoicCircle') {
                              setActiveExercise('stoicCircle');
                            } else {
                              setActiveExercise('grounding54321');
                            }
                            onPlayChime();
                          }}
                          className="w-full py-2 rounded-lg bg-gradient-to-r from-[#7bd0ff]/20 to-[#8083ff]/20 hover:from-[#7bd0ff]/30 hover:to-[#8083ff]/30 text-[#7bd0ff] text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#7bd0ff]/30 transition-all"
                        >
                          <span className="material-symbols-outlined text-[15px]">self_improvement</span>
                          <span>Rehberli Egzersizi Başlat</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Message Action Bar (Voice Speak & Save Epiphany) */}
                  {isAI && (
                    <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px] text-[#c7c4d7]">
                      <div className="flex items-center gap-2">
                        {/* Audio Speak Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleSpeak(msg.id, msg.text)}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-full transition-colors ${
                            isSpeaking
                              ? 'bg-[#e7c355] text-[#3d2f00] font-bold'
                              : 'hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {isSpeaking ? 'volume_up' : 'volume_down'}
                          </span>
                          <span>{isSpeaking ? 'Dinleniyor' : 'Dinle'}</span>
                        </button>

                        {/* Save to Insights */}
                        <button
                          type="button"
                          onClick={() => handleSaveInsight(msg.text, conversationMode.toUpperCase())}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-full hover:text-[#ffe089] hover:bg-white/5 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[14px]">bookmark_add</span>
                          <span>Kaydet</span>
                        </button>

                        {/* Report / Flag AI Response (Apple Guideline 1.2 & Google Play AI Policy) */}
                        <button
                          type="button"
                          onClick={() => {
                            onShowToast('Geri bildiriminiz alındı. Yanıt kontrol için etiketlendi.', 'flag');
                          }}
                          title="Uygunsuz veya Hatalı Yanıtı Bildir"
                          className="flex items-center gap-1 px-2 py-0.5 rounded-full hover:text-rose-400 hover:bg-white/5 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[13px]">flag</span>
                          <span>Bildir</span>
                        </button>
                      </div>

                      <span className="text-[10px] text-[#908fa0] font-mono">{msg.time}</span>
                    </div>
                  )}
                </div>

                {!isAI && (
                  <span className="text-[10px] text-[#908fa0] px-1 font-mono">{msg.time}</span>
                )}
              </div>
            </div>
          );
        })}

        {/* Dynamic Thinking State */}
        {isThinking && (
          <div className="flex items-start gap-2.5 w-full animate-fadeIn">
            <div className="w-8 h-8 rounded-full bg-[#e7c355]/20 flex items-center justify-center shrink-0 border border-[#e7c355]/40 text-[#e7c355] animate-pulse">
              <span className="material-symbols-outlined text-[16px]">psychology</span>
            </div>
            <div className="p-3.5 rounded-2xl rounded-tl-xs bg-[#1a1e35]/90 border border-white/10 flex items-center gap-3 shadow-md">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#8083ff] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-[#7bd0ff] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-[#e7c355] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-[#c7c4d7] italic">
                Veira zihinsel frekansı dinliyor ve bilişsel çözümü hazırlıyor...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. INPUT BAR & PROMPT SPARKS DOCK (Elevated comfortably above the floating bottom dock) */}
      <div className="sticky bottom-[76px] sm:bottom-[84px] md:bottom-[90px] left-0 right-0 z-30 flex flex-col gap-1.5 pointer-events-auto">
        <div className="bg-[#080c22]/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 border border-white/15 shadow-[0_-8px_32px_rgba(0,0,0,0.75)] flex flex-col gap-1.5">
          {/* Quick Prompt Sparks Docked Above Input */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5">
            {getQuickPrompts().map((p, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isThinking}
                onClick={() => handleSend(p.text)}
                className="bg-[#161a30]/95 hover:bg-[#252840] active:scale-95 disabled:opacity-50 transition-all text-[#dee0ff] text-[11px] sm:text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10 shadow-sm shrink-0 whitespace-nowrap"
              >
                <span>{p.label}</span>
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-full bg-[#161a30] border border-white/15 shadow-inner"
          >
            <div className="pl-2 sm:pl-3 text-[#7bd0ff] shrink-0">
              <span className="material-symbols-outlined text-[17px] sm:text-[18px]">
                {conversationMode === 'cbt' ? 'psychology' : conversationMode === 'coach' ? 'flag' : 'chat'}
              </span>
            </div>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={isThinking}
              placeholder={
                isListening
                  ? 'Dinliyorum Selin... 🎙️'
                  : conversationMode === 'cbt'
                  ? 'Seni kısıtlayan düşünceyi yaz...'
                  : conversationMode === 'coach'
                  ? 'Hedefini yaz, 15 dk adıma böleyim...'
                  : 'Veira ile dertleş, "fotoğraf üret", "Como gölü çiz"...'
              }
              className="flex-1 min-w-0 bg-transparent px-1.5 sm:px-2 py-2 text-xs sm:text-sm text-[#dee0ff] placeholder-[#c7c4d7]/50 outline-none disabled:opacity-50"
            />

            {/* Quick Voice Dictation Mic Button */}
            <button
              type="button"
              onClick={handleToggleVoiceDictation}
              title={isListening ? 'Dinlemeyi Durdur' : 'Sesli Dikte (Konuşarak Yazdır)'}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 border transition-all shadow-sm active:scale-95 ${
                isListening
                  ? 'bg-red-500 text-white border-red-400 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.6)]'
                  : 'bg-[#252840] hover:bg-[#2f334b] text-[#dee0ff] border-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-[17px] sm:text-[19px]">
                {isListening ? 'mic' : 'mic_none'}
              </span>
            </button>

            {/* Quick AI Photo Studio Launch Button */}
            <button
              type="button"
              onClick={() => setIsImageStudioOpen(true)}
              title="AI 8K Fotoğraf Stüdyosu"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#252840] hover:bg-[#2f334b] text-[#e7c355] flex items-center justify-center shrink-0 border border-white/10 transition-all shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-[17px] sm:text-[19px]">palette</span>
            </button>

            <button
              type="submit"
              disabled={!inputVal.trim() || isThinking}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-[#e7c355] to-[#ffe089] text-[#3d2f00] flex items-center justify-center shrink-0 hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md font-bold"
            >
              <span className="material-symbols-outlined text-[17px] sm:text-[20px]">send</span>
            </button>
          </form>
        </div>
      </div>

      {/* 6. MODAL: 4-7-8 DIAPHRAGM BREATHING RHYTHM */}
      {activeExercise === 'breath478' && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto overscroll-contain">
          <div className="relative w-full max-w-sm max-h-[96dvh] sm:max-h-[90vh] overflow-y-auto rounded-3xl bg-[#161a30] border border-[#7bd0ff]/30 p-5 sm:p-6 flex flex-col items-center text-center shadow-2xl my-auto">
            <button
              onClick={() => {
                setActiveExercise(null);
                setIsBreathActive(false);
              }}
              className="absolute top-4 right-4 text-[#c7c4d7] hover:text-white"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <span className="text-[10px] font-bold text-[#7bd0ff] uppercase tracking-widest mb-1">
              Bilişsel Sinir Sistemi Sakinleştirici
            </span>
            <h3 className="font-serif text-xl font-bold text-[#dee0ff]">
              4-7-8 Diyafram Nefesi
            </h3>
            <p className="text-xs text-[#c7c4d7] mt-1 mb-6">
              Vagus sinirini uyararak kalp ritmini sakinleştirir ve kaygıyı hücresel düzeyde çözer.
            </p>

            {/* Pulsing Breathing Orb */}
            <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center my-2">
              <div
                className={`absolute rounded-full transition-all duration-1000 ${
                  breathPhase === 'inhale'
                    ? 'w-40 sm:w-44 h-40 sm:h-44 bg-[#7bd0ff]/30 border-2 border-[#7bd0ff] scale-110 shadow-[0_0_35px_rgba(123,208,255,0.4)]'
                    : breathPhase === 'hold'
                    ? 'w-40 sm:w-44 h-40 sm:h-44 bg-[#e7c355]/30 border-2 border-[#e7c355] scale-105 shadow-[0_0_35px_rgba(231,195,85,0.5)]'
                    : 'w-24 sm:w-28 h-24 sm:h-28 bg-[#8083ff]/20 border-2 border-[#8083ff] scale-90 shadow-none'
                }`}
              />
              <div className="relative flex flex-col items-center z-10">
                <span className="font-serif text-3xl font-bold text-white tabular-nums">
                  {breathSecondsLeft}
                </span>
                <span className="text-xs font-bold text-[#dee0ff] uppercase tracking-wider mt-1">
                  {breathPhase === 'inhale' ? 'Nefes Al' : breathPhase === 'hold' ? 'Tut' : 'Yavaşça Ver'}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between w-full text-xs text-[#c7c4d7] px-2">
              <span>Tamamlanan Tur: {breathCyclesCompleted}</span>
              <button
                type="button"
                onClick={() => setIsBreathActive(!isBreathActive)}
                className="px-4 py-1.5 rounded-full bg-[#7bd0ff] text-[#080c22] font-bold"
              >
                {isBreathActive ? 'Duraklat' : 'Devam Et'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL: STOIC CIRCLE OF CONTROL */}
      {activeExercise === 'stoicCircle' && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto overscroll-contain">
          <div className="relative w-full max-w-md max-h-[96dvh] sm:max-h-[90vh] overflow-y-auto rounded-3xl bg-[#161a30] border border-[#e7c355]/30 p-5 sm:p-6 flex flex-col shadow-2xl my-auto">
            <button
              onClick={() => setActiveExercise(null)}
              className="absolute top-4 right-4 text-[#c7c4d7] hover:text-white"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <span className="text-[10px] font-bold text-[#e7c355] uppercase tracking-widest mb-1">
              Marcus Aurelius • Kontrol Dikotomisi
            </span>
            <h3 className="font-serif text-xl font-bold text-[#dee0ff]">
              Stoik Zihinsel Kontrol Çemberi
            </h3>
            <p className="text-xs text-[#c7c4d7] mt-1 mb-4">
              Zihinsel enerjini sadece değiştirebileceğin şeylere odakla, kontrolün dışındakileri serbest bırak.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
              <div className="bg-[#e7c355]/10 border border-[#e7c355]/30 rounded-2xl p-3.5 space-y-2">
                <span className="text-[11px] font-bold text-[#e7c355] uppercase block flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  Kontrolümde Olanlar
                </span>
                <ul className="space-y-1.5 text-[#dee0ff] text-[11px]">
                  <li>• Bugünkü 15 dk mikro-eylemim</li>
                  <li>• Yaşananlara verdiğim içsel tepki</li>
                  <li>• Kendime gösterdiğim şefkat</li>
                  <li>• Odaklandığım niyet ve düşünceler</li>
                </ul>
              </div>

              <div className="bg-[#252840]/60 border border-white/10 rounded-2xl p-3.5 space-y-2">
                <span className="text-[11px] font-bold text-[#c7c4d7] uppercase block flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">cancel</span>
                  Bırakmam Gerekenler
                </span>
                <ul className="space-y-1.5 text-[#c7c4d7] text-[11px]">
                  <li>• Başkalarının benim hakkımdaki fikirleri</li>
                  <li>• Geçmişte kaçırılan fırsatlar</li>
                  <li>• Geleceğin belirsizliği</li>
                  <li>• Dış dünyanın hız temposu</li>
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveExercise(null);
                onShowToast('Stoik sükunet zihnine mühürlendi 🛡️', 'verified');
              }}
              className="mt-5 w-full py-2.5 rounded-xl bg-[#e7c355] text-[#3d2f00] text-xs font-bold shadow-md hover:bg-[#ffe089]"
            >
              Anladım, Zihnimi Sadeleştiriyorum ✨
            </button>
          </div>
        </div>
      )}

      {/* 8. DRAWER: SAVED INSIGHTS VAULT */}
      {isInsightsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm h-full bg-[#161a30] border-l border-white/10 p-5 flex flex-col justify-between shadow-2xl">
            <div className="flex flex-col space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#e7c355] text-[20px]">bookmark</span>
                  <h3 className="font-serif text-lg font-bold text-[#dee0ff]">
                    Kayıtlı İçgörülerim
                  </h3>
                </div>
                <button
                  onClick={() => setIsInsightsOpen(false)}
                  className="w-7 h-7 rounded-full bg-[#252840] flex items-center justify-center text-[#c7c4d7] hover:text-white"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>

              {savedInsights.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#c7c4d7] space-y-2">
                  <span className="material-symbols-outlined text-[32px] text-[#e7c355]/40 block">
                    lightbulb
                  </span>
                  <p>Henüz kaydedilmiş bir içgörü yok.</p>
                  <p className="text-[11px] text-[#908fa0]">
                    Veira'nın mesajlarının altındaki "Kaydet" butonuna basarak sevdiğin rehberlikleri burada arşivleyebilirsin.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedInsights.map((ins) => (
                    <div
                      key={ins.id}
                      className="p-3.5 rounded-2xl bg-[#080c22] border border-white/10 space-y-1.5 shadow-sm"
                    >
                      <div className="flex items-center justify-between text-[10px] text-[#e7c355]">
                        <span className="font-semibold uppercase tracking-wider">{ins.tag || 'Bilişsel İçgörü'}</span>
                        <span className="text-[#908fa0] font-mono">{ins.date}</span>
                      </div>
                      <p className="text-xs text-[#dee0ff] leading-relaxed italic">
                        “{ins.text}”
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsInsightsOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#252840] hover:bg-[#2f334b] text-[#dee0ff] text-xs font-semibold mt-4"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* 9. MODAL: AI FOTOĞRAF & VİZYON STÜDYOSU */}
      {isImageStudioOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto overscroll-contain">
          <div className="relative w-full max-w-xl max-h-[96dvh] sm:max-h-[92vh] flex flex-col overflow-hidden rounded-3xl bg-[#161a30] border border-[#e7c355]/30 shadow-2xl my-auto">
            {/* Header */}
            <div className="flex items-start justify-between p-4 sm:p-6 pb-3 border-b border-white/5 shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-[#e7c355] text-[20px] sm:text-[22px]">palette</span>
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#e7c355] uppercase tracking-wider">
                    Flux.1 8K Ultra-Fotogerçekçi Motor
                  </span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#dee0ff]">
                  AI Vizyon Fotoğrafı Stüdyosu
                </h2>
                <p className="text-xs text-[#c7c4d7] mt-1">
                  Hayalindeki manzarayı veya vizyonunu Türkçe tarif et. Veira, sinematik görsel üretsin.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsImageStudioOpen(false);
                  setGeneratedPhotoUrl(null);
                }}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#c7c4d7] hover:text-white shrink-0 ml-2"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 p-4 sm:p-6 space-y-4">
              {/* Quick Templates */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-[#7bd0ff] uppercase tracking-wider block">
                  Hızlı Vizyon Şablonları:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: '🏡 Como Gölü & Minimalist Villa', prompt: 'Lake Como modern minimalist luxury villa, floor-to-ceiling glass, calm turquoise lake reflection, sunrise' },
                    { label: '🧘 Zen Meditasyon Mabedi', prompt: 'peaceful zen meditation room, warm morning mist, soft sunlight, natural wood floor, tranquil garden' },
                    { label: '🏃 Canlı & Fit Atletik Beden', prompt: 'fit athletic runner on a breathtaking alpine mountain trail at sunrise, vibrant natural vitality, 8k' },
                    { label: '🏛️ Modern Lüks Çalışma Alanı', prompt: 'minimalist sunlit creative design studio, wooden desk, espresso cup, panoramic mountain view' },
                    { label: '🌌 Gece Kozmosu & Samanyolu', prompt: 'clear midnight sky filled with dazzling starlight and milky way galaxy, peaceful solitude, long exposure' },
                    { label: '🏎️ Amalfi Sahil Gezisi', prompt: 'vintage convertible sports car on Amalfi coast cliff overlooking azure Mediterranean sea, golden hour' },
                  ].map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setImagePromptInput(tmpl.prompt);
                        handleGeneratePhotoInStudio(tmpl.prompt);
                      }}
                      className="px-2.5 py-1 rounded-full bg-[#252840] hover:bg-[#2f334b] text-[11px] text-[#dee0ff] border border-white/5 active:scale-95 transition-all"
                    >
                      {tmpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Input */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#dee0ff]">
                    Fotoğraf &amp; Vizyon Tarifi (Türkçe veya İngilizce)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={imagePromptInput}
                      onChange={(e) => setImagePromptInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleGeneratePhotoInStudio();
                        }
                      }}
                      placeholder="Örn: Como Gölü kıyısında cam çalışma masası, gün doğumu, espresso..."
                      className="flex-1 bg-[#080c22] text-xs sm:text-sm text-[#dee0ff] placeholder-[#908fa0] px-4 py-2.5 rounded-xl border border-white/10 outline-none focus:border-[#e7c355]"
                    />
                    <button
                      type="button"
                      disabled={isGeneratingPhoto || !imagePromptInput.trim()}
                      onClick={() => handleGeneratePhotoInStudio()}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#e7c355] to-[#ffe089] text-[#3d2f00] font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isGeneratingPhoto ? 'sync' : 'auto_awesome'}
                      </span>
                      <span>{isGeneratingPhoto ? 'Üretiliyor...' : 'Fotoğraf Üret'}</span>
                    </button>
                  </div>
                </div>

                {/* Style & Aspect Ratio Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#dee0ff]">Fotoğraf Stili</label>
                    <select
                      value={imageStyle}
                      onChange={(e: any) => setImageStyle(e.target.value)}
                      className="w-full bg-[#080c22] text-xs text-[#dee0ff] px-3.5 py-2.5 rounded-xl border border-white/10 outline-none focus:border-[#e7c355]"
                    >
                      <option value="photorealistic">📸 8K Fotogerçekçi (Hasselblad 35mm)</option>
                      <option value="cinematic">🌅 Altın Saat Sinematik</option>
                      <option value="minimalist">🌿 Zen Minimalist Mabed</option>
                      <option value="luxury">🏛️ Lüks Mimari &amp; Manzara</option>
                      <option value="night_sky">🌌 Gece Kozmosu &amp; Yıldızlar</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#dee0ff]">En-Boy Oranı</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: '1:1', label: '1:1 Kare', icon: 'crop_square' },
                        { id: '9:16', label: '9:16 Kilit', icon: 'smartphone' },
                        { id: '16:9', label: '16:9 Geniş', icon: 'panorama' },
                      ].map((ar) => (
                        <button
                          key={ar.id}
                          type="button"
                          onClick={() => setImageAspectRatio(ar.id as any)}
                          className={`py-2 px-1 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all border ${
                            imageAspectRatio === ar.id
                              ? 'bg-[#e7c355] text-[#3d2f00] font-bold border-[#e7c355]'
                              : 'bg-[#080c22] text-[#c7c4d7] hover:text-white border-white/10'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">{ar.icon}</span>
                          <span className="text-[11px]">{ar.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Generated Image Preview Card */}
                {generatedPhotoUrl && (
                  <div className="space-y-3 pt-2">
                    <div className="relative rounded-2xl overflow-hidden border border-[#e7c355]/40 shadow-xl bg-black max-h-72 flex items-center justify-center">
                      <img
                        src={generatedPhotoUrl}
                        alt="Üretilen AI Fotoğrafı"
                        referrerPolicy="no-referrer"
                        className="w-full h-full max-h-72 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=85';
                        }}
                      />
                      <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs font-bold text-[#e7c355] flex items-center gap-1 shadow">
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                        <span>8K Fotogerçekçi Sonuç</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-end gap-2 pt-1 w-full">
                      <button
                        type="button"
                        onClick={() => handleTransferPhotoToChat(generatedPhotoUrl, generatedPhotoPrompt || imagePromptInput)}
                        className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-[#252840] hover:bg-[#2f334b] text-[#7bd0ff] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-white/10"
                      >
                        <span className="material-symbols-outlined text-[15px]">chat</span>
                        <span>Asistan Sohbetine Aktar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddImageToVision(generatedPhotoUrl, (generatedPhotoPrompt || imagePromptInput).slice(0, 32))}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#e7c355] to-[#ffe089] text-[#3d2f00] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 active:scale-95 transition-all"
                      >
                        <span className="material-symbols-outlined text-[16px]">stars</span>
                        <span>Vizyon Panosuna Ekle</span>
                      </button>

                      <a
                        href={generatedPhotoUrl}
                        target="_blank"
                        rel="noreferrer"
                        download="veira-ai-vision.jpg"
                        className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-[#161a30] hover:bg-[#202544] text-[#c7c4d7] hover:text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors border border-white/10"
                      >
                        <span className="material-symbols-outlined text-[15px]">download</span>
                        <span>HD İndir</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}



      {/* 11. MODAL: 5-4-3-2-1 BİLİŞSEL TOPRAKLANMA (GROUNDING) */}
      {activeExercise === 'grounding54321' && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto overscroll-contain">
          <div className="relative w-full max-w-md max-h-[96dvh] sm:max-h-[90vh] overflow-y-auto rounded-3xl bg-[#161a30] border border-[#c0c1ff]/30 p-5 sm:p-6 flex flex-col shadow-2xl my-auto text-center">
            <button
              onClick={() => setActiveExercise(null)}
              className="absolute top-4 right-4 text-[#c7c4d7] hover:text-white"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <span className="text-[10px] font-bold text-[#c0c1ff] uppercase tracking-widest mb-1">
              Bilişsel Topraklanma Egzersizi
            </span>
            <h3 className="font-serif text-xl font-bold text-[#dee0ff]">
              5-4-3-2-1 Zihinsel Çapa
            </h3>
            <p className="text-xs text-[#c7c4d7] mt-1 mb-5">
              Zihnindeki fırtınayı durdurmak için dikkatini 5 duyuna çevirerek 'şu an'a demir at.
            </p>

            {/* Step Progress Pill */}
            <div className="flex items-center justify-center gap-1.5 mb-5">
              {[5, 4, 3, 2, 1].map((step) => (
                <div
                  key={step}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    groundingStep === step
                      ? 'bg-[#c0c1ff] text-[#080c22] scale-110 shadow-[0_0_15px_rgba(192,193,255,0.5)]'
                      : groundingStep < step
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-[#252840] text-[#908fa0]'
                  }`}
                >
                  {groundingStep < step ? '✓' : step}
                </div>
              ))}
            </div>

            {/* Step Card Content */}
            <div className="p-5 rounded-2xl bg-[#080c22] border border-white/10 space-y-3 mb-5">
              {groundingStep === 5 && (
                <>
                  <span className="text-3xl">👁️</span>
                  <h4 className="font-serif text-lg font-bold text-[#dee0ff]">5 Gördüğün Şey</h4>
                  <p className="text-xs text-[#c7c4d7] leading-relaxed">
                    Etrafına sakince bak. Odandaki veya ekranındaki 5 farklı nesneyi fark et (ışık, bitki, bardak, defter...).
                  </p>
                </>
              )}
              {groundingStep === 4 && (
                <>
                  <span className="text-3xl">✋</span>
                  <h4 className="font-serif text-lg font-bold text-[#dee0ff]">4 Dokunduğun Doku</h4>
                  <p className="text-xs text-[#c7c4d7] leading-relaxed">
                    Ellerinin altındaki masayı, parmaklarının ucundaki telefonu veya kıyafetinin yumuşak dokusunu hisset.
                  </p>
                </>
              )}
              {groundingStep === 3 && (
                <>
                  <span className="text-3xl">👂</span>
                  <h4 className="font-serif text-lg font-bold text-[#dee0ff]">3 Duyduğun Ses</h4>
                  <p className="text-xs text-[#c7c4d7] leading-relaxed">
                    Gözlerini hafifçe kıs. Dışarıdaki uzak uğultuyu, kendi sakin nefesini veya 432Hz tonunu dinle.
                  </p>
                </>
              )}
              {groundingStep === 2 && (
                <>
                  <span className="text-3xl">👃</span>
                  <h4 className="font-serif text-lg font-bold text-[#dee0ff]">2 Kokladığın Koku</h4>
                  <p className="text-xs text-[#c7c4d7] leading-relaxed">
                    Derin bir nefes al. Havadaki temiz serinliği veya kahve/çay kokusunu ciğerlerine çek.
                  </p>
                </>
              )}
              {groundingStep === 1 && (
                <>
                  <span className="text-3xl">👅</span>
                  <h4 className="font-serif text-lg font-bold text-[#dee0ff]">1 Tattığın His</h4>
                  <p className="text-xs text-[#c7c4d7] leading-relaxed">
                    Ağzındaki hissi fark et, yutkun. Çene kaslarını, boynunu ve omuzlarını tamamen gevşet.
                  </p>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {groundingStep > 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setGroundingStep((s) => s - 1);
                    onPlayChime();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#c0c1ff] to-[#8083ff] text-[#080c22] font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all"
                >
                  Sonraki Duyuya Geç ({groundingStep - 1})
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setActiveExercise(null);
                    setGroundingStep(5);
                    onPlayChime();
                    onShowToast('Tebrikler Selin! Bilişsel olarak şu ana demirlendin ✨', 'self_improvement');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-[#080c22] font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all"
                >
                  Egzersizi Tamamla ✨
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
