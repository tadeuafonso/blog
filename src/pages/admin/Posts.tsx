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
import { showSuccess } from "@/utils/toast";

const initialPosts = [
  { id: "1", title: "iPhone 15 Pro", rating: 9.8, status: "Publicado" },
  { id: "2", title: "Galaxy Z Fold 5", rating: 9.5, status: "Publicado" },
  { id: "3", title: "Pixel 8 Pro", rating: 9.2, status: "Rascunho" },
  { id: "4", title: "Xiaomi 14", rating: 9.0, status: "Publicado" },
];

const PostsPage = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleAddNew = () => {
    setSelectedPost(null);
    setIsFormOpen(true);
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    setIsFormOpen(true);
  };

  const handleDelete = (post) => {
    setSelectedPost(post);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    setPosts(posts.filter((p) => p.id !== selectedPost.id));
    showSuccess("Post excluído com sucesso!");
    setIsDeleteConfirmOpen(false);
    setSelectedPost(null);
  };

  const handleSave = (postData) => {
    if (postData.id) {
      // Edit existing post
      setPosts(posts.map((p) => (p.id === postData.id ? postData : p)));
      showSuccess("Post atualizado com sucesso!");
    } else {
      // Add new post
      const newPost = { ...postData, id: (posts.length + 1).toString() };
      setPosts([...posts, newPost]);
      showSuccess("Post criado com sucesso!");
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
                {posts.map((post) => (
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
                ))}
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