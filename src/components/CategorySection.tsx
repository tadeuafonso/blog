import { Card, CardTitle } from "./ui/card";
import { Link } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";
import { iconMap } from "@/components/icons";

export const CategorySection = ({ categories, isLoading }) => {
  return (
    <section className="py-12 md:py-20 bg-muted/40">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tighter text-center mb-8">Qual Comprar?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="flex flex-col items-center justify-center text-center p-6 h-full">
                <Skeleton className="h-8 w-8 mb-4 rounded-md" />
                <Skeleton className="h-6 w-3/4" />
              </Card>
            ))
          ) : (
            categories?.map((category) => {
              const IconComponent = iconMap[category.icon];
              return (
                <Link to={`/category/${category.slug}`} key={category.id} className="block">
                  <Card className="flex flex-col items-center justify-center text-center p-6 hover:shadow-lg transition-shadow h-full">
                    <div className="mb-4 text-primary" style={{ color: '#0057D9' }}>
                      {IconComponent ? <IconComponent className="w-8 h-8" /> : null}
                    </div>
                    <CardTitle>{category.title}</CardTitle>
                  </Card>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};