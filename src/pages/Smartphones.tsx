import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { SEO } from "@/components/SEO";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Star } from "lucide-react";

const fetchSmartphones = async () => {
  const { data, error } = await supabase
    .from('smartphones')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const SmartphonesPage = () => {
  const { data: smartphones, isLoading, isError } = useQuery({
    queryKey: ['smartphones'],
    queryFn: fetchSmartphones,
  });

  return (
    <>
      <SEO 
        title="Smartphones"
        description="Confira nossa seleção de smartphones com as melhores ofertas. Encontre o modelo ideal para você."
        url="/smartphones"
      />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-12 md:py-20">
          <div className="container">
            <h1 className="text-4xl font-bold tracking-tighter text-center mb-2">Smartphones</h1>
            <p className="text-lg text-muted-foreground text-center mb-12">
              Confira nossa seleção de smartphones com as melhores ofertas.
            </p>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Card key={index}>
                    <Skeleton className="rounded-t-lg aspect-square" />
                    <CardContent className="p-4 space-y-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-5 w-1/2" />
                      <Skeleton className="h-8 w-1/2" />
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex flex-col gap-2">
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : isError || !smartphones ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">Ocorreu um erro ao buscar os smartphones.</p>
              </div>
            ) : smartphones.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">Nenhum smartphone cadastrado ainda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {smartphones.map((phone) => {
                  const hasAffiliateLinks = phone.affiliate_link_amazon || phone.affiliate_link_ml;
                  return (
                    <Card key={phone.id} className="flex flex-col h-full">
                      <img src={phone.image_url || 'https://placehold.co/400x400'} alt={phone.name} className="rounded-t-lg aspect-square object-contain bg-white dark:bg-muted p-4" />
                      <CardContent className="p-4 flex-1">
                        <p className="text-sm text-muted-foreground mb-2">{phone.name}</p>
                        {phone.rating_text && (
                          <div className="flex items-center gap-1 text-sm mb-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{phone.rating_text}</span>
                          </div>
                        )}
                        <p className="text-2xl font-bold">{phone.price}</p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex flex-col items-stretch gap-2">
                        {hasAffiliateLinks ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button className="w-full" style={{ backgroundColor: '#0057D9' }}>Comprar Agora</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                              {phone.affiliate_link_amazon && (
                                <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
                                  <a href={phone.affiliate_link_amazon} target="_blank" rel="noopener noreferrer sponsored" className="cursor-pointer w-full px-2 py-1.5 text-sm font-semibold rounded-sm transition-colors bg-amazon text-amazon-foreground hover:bg-amazon/90 focus:bg-amazon/90 focus:outline-none">
                                    Comprar na Amazon
                                  </a>
                                </DropdownMenuItem>
                              )}
                              {phone.affiliate_link_ml && (
                                <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
                                  <a href={phone.affiliate_link_ml} target="_blank" rel="noopener noreferrer sponsored" className="cursor-pointer w-full px-2 py-1.5 text-sm font-semibold rounded-sm transition-colors bg-mercadolivre text-mercadolivre-foreground hover:bg-yellow-300 focus:bg-yellow-300 focus:outline-none">
                                    Comprar no Mercado Livre
                                  </a>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <Button className="w-full" disabled>Indisponível</Button>
                        )}
                        {phone.linked_review_id && (
                          <Button asChild variant="outline" className="w-full">
                            <Link to={`/review/${phone.linked_review_id}`}>Ver Review</Link>
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default SmartphonesPage;