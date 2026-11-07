# VEIRA — ANDROID STUDIO WEBVIEW APK TAM PROJE PAKETİ
**Amaç:** İndirilen `code.html` dosyasını hiçbir harici derleme karmaşası olmadan, doğrudan Android Studio'da açıp **Build > Build APK** ile çalışır APK üretebileceğiniz eksiksiz Android proje dosyaları.

---

## 📁 1. PROJE DİZİN YAPISI
Android Studio'da "New Project > No Activity" seçip proje adını `veira` yaptıktan sonra klasör yapısı tam olarak şu şekilde olmalıdır:

```
veira/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── assets/
│   │       │   └── index.html               <-- (İndirdiğiniz code.html dosyasını buraya yapıştırıp adını index.html yapın)
│   │       ├── java/com/veira/app/
│   │       │   └── MainActivity.kt          <-- (Dosya 3)
│   │       ├── res/
│   │       │   ├── layout/
│   │       │   │   └── activity_main.xml    <-- (Dosya 4)
│   │       │   └── values/
│   │       │       ├── colors.xml           <-- (Dosya 5)
│   │       │       └── themes.xml           <-- (Dosya 6)
│   │       └── AndroidManifest.xml          <-- (Dosya 2)
│   └── build.gradle.kts                     <-- (Dosya 1b: App Seviyesi)
├── build.gradle.kts                         <-- (Dosya 1a: Proje Seviyesi)
└── settings.gradle.kts
```

---

## 📄 DOSYA 1a: `build.gradle.kts` (Root / Proje Seviyesi)
```kotlin
// Top-level build file
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
}
```

---

## 📄 DOSYA 1b: `app/build.gradle.kts` (App Seviyesi)
```kotlin
plugins {
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
}
```

---

## 📄 DOSYA 2: `app/src/main/AndroidManifest.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
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

</manifest>
```

---

## 📄 DOSYA 3: `app/src/main/java/com/veira/app/MainActivity.kt`
```kotlin
package com.veira.app

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

        // WebView Motor Ayarları (Canlı Geçişler, LocalStorage ve Ses için Şarttır)
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

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                return false // Uygulama içi akışta kal
            }
        }

        webView.webChromeClient = WebChromeClient()

        // Yerel assets içerisindeki index.html dosyasını yükle (İnternetsiz anında açılır)
        webView.loadUrl("file:///android_asset/index.html")

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
}
```

---

## 📄 DOSYA 4: `app/src/main/res/layout/activity_main.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#080A16">

    <WebView
        android:id="@+id/veiraWebView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:overScrollMode="never" />

</FrameLayout>
```

---

## 📄 DOSYA 5: `app/src/main/res/values/colors.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="spaceDeepNavy">#080A16</color>
    <color name="celestialGold">#F5D061</color>
</resources>
```

---

## 📄 DOSYA 6: `app/src/main/res/values/themes.xml`
```xml
<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Theme.Veira" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <item name="android:statusBarColor">#080A16</item>
        <item name="android:navigationBarColor">#080A16</item>
        <item name="android:windowBackground">#080A16</item>
    </style>
</resources>
```

---

## 🚀 3 ADIMDA APK ALMA:
1. Android Studio'yu açıp bu klasörü açın.
2. İndirdiğiniz `code.html` dosyasını `app/src/main/assets/index.html` olarak yapıştırın.
3. Üst menüden **Build > Build Bundle(s) / APK(s) > Build APK(s)** tıklayın. 1-2 dakika içinde telefonunuza kurabileceğiniz APK hazır!
