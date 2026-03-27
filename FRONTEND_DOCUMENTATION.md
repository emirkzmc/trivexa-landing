# Trivexa Landing - Frontend Documentation

## 1. Project Overview
- **Proje Adı:** Trivexa Landing
- **Amaç:** Kurumsal Tanıtım Sitesi ve Müşteri Portalı (Customer Portal)
- **Kullanılan Framework:** React (v19)
- **Kullanılan Dil:** TypeScript
- **Build Tool:** Vite
- **Styling Sistemi:** Tailwind CSS (v4)
- **State Management:** Yerel Component State (`useState`), Custom Hook'lar (Örn: `useAppRouter`, LocalStorage Session). Dış bir kütüphane (Zustand/Redux) kullanılmamıştır.
- **Routing:** Vanilla tarayıcı History API üzerine kurulu özel `useAppRouter` hook'u.

## 2. Tech Stack
- **Core:** React, TypeScript, Vite
- **Styling & UI:** Tailwind CSS, Lucide React (İkonlar)
- **Icons:** lucide-react

## 3. Project Structure
Projenin kök dizini altında bulunan `src` klasörü Feature-Sliced Design (FSD) prensiplerine uygun olarak organize edilmiştir:

```
src/
├── app/          # Uygulama genelindeki router (`useAppRouter`), layout vb. çekirdek yapılandırmalar
├── features/     # Her bir iş modülünün (domain) kendi bileşenleri ve api tanımları (contact, customer-panel, home, team)
└── shared/       # Tüm projede ortak kullanılan UI bileşenleri (Button, Input vb.), layout (Navbar, Footer) ve utility fonksiyonları
```

## 4. Architecture
Projede **Feature-Sliced Design (FSD)** benzeri modüler bir mimari kullanılmıştır. Mantıksal her bir yapı veya sayfa kendi `features` klasörü altında barındırılır.

## 5. Routing Structure
Performans ve sadelik odaklı olarak projenin kendi history-api bazlı `useAppRouter.ts` custom hook'u geliştirilmiştir. Sayfa değişimleri `App.tsx` üzerinden render edilen component'ler aracılığıyla gerçekleştirilir (Örn: `currentPath === '/iletisim'`). Çok kompleks bir nested routing yerine doğrudan component render stratejisi uygulanmıştır.

## 6. State Management
Harici bir global state kütüphanesi (Zustand vs.) yoktur. Oturum bilgileri LocalStorage tabanlı oturum servisleri (`portalSession.ts`) ile yönetilmekte; arayüz durumsallığı bileşen özellikleri (props) ve bağlam (context/state) ile taşınmaktadır.

## 7. API Layer
Form gönderimleri (İletişim) ve Müşteri Paneli istekleri genellikle fetch veya page-specific api servis dosyaları üzerinden yürütülmektedir. İleri seviye bir global caching hook'u (React Query gibi) bu projede tercih edilmemiş, veri akışı daha lokal tutulmuştur.

## 8. Component Structure
- **Shared Components:** `src/shared/layout` ve `src/shared/ui` içerisinde genel UI elemanları (Navbar, Button, FormField) bulunur.
- **Feature Components:** `src/features/[feature]/components` altında domaine özel iş mantığı olan kapsayıcı parçalar yer alır (Örn: CustomerPanelSidebar, ContactSection).

## 9. Styling System
Projede styling için **Tailwind CSS v4** kullanılmaktadır. Tamamen utility-first (yardımcı sınıflar) yaklaşımı benimsenmiştir.

## 10. Environment Variables
Projede dış servis bağlantıları veya CMS kullanımları için standart Vite pratiklerine uygun `.env` yapılandırması kullanılmaktadır.

## 11. How to Run Project
Kullanılan paket yöneticisi `npm`'dir.
- Geliştirme modu: `npm run dev`
- Production Build: `npm run build`
- Linter: `npm run lint`
