import { Menu, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { ThemeToggle } from "./ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const NavLinks = () => (
  <>
    <Link to="/smartphones" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Smartphones</Link>
    <Link to="/offers" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Ofertas</Link>
    <Link to="/comparisons" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Comparativos</Link>
    <Link to="/accessories" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Acessórios</Link>
    <Link to="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Sobre</Link>
  </>
);

const SearchBar = ({ className }: { className?: string }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={className}>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar produtos..."
          className="pl-8 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </form>
  );
};

export const Header = () => {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Qual Logo" className="h-6 w-6" />
            <span className="text-xl font-bold text-foreground">Qual</span>
          </Link>
          {!isMobile && (
            <nav className="hidden md:flex items-center gap-6">
              <NavLinks />
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          <SearchBar className="hidden md:block sm:w-[300px] md:w-[200px] lg:w-[300px]" />
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
                <div className="p-4">
                  <SearchBar />
                </div>
                <nav className="grid gap-6 text-lg font-medium mt-4 p-4">
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