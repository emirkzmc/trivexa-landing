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
