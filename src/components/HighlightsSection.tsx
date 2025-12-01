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

const reviews = [
  { name: "iPhone 15 Pro", rating: 9.8, image: "/placeholder.svg" },
  { name: "Galaxy Z Fold 5", rating: 9.5, image: "/placeholder.svg" },
  { name: "Pixel 8 Pro", rating: 9.2, image: "/placeholder.svg" },
  { name: "Xiaomi 14", rating: 9.0, image: "/placeholder.svg" },
  { name: "OnePlus 12", rating: 8.9, image: "/placeholder.svg" },
  { name: "Asus ROG Phone 8", rating: 9.1, image: "/placeholder.svg" },
];

export const HighlightsSection = () => {
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
            {reviews.map((review, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="p-1 h-full">
                  <Card className="flex flex-col h-full">
                    <CardHeader className="p-0">
                      <img src={review.image} alt={review.name} className="rounded-t-lg aspect-video object-cover" />
                    </CardHeader>
                    <CardContent className="p-4 flex-1">
                      <CardTitle className="mb-2">{review.name}</CardTitle>
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold">{review.rating}</span>
                        <span className="text-sm text-muted-foreground">/ 10</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button className="w-full" style={{ backgroundColor: '#0057D9' }}>Ver Review</Button>
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
};