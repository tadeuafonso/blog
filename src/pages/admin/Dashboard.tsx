import AdminLayout from "../../components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Headphones, Layers, MousePointerClick } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const fetchDashboardStats = async () => {
  const { count: reviewsCount, error: reviewsError } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Publicado');

  const { count: accessoriesCount, error: accessoriesError } = await supabase
    .from('accessories')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Publicado');

  const { count: categoriesCount, error: categoriesError } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true });

  if (reviewsError || accessoriesError || categoriesError) {
    console.error(reviewsError || accessoriesError || categoriesError);
    throw new Error("Não foi possível carregar as estatísticas.");
  }

  return {
    reviewsCount,
    accessoriesCount,
    categoriesCount,
  };
};

const Admin = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard_stats'],
    queryFn: fetchDashboardStats,
  });

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Painel</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Reviews Publicados
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-1/2" />
              ) : (
                <div className="text-2xl font-bold">{stats?.reviewsCount ?? 0}</div>
              )}
              <p className="text-xs text-muted-foreground">
                Total de reviews no site
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Acessórios Publicados
              </CardTitle>
              <Headphones className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-1/2" />
              ) : (
                <div className="text-2xl font-bold">{stats?.accessoriesCount ?? 0}</div>
              )}
              <p className="text-xs text-muted-foreground">
                Total de acessórios no site
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categorias</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-1/2" />
              ) : (
                <div className="text-2xl font-bold">{stats?.categoriesCount ?? 0}</div>
              )}
              <p className="text-xs text-muted-foreground">
                Total de categorias criadas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Cliques (Mês)
              </CardTitle>
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">734</div>
              <p className="text-xs text-muted-foreground">
                Cliques em links de afiliados
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Admin;