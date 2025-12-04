import AdminLayout from "../../components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Headphones, Layers, MousePointerClick, BarChart, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ResetConfirmationDialog } from "@/components/admin/ResetConfirmationDialog";
import { showError, showSuccess } from "@/utils/toast";

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
  
  const { data: analyticsData, error: analyticsError } = await supabase
    .from('analytics')
    .select('key, value')
    .in('key', ['total_visits', 'monthly_clicks']);

  if (reviewsError || accessoriesError || categoriesError || analyticsError) {
    console.error(reviewsError || accessoriesError || categoriesError || analyticsError);
    throw new Error("Não foi possível carregar as estatísticas.");
  }

  const totalVisits = analyticsData?.find(item => item.key === 'total_visits')?.value ?? 0;
  const monthlyClicks = analyticsData?.find(item => item.key === 'monthly_clicks')?.value ?? 0;

  return {
    reviewsCount,
    accessoriesCount,
    categoriesCount,
    totalVisits,
    monthlyClicks,
  };
};

const Admin = () => {
  const queryClient = useQueryClient();
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard_stats'],
    queryFn: fetchDashboardStats,
  });

  const resetStatsMutation = useMutation({
    mutationFn: async () => {
      const { error: visitsError } = await supabase.rpc('reset_total_visits');
      if (visitsError) throw visitsError;
      
      const { error: clicksError } = await supabase.rpc('reset_monthly_clicks');
      if (clicksError) throw clicksError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard_stats'] });
      showSuccess("Estatísticas zeradas com sucesso!");
    },
    onError: (error: Error) => {
      showError(error.message || "Ocorreu um erro ao zerar as estatísticas.");
    },
  });

  const confirmReset = () => {
    resetStatsMutation.mutate();
    setIsResetConfirmOpen(false);
  };

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Painel</h2>
          <Button variant="destructive" onClick={() => setIsResetConfirmOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" /> Limpar Estatísticas
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Visitas Totais
              </CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-1/2" />
              ) : (
                <div className="text-2xl font-bold">{stats?.totalVisits ?? 0}</div>
              )}
              <p className="text-xs text-muted-foreground">
                Desde o início
              </p>
            </CardContent>
          </Card>
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
              {isLoading ? (
                <Skeleton className="h-8 w-1/2" />
              ) : (
                <div className="text-2xl font-bold">{stats?.monthlyClicks ?? 0}</div>
              )}
              <p className="text-xs text-muted-foreground">
                Cliques em links de afiliados
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <ResetConfirmationDialog
        open={isResetConfirmOpen}
        onOpenChange={setIsResetConfirmOpen}
        onConfirm={confirmReset}
        title="Você tem certeza?"
        description="Essa ação zerará os contadores de visitas e cliques do mês. Isso não pode ser desfeito."
      />
    </AdminLayout>
  );
};

export default Admin;