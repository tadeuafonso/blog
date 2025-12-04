import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navigate, Link } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';

const Login = () => {
  const { session } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      showError('E-mail ou senha inválidos.');
    }
    // A navegação é tratada pelo onAuthStateChange no SessionContext
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_name: username,
        },
      },
    });
    if (error) {
      showError(error.message || 'Ocorreu um erro ao tentar se cadastrar.');
    } else {
      showSuccess('Cadastro realizado! Verifique seu e-mail para confirmar a conta.');
    }
    setLoading(false);
  };

  if (session) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-background p-4">
      <div className="mb-8 text-center">
        <Link to="/" className="flex items-center justify-center gap-2">
          <img src="/logo.png" alt="Qual Logo" className="h-8 w-8" />
          <span className="text-3xl font-bold text-foreground">Qual</span>
        </Link>
      </div>
      <Tabs defaultValue="login" className="w-full max-w-sm">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Entrar</TabsTrigger>
          <TabsTrigger value="signup">Cadastrar</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Acessar Painel</CardTitle>
              <CardDescription>
                Entre com suas credenciais para acessar o painel.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">E-mail</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">Senha</Label>
                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading} style={{ backgroundColor: '#0057D9' }}>
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Criar Conta</CardTitle>
              <CardDescription>
                Crie uma nova conta para poder comentar nas reviews.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-username">Nome de Usuário</Label>
                  <Input
                    id="signup-username"
                    type="text"
                    placeholder="seu_usuario"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">E-mail</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                   <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading} style={{ backgroundColor: '#0057D9' }}>
                  {loading ? 'Cadastrando...' : 'Cadastrar'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;