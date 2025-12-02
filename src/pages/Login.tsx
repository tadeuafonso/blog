import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';

const Login = () => {
  const { session } = useSession();

  if (session) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Login do Administrador</h2>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          theme="light"
          localization={{
            variables: {
              sign_in: {
                email_label: 'Endereço de e-mail',
                password_label: 'Sua senha',
                email_input_placeholder: 'Seu endereço de e-mail',
                password_input_placeholder: 'Sua senha',
                button_label: 'Entrar',
                loading_button_label: 'Entrando...',
                social_provider_text: 'Entrar com {{provider}}',
                link_text: 'Já tem uma conta? Entre',
              },
              sign_up: {
                email_label: 'Endereço de e-mail',
                password_label: 'Crie uma senha',
                button_label: 'Cadastrar',
                loading_button_label: 'Cadastrando...',
                link_text: 'Não tem uma conta? Cadastre-se',
              },
              forgotten_password: {
                email_label: 'Endereço de e-mail',
                password_label: 'Sua senha',
                button_label: 'Enviar instruções de recuperação',
                loading_button_label: 'Enviando...',
                link_text: 'Esqueceu sua senha?',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Login;