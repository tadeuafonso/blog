import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DollarSign, Camera, Gamepad2, BatteryCharging } from "lucide-react";

const categories = [
  { title: "Melhores até R$ 1.000", icon: <DollarSign className="w-8 h-8" /> },
  { title: "Melhores para fotos", icon: <Camera className="w-8 h-8" /> },
  { title: "Top desempenho Gamers", icon: <Gamepad2 className="w-8 h-8" /> },
  { title: "Bateria para o dia todo", icon: <BatteryCharging className="w-8 h-8" /> },
];

export const CategorySection = () => {
  return (
    <section className="py-12 md:py-20 bg-muted/40">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tighter text-center mb-8">Qual Comprar?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card key={category.title} className="flex flex-col items-center justify-center text-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="mb-4 text-primary" style={{ color: '#0057D9' }}>{category.icon}</div>
              <CardTitle>{category.title}</CardTitle>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};