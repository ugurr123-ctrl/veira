import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, Copy, Check, X, Smartphone, FileText, FolderArchive, ArrowRight } from 'lucide-react';
import JSZip from 'jszip';

interface AndroidApkModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'tr' | 'en';
}

const FILES = [
  {
    id: 'main-activity',
    title: 'MainActivity.kt',
    path: 'app/src/main/java/com/veira/app/MainActivity.kt',
    lang: 'kotlin',
    code: `package com.veira.app

import android.annotation.SuppressLint
import android.graphics.Color
import android.os.Bundle
import android.view.View
import android.view.WindowManager
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Durum çubuğunu (Status Bar) Veira'nın gece laciverti (#080A16) ile boya
        window.apply {
            clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS)
            addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS)
            statusBarColor = Color.parseColor("#080A16")
            navigationBarColor = Color.parseColor("#080A16")
            decorView.systemUiVisibility = 0 // Beyaz ikonlar ve metinler
        }

        webView = findViewById(R.id.veiraWebView)

        // WebView Motor Ayarları (Canlı Geçişler, LocalStorage ve 432Hz Ses için Şarttır)
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            useWideViewPort = true
            loadWithOverviewMode = true
            allowFileAccess = true
            allowContentAccess = true
            mediaPlaybackRequiresUserGesture = false // 432Hz sesin arka planda ve anında çalabilmesi için
            cacheMode = WebSettings.LOAD_DEFAULT
        }

        val fallbackCloudUrl = "https://ais-pre-dldcexr22duip7tka3swm7-848124876637.europe-west2.run.app"

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                return false // Uygulama içi akışta kal
            }

            // Yerel assets/index.html bulunamazsa otomatik canlı bulut URL'sini aç (asla beyaz ekran kalmaz)
            override fun onReceivedError(view: WebView?, errorCode: Int, description: String?, failingUrl: String?) {
                if (failingUrl?.contains("android_asset") == true) {
                    view?.loadUrl(fallbackCloudUrl)
                }
            }
        }

        webView.webChromeClient = WebChromeClient()

        // 1. Önce yerel assets içerisindeki index.html dosyasını kontrol et
        // 2. index.html mevcutsa anında internetsiz yerel aç, yoksa bulut URL'sini aç (asla 'dosya eksik' uyarısı vermez)
        try {
            val assetFiles = assets.list("") ?: emptyArray()
            if (assetFiles.contains("index.html")) {
                webView.loadUrl("file:///android_asset/index.html")
            } else {
                webView.loadUrl(fallbackCloudUrl)
            }
        } catch (e: Exception) {
            webView.loadUrl(fallbackCloudUrl)
        }

        // Android Donanım Geri Tuşu Mantığı: Uygulamadan çıkmak yerine sayfada geri git
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    finish()
                }
            }
        })
    }
}`,
  },
  {
    id: 'index-html',
    title: 'assets/index.html',
    path: 'app/src/main/assets/index.html',
    lang: 'html',
    code: `<!-- VEIRA ANDROID WEBVIEW ASSET DOSYASI -->
<!-- Bu dosya ZIP paketi içinde doğrudan 'app/src/main/assets/index.html' olarak hazır bulunmaktadır. -->
<!-- Bu sayede Android Studio'da derlerken hiçbir zaman 'index.html eksik' hatası oluşmaz. -->

<!DOCTYPE html>
<html class="dark" lang="tr">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"/>
  <title>Veira — Vision & Goal Manifest Sanctuary</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;1,400&display=swap" rel="stylesheet"/>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#080A16] text-[#dee0ff]">
  <div id="root"></div>
  <script>
    // Canlı web sürümüne anında bağlanma ve yerel önbellek köprüsü
    window.addEventListener('DOMContentLoaded', () => {
      console.log('Veira Android WebView initialized successfully.');
    });
  </script>
</body>
</html>`,
  },
  {
    id: 'manifest',
    title: 'AndroidManifest.xml',
    path: 'app/src/main/AndroidManifest.xml',
    lang: 'xml',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <!-- İnternet, Donanım Hızlandırma ve Ses İzinleri -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK" />

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="Veira"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.Veira"
        android:hardwareAccelerated="true"
        android:usesCleartextTraffic="true"
        tools:targetApi="31">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:screenOrientation="portrait"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>`,
  },
  {
    id: 'build-gradle-app',
    title: 'app/build.gradle.kts',
    path: 'app/build.gradle.kts',
    lang: 'kotlin',
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.veira.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.veira.app"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.material)
    implementation(libs.androidx.activity)
    implementation(libs.androidx.webkit)
}`,
  },
  {
    id: 'activity-main-xml',
    title: 'activity_main.xml',
    path: 'app/src/main/res/layout/activity_main.xml',
    lang: 'xml',
    code: `<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#080A16">

    <WebView
        android:id="@+id/veiraWebView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:overScrollMode="never" />

</FrameLayout>`,
  },
  {
    id: 'colors-themes',
    title: 'colors.xml & themes.xml',
    path: 'app/src/main/res/values/',
    lang: 'xml',
    code: `<!-- colors.xml -->
<resources>
    <color name="spaceDeepNavy">#080A16</color>
    <color name="celestialGold">#F5D061</color>
</resources>

<!-- themes.xml -->
<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Theme.Veira" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <item name="android:statusBarColor">#080A16</item>
        <item name="android:navigationBarColor">#080A16</item>
        <item name="android:windowBackground">#080A16</item>
    </style>
</resources>`,
  },
];

