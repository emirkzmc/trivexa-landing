import AgencyIntroSection from "../components/AgencyIntroSection";
import HeroSection from "../components/HeroSection";
import HomeExtraSections from "../components/HomeExtraSections";

export default function HomePage() {
  const handleStartClick = () => {
    document.getElementById("agency-intro")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="scroll-smooth">
      <HeroSection onStartClick={handleStartClick} />
      <AgencyIntroSection />
      <HomeExtraSections />
    </main>
  );
}
