import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const fetchCategoryDetails = async (slug: string) => {
  const { data, error } = await supabase
    .from('categories')
    .select('title')
    .eq('slug', slug)
    .single();
  if (error) throw new Error("Categoria não encontrada");
  return data;
};

const fetchPostsByCategory = async (slug: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'Publicado')
    .contains('tags', [slug]);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: category, isLoading: isLoadingCategory } = useQuery({
    queryKey: ['category_details', slug],
    queryFn: () => fetchCategoryDetails(slug!),
    enabled: !!slug,
  });

  const { data: posts, isLoading: isLoadingPosts, isError } = useQuery({
    queryKey: ['posts_by_category', slug],
    queryFn: () => fetchPostsByCategory(slug!),
    enabled: !!slug,
  });

  const categoryTitle = category?.title || "Carregando Categoria...";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container">
          {isLoadingCategory ? (
            <div className="text-center mb-12">
              <Skeleton className="h-10 w-1/2 mx-auto mb-2" />
              <Skeleton className="h-6 w-3/4 mx-auto" />
            </div>
          ) : (
            <>
              <h1 className="text-4xl font-bold tracking-tighter text-center mb-2">{categoryTitle}</h1>
              <p className="text-lg text-muted-foreground text-center mb-12">
                Confira nossa seleção de reviews para esta categoria.
              </p>
            </>
          )}
          
          {isLoadingPosts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
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
          ) : isError || !posts ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Ocorreu um erro ao buscar os posts.</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Nenhum review encontrado para esta categoria ainda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {posts.map((post) => (
                <Card key={post.id} className="flex flex-col h-full">
                  <CardHeader className="p-0">
                    <img src={post.image || 'https://placehold.co/400x300'} alt={post.title} className="rounded-t-lg aspect-video object-cover" />
                  </CardHeader>
                  <CardContent className="p-4 flex-1">
                    <CardTitle className="mb-2 text-lg">{post.title}</CardTitle>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{post.rating}</span>
                      <span className="text-sm text-muted-foreground">/ 10</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button asChild className="w-full" style={{ backgroundColor: '#0057D9' }}>
                      <Link to={`/review/${post.id}`}>Ver Review</Link>
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
  );
};

export default CategoryPage;