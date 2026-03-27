# Trivexa Landing - Dosya Mimarisi

Aşağıda `trivexa-landing` projesinin kök dizini (root) ile birlikte `src/` ve `public/` içerisindeki tüm dosya/klasör ağaç mimarisi bulunmaktadır.

```text
trivexa-landing/
├── .git/
├── .gitignore
├── README.md
├── dist/
├── eslint.config.js
├── index.html
├── node_modules/
├── package-lock.json
├── package.json
├── public/
│   ├── Frame4.svg
│   ├── Img.png
│   ├── WebIcon.svg
│   ├── contact.png
│   ├── map.png
│   └── photo.png
├── src/
│   ├── app/
│   │   ├── App.css
│   │   └── App.tsx
│   ├── assets/
│   │   ├── WebIcon.svg
│   │   └── default-avatar.svg
│   ├── features/
│   │   ├── contact/
│   │   │   ├── api/
│   │   │   │   └── contact.api.ts
│   │   │   ├── components/
│   │   │   │   └── ContactSection.tsx
│   │   │   └── pages/
│   │   │       └── ContactPage.tsx
│   │   ├── customer-panel/
│   │   │   ├── components/
│   │   │   │   ├── CustomerContractsSection.tsx
│   │   │   │   ├── CustomerMeetingNotesSection.tsx
│   │   │   │   ├── CustomerPanelContent.tsx
│   │   │   │   ├── CustomerPanelHeader.tsx
│   │   │   │   ├── CustomerPanelSidebar.tsx
│   │   │   │   ├── CustomerRequestsSection.tsx
│   │   │   │   ├── DashboardStats.tsx
│   │   │   │   ├── PasswordResetModule.tsx
│   │   │   │   ├── PendingApprovalsSection.tsx
│   │   │   │   ├── TableCard.tsx
│   │   │   │   └── icons.tsx
│   │   │   ├── model/
│   │   │   │   ├── api.ts
│   │   │   │   ├── constants.ts
│   │   │   │   └── types.ts
│   │   │   └── pages/
│   │   │       ├── CustomerLoginPage.tsx
│   │   │       ├── CustomerPanelPage.tsx
│   │   │       └── PasswordResetPreviewPage.tsx
│   │   ├── home/
│   │   │   ├── components/
│   │   │   │   ├── AgencyIntroSection.tsx
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   └── HomeExtraSections.tsx
│   │   │   └── pages/
│   │   │       └── HomePage.tsx
│   │   └── team/
│   │       ├── api/
│   │       │   └── team.api.ts
│   │       ├── components/
│   │       │   └── TeamSection.tsx
│   │       └── pages/
│   │           └── TeamPage.tsx
│   ├── shared/
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   └── Navbar.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Label.tsx
│   │       ├── LoginBackground.tsx
│   │       └── ScrollVelocity.tsx
│   ├── index.css
│   └── main.tsx
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Klasörlerin İşlevleri ve Mimari Yaklaşım

**Trivexa Landing** projesi, modern React uygulamalarında sıkça tercih edilen **Feature-Sliced Design (FSD)** (Özellik Odaklı Tasarım) benzeri modüler bir mimari yaklaşımla kurgulanmıştır. Ortak bileşenlerin (`shared`) ve izole özelliklerin (`features`) ayrılmasıyla kodun okunabilirliği, bakımı ve ölçeklenebilirliği artırılmıştır.

### 📁 Kök Dizin (Root) Klasörleri ve Dosyaları
* **`public/`**: Webpack/Vite tarafından işlenmeyen, derleme sürecinden direkt geçip sunucunun kök dizinine yerleştirilen statik dosyalar (örn. resimler, favicons).
* **`dist/`**: Projenin build (derleme) alındıktan sonra oluşan canlıya/sunucuya (production) aktarılacak olan çıktı klasörü.
* **Proje Yapılandırma Dosyaları**:
  * `package.json` & `package-lock.json`: Proje bağımlılıkları (React, Tailwind v4, Vite vb.) ve proje komutları (dev, build, lint).
  * `vite.config.ts`: Vite geliştirme sunucusu ve derleme aracı ayarları.
  * `eslint.config.js`: Kod standartları ve stil kurallarını belirleyen ESLint ayarları.
  * `tsconfig.*.json` vb.: TypeScript'in kodu yorulmama (derleme) kurallarını içeren dosyaları.

---

### 📁 `src/` (Kaynak Kod) Klasörü

Projenin asıl geliştirme yapılan alanıdır. Sorumluluklarına göre alt klasörlere ayrılmıştır:

#### 1. `app/` (Uygulama Kabuğu)
Uygulamanın en üst düzey kabuğudur. 
* **`App.tsx` & `App.css`**: Sayfa yönlendirmelerinin (routing), genel çerçeve yapılarının (layout) ve global state sarmalayıcıların (providers) uygulandığı ana React bileşeni.

#### 2. `assets/` (Proje İçi Statik Dosyalar)
* Kod içerisinde `import` ederek kullandığınız statik materyaller bulunur (Ikonlar, logolar, arka planlar vb.). Buradaki dosyalar Vite tarafından optimize edilerek derlemeye dahil edilir.

#### 3. `features/` (İzole Özellikler/Modüller)
Projenin en kritik klasörüdür. Her sayfa/özellik, kendi API çağrılarını, kendi spesifik bileşenlerini ve kendi sayfa yapılarını içerir. Böylece bir özelliği taşımak veya silmek istediğinizde tek bir klasörle işlem yapabilirsiniz.
* **`home/`**: Ana sayfa (Landing Page). İçinde açılış bileşenleri (`HeroSection.tsx`) ve ana sayfa ekranı bulunur.
* **`contact/`**: İletişim ile ilgili sayfalar (`ContactPage.tsx`), form bileşenleri (`ContactSection`) ve API istekleri.
* **`team/`**: Ekip tanıtım sayfası, özel ekip bölümü bileşenleri (`TeamSection.tsx`) ve API bağlantıları.
* **`customer-panel/`**: En kapsamlı modüllerden biridir. Müşterilerin giriş ekranı (`CustomerLoginPage.tsx`), şifre sıfırlama, pano ekranları (`CustomerPanelPage.tsx`), sözleşmeler veya taleplerin gösterildiği tablolar ve bu panele özel veri tipleri (`model/types.ts`) burada bulunur.

#### 4. `shared/` (Ortak / Paylaşılanlar)
Uygulamanın farklı `feature` bölümlerinde (sayfalarında) ortak olarak kullanılabilen her türlü jenerik yapıyı içerir.
* **`layout/`**: Sayfaların genel iskeletinde paylaşılan ana yapı taşları (`Navbar.tsx` ve `Footer.tsx`).
* **`ui/`**: Projenin *Dumb Component* (iş mantığı olmayan tasarım ögeleri) havuzu. Örneğin; butonlar (`Button.tsx`), input alanları (`Input.tsx`), etiketler (`Label.tsx`). Kendi içlerinde state tutmayan, tasarım sistemini oluşturan parçalardır.

#### 5. Ana Giriş Dosyaları
* **`main.tsx`**: Tüm uygulamanın çalışmaya başladığı (bootstrapping), React'in HTML içerisine basıldığı (DOM Render) mutlak giriş dosyasıdır.
* **`index.css`**: Tailwind v4 direktiflerinin eklendiği ve çok nadir olan global CSS ayarlarının tutulduğu ana stil dosyasıdır.
