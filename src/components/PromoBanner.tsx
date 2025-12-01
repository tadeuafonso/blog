import { Button } from "./ui/button";

export const PromoBanner = () => {
  return (
    <section className="w-full py-12 md:py-20 lg:py-24" style={{ backgroundColor: '#0057D9' }}>
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4 text-white">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Galaxy S24 Ultra com 30% OFF
              </h1>
              <p className="max-w-[600px] md:text-xl">
                Aproveite a oferta imperdível no smartphone mais poderoso do ano. Câmera, desempenho e bateria de outro nível.
              </p>
            </div>
            <Button variant="secondary" className="w-fit">Ver Oferta</Button>
          </div>
          <img
            alt="Smartphone em promoção"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
            height="400"
            src="/placeholder.svg"
            width="1200"
          />
        </div>
      </div>
    </section>
  );
};