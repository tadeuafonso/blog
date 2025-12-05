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
import { Skeleton } from "./ui/skeleton";

export const HighlightsSection = ({ reviews, isLoading }) => {
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
                        <Skeleton className="rounded-t-lg aspect-square" />
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
                        <img src={review.image || 'https://placehold.co/800x800'} alt={review.title} className="rounded-t-lg aspect-square object-cover" />
                      </CardHeader>
                      <CardContent className="p-4 flex-1 flex flex-col justify-between">
                        <CardTitle className="mb-2 line-clamp-3">{review.title}</CardTitle>
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