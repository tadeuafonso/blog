import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "./ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const fetchOffers = async () => {
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const OffersSection = () => {
  const { data: offers, isLoading } = useQuery({
    queryKey: ['homepage_offers'],
    queryFn: fetchOffers,
  });

  return (
    <section className="py-12 md:py-20">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tighter text-center mb-8">Ofertas que Valem a Pena</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <Skeleton className="rounded-t-lg aspect-square" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-8 w-1/2" />
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))
          ) : (
            offers?.map((offer) => {
              const hasAffiliateLinks = offer.affiliate_link_amazon || offer.affiliate_link_ml;
              return (
                <Card key={offer.id} className="relative flex flex-col">
                  {offer.tag && <Badge variant="destructive" className="absolute top-4 right-4">{offer.tag}</Badge>}
                  <CardHeader className="p-0">
                    <img src={offer.image || 'https://placehold.co/400x300'} alt={offer.name} className="rounded-t-lg w-full aspect-square object-contain bg-white dark:bg-muted" />
                  </CardHeader>
                  <CardContent className="p-4 flex-1">
                    <CardTitle className="mb-2 text-lg">{offer.name}</CardTitle>
                    <p className="text-2xl font-bold">{offer.price.replace(/\s/g, '')}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    {hasAffiliateLinks ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className="w-full" style={{ backgroundColor: '#0057D9' }}>Comprar Agora</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {offer.affiliate_link_amazon && (
                            <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
                              <a href={offer.affiliate_link_amazon} target="_blank" rel="noopener noreferrer sponsored" className="cursor-pointer w-full px-2 py-1.5 text-sm font-semibold rounded-sm transition-colors bg-amazon text-amazon-foreground hover:bg-amazon/90 focus:bg-amazon/90 focus:outline-none">
                                Comprar na Amazon
                              </a>
                            </DropdownMenuItem>
                          )}
                          {offer.affiliate_link_ml && (
                            <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
                              <a href={offer.affiliate_link_ml} target="_blank" rel="noopener noreferrer sponsored" className="cursor-pointer w-full px-2 py-1.5 text-sm font-semibold rounded-sm transition-colors bg-mercadolivre text-mercadolivre-foreground hover:bg-yellow-300 focus:bg-yellow-300 focus:outline-none">
                                Comprar no Mercado Livre
                              </a>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Button variant="outline" className="w-full" disabled>Indisponível</Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};