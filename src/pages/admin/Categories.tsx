import AdminLayout from "../../components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { useState } from "react";
import { CategoryFormDialog } from "@/components/admin/CategoryFormDialog";
import { DeleteConfirmationDialog } from "@/components/admin/DeleteConfirmationDialog";
import { showError, showSuccess } from "@/utils/toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { iconMap } from "@/components/icons";

const fetchCategories = async () => {
  const { data, error } = await supabase.from('categories').select('*').order('display_order', { ascending: true });
  if (error) throw new Error(error.message);
  return data;
};

const CategoriesPage = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['homepage_categories'] });
    },
    onError: (error: Error) => {
      showError(error.message || "Ocorreu um erro. Verifique se você está autenticado.");
    },
  };

  const createCategoryMutation = useMutation({
    mutationFn: async (newCategory: any) => {
      const { error } = await supabase.from('categories').insert(newCategory);
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      showSuccess("Categoria criada com sucesso!");
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async (updatedCategory: any) => {
      const { error } = await supabase.from('categories').update(updatedCategory).eq('id', updatedCategory.id);
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      showSuccess("Categoria atualizada com sucesso!");
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', categoryId);
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      showSuccess("Categoria excluída com sucesso!");
    },
  });

  const handleAddNew = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = (category: any) => {
    setSelectedCategory(category);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCategory) {
      deleteCategoryMutation.mutate((selectedCategory as any).id);
    }
    setIsDeleteConfirmOpen(false);
    setSelectedCategory(null);
  };

  const handleSave = (categoryData: any) => {
    if (categoryData.id) {
      updateCategoryMutation.mutate(categoryData);
    } else {
      const { id, ...newCategoryData } = categoryData;
      createCategoryMutation.mutate(newCategoryData);
    }
    setIsFormOpen(false);
    setSelectedCategory(null);
  };

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Categorias</h2>
            <p className="text-muted-foreground">
              Gerencie as categorias da seção "Qual Comprar?".
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Nova Categoria
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Categorias</CardTitle>
            <CardDescription>Uma lista das suas categorias.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Ordem</TableHead>
                  <TableHead>Ícone</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead className="hidden md:table-cell">Slug</TableHead>
                  <TableHead>
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-6" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  categories?.map((category) => {
                    const IconComponent = iconMap[category.icon];
                    return (
                      <TableRow key={category.id}>
                        <TableCell>{category.display_order}</TableCell>
                        <TableCell>
                          {IconComponent && <IconComponent className="h-5 w-5 text-muted-foreground" />}
                        </TableCell>
                        <TableCell className="font-medium">{category.title}</TableCell>
                        <TableCell className="hidden md:table-cell">{category.slug}</TableCell>
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
                              <DropdownMenuItem onClick={() => handleEdit(category)}>Editar</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(category)}>Excluir</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <CategoryFormDialog
        category={selectedCategory}
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

export default CategoriesPage;