import AdminLayout from "../../components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { useState } from "react";
import { PriceGuideFormDialog } from "@/components/admin/PriceGuideFormDialog";
import { DeleteConfirmationDialog } from "@/components/admin/DeleteConfirmationDialog";
import { showError, showSuccess } from "@/utils/toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const fetchPriceGuides = async () => {
  const { data, error } = await supabase.from('price_guides').select('*').order('display_order', { ascending: true });
  if (error) throw new Error(error.message);
  return data;
};

const PriceGuidesPage = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);

  const { data: guides, isLoading } = useQuery({
    queryKey: ['price_guides'],
    queryFn: fetchPriceGuides,
  });

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price_guides'] });
    },
    onError: (error: Error) => {
      showError(error.message || "Ocorreu um erro. Verifique se você está autenticado.");
    },
  };

  const createGuideMutation = useMutation({
    mutationFn: async (newGuide: any) => {
      const { error } = await supabase.from('price_guides').insert(newGuide);
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      showSuccess("Guia de preço criado com sucesso!");
    },
  });

  const updateGuideMutation = useMutation({
    mutationFn: async (updatedGuide: any) => {
      const { error } = await supabase.from('price_guides').update(updatedGuide).eq('id', updatedGuide.id);
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      showSuccess("Guia de preço atualizado com sucesso!");
    },
  });

  const deleteGuideMutation = useMutation({
    mutationFn: async (guideId: string) => {
      const { error } = await supabase.from('price_guides').delete().eq('id', guideId);
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      showSuccess("Guia de preço excluído com sucesso!");
    },
  });

  const handleAddNew = () => {
    setSelectedGuide(null);
    setIsFormOpen(true);
  };

  const handleEdit = (guide: any) => {
    setSelectedGuide(guide);
    setIsFormOpen(true);
  };

  const handleDelete = (guide: any) => {
    setSelectedGuide(guide);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (selectedGuide) {
      deleteGuideMutation.mutate((selectedGuide as any).id);
    }
    setIsDeleteConfirmOpen(false);
    setSelectedGuide(null);
  };

  const handleSave = (guideData: any) => {
    if (guideData.id) {
      updateGuideMutation.mutate(guideData);
    } else {
      const { id, ...newGuideData } = guideData;
      createGuideMutation.mutate(newGuideData);
    }
    setIsFormOpen(false);
    setSelectedGuide(null);
  };

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Guias de Preço</h2>
            <p className="text-muted-foreground">
              Gerencie os guias de "Melhores até X".
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Novo Guia
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Guias de Preço</CardTitle>
            <CardDescription>Uma lista dos seus guias de preço.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Ordem</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Preço Máximo</TableHead>
                  <TableHead className="hidden md:table-cell">Slug</TableHead>
                  <TableHead>
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  guides?.map((guide) => (
                    <TableRow key={guide.id}>
                      <TableCell>{guide.display_order}</TableCell>
                      <TableCell className="font-medium">{guide.title}</TableCell>
                      <TableCell>R$ {guide.max_price}</TableCell>
                      <TableCell className="hidden md:table-cell">{guide.slug}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleEdit(guide)}>Editar</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(guide)}>Excluir</DropdownMenuItem>
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
      <PriceGuideFormDialog
        guide={selectedGuide}
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

export default PriceGuidesPage;