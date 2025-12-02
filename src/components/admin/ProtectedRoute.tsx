import { Navigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { session, loading } = useSession();

  if (loading) {
    return <div>Carregando...</div>; // Ou um componente de spinner
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;