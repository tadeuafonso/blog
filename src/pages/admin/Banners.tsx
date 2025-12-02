import AdminLayout from "../../components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { useState } from "react";
import { BannerFormDialog } from "@/components/admin/BannerFormDialog";
import { DeleteConfirmationDialog } from "@/components/admin/DeleteConfirmationDialog";
import { showError, showSuccess } from "@/utils/toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const fetchBanners = async () => {
  const { data, error } = await supabase.from('banners').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

const BannersPage = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const { data: banners, isLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: fetchBanners,
  });

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      queryClient.invalidateQueries({ queryKey: ['promo_banners'] });
    },
    onError: (error: Error) => {
      showError(error.message || "Ocorreu um erro.");
    },
  };

  const createBannerMutation = useMutation({
    mutationFn: async (newBanner: any) => {
      const { error } = await supabase.from('banners').insert(newBanner);
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      showSuccess("Banner criado com sucesso!");
    },
  });

  const updateBannerMutation = useMutation({
    mutationFn: async (updatedBanner: any) => {
      const { error } = await supabase.from('banners').update(updatedBanner).eq('id', updatedBanner.id);
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      showSuccess("Banner atualizado com sucesso!");
    },
  });

  const deleteBannerMutation = useMutation({
    mutationFn: async (bannerId: string) => {
      const { error } = await supabase.from('banners').delete().eq('id', bannerId);
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      showSuccess("Banner excluído com sucesso!");
    },
  });

  const handleAddNew = () => {
    setSelectedBanner(null);
    setIsFormOpen(true);
  };

  const handleEdit = (banner: any) => {
    setSelectedBanner(banner);
    setIsFormOpen(true);
  };

  const handleDelete = (banner: any) => {
    setSelectedBanner(banner);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (selectedBanner) {
      deleteBannerMutation.mutate((selectedBanner as any).id);
    }
    setIsDeleteConfirmOpen(false);
    setSelectedBanner(null);
  };

  const handleSave = (bannerData: any) => {
    if (bannerData.id) {
      updateBannerMutation.mutate(bannerData);
    } else {
      const { id, ...newBannerData } = bannerData;
      createBannerMutation.mutate(newBannerData);
    }
    setIsFormOpen(false);
    setSelectedBanner(null);
  };

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Banners Promocionais</h2>
            <p className="text-muted-foreground">
              Gerencie os banners da página inicial aqui.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Novo Banner
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Banners</CardTitle>
            <CardDescription>Uma lista dos seus banners promocionais.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">Imagem</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="hidden sm:table-cell"><Skeleton className="h-16 w-16 rounded-md" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  banners?.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell className="hidden sm:table-cell">
                        <img
                          alt={banner.title}
                          className="aspect-square rounded-md object-cover"
                          height="64"
                          src={banner.image_url || 'https://placehold.co/64'}
                          width="64"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{banner.title}</TableCell>
                      <TableCell>
                        <Badge variant={banner.is_active ? "default" : "outline"}>
                          {banner.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Alternar menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEdit(banner)}>Editar</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(banner)}>Excluir</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <BannerFormDialog
        banner={selectedBanner}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSave}
      />
      <DeleteConfirmationDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        onConfirm={confirmDelete}
      />
    </AdminLayout>
  );
};

export default BannersPage;