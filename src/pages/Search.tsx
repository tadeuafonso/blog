import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { SEO } from "@/components/SEO";
import { Badge } from "@/components/ui/badge";

const searchContent = async (query: string) => {
  if (!query) return [];

  const searchPattern = `%${query}%`;

  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'Publicado')
    .or(`title.ilike.${searchPattern},summary.ilike.${searchPattern}`);

  const { data: accessories, error: accessoriesError } = await supabase
    .from('accessories')
    .select('*')
    .eq('status', 'Publicado')
    .or(`title.ilike.${searchPattern},summary.ilike.${searchPattern}`);

  if (postsError) throw new Error(postsError.message);
  if (accessoriesError) throw new Error(accessoriesError.message);

  const combinedResults = [
    ...(posts || []).map(item => ({ ...item, type: 'review' })),
    ...(accessories || []).map(item => ({ ...item, type: 'accessory' })),
  ];

  combinedResults.sort((a, b) => {
    const aTitleMatch = a.title.toLowerCase().includes(query.toLowerCase());
    const bTitleMatch = b.title.toLowerCase().includes(query.toLowerCase());
    if (aTitleMatch && !bTitleMatch) return -1;
    if (!aTitleMatch && bTitleMatch) return 1;
    return 0;
  });

  return combinedResults;
};

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data: results, isLoading, isError } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchContent(query),
    enabled: !!query,
  });

  return (
    <>
      <SEO 
        title={`Resultados da busca por "${query}"`}
        description={`Encontre os melhores reviews e acessórios sobre "${query}".`}
        url={`/search?q=${query}`}
      />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-12 md:py-20">
          <div className="container">
            {query ? (
              <>
                <h1 className="text-4xl font-bold tracking-tighter text-center mb-2">Resultados da Busca</h1>
                <p className="text-lg text-muted-foreground text-center mb-12">
                  Exibindo resultados para: <span className="font-semibold text-primary">"{query}"</span>
                </p>
              </>
            ) : (
              <h1 className="text-4xl font-bold tracking-tighter text-center mb-12">Digite algo para buscar</h1>
            )}
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Card key={index}>
                    <Skeleton className="rounded-t-lg aspect-square" />
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
            ) : isError ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">Ocorreu um erro ao realizar a busca.</p>
              </div>
            ) : results && results.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">Nenhum resultado encontrado para sua busca.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {results?.map((item) => (
                  <Card key={`${item.type}-${item.id}`} className="flex flex-col h-full">
                    <CardHeader className="p-0 relative">
                      <img src={item.image || 'https://placehold.co/800x800'} alt={item.title} className="rounded-t-lg aspect-square object-cover" />
                      <Badge className="absolute top-2 right-2" variant={item.type === 'review' ? 'default' : 'secondary'}>
                        {item.type === 'review' ? 'Review' : 'Acessório'}
                      </Badge>
                    </CardHeader>
                    <CardContent className="p-4 flex-1">
                      <CardTitle className="mb-2 text-lg">{item.title}</CardTitle>
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold">{item.rating}</span>
                        <span className="text-sm text-muted-foreground">/ 10</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button asChild className="w-full" style={{ backgroundColor: '#0057D9' }}>
                        <Link to={`/${item.type}/${item.id}`}>
                          {item.type === 'review' ? 'Ver Review' : 'Ver Análise'}
                        </Link>
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

export default SearchPage;