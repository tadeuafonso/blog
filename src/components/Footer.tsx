import { Check, Twitter, Instagram, Facebook } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-muted/40 py-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <a href="/" className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold" style={{ color: '#1E1E1E' }}>Qual</span>
              <Check className="h-6 w-6" style={{ color: '#0057D9' }} />
            </a>
            <p className="text-sm text-muted-foreground">Compare. Escolha. Acerte.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Links Úteis</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary">Política de Privacidade</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Termos de Uso</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Sobre Nós</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Contato</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Redes Sociais</h3>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary"><Twitter /></a>
              <a href="#" className="text-muted-foreground hover:text-primary"><Instagram /></a>
              <a href="#" className="text-muted-foreground hover:text-primary"><Facebook /></a>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© 2024 Qual. Todos os direitos reservados.</p>
          <p className="mt-2">Este site participa de programas de afiliados. Ao comprar através de nossos links, podemos receber uma comissão sem custo adicional para você.</p>
        </div>
      </div>
    </footer>
  );
};