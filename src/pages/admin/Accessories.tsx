import AdminLayout from "../../components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { useState } from "react";
import { AccessoryFormDialog } from "@/components/admin/AccessoryFormDialog";
import { DeleteConfirmationDialog } from "@/components/admin/DeleteConfirmationDialog";
import { showError, showSuccess } from "@/utils/toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const fetchAccessories = async () => {
  const { data, error } = await supabase.from('accessories').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

const AccessoriesPage = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedAccessory, setSelectedAccessory] = useState(null);

  const { data: accessories, isLoading } = useQuery({
    queryKey: ['accessories'],
    queryFn: fetchAccessories,
  });

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accessories'] });
    },
    onError: (error: Error) => {
      showError(error.message || "Ocorreu um erro. Verifique se você está autenticado.");
    },
  };

  const createAccessoryMutation = useMutation({
    mutationFn: async (newAccessory: any) => {
      const { error } = await supabase.from('accessories').insert(newAccessory);
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      showSuccess("Acessório criado com sucesso!");
    },
  });

  const updateAccessoryMutation = useMutation({
    mutationFn: async (updatedAccessory: any) => {
      const { error } = await supabase.from('accessories').update(updatedAccessory).eq('id', updatedAccessory.id);
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      showSuccess("Acessório atualizado com sucesso!");
    },
  });

  const deleteAccessoryMutation = useMutation({
    mutationFn: async (accessoryId: string) => {
      const { error } = await supabase.from('accessories').delete().eq('id', accessoryId);
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      showSuccess("Acessório excluído com sucesso!");
    },
  });

  const handleAddNew = () => {
    setSelectedAccessory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (accessory: any) => {
    setSelectedAccessory(accessory);
    setIsFormOpen(true);
  };

  const handleDelete = (accessory: any) => {
    setSelectedAccessory(accessory);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAccessory) {
      deleteAccessoryMutation.mutate((selectedAccessory as any).id);
    }
    setIsDeleteConfirmOpen(false);
    setSelectedAccessory(null);
  };

  const handleSave = (accessoryData: any) => {
    if (accessoryData.id) {
      updateAccessoryMutation.mutate(accessoryData);
    } else {
      const { id, ...newAccessoryData } = accessoryData;
      createAccessoryMutation.mutate(newAccessoryData);
    }
    setIsFormOpen(false);
    setSelectedAccessory(null);
  };

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Acessórios</h2>
            <p className="text-muted-foreground">
              Gerencie seus acessórios aqui.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Novo Acessório
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Acessórios</CardTitle>
            <CardDescription>Uma lista dos seus acessórios recentes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead className="hidden md:table-cell">Avaliação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  accessories?.map((accessory) => (
                    <TableRow key={accessory.id}>
                      <TableCell className="font-medium">{accessory.title}</TableCell>
                      <TableCell className="hidden md:table-cell">{accessory.rating} / 10</TableCell>
                      <TableCell>
                        <Badge variant={accessory.status === "Publicado" ? "default" : "outline"}>
                          {accessory.status}
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
                            <DropdownMenuItem onClick={() => handleEdit(accessory)}>Editar</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(accessory)}>Excluir</DropdownMenuItem>
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
      <AccessoryFormDialog
        accessory={selectedAccessory}
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

export default AccessoriesPage;