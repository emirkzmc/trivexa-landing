export default function Footer() {
  return (
    <footer className="snap-start border-t border-[#e5e7eb] bg-white px-6 py-6 md:px-20">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-[#6b7280] md:flex-row md:gap-0">
        <p>© {new Date().getFullYear()} TRIVEXA. Tüm hakları saklıdır.</p>
        <div className="flex gap-6">
          <a href="/gizlilik-politikasi" className="hover:text-gray-900 transition-colors">Gizlilik Politikası</a>
          <a href="/kullanici-politikasi" className="hover:text-gray-900 transition-colors">Kullanıcı Politikası</a>
        </div>
      </div>
    </footer>
  );
}
