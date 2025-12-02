import { Menu, Search, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { ThemeToggle } from "./ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";

const NavLinks = () => (
  <>
    <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Smartphones</a>
    <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Ofertas</a>
    <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Comparativos</a>
    <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Acessórios</a>
    <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Sobre</a>
  </>
);

export const Header = () => {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-2">
            <Check className="h-6 w-6 text-primary" strokeWidth={3} />
            <span className="text-xl font-bold text-foreground">Qual</span>
          </a>
          {!isMobile && (
            <nav className="hidden md:flex items-center gap-6">
              <NavLinks />
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar produtos..." className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]" />
          </div>
          <ThemeToggle />
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="grid gap-6 text-lg font-medium mt-8">
                  <NavLinks />
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};