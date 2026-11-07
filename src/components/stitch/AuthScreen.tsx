import React, { useState } from 'react';
import { VeiraLogo } from './VeiraLogo';

interface AuthScreenProps {
  onSuccess: (userData?: { name: string; email: string }) => void;
  onExploreAsGuest: () => void;
  onBack?: () => void;
  onShowToast: (msg: string, icon?: string) => void;
  onPlayChime?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onSuccess,
  onExploreAsGuest,
  onBack,
  onShowToast,
  onPlayChime,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [termsModal, setTermsModal] = useState<'eula' | 'privacy' | 'security' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      onShowToast('Lütfen e-posta ve kutsal parolanızı girin.', 'error');
      return;
    }

    if (authMode === 'signup' && !name) {
      onShowToast('Lütfen adınızı ve soyadınızı belirtin.', 'badge');
      return;
    }

    if (onPlayChime) onPlayChime();

    const displayName = authMode === 'signup' && name ? name : 'Selin Aydın';
    const userEmail = email || 'selin.***@privaterelay.appleid.com';

    onShowToast(
      authMode === 'signin'
        ? `Zihinsel alanınıza hoş geldiniz, ${displayName} ✨`
        : `Zihinsel kimliğiniz mühürlendi ve oluşturuldu, ${displayName} ✨`,
      'auto_awesome'
    );

    onSuccess({ name: displayName, email: userEmail });
  };

  const handleSocialAuth = (provider: 'Apple' | 'Google') => {
    if (onPlayChime) onPlayChime();
    onShowToast(`${provider} ile güvenli oturum açıldı ✨`, 'verified');
    onSuccess({
      name: 'Selin Aydın',
      email: provider === 'Apple' ? 'selin.***@privaterelay.appleid.com' : 'selin.aydin@gmail.com',
    });
  };

  const handleForgotPassword = () => {
    if (!forgotEmail) {
      onShowToast('Lütfen e-posta adresinizi girin.', 'mail');
      return;
    }
    setForgotPasswordModal(false);
    onShowToast('Parola sıfırlama bağlantısı e-posta adresinize gönderildi ✨', 'mark_email_read');
    setForgotEmail('');
  };

  return (
    <div className="relative min-h-[100vh] min-h-[100svh] min-h-[100dvh] w-full bg-[#080c22] text-[#dee0ff] font-body-md antialiased overflow-x-hidden selection:bg-[#c0c1ff] selection:text-[#1000a9]">
      {/* Ambient Starlight Background Refractions */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-36 -left-32 w-96 h-96 rounded-full bg-[#8083ff]/20 blur-[110px]" />
        <div className="absolute top-1/3 -right-36 w-80 h-80 rounded-full bg-[#7bd0ff]/15 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-[#e7c355]/10 blur-[120px]" />
      </div>

      {/* FIXED TOP HEADER */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#080c22]/70 backdrop-blur-2xl pt-safe shadow-[0_4px_30px_rgba(8,12,34,0.4)] border-b border-white/5">
        <div className="h-16 px-4 sm:px-6 md:px-8 max-w-xl md:max-w-2xl mx-auto flex items-center justify-between">
          {onBack ? (
            <button
              aria-label="Geri Dön"
              className="w-11 h-11 rounded-full flex items-center justify-center bg-[#1a1e35]/60 text-[#dee0ff] hover:text-[#c0c1ff] transition-colors active:scale-95"
              onClick={onBack}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
            </button>
          ) : (
            <div className="w-11 h-11" />
          )}

          <div className="flex items-center gap-1.5">
            <span className="text-[#e7c355] text-[18px] material-symbols-outlined">auto_awesome</span>
            <span className="font-serif text-lg tracking-wider text-[#dee0ff]">
              {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
            </span>
          </div>

          <div className="w-8 h-8 rounded-full bg-[#c0c1ff] flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[#1000a9] text-[18px]">person</span>
          </div>
        </div>
      </header>

      {/* MAIN AUTHENTICATION CONTAINER */}
      <main className="flex flex-col relative w-full min-h-[100svh] min-h-[100dvh] pt-20 pb-safe">
        <div className="flex flex-col w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto px-4 sm:px-6 md:px-8 pb-12">
          {/* Üst Yardımcı Navigasyon (Misafir Geçişi) */}
          <div className="flex items-center justify-between py-2 mb-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#252840]/60 backdrop-blur-md border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e7c355] animate-pulse" />
              <span className="text-[11px] font-semibold text-[#c7c4d7] uppercase tracking-widest">
                Nocturnal v2.4
              </span>
            </div>

            <button
              onClick={onExploreAsGuest}
              className="group flex items-center gap-1.5 text-xs font-semibold text-[#e7c355] hover:text-[#ffe089] transition-colors active:scale-95"
              type="button"
            >
              <span>Misafir Olarak Keşfet</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>

          {/* Marka & Hoş Geldin Hero Alanı */}
          <div className="flex flex-col items-center text-center mt-3 mb-6 relative">
            {/* Parlayan Veira Rozeti */}
            <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl overflow-hidden shadow-2xl mb-3 border border-[#e7c355]/40 group hover:scale-105 transition-transform bg-[#080a16]">
              <div className="absolute inset-0 rounded-2xl bg-[#e7c355]/15 blur-md animate-pulse" />
              <VeiraLogo className="w-full h-full relative z-10" showFrame={true} />
            </div>

            <h1 className="font-serif text-3xl font-bold text-[#dee0ff] tracking-[0.25em] uppercase mb-1">
              V E I R A
            </h1>
            <p className="text-xs text-[#c7c4d7] max-w-[270px]">
              Zihinsel Vizyon ve Eylem Mimarisi
            </p>

            {/* Zarif Segmented Switch (Giriş Yap / Kayıt Ol) */}
            <div className="w-full max-w-xs mt-5 p-1 rounded-full bg-[#080c22]/80 backdrop-blur-2xl shadow-inner flex relative border border-white/10">
              <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-[#252840] shadow-md transition-all duration-300 ease-out border border-white/5 ${
                  authMode === 'signin' ? 'left-1' : 'left-[calc(50%+2px)]'
                }`}
              />
              <button
                className={`relative z-10 flex-1 py-2 text-xs font-semibold transition-colors duration-200 ${
                  authMode === 'signin' ? 'text-[#e7c355]' : 'text-[#c7c4d7] hover:text-[#dee0ff]'
                }`}
                onClick={() => setAuthMode('signin')}
                type="button"
              >
                Giriş Yap
              </button>
              <button
                className={`relative z-10 flex-1 py-2 text-xs font-semibold transition-colors duration-200 ${
                  authMode === 'signup' ? 'text-[#e7c355]' : 'text-[#c7c4d7] hover:text-[#dee0ff]'
                }`}
                onClick={() => setAuthMode('signup')}
                type="button"
              >
                Kayıt Ol
              </button>
            </div>
          </div>

          {/* Sosyal Giriş Butonları */}
          <div className="flex flex-col gap-2.5 w-full">
            {/* Apple ile Giriş */}
            <button
              onClick={() => handleSocialAuth('Apple')}
              className="w-full h-12 rounded-full bg-[#1a1e35]/80 backdrop-blur-xl hover:bg-[#252840] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 shadow-md border border-white/5"
              type="button"
            >
              <svg className="w-5 h-5 fill-current text-[#dee0ff]" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.85-11.93-14.42-6-9.16-10.74-19.34-14.23-30.55-3.48-11.21-5.23-21.75-5.23-31.62 0-14.24 3.69-25.79 11.08-34.65 7.39-8.86 16.48-13.34 27.27-13.46 4.9.12 10.33 1.34 16.29 3.66 5.96 2.32 9.69 3.53 11.19 3.63 2.12-.34 6.13-1.66 12.03-3.96 5.9-2.3 11.1-3.35 15.6-3.15 13.57.9 24.36 5.75 32.37 14.54-11.95 7.27-17.77 17.27-17.47 30 0 9.77 3.73 17.92 11.19 24.45 7.46 6.53 16.48 10.15 27.06 10.86-2.29 6.84-5.06 13.25-8.3 19.24zM119.22 31.84c0-7.72 2.76-14.78 8.28-21.18 5.52-6.4 12.35-10.29 20.49-11.66.44 1.45.66 2.9.66 4.35 0 7.72-2.88 15.01-8.63 21.87-5.75 6.86-12.67 10.75-20.76 11.67-.04-1.7-.04-3.38-.04-5.05z" />
              </svg>
              <span className="text-sm font-medium text-[#dee0ff]">Apple ile Devam Et</span>
            </button>

            {/* Google ile Giriş */}
            <button
              onClick={() => handleSocialAuth('Google')}
              className="w-full h-12 rounded-full bg-[#1a1e35]/80 backdrop-blur-xl hover:bg-[#252840] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 shadow-md border border-white/5"
              type="button"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                  fill="#EA4335"
                />
                <path
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  fill="#4285F4"
                />
                <path
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                  fill="#34A853"
                />
              </svg>
              <span className="text-sm font-medium text-[#dee0ff]">Google ile Devam Et</span>
            </button>
          </div>

          {/* Yıldız Tozu Ayracı */}
          <div className="flex items-center my-6 gap-2">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#464554]/40 to-[#464554]/60" />
            <div className="flex items-center gap-1 px-1">
              <span className="material-symbols-outlined text-[10px] text-[#e7c355]">star</span>
              <span className="text-[11px] font-semibold text-[#c7c4d7] uppercase tracking-widest">
                veya e-posta
              </span>
              <span className="material-symbols-outlined text-[10px] text-[#e7c355]">star</span>
            </div>
            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#464554]/40 to-[#464554]/60" />
          </div>

          {/* FORM GİRDİLERİ */}
          <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
            {/* Ad & Soyad Alanı (Kayıt Ol modunda görünür) */}
            {authMode === 'signup' && (
              <div className="flex flex-col gap-1.5 animate-fadeIn">
                <label className="text-[11px] font-semibold text-[#c7c4d7] flex items-center justify-between">
                  <span>Adınız ve Soyadınız</span>
                  <span className="text-[#e7c355] text-[11px]">Bilinç Alanı Kimliği</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[18px] text-[#c0c1ff]">
                    person
                  </span>
                  <input
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#252840]/50 text-[#dee0ff] placeholder:text-[#908fa0] focus:outline-none focus:bg-[#2f334b]/90 border border-white/5 focus:border-[#e7c355]/40 transition-all text-sm shadow-sm"
                    placeholder="Selin Aydın"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* E-posta Alanı */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-[#c7c4d7] flex items-center justify-between">
                <span>E-posta Adresi</span>
                <span className="material-symbols-outlined text-[14px] text-[#e7c355]">
                  alternate_email
                </span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-[18px] text-[#c0c1ff]">
                  mail
                </span>
                <input
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#252840]/50 text-[#dee0ff] placeholder:text-[#908fa0] focus:outline-none focus:bg-[#2f334b]/90 border border-white/5 focus:border-[#e7c355]/40 transition-all text-sm shadow-sm"
                  placeholder="selin@veira.mind"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Parola Alanı */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-[#c7c4d7] flex items-center justify-between">
                <span>Kutsal Parola</span>
                <span className="text-[10px] text-[#908fa0]">Kriptografik 256-bit</span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-[18px] text-[#c0c1ff]">
                  lock
                </span>
                <input
                  className="w-full h-12 pl-11 pr-11 rounded-xl bg-[#252840]/50 text-[#dee0ff] placeholder:text-[#908fa0] focus:outline-none focus:bg-[#2f334b]/90 border border-white/5 focus:border-[#e7c355]/40 transition-all text-sm tracking-wider shadow-sm"
                  placeholder="••••••••"
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  aria-label="Parolayı Göster/Gizle"
                  className="absolute right-2 p-1.5 rounded-lg text-[#c7c4d7] hover:text-[#dee0ff] transition-colors flex items-center justify-center"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Giriş Modu Ekstra Seçenekleri (Beni Hatırla & Şifremi Unuttum) */}
            {authMode === 'signin' && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#252840] text-[#c0c1ff] focus:ring-0 focus:outline-none accent-[#e7c355] cursor-pointer"
                    type="checkbox"
                  />
                  <span className="text-xs font-medium text-[#c7c4d7]">Beni Hatırla</span>
                </label>
                <button
                  className="text-xs font-medium text-[#e7c355] hover:underline transition-all"
                  onClick={() => setForgotPasswordModal(true)}
                  type="button"
                >
                  Şifremi Unuttum?
                </button>
              </div>
            )}

            {/* Kayıt Modu Ekstra Güvenlik Toggle Rozeti (Face ID) */}
            {authMode === 'signup' && (
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#161a30]/90 backdrop-blur-md shadow-sm border border-white/5 animate-fadeIn">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#e7c355]/15 flex items-center justify-center text-[#e7c355]">
                    <span className="material-symbols-outlined text-[18px]">fingerprint</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-[#dee0ff]">
                      Biyometrik Kasa (Face ID)
                    </span>
                    <span className="text-[11px] text-[#c7c4d7]">
                      Anında anahtarsız ve güvenli kilit açılışı
                    </span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    checked={biometricEnabled}
                    onChange={(e) => setBiometricEnabled(e.target.checked)}
                    className="sr-only peer"
                    type="checkbox"
                  />
                  <div className="w-9 h-5 bg-[#2f334b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e7c355]" />
                </label>
              </div>
            )}

            {/* Ana Aksiyon Butonu (Altın / Işıltılı Gradyan) */}
            <button
              className="mt-2 w-full h-14 rounded-full bg-gradient-to-r from-[#ffe089] via-[#e7c355] to-[#ffe089] text-[#3d2f00] font-semibold text-sm tracking-wide shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              type="submit"
            >
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              <span>
                {authMode === 'signin'
                  ? 'Zihinsel Alanıma Giriş Yap'
                  : 'Vizyonumu Mühürle & Kaydol'}
              </span>
            </button>

            {/* Senkronizasyon Mikro Bilgilendirme Notu */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-[#161a30]/50 backdrop-blur-sm border border-white/5 mt-1">
              <span className="material-symbols-outlined text-[16px] text-[#e7c355] shrink-0 mt-0.5">
                sync_saved_locally
              </span>
              <p className="text-[11px] text-[#c7c4d7] leading-relaxed">
                Misafir modunda tasarladığınız vizyonlar ve oluşturulan zihin panoları güvenle bu hesabınızla birleştirilecektir.
              </p>
            </div>
          </form>

          {/* Kutsal Gizlilik & Kriptografik Güvence Kartı */}
          <div className="mt-8 p-4 rounded-2xl bg-[#080c22]/80 backdrop-blur-xl shadow-lg border border-white/5 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#7bd0ff]/15 flex items-center justify-center text-[#7bd0ff] shrink-0">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
              </div>
              <span className="text-xs font-semibold text-[#dee0ff] tracking-wide">
                %100 Cihaz İçi Uçtan Uca Kriptografik Kasa
              </span>
            </div>
            <p className="text-xs text-[#c7c4d7] leading-relaxed">
              Düşünceleriniz, niyetleriniz ve yüklediğiniz görseller Apple Secure Enclave seviyesinde yerel olarak şifrelenir. Kişisel verileriniz asla yapay zeka eğitim modelleriyle paylaşılmaz.
            </p>

            {/* Yasal Bağlantılar */}
            <div className="flex items-center justify-center gap-4 pt-2 text-[11px] text-[#908fa0]">
              <button
                type="button"
                onClick={() => setTermsModal('eula')}
                className="hover:text-[#e7c355] transition-colors underline underline-offset-4 decoration-white/20"
              >
                Kullanım Koşulları (EULA)
              </button>
              <span className="text-[#464554]">•</span>
              <button
                type="button"
                onClick={() => setTermsModal('privacy')}
                className="hover:text-[#e7c355] transition-colors underline underline-offset-4 decoration-white/20"
              >
                Gizlilik Politikası
              </button>
              <span className="text-[#464554]">•</span>
              <button
                type="button"
                onClick={() => setTermsModal('security')}
                className="hover:text-[#e7c355] transition-colors underline underline-offset-4 decoration-white/20"
              >
                Kutsal Güvenlik
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* FORGOT PASSWORD MODAL */}
      {forgotPasswordModal && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto overscroll-contain"
          onClick={() => setForgotPasswordModal(false)}
        >
          <div
            className="w-full max-w-sm max-h-[96dvh] sm:max-h-[90vh] overflow-y-auto bg-[#161a30] border border-[#e7c355]/30 rounded-3xl p-5 sm:p-6 shadow-2xl relative text-center my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setForgotPasswordModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#c7c4d7] hover:text-white"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            <div className="w-14 h-14 rounded-full bg-[#e7c355]/15 border border-[#e7c355]/40 flex items-center justify-center mx-auto mb-3 text-[#e7c355]">
              <span className="material-symbols-outlined text-2xl">key</span>
            </div>

            <h3 className="font-serif text-lg font-bold text-[#dee0ff] mb-1">
              Kutsal Parolayı Sıfırla
            </h3>
            <p className="text-xs text-[#c7c4d7] mb-4">
              Kayıtlı e-posta adresinizi girin, size güvenli bir erişim bağlantısı iletelim.
            </p>

            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="ornek@veira.app"
              className="w-full h-11 px-4 rounded-xl bg-[#252840] border border-white/10 text-sm text-[#dee0ff] placeholder:text-[#908fa0] mb-4 focus:outline-none focus:border-[#e7c355]"
            />

            <button
              onClick={handleForgotPassword}
              className="w-full h-11 rounded-full bg-[#e7c355] text-[#3d2f00] font-bold text-xs shadow-lg active:scale-95 transition-transform"
            >
              Sıfırlama Bağlantısı Gönder
            </button>
          </div>
        </div>
      )}

      {/* TERMS & PRIVACY MODAL (Apple App Store Guideline 5.1.2 & Google Play Policy Compliant) */}
      {termsModal && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto overscroll-contain"
          onClick={() => setTermsModal(null)}
        >
          <div
            className="w-full max-w-md max-h-[96dvh] sm:max-h-[90vh] overflow-y-auto bg-[#161a30] border border-[#e7c355]/30 rounded-3xl p-5 sm:p-6 shadow-2xl relative text-left my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#e7c355] text-[20px]">
                  {termsModal === 'eula' ? 'gavel' : termsModal === 'privacy' ? 'verified_user' : 'lock'}
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#dee0ff]">
                  {termsModal === 'eula'
                    ? 'Kullanım Koşulları (EULA)'
                    : termsModal === 'privacy'
                    ? 'Gizlilik ve Veri Güvenliği Politikası'
                    : 'Kutsal Şifreleme ve Güvenlik'}
                </h3>
              </div>
              <button
                onClick={() => setTermsModal(null)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#c7c4d7] hover:text-white"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="text-xs text-[#c7c4d7] space-y-3 leading-relaxed">
              {termsModal === 'eula' && (
                <>
                  <p className="font-medium text-[#dee0ff]">
                    Veira Uygulama İçi Lisans Sözleşmesi (Apple Standard EULA &amp; Google Play Koşulları):
                  </p>
                  <p>
                    1. <strong>Lisans Kapsamı:</strong> Veira, kişisel ve devredilemez bir son kullanıcı lisansı sunar. Uygulama içerisindeki niyetler, 15 dakikalık kilometre taşları ve vizyon panoları kullanıcı tarafından üretilir.
                  </p>
                  <p>
                    2. <strong>Yapay Zeka Kullanımı:</strong> Veira yapay zekası niyet ve hedef desteği sağlar; çıktıların uygunsuz olmaması için güvenlik filtreleri ve raporlama mekanizmaları mevcuttur.
                  </p>
                  <p>
                    3. <strong>Sağlık Sorumluluk Reddi:</strong> Veira bir motivasyon ve zihinsel berraklık aracıdır; klinik psikiyatrik veya tıbbi tedavi niteliği taşımaz.
                  </p>
                  <p>
                    4. <strong>Hesap Silme:</strong> Profil veya Ayarlar ekranından hesabınızı ve tüm yerel verilerinizi istediğiniz zaman kalıcı olarak silebilirsiniz.
                  </p>
                </>
              )}

              {termsModal === 'privacy' && (
                <>
                  <p className="font-medium text-[#dee0ff]">
                    Apple Gizlilik İlkeleri ve Google Play Kullanıcı Verileri Politikası:
                  </p>
                  <p>
                    1. <strong>Sıfır Telemetri:</strong> Hiçbir reklam ağı, üçüncü şahıs takip kodu veya kullanıcı verisi satışı yapılmaz.
                  </p>
                  <p>
                    2. <strong>Uçtan Uca Şifreleme:</strong> Tüm panolarınız cihazınızın yerel depolama alanında AES-256 şifrelemesiyle korunur.
                  </p>
                  <p>
                    3. <strong>Yapay Zeka Prompt Güvenliği:</strong> Hedef parçalama ve niyet önerisi girdileriniz model eğitimi için kullanılmaz, üçüncü şahıslarla paylaşılmaz.
                  </p>
                  <p>
                    4. <strong>Veri İmhası:</strong> Uygulamayı sildiğinizde veya "Hesabı Sil" düğmesini kullandığınızda tüm verileriniz anında temizlenir.
                  </p>
                </>
              )}

              {termsModal === 'security' && (
                <>
                  <p className="font-medium text-[#dee0ff]">
                    Çift Katmanlı Biyometrik ve Kriptografik Kasa Mimarisi:
                  </p>
                  <p>
                    Face ID ve Touch ID donanımsal Secure Enclave üzerinden çalışır; biyometrik veriniz cihaz dışına asla çıkamaz. İletişim oturumları TLS 1.3 standardında şifrelenir.
                  </p>
                </>
              )}

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-[#908fa0]">Resmi İletişim:</span>
                <span className="text-[#e7c355] font-semibold">destek@veira.app</span>
              </div>
            </div>

            <div className="mt-5">
              <button
                onClick={() => setTermsModal(null)}
                className="w-full py-3 rounded-full bg-[#e7c355] text-[#3d2f00] font-bold text-xs shadow-md active:scale-95 transition-transform"
              >
                Kabul Ediyorum &amp; Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
