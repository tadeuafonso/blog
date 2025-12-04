import AdminLayout from "../../components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { useState } from "react";
import { SmartphoneFormDialog } from "@/components/admin/SmartphoneFormDialog";
import { DeleteConfirmationDialog } from "@/components/admin/DeleteConfirmationDialog";
import { showError, showSuccess } from "@/utils/toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const fetchSmartphones = async () => {
  const { data, error } = await supabase.from('smartphones').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

const SmartphonesAdminPage = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedSmartphone, setSelectedSmartphone] = useState(null);

  const { data: smartphones, isLoading } = useQuery({
    queryKey: ['smartphones'],
    queryFn: fetchSmartphones,
  });

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['smartphones'] });
    },
    onError: (error: Error) => {
      showError(error.message || "Ocorreu um erro. Verifique se você está autenticado.");
    },
  };

  const createSmartphoneMutation = useMutation({
    mutationFn: async (newSmartphone: any) => {
      const { error } = await supabase.from('smartphones').insert(newSmartphone);
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      showSuccess("Smartphone adicionado com sucesso!");
    },
  });

  const updateSmartphoneMutation = useMutation({
    mutationFn: async (updatedSmartphone: any) => {
      const { error } = await supabase.from('smartphones').update(updatedSmartphone).eq('id', updatedSmartphone.id);
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      showSuccess("Smartphone atualizado com sucesso!");
    },
  });

  const deleteSmartphoneMutation = useMutation({
    mutationFn: async (smartphoneId: string) => {
      const { error } = await supabase.from('smartphones').delete().eq('id', smartphoneId);
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      showSuccess("Smartphone excluído com sucesso!");
    },
  });

  const handleAddNew = () => {
    setSelectedSmartphone(null);
    setIsFormOpen(true);
  };

  const handleEdit = (smartphone: any) => {
    setSelectedSmartphone(smartphone);
    setIsFormOpen(true);
  };

  const handleDelete = (smartphone: any) => {
    setSelectedSmartphone(smartphone);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSmartphone) {
      deleteSmartphoneMutation.mutate((selectedSmartphone as any).id);
    }
    setIsDeleteConfirmOpen(false);
    setSelectedSmartphone(null);
  };

  const handleSave = (smartphoneData: any) => {
    if (smartphoneData.id) {
      updateSmartphoneMutation.mutate(smartphoneData);
    } else {
      const { id, ...newSmartphoneData } = smartphoneData;
      createSmartphoneMutation.mutate(newSmartphoneData);
    }
    setIsFormOpen(false);
    setSelectedSmartphone(null);
  };

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Smartphones</h2>
            <p className="text-muted-foreground">
              Gerencie os produtos da página de smartphones.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Novo Smartphone
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Smartphones</CardTitle>
            <CardDescription>Uma lista dos smartphones cadastrados.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">Preço</TableHead>
                  <TableHead>
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  smartphones?.map((phone) => (
                    <TableRow key={phone.id}>
                      <TableCell className="font-medium">{phone.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{phone.price}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleEdit(phone)}>Editar</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(phone)}>Excluir</DropdownMenuItem>
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
      <SmartphoneFormDialog
        smartphone={selectedSmartphone}
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

export default SmartphonesAdminPage;