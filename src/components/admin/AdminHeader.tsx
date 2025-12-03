import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CircleUser,
  Menu,
  Search,
  Home,
  FileText,
  Tag,
  Check,
  Layers,
  Megaphone,
  Headphones
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "../ThemeToggle";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const AdminHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Alternar menu de navegação</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-semibold mb-4"
            >
              <Check className="h-6 w-6 text-primary" strokeWidth={3} />
              <span className="">Qual</span>
            </Link>
            <Link
              to="/admin"
              className={cn(
                "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                pathname === "/admin" && "bg-muted text-foreground"
              )}
            >
              <Home className="h-5 w-5" />
              Painel
            </Link>
            <Link
              to="/admin/banners"
              className={cn(
                "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                pathname === "/admin/banners" && "bg-muted text-foreground"
              )}
            >
              <Megaphone className="h-5 w-5" />
              Banners
            </Link>
            <Link
              to="/admin/posts"
              className={cn(
                "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                pathname === "/admin/posts" && "bg-muted text-foreground"
              )}
            >
              <FileText className="h-5 w-5" />
              Reviews
            </Link>
            <Link
              to="/admin/accessories"
              className={cn(
                "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                pathname === "/admin/accessories" && "bg-muted text-foreground"
              )}
            >
              <Headphones className="h-5 w-5" />
              Acessórios
            </Link>
            <Link
              to="/admin/offers"
              className={cn(
                "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                pathname === "/admin/offers" && "bg-muted text-foreground"
              )}
            >
              <Tag className="h-5 w-5" />
              Ofertas
            </Link>
            <Link
              to="/admin/categories"
              className={cn(
                "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                pathname === "/admin/categories" && "bg-muted text-foreground"
              )}
            >
              <Layers className="h-5 w-5" />
              Categorias
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar produtos..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Alternar menu do usuário</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Configurações</DropdownMenuItem>
          <DropdownMenuItem>Suporte</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default AdminHeader;