import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Star } from "lucide-react";

const reviews = [
  { name: "iPhone 15 Pro", rating: 9.8, image: "/placeholder.svg" },
  { name: "Galaxy Z Fold 5", rating: 9.5, image: "/placeholder.svg" },
  { name: "Pixel 8 Pro", rating: 9.2, image: "/placeholder.svg" },
  { name: "Xiaomi 14", rating: 9.0, image: "/placeholder.svg" },
];

export const HighlightsSection = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tighter text-center mb-8">Reviews em Destaque</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review) => (
            <Card key={review.name}>
              <CardHeader>
                <img src={review.image} alt={review.name} className="rounded-t-lg aspect-video object-cover" />
              </CardHeader>
              <CardContent>
                <CardTitle className="mb-2">{review.name}</CardTitle>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{review.rating}</span>
                  <span className="text-sm text-muted-foreground">/ 10</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" style={{ backgroundColor: '#0057D9' }}>Ver Review</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};