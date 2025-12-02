import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { useParams } from "react-router-dom";

// Dados de exemplo - em uma aplicação real, você buscaria isso com base no ID
const mockReview = {
  id: "1",
  name: "iPhone 15 Pro",
  rating: 9.8,
  image: "/placeholder.svg",
  tags: ["Premium", "iOS", "Fotografia"],
  summary: "O iPhone 15 Pro eleva a experiência a um novo patamar com seu design em titânio, o poderoso chip A17 Pro e um sistema de câmera que redefine a fotografia mobile. É a escolha definitiva para quem busca o máximo em performance e qualidade de imagem.",
  pros: [
    "Construção em titânio, mais leve e resistente.",
    "Desempenho excepcional com o chip A17 Pro.",
    "Câmeras versáteis com qualidade profissional.",
    "Tela ProMotion com 120Hz.",
    "Porta USB-C com velocidades de transferência maiores."
  ],
  cons: [
    "Preço elevado.",
    "Autonomia de bateria poderia ser melhor.",
    "Poucas mudanças de design em relação à geração anterior."
  ],
  conclusion: "O iPhone 15 Pro é, sem dúvida, um dos melhores smartphones do mercado. Se você busca o ápice da tecnologia móvel e o preço não é um impeditivo, a compra é mais do que recomendada. A performance e as câmeras justificam o investimento para profissionais e entusiastas."
};


const ReviewPage = () => {
  const { id } = useParams(); // Podemos usar este ID para buscar os dados futuramente

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <img
                src={mockReview.image}
                alt={mockReview.name}
                className="rounded-lg object-cover w-full aspect-square"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">{mockReview.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1 text-2xl font-bold">
                  <Star className="w-7 h-7 fill-yellow-400 text-yellow-400" />
                  <span>{mockReview.rating}</span>
                  <span className="text-lg text-muted-foreground">/ 10</span>
                </div>
                <div className="flex gap-2">
                  {mockReview.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
              <p className="text-lg text-muted-foreground mb-6">{mockReview.summary}</p>
              <Button size="lg" className="w-full md:w-fit" style={{ backgroundColor: '#0057D9' }}>
                Ver Ofertas e Comprar
              </Button>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-6 text-center">Análise Completa</h2>
            <Card>
              <CardContent className="p-6 grid gap-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <ThumbsUp className="w-6 h-6 text-green-500" />
                    Pontos Positivos
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {mockReview.pros.map((pro, index) => (
                      <li key={index}>{pro}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <ThumbsDown className="w-6 h-6 text-red-500" />
                    Pontos Negativos
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {mockReview.cons.map((con, index) => (
                      <li key={index}>{con}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Conclusão</h3>
                  <p className="text-muted-foreground leading-relaxed">{mockReview.conclusion}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReviewPage;