import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const fetchAccessory = async (id: string) => {
  const { data, error } = await supabase
    .from('accessories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const AccessoryPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: accessory, isLoading, isError } = useQuery({
    queryKey: ['accessory', id],
    queryFn: () => fetchAccessory(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-12 md:py-20">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              <div>
                <Skeleton className="rounded-lg w-full aspect-square" />
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-12 w-40" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !accessory) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-4">Acessório não encontrado</h1>
        <p className="text-muted-foreground mb-8">Não conseguimos encontrar o acessório que você está procurando.</p>
        <Button asChild>
          <Link to="/">Voltar para a página inicial</Link>
        </Button>
      </div>
    );
  }

  const hasAffiliateLinks = accessory.affiliate_link_amazon || accessory.affiliate_link_ml;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <img
                src={accessory.image || 'https://placehold.co/600x600'}
                alt={accessory.title}
                className="rounded-lg object-cover w-full aspect-square"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">{accessory.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1 text-2xl font-bold">
                  <Star className="w-7 h-7 fill-yellow-400 text-yellow-400" />
                  <span>{accessory.rating}</span>
                  <span className="text-lg text-muted-foreground">/ 10</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {accessory.tags?.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
              <p className="text-lg text-muted-foreground mb-6">{accessory.summary}</p>
              {hasAffiliateLinks && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="lg" className="w-full md:w-fit" style={{ backgroundColor: '#0057D9' }}>
                      Ver Ofertas e Comprar
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {accessory.affiliate_link_amazon && (
                      <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
                        <a 
                          href={accessory.affiliate_link_amazon} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="cursor-pointer w-full px-2 py-1.5 text-sm font-semibold rounded-sm transition-colors bg-amazon text-amazon-foreground hover:bg-amazon/90 focus:bg-amazon/90 focus:outline-none"
                        >
                          Comprar na Amazon
                        </a>
                      </DropdownMenuItem>
                    )}
                    {accessory.affiliate_link_ml && (
                      <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
                        <a 
                          href={accessory.affiliate_link_ml} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="cursor-pointer w-full px-2 py-1.5 text-sm font-semibold rounded-sm transition-colors bg-mercadolivre text-mercadolivre-foreground hover:bg-yellow-300 focus:bg-yellow-300 focus:outline-none"
                        >
                          Comprar no Mercado Livre
                        </a>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-6 text-center">Análise Completa</h2>
            <Card>
              <CardContent className="p-6 grid gap-8">
                {accessory.pros && accessory.pros.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                      <ThumbsUp className="w-6 h-6 text-green-500" />
                      Pontos Positivos
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      {accessory.pros.map((pro, index) => (
                        <li key={index}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {accessory.cons && accessory.cons.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                      <ThumbsDown className="w-6 h-6 text-red-500" />
                      Pontos Negativos
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      {accessory.cons.map((con, index) => (
                        <li key={index}>{con}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {accessory.conclusion && (
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">Conclusão</h3>
                    <p className="text-muted-foreground leading-relaxed">{accessory.conclusion}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AccessoryPage;