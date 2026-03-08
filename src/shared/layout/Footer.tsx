export default function Footer() {
  return (
    <footer className="snap-start border-t border-[#e5e7eb] bg-white px-6 py-6 md:px-20">
      <div className="mx-auto flex max-w-5xl items-center justify-between text-sm text-[#6b7280]">
        <p>© {new Date().getFullYear()} TRIVEXA</p>
        <p>Tüm haklar saklıdır.</p>
      </div>
    </footer>
  );
}
