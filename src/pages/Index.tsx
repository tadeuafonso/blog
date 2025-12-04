import { Header } from "@/components/Header";
import { PromoBanner } from "@/components/PromoBanner";
import { HighlightsSection } from "@/components/HighlightsSection";
import { CategorySection } from "@/components/CategorySection";
import { OffersSection } from "@/components/OffersSection";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  useEffect(() => {
    const trackVisit = async () => {
      // Chama a função no Supabase para incrementar o contador de visitas
      await supabase.rpc('increment_total_visits');
    };
    trackVisit();
  }, []);

  return (
    <>
      <SEO 
        title="Reviews, Ofertas e Comparativos de Eletrônicos"
        description="Encontre o produto certo para você. O Qual oferece reviews honestos, comparativos detalhados e as melhores ofertas de smartphones, acessórios e mais."
        url="/"
      />
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
    </>
  );
};

export default Index;