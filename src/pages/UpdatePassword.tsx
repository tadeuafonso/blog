import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Check } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      showError(error.message);
    } else {
      showSuccess('Senha atualizada com sucesso! Você será redirecionado para o login.');
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-background p-4">
       <div className="mb-8 text-center">
        <Link to="/" className="flex items-center justify-center gap-2">
          <Check className="h-8 w-8 text-primary" strokeWidth={3} />
          <span className="text-3xl font-bold text-foreground">Qual</span>
        </Link>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Redefinir Senha</CardTitle>
          <CardDescription>
            Digite sua nova senha abaixo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <div className="relative">
                <Input
                  id="new-password"
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
              {loading ? 'Atualizando...' : 'Atualizar Senha'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatePassword;