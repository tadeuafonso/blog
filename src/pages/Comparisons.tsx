import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const ComparisonsPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container text-center">
          <h1 className="text-4xl font-bold tracking-tighter mb-4">Comparativos</h1>
          <p className="text-lg text-muted-foreground">
            Em breve! Estamos trabalhando para trazer os melhores comparativos para você.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ComparisonsPage;