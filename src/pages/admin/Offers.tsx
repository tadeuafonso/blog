import AdminLayout from "../../components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { useState } from "react";
import { OfferFormDialog } from "@/components/admin/OfferFormDialog";
import { DeleteConfirmationDialog } from "@/components/admin/DeleteConfirmationDialog";
import { showError, showSuccess } from "@/utils/toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const fetchOffers = async () => {
  const { data, error } = await supabase.from('offers').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

const OffersPage = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const { data: offers, isLoading } = useQuery({
    queryKey: ['offers'],
    queryFn: fetchOffers,
  });

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      queryClient.invalidateQueries({ queryKey: ['homepage_offers'] });
    },
    onError: (error: Error) => {
      showError(error.message || "Ocorreu um erro. Verifique se você está autenticado.");
    },
  };

  const createOfferMutation = useMutation({
    mutationFn: async (newOffer: any) => {
      const { error } = await supabase.from('offers').insert(newOffer);
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      showSuccess("Oferta criada com sucesso!");
    },
  });

  const updateOfferMutation = useMutation({
    mutationFn: async (updatedOffer: any) => {
      const { error } = await supabase.from('offers').update(updatedOffer).eq('id', updatedOffer.id);
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      showSuccess("Oferta atualizada com sucesso!");
    },
  });

  const deleteOfferMutation = useMutation({
    mutationFn: async (offerId: string) => {
      const { error } = await supabase.from('offers').delete().eq('id', offerId);
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      showSuccess("Oferta excluída com sucesso!");
    },
  });

  const handleAddNew = () => {
    setSelectedOffer(null);
    setIsFormOpen(true);
  };

  const handleEdit = (offer: any) => {
    setSelectedOffer(offer);
    setIsFormOpen(true);
  };

  const handleDelete = (offer: any) => {
    setSelectedOffer(offer);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (selectedOffer) {
      deleteOfferMutation.mutate((selectedOffer as any).id);
    }
    setIsDeleteConfirmOpen(false);
    setSelectedOffer(null);
  };

  const handleSave = (offerData: any) => {
    if (offerData.id) {
      updateOfferMutation.mutate(offerData);
    } else {
      const { id, ...newOfferData } = offerData;
      createOfferMutation.mutate(newOfferData);
    }
    setIsFormOpen(false);
    setSelectedOffer(null);
  };

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Ofertas</h2>
            <p className="text-muted-foreground">
              Gerencie as ofertas da página inicial aqui.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Nova Oferta
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Ofertas</CardTitle>
            <CardDescription>Uma lista das suas ofertas recentes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">Preço</TableHead>
                  <TableHead>Tag</TableHead>
                  <TableHead>
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-28 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  offers?.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell className="font-medium">{offer.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{offer.price}</TableCell>
                      <TableCell>
                        {offer.tag && <Badge variant="destructive">{offer.tag}</Badge>}
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
                            <DropdownMenuItem onClick={() => handleEdit(offer)}>Editar</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(offer)}>Excluir</DropdownMenuItem>
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
      <OfferFormDialog
        offer={selectedOffer}
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

export default OffersPage;