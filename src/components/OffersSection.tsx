import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const offers = [
  { name: "Redmi Note 13", price: "R$ 1.299", image: "https://placehold.co/400x300/7d28d9/FFFFFF?text=Redmi+Note+13", tag: "Oferta Relâmpago" },
  { name: "Motorola Edge 40", price: "R$ 2.499", image: "https://placehold.co/400x300/1d4ed8/FFFFFF?text=Motorola+Edge" },
  { name: "Poco F5", price: "R$ 2.199", image: "https://placehold.co/400x300/f59e0b/FFFFFF?text=Poco+F5", tag: "Super Desconto" },
  { name: "Realme 11 Pro+", price: "R$ 2.899", image: "https://placehold.co/400x300/facc15/FFFFFF?text=Realme+11" },
];

export const OffersSection = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tighter text-center mb-8">Ofertas que Valem a Pena</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.map((offer) => (
            <Card key={offer.name} className="relative">
              {offer.tag && <Badge variant="destructive" className="absolute top-4 right-4">{offer.tag}</Badge>}
              <CardHeader>
                <img src={offer.image} alt={offer.name} className="rounded-t-lg aspect-video object-cover" />
              </CardHeader>
              <CardContent>
                <CardTitle className="mb-2 text-lg">{offer.name}</CardTitle>
                <p className="text-2xl font-bold">{offer.price}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Comprar Agora</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};