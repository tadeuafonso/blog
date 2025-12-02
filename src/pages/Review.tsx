import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { initialPostsData } from "../data/posts";

const ReviewPage = () => {
  const { id } = useParams();
  const review = initialPostsData.find(post => post.id === id);

  if (!review) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-4">Review não encontrado</h1>
        <p className="text-muted-foreground mb-8">Não conseguimos encontrar a review que você está procurando.</p>
        <Button asChild>
          <Link to="/">Voltar para a página inicial</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <img
                src={review.image}
                alt={review.title}
                className="rounded-lg object-cover w-full aspect-square"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">{review.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1 text-2xl font-bold">
                  <Star className="w-7 h-7 fill-yellow-400 text-yellow-400" />
                  <span>{review.rating}</span>
                  <span className="text-lg text-muted-foreground">/ 10</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {review.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
              <p className="text-lg text-muted-foreground mb-6">{review.summary}</p>
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
                    {review.pros.map((pro, index) => (
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
                    {review.cons.map((con, index) => (
                      <li key={index}>{con}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Conclusão</h3>
                  <p className="text-muted-foreground leading-relaxed">{review.conclusion}</p>
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