import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, ChevronsUpDown, Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Tipos
interface PostSummary {
  id: string;
  title: string;
}

interface PostDetails {
  id: string;
  title: string;
  rating: number;
  image: string;
  summary: string;
  pros: string[];
  cons: string[];
  affiliate_link_amazon: string;
  affiliate_link_ml: string;
}

// Funções de busca de dados
const fetchAllPosts = async (): Promise<PostSummary[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title')
    .eq('status', 'Publicado');
  if (error) throw new Error(error.message);
  return data;
};

const fetchPostDetails = async (id: string): Promise<PostDetails> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

// Componente reutilizável para selecionar produto
const ProductSelector = ({ posts, selectedProductId, onSelect, disabledProductId }: { posts: PostSummary[], selectedProductId: string | null, onSelect: (id: string) => void, disabledProductId?: string | null }) => {
  const [open, setOpen] = useState(false);
  const selectedProductTitle = posts.find(p => p.id === selectedProductId)?.title || "Selecione um produto...";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-12 text-left"
        >
          <span className="truncate">{selectedProductTitle}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Buscar produto..." />
          <CommandList>
            <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
            <CommandGroup>
              {posts.filter(p => p.id !== disabledProductId).map((post) => (
                <CommandItem
                  key={post.id}
                  value={post.title}
                  onSelect={() => {
                    onSelect(post.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedProductId === post.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {post.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

// Botão de Links de Afiliado
const AffiliateLinksButton = ({ product }: { product: PostDetails }) => {
  const hasLinks = product.affiliate_link_amazon || product.affiliate_link_ml;
  if (!hasLinks) return <Button disabled>Indisponível</Button>;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button style={{ backgroundColor: '#0057D9' }}>Ver Ofertas</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {product.affiliate_link_amazon && (
          <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
            <a href={product.affiliate_link_amazon} target="_blank" rel="noopener noreferrer" className="cursor-pointer w-full px-2 py-1.5 text-sm font-semibold rounded-sm transition-colors bg-amazon text-amazon-foreground hover:bg-amazon/90 focus:bg-amazon/90 focus:outline-none">
              Comprar na Amazon
            </a>
          </DropdownMenuItem>
        )}
        {product.affiliate_link_ml && (
          <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
            <a href={product.affiliate_link_ml} target="_blank" rel="noopener noreferrer" className="cursor-pointer w-full px-2 py-1.5 text-sm font-semibold rounded-sm transition-colors bg-mercadolivre text-mercadolivre-foreground hover:bg-yellow-300 focus:bg-yellow-300 focus:outline-none">
              Comprar no Mercado Livre
            </a>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Componente Principal da Página
const ComparisonsPage = () => {
  const [productOneId, setProductOneId] = useState<string | null>(null);
  const [productTwoId, setProductTwoId] = useState<string | null>(null);

  const { data: allPosts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ['all_posts_summary'],
    queryFn: fetchAllPosts,
  });

  const { data: productOne, isLoading: isLoadingOne } = useQuery({
    queryKey: ['post_details', productOneId],
    queryFn: () => fetchPostDetails(productOneId!),
    enabled: !!productOneId,
  });

  const { data: productTwo, isLoading: isLoadingTwo } = useQuery({
    queryKey: ['post_details', productTwoId],
    queryFn: () => fetchPostDetails(productTwoId!),
    enabled: !!productTwoId,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tighter mb-2">Compare Lado a Lado</h1>
            <p className="text-lg text-muted-foreground">
              Selecione dois produtos para ver uma análise comparativa detalhada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
            {isLoadingPosts ? (
              <>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </>
            ) : (
              <>
                <ProductSelector
                  posts={allPosts || []}
                  selectedProductId={productOneId}
                  onSelect={setProductOneId}
                  disabledProductId={productTwoId}
                />
                <ProductSelector
                  posts={allPosts || []}
                  selectedProductId={productTwoId}
                  onSelect={setProductTwoId}
                  disabledProductId={productOneId}
                />
              </>
            )}
          </div>

          {(productOneId || productTwoId) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-2xl">Quadro Comparativo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="p-4 text-left font-semibold text-lg w-1/4">Característica</th>
                        <th className="p-4 text-center font-semibold text-lg w-3/8">
                          {isLoadingOne ? <Skeleton className="h-7 w-3/4 mx-auto" /> : productOne?.title || 'Produto 1'}
                        </th>
                        <th className="p-4 text-center font-semibold text-lg w-3/8">
                          {isLoadingTwo ? <Skeleton className="h-7 w-3/4 mx-auto" /> : productTwo?.title || 'Produto 2'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-4 font-medium align-top">Imagem</td>
                        <td className="p-4 text-center">
                          {isLoadingOne ? <Skeleton className="aspect-square w-full max-w-xs mx-auto rounded-lg" /> : productOne && <img src={productOne.image || 'https://placehold.co/400'} alt={productOne.title} className="rounded-lg mx-auto" />}
                        </td>
                        <td className="p-4 text-center">
                          {isLoadingTwo ? <Skeleton className="aspect-square w-full max-w-xs mx-auto rounded-lg" /> : productTwo && <img src={productTwo.image || 'https://placehold.co/400'} alt={productTwo.title} className="rounded-lg mx-auto" />}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-4 font-medium align-top">Avaliação</td>
                        <td className="p-4 text-center text-xl font-bold">
                          {isLoadingOne ? <Skeleton className="h-7 w-20 mx-auto" /> : productOne && (
                            <div className="flex items-center justify-center gap-2">
                              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                              <span>{productOne.rating} / 10</span>
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-center text-xl font-bold">
                          {isLoadingTwo ? <Skeleton className="h-7 w-20 mx-auto" /> : productTwo && (
                            <div className="flex items-center justify-center gap-2">
                              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                              <span>{productTwo.rating} / 10</span>
                            </div>
                          )}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-4 font-medium align-top">
                          <div className="flex items-center gap-2">
                            <ThumbsUp className="w-5 h-5 text-green-500" /> Pontos Positivos
                          </div>
                        </td>
                        <td className="p-4 align-top">
                          {isLoadingOne ? <Skeleton className="h-24 w-full" /> : productOne && (
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                              {productOne.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                            </ul>
                          )}
                        </td>
                        <td className="p-4 align-top">
                          {isLoadingTwo ? <Skeleton className="h-24 w-full" /> : productTwo && (
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                              {productTwo.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                            </ul>
                          )}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-4 font-medium align-top">
                          <div className="flex items-center gap-2">
                            <ThumbsDown className="w-5 h-5 text-red-500" /> Pontos Negativos
                          </div>
                        </td>
                        <td className="p-4 align-top">
                          {isLoadingOne ? <Skeleton className="h-24 w-full" /> : productOne && (
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                              {productOne.cons.map((con, i) => <li key={i}>{con}</li>)}
                            </ul>
                          )}
                        </td>
                        <td className="p-4 align-top">
                          {isLoadingTwo ? <Skeleton className="h-24 w-full" /> : productTwo && (
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                              {productTwo.cons.map((con, i) => <li key={i}>{con}</li>)}
                            </ul>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Comprar</td>
                        <td className="p-4 text-center">
                          {isLoadingOne ? <Skeleton className="h-10 w-28 mx-auto" /> : productOne && <AffiliateLinksButton product={productOne} />}
                        </td>
                        <td className="p-4 text-center">
                          {isLoadingTwo ? <Skeleton className="h-10 w-28 mx-auto" /> : productTwo && <AffiliateLinksButton product={productTwo} />}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ComparisonsPage;