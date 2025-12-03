import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { SEO } from "@/components/SEO";

const fetchAccessories = async () => {
  const { data, error } = await supabase
    .from('accessories')
    .select('*')
    .eq('status', 'Publicado')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const AccessoriesPage = () => {
  const { data: accessories, isLoading, isError } = useQuery({
    queryKey: ['all_accessories'],
    queryFn: fetchAccessories,
  });

  return (
    <>
      <SEO 
        title="Reviews de Acessórios"
        description="Confira nossa seleção de reviews para os melhores acessórios do mercado. Encontre fones de ouvido, carregadores, capas e muito mais."
        url="/accessories"
      />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-12 md:py-20">
          <div className="container">
            <h1 className="text-4xl font-bold tracking-tighter text-center mb-2">Acessórios</h1>
            <p className="text-lg text-muted-foreground text-center mb-12">
              Confira nossa seleção de reviews para acessórios.
            </p>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Card key={index}>
                    <Skeleton className="rounded-t-lg aspect-video" />
                    <CardContent className="p-4 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-5 w-1/2" />
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : isError || !accessories ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">Ocorreu um erro ao buscar os acessórios.</p>
              </div>
            ) : accessories.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">Nenhum acessório encontrado ainda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {accessories.map((accessory) => (
                  <Card key={accessory.id} className="flex flex-col h-full">
                    <CardHeader className="p-0">
                      <img src={accessory.image || 'https://placehold.co/400x300'} alt={accessory.title} className="rounded-t-lg aspect-video object-cover" />
                    </CardHeader>
                    <CardContent className="p-4 flex-1">
                      <CardTitle className="mb-2 text-lg">{accessory.title}</CardTitle>
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold">{accessory.rating}</span>
                        <span className="text-sm text-muted-foreground">/ 10</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button asChild className="w-full" style={{ backgroundColor: '#0057D9' }}>
                        <Link to={`/accessory/${accessory.id}`}>Ver Análise</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AccessoriesPage;