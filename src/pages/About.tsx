import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const AboutPage = () => {
  return (
    <>
      <SEO 
        title="Sobre o Qual"
        description="Saiba mais sobre a missão do Qual: simplificar a decisão de compra de eletrônicos com análises claras, diretas e honestas."
        url="/about"
      />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-12 md:py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold tracking-tighter mb-4">Sobre o Qual</h1>
              <p className="text-lg text-muted-foreground mb-6">
                O "Qual" nasceu da necessidade de simplificar a decisão de compra de eletrônicos. Em um mercado saturado de opções, nossa missão é oferecer análises claras, diretas e honestas para que você possa fazer a escolha certa, sem arrependimentos.
              </p>
              <p className="text-lg text-muted-foreground">
                Nossa equipe é apaixonada por tecnologia e testa exaustivamente cada produto para trazer a você reviews detalhados, comparativos e as melhores ofertas. Compare. Escolha. Acerte.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AboutPage;