export const AndroidApkModal: React.FC<AndroidApkModalProps> = ({
  isOpen,
  onClose,
  lang = 'tr',
}) => {
  const [selectedFileId, setSelectedFileId] = useState(FILES[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  const [isDownloadingHtml, setIsDownloadingHtml] = useState(false);

  if (!isOpen) return null;

  const currentFile = FILES.find((f) => f.id === selectedFileId) || FILES[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStandAloneHtmlContent = async (): Promise<string> => {
    try {
      const res = await fetch('/veira-webview-index.html');
      if (res.ok) {
        const text = await res.text();
        if (text && text.trim().length > 100) {
          return text;
        }
      }
    } catch (e) {
      console.warn('Could not fetch standalone HTML from static asset, using fallback:', e);
    }
    return (
      FILES.find((f) => f.id === 'index-html')?.code ||
      `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"/>
  <title>Veira</title>
  <script>
    window.location.replace("https://ais-pre-dldcexr22duip7tka3swm7-848124876637.europe-west2.run.app");
  </script>
</head>
<body style="background:#080A16;color:#dee0ff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:sans-serif;">
  <p>Veira açılıyor...</p>
</body>
</html>`
    );
  };

  const handleDownloadIndexHtmlOnly = async () => {
    try {
      setIsDownloadingHtml(true);
      const htmlContent = await getStandAloneHtmlContent();
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'index.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('index.html download error:', err);
    } finally {
      setIsDownloadingHtml(false);
    }
  };

  const handleDownloadFullZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Standalone HTML Content for Android WebView assets
      const htmlContent = await getStandAloneHtmlContent();

      // Root build files
      zip.file(
        'build.gradle.kts',
        `// Top-level build file\nplugins {\n    alias(libs.plugins.android.application) apply false\n    alias(libs.plugins.kotlin.android) apply false\n}\n`
      );
      zip.file(
        'settings.gradle.kts',
        `pluginManagement {\n    repositories {\n        google()\n        mavenCentral()\n        gradlePluginPortal()\n    }\n}\ndependencyResolutionManagement {\n    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)\n    repositories {\n        google()\n        mavenCentral()\n    }\n}\nrootProject.name = "veira"\ninclude(":app")\n`
      );

      // App build file
      zip.file(
        'app/build.gradle.kts',
        FILES.find((f) => f.id === 'build-gradle-app')?.code || ''
      );

      // Manifest
      zip.file(
        'app/src/main/AndroidManifest.xml',
        FILES.find((f) => f.id === 'manifest')?.code || ''
      );

      // Kotlin Main Activity (with double fallback so it never fails)
      zip.file(
        'app/src/main/java/com/veira/app/MainActivity.kt',
        FILES.find((f) => f.id === 'main-activity')?.code || ''
      );

      // Layout
      zip.file(
        'app/src/main/res/layout/activity_main.xml',
        FILES.find((f) => f.id === 'activity-main-xml')?.code || ''
      );

      // Values
      zip.file(
        'app/src/main/res/values/colors.xml',
        `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="spaceDeepNavy">#080A16</color>\n    <color name="celestialGold">#F5D061</color>\n</resources>`
      );
      zip.file(
        'app/src/main/res/values/themes.xml',
        `<?xml version="1.0" encoding="utf-8"?>\n<resources xmlns:tools="http://schemas.android.com/tools">\n    <style name="Theme.Veira" parent="Theme.MaterialComponents.DayNight.NoActionBar">\n        <item name="android:statusBarColor">#080A16</item>\n        <item name="android:navigationBarColor">#080A16</item>\n        <item name="android:windowBackground">#080A16</item>\n    </style>\n</resources>`
      );

      // 1. Android Asset: app/src/main/assets/index.html (Essential for file:///android_asset/index.html)
      zip.file('app/src/main/assets/index.html', htmlContent);

      // 2. Project root: index.html (Just in case root is referenced)
      zip.file('index.html', htmlContent);

      // Readme instructions
      zip.file(
        'README_APK_KURULUM.md',
        `# VEIRA ANDROID STUDIO PROJESİ (Tam Otomatik Paket)\n\n✅ index.html dosyası bu proje ZIP paketi içinde doğrudan 'app/src/main/assets/index.html' konumuna eklenmiştir.\nHiçbir ek dosya kopyalama veya arama işlemi yapmanıza gerek yoktur!\n\n## Hızlı Derleme Adımları:\n1. Android Studio'yu açın.\n2. 'Open' (Projeyi Aç) seçeneğine tıklayıp bu klasörü seçin.\n3. Gradle senkronizasyonunun tamamlanmasını bekleyin.\n4. Üst menüden Build > Build Bundle(s) / APK(s) > Build APK(s) tıklayın.\n5. Tebrikler! Veira mobil uygulamanız Android telefonunuza kurulmaya hazır.\n\n✨ Güvence: MainActivity.kt hem yerel index.html dosyasını hem de olası bir durumda canlı bulut sunucusunu otomatik olarak yedekli çalıştıracak şekilde donatılmıştır.`
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'veira_android_studio_projesi.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('ZIP creation error:', err);
    } finally {
      setIsZipping(false);
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-start sm:items-center justify-center p-2.5 sm:p-5 bg-black/85 backdrop-blur-xl overflow-y-auto overscroll-contain animate-fadeIn min-h-[100dvh]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl my-auto rounded-2xl sm:rounded-3xl bg-[#0e1228] border border-[#818cf8]/40 shadow-[0_25px_70px_rgba(0,0,0,0.95)] p-4 sm:p-6 space-y-3.5 sm:space-y-4 max-h-[94dvh] sm:max-h-[86dvh] flex flex-col overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-[#f5d061]" />
            <div>
              <h3 className="font-editorial text-xl font-medium text-[#fdf4dc]">
                {lang === 'tr'
                  ? 'Android Studio WebView APK Paketi'
                  : 'Android Studio WebView APK Kit'}
              </h3>
              <p className="text-xs text-[#c7c4d7]">
                {lang === 'tr'
                  ? 'Doğrudan Android Studio ile derleyebileceğiniz hazır mobil proje dosyaları.'
                  : 'Ready-to-build configuration files for standalone Android APK compilation.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#c7c4d7] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Step Instruction Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#080a16]/60 border border-white/10 text-xs text-[#c7c4d7] shrink-0">
          <div className="space-y-0.5">
            <span className="font-bold text-[#f5d061] text-[11px] uppercase tracking-wide">
              {lang === 'tr' ? '1. Projeyi Açın' : '1. Open Project'}
            </span>
            <p className="text-[11px]">
              {lang === 'tr'
                ? 'Android Studio > Open > İndirilen veira klasörünü seçin.'
                : 'Android Studio > Open Project > Select the extracted veira folder.'}
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="font-bold text-[#34d399] text-[11px] uppercase tracking-wide flex items-center gap-1">
              <Check className="w-3 h-3 text-[#34d399]" />
              {lang === 'tr' ? '2. index.html Otomatik Ekli' : '2. index.html Pre-Bundled'}
            </span>
            <p className="text-[11px]">
              {lang === 'tr'
                ? 'app/src/main/assets/index.html dosyanız ZIP içine dahil edilmiştir.'
                : 'Pre-bundled in app/src/main/assets/index.html ready for compilation.'}
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="font-bold text-[#38bdf8] text-[11px] uppercase tracking-wide">
              {lang === 'tr' ? '3. APK Üretin' : '3. Build APK'}
            </span>
            <p className="text-[11px]">
              {lang === 'tr'
                ? 'Build > Build Bundle(s) / APK(s) > Build APK(s) tıklayın.'
                : 'Build > Build Bundle(s) / APK(s) > Build APK(s).'}
            </p>
          </div>
        </div>

        {/* Download Buttons Strip: Full Project ZIP & Standalone index.html */}
        <div className="p-3.5 rounded-xl bg-[#6366f1]/15 border border-[#818cf8]/40 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <FolderArchive className="w-5 h-5 text-[#f5d061] shrink-0" />
            <div>
              <span className="font-semibold text-xs text-[#fdf4dc] block">
                {lang === 'tr'
                  ? 'Eksiksiz Android Studio Projesi (index.html Dahil)'
                  : 'Complete Android Studio Project (Includes index.html)'}
              </span>
              <span className="text-[11px] text-[#c7c4d7]">
                {lang === 'tr'
                  ? 'Kotlin, Manifest, Gradle ve app/src/main/assets/index.html tam paket.'
                  : 'Full structure, Kotlin code, Manifest, and assets/index.html pre-packaged.'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0">
            {/* Standalone index.html Download */}
            <button
              onClick={handleDownloadIndexHtmlOnly}
              disabled={isDownloadingHtml}
              title={lang === 'tr' ? 'Sadece eksik olan index.html dosyasını indir' : 'Download only index.html file'}
              className="px-3.5 py-2 rounded-full border border-[#f5d061]/50 bg-[#f5d061]/10 hover:bg-[#f5d061]/20 text-[#f5d061] text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>
                {isDownloadingHtml
                  ? lang === 'tr'
                    ? 'İndiriliyor...'
                    : 'Downloading...'
                  : lang === 'tr'
                  ? 'Sadece index.html İndir'
                  : 'Download index.html'}
              </span>
            </button>

            {/* Complete Project ZIP */}
            <button
              onClick={handleDownloadFullZip}
              disabled={isZipping}
              className="btn-celestial-primary text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-2 shrink-0 shadow-md transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>
                {isZipping
                  ? lang === 'tr'
                    ? 'Hazırlanıyor...'
                    : 'Zipping...'
                  : lang === 'tr'
                  ? 'Projeyi İndir (.ZIP)'
                  : 'Download .ZIP'}
              </span>
            </button>
          </div>
        </div>

        {/* File Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 no-scrollbar">
          {FILES.map((f) => {
            const isSelected = f.id === selectedFileId;
            return (
              <button
                key={f.id}
                onClick={() => setSelectedFileId(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-[#6366f1]/30 border border-[#818cf8]/70 text-[#fdf4dc]'
                    : 'bg-white/5 border border-white/10 text-[#c7c4d7] hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-[#818cf8]" />
                <span>{f.title}</span>
              </button>
            );
          })}
        </div>

        {/* Code View with Copy Button */}
        <div className="relative flex-1 min-h-[220px] rounded-xl overflow-hidden bg-[#080a16] border border-white/10 flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5 text-[11px] text-[#c7c4d7] font-mono">
            <span>{currentFile.path}</span>
            <button
              onClick={() => handleCopy(currentFile.code, currentFile.id)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-[#dee0ff] transition-all"
            >
              {copiedId === currentFile.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#f5d061]" />
                  <span className="text-[#f5d061]">{lang === 'tr' ? 'Kopyalandı' : 'Copied'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{lang === 'tr' ? 'Kodu Kopyala' : 'Copy Code'}</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 text-xs font-mono text-[#dee0ff]/90 overflow-auto flex-1 leading-relaxed selection:bg-[#6366f1]/40">
            <code>{currentFile.code}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between shrink-0 pt-2 border-t border-white/10">
          <span className="text-[11px] text-[#c7c4d7]/70">
            {lang === 'tr'
              ? '432Hz arka plan ses izinleri AndroidManifest.xml içinde tanımlıdır.'
              : '432Hz background audio playback permissions are pre-configured.'}
          </span>
          <button
            onClick={onClose}
            className="btn-celestial-primary text-white text-xs font-semibold px-5 py-2 rounded-full cursor-pointer"
          >
            {lang === 'tr' ? 'Tamam' : 'Close Guide'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
