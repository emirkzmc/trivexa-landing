# Trivexa Landing - Components Documentation

Bu doküman `trivexa-landing` projesinde yer alan paylaşılan (shared) ve özellik bazlı (feature) temel UI bileşenlerini listeler.

---

## 1. Shared / Core UI Components
Genel sayfalarda ve müşteri panelinde ortak kullanılan, sadeleştirilmiş bileşenlerdir. Bulunduğu dizin: `src/shared/ui/`

### `Button`
Temel buton bileşenidir.
- `variant` ('default' | 'login') *(opsiyonel)*: Butonun stil varyantı. Login ekranı için siyah bg'li login varyantı mevcuttur.
- `text` veya `children` (ReactNode): Buton içeriği.

### `Input`
Basitleştirilmiş metin giriş bileşenidir.
- `variant` ('default' | 'login') *(opsiyonel)*: Login varyantında gri çerçeveli daha belirgin bir zemin kullanılır.
- Normal HTML Input propertylerini alır.

### `FormField`
Label ve yardımcı elementleri saran dikey bir kapsayıcıdır.
- `label` (string): Giriş alanının başlığı.
- `htmlFor` (string) *(opsiyonel)*: Erişilebilirlik için içerideki input'un ID değeri.
- `children` (ReactNode): Genellikle `Input` veya `textarea` bileşenini içine alır.

### `SectionBlock`
Sayfalarda bölümleri yatay ve dikey paddingler vererek hizalayan genel layout bileşenidir.

---

## 2. Shared / Layout Components
Açılış sayfaları ve genel çerçeveyi oluşturan bileşenlerdir. Bulunduğu dizin: `src/shared/layout/`

### `Navbar`
Tüm genel sayfalarda (Ana sayfa, İletişim, Takım) görünen üst menüdür.
- `currentPath` (string): Aktif menüyü çizgi ile vurgular.
- `isScrolled` (boolean): Sayfa aşağı kaydırıldığında arka planı solid siyaha çevirir (backdrop-blur tabanlı).
- `onNavigate` (function): Navigasyon linki tıklandığında History API hook'unu tetikler.

### `Footer`
Sitenin alt bilgi alanıdır. İletişim, sosyal medya bağlantıları ve telif hakkı ibarelerini içerir.

---

## 3. Customer Panel (Feature) Components
Müşteri portalı (`/customer-panel/*`) yapısını kuran bileşenlerdir. Bulunduğu dizin: `src/features/customer-panel/components/`

### `CustomerPanelSidebar`
Müşteri paneli sol menü yönetimi.
- `currentPath` (string): İlgili sayfayı vurgular (ör: Sozlesmeler, Projeler).
- `isMobile`, `mobileOpen`, `collapsed`: Menünün dar, açık (hamburger) veya kapalı olmasını belirleyen responsive proplar.
- `unreadTickets` / `pendingInvoices`: İlgili menülerin sağ tarafında bildirim (badge) sayılarını görüntüler.

### `CustomerPanelHeader`
Müşteri paneli üst kısmı. Mobilde hamburger menü erişimi ve kullanıcı profil bilgilerini barındırır.
- `pageName` (string): Bulunulan sayfanın başlığı.
- `userName` / `userEmail` / `roleLabel`: Giriş yapmış müşterinin detayları.

### `CustomerPanelContent`
`CustomerPanelPage` içerisindeki merkezi yönlendirme (İçerik render) bileşenidir. 
- `currentPath` prop değerine göre ilgili alt bileşenleri (Projeler, Sözleşmeler, Destek Talepleri bileşenleri) ekrana çizer ve API'den gelen verileri yönetir.

### `CustomerRequestForm`
Müşterinin yeni destek/hata talebi oluşturduğu form bileşenidir. Öncelik, talep türü, proje ve açıklama bilgisini alır.

### `CustomerContractsSection` & `CustomerContractDetailSection`
Sözleşmelerin listelendiği ve detaylı PDF/İçerik önizlemesinin yapıldığı bölüm bileşenleridir.

---

*(Tüm bu bileşenler kendi alanlarına göre modülerleştirilmiş olup, başka projelerdeki (örn: web admin) kompleks UI library veya global statelerden bağımsız çalışacak şekilde tasarlanmıştır.)*
