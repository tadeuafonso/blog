import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const fetchAllOffers = async () => {
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const OffersPage = () => {
  const { data: offers, isLoading } = useQuery({
    queryKey: ['all_offers'],
    queryFn: fetchAllOffers,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container">
          <h1 className="text-4xl font-bold tracking-tighter text-center mb-2">Todas as Ofertas</h1>
          <p className="text-lg text-muted-foreground text-center mb-12">
            Confira as melhores ofertas que encontramos para você.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <Card key={index}>
                  <Skeleton className="rounded-t-lg aspect-video" />
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
              offers?.map((offer) => (
                <Card key={offer.id} className="relative">
                  {offer.tag && <Badge variant="destructive" className="absolute top-4 right-4">{offer.tag}</Badge>}
                  <CardHeader className="p-0">
                    <img src={offer.image || 'https://placehold.co/400x300'} alt={offer.name} className="rounded-t-lg aspect-video object-cover" />
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="mb-2 text-lg">{offer.name}</CardTitle>
                    <p className="text-2xl font-bold">{offer.price}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button variant="outline" className="w-full">Comprar Agora</Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OffersPage;