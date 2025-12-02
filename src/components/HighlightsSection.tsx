import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "./ui/skeleton";

const fetchHighlights = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'Publicado')
    .order('rating', { ascending: false })
    .limit(6);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const HighlightsSection = () => {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['highlight_reviews'],
    queryFn: fetchHighlights,
  });

  return (
    <section className="py-12 md:py-20">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tighter text-center mb-8">Reviews em Destaque</h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="p-1 h-full">
                    <Card className="flex flex-col h-full">
                      <CardHeader className="p-0">
                        <Skeleton className="rounded-t-lg aspect-video" />
                      </CardHeader>
                      <CardContent className="p-4 flex-1 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-5 w-1/2" />
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Skeleton className="h-10 w-full" />
                      </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))
            ) : (
              reviews?.map((review, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="p-1 h-full">
                    <Card className="flex flex-col h-full">
                      <CardHeader className="p-0">
                        <img src={review.image || 'https://placehold.co/400x300'} alt={review.title} className="rounded-t-lg aspect-video object-cover" />
                      </CardHeader>
                      <CardContent className="p-4 flex-1">
                        <CardTitle className="mb-2">{review.title}</CardTitle>
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold">{review.rating}</span>
                          <span className="text-sm text-muted-foreground">/ 10</span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button asChild className="w-full" style={{ backgroundColor: '#0057D9' }}>
                          <Link to={`/review/${review.id}`}>Ver Review</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))
            )}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
};