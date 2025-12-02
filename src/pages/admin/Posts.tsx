import AdminLayout from "../../components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { useState } from "react";
import { PostFormDialog } from "@/components/admin/PostFormDialog";
import { DeleteConfirmationDialog } from "@/components/admin/DeleteConfirmationDialog";
import { showError, showSuccess } from "@/utils/toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const fetchPosts = async () => {
  const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

const PostsPage = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: Error) => {
      showError(error.message || "Ocorreu um erro. Verifique se você está autenticado.");
    },
  };

  const createPostMutation = useMutation({
    mutationFn: async (newPost: any) => {
      const { error } = await supabase.from('posts').insert(newPost);
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      showSuccess("Post criado com sucesso!");
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async (updatedPost: any) => {
      const { error } = await supabase.from('posts').update(updatedPost).eq('id', updatedPost.id);
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      showSuccess("Post atualizado com sucesso!");
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase.from('posts').delete().eq('id', postId);
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      mutationOptions.onSuccess();
      showSuccess("Post excluído com sucesso!");
    },
  });

  const handleAddNew = () => {
    setSelectedPost(null);
    setIsFormOpen(true);
  };

  const handleEdit = (post: any) => {
    setSelectedPost(post);
    setIsFormOpen(true);
  };

  const handleDelete = (post: any) => {
    setSelectedPost(post);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPost) {
      deletePostMutation.mutate((selectedPost as any).id);
    }
    setIsDeleteConfirmOpen(false);
    setSelectedPost(null);
  };

  const handleSave = (postData: any) => {
    if (postData.id) {
      updatePostMutation.mutate(postData);
    } else {
      const { id, ...newPostData } = postData;
      createPostMutation.mutate(newPostData);
    }
    setIsFormOpen(false);
    setSelectedPost(null);
  };

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Reviews</h2>
            <p className="text-muted-foreground">
              Gerencie suas postagens de review aqui.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Nova Review
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Postagens</CardTitle>
            <CardDescription>Uma lista das suas postagens de review recentes.</CardDescription>
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
                  posts?.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell className="hidden md:table-cell">{post.rating} / 10</TableCell>
                      <TableCell>
                        <Badge variant={post.status === "Publicado" ? "default" : "outline"}>
                          {post.status}
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
                            <DropdownMenuItem onClick={() => handleEdit(post)}>Editar</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(post)}>Excluir</DropdownMenuItem>
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
      <PostFormDialog
        post={selectedPost}
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

export default PostsPage;