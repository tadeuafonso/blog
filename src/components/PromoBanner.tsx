import { Button } from "./ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "./ui/skeleton";
import { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

const fetchBanners = async () => {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const PromoBanner = () => {
  const { data: banners, isLoading } = useQuery({
    queryKey: ['promo_banners'],
    queryFn: fetchBanners,
  });

  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (isLoading) {
    return (
      <section className="w-full py-12 md:py-20 lg:py-24 bg-primary">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-12 w-40" />
            </div>
            <Skeleton className="mx-auto aspect-video overflow-hidden rounded-xl sm:w-full lg:order-last lg:aspect-square" />
          </div>
        </div>
      </section>
    );
  }

  if (!banners || banners.length === 0) {
    return null; // Não renderiza nada se não houver banners
  }

  return (
    <section className="w-full relative" style={{ backgroundColor: '#0057D9' }}>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[plugin.current]}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div className="py-12 md:py-20 lg:py-24">
                <div className="container px-4 md:px-6">
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
                    <img
                      alt={banner.title}
                      className="mx-auto aspect-video w-full max-w-lg rounded-xl object-cover lg:order-last lg:aspect-square"
                      height="400"
                      src={banner.image_url || "https://placehold.co/1200x1200"}
                      width="1200"
                    />
                    <div className="flex flex-col justify-center space-y-4 text-white text-center lg:text-left">
                      <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                          {banner.title}
                        </h1>
                        <p className="max-w-[600px] md:text-xl mx-auto lg:mx-0">
                          {banner.description}
                        </p>
                      </div>
                      <div className="flex justify-center lg:justify-start">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="secondary" className="w-fit">Ver Oferta</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {banner.affiliate_link_amazon && (
                              <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
                                <a 
                                  href={banner.affiliate_link_amazon} 
                                  target="_blank" 
                                  rel="noopener noreferrer sponsored" 
                                  className="cursor-pointer w-full px-2 py-1.5 text-sm font-semibold rounded-sm transition-colors bg-amazon text-amazon-foreground hover:bg-amazon/90 focus:bg-amazon/90 focus:outline-none"
                                >
                                  Comprar na Amazon
                                </a>
                              </DropdownMenuItem>
                            )}
                            {banner.affiliate_link_ml && (
                              <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
                                <a 
                                  href={banner.affiliate_link_ml} 
                                  target="_blank" 
                                  rel="noopener noreferrer sponsored" 
                                  className="cursor-pointer w-full px-2 py-1.5 text-sm font-semibold rounded-sm transition-colors bg-mercadolivre text-mercadolivre-foreground hover:bg-yellow-300 focus:bg-yellow-300 focus:outline-none"
                                >
                                  Comprar no Mercado Livre
                                </a>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {banners.length > 1 && (
          <>
            <CarouselPrevious className="hidden sm:flex left-4" />
            <CarouselNext className="hidden sm:flex right-4" />
          </>
        )}
      </Carousel>
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-4">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "text-white text-sm font-mono",
                current === index + 1 ? "opacity-100 font-bold" : "opacity-60",
                "transition-all"
              )}
              aria-label={`Ir para o slide ${index + 1}`}
            >
              {String(index + 1).padStart(2, '0')}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};