import { Header } from "@/components/Header";
import { PromoBanner } from "@/components/PromoBanner";
import { HighlightsSection } from "@/components/HighlightsSection";
import { CategorySection } from "@/components/CategorySection";
import { OffersSection } from "@/components/OffersSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <PromoBanner />
        <HighlightsSection />
        <CategorySection />
        <OffersSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;