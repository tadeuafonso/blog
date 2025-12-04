import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/contexts/SessionContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { showError, showSuccess } from "@/utils/toast";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent } from "./ui/card";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  parent_id: string | null;
  username: string | null;
  avatar_url: string | null;
}

const fetchComments = async (postId: string) => {
  const { data, error } = await supabase.rpc('get_comments_with_profiles', { post_id_in: postId });
  if (error) throw new Error(error.message);
  return data as Comment[];
};

const CommentForm = ({ postId }: { postId: string }) => {
  const { session } = useSession();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");

  const addCommentMutation = useMutation({
    mutationFn: async (newComment: { content: string; post_id: string; user_id: string }) => {
      const { error } = await supabase.from('comments').insert(newComment);
      if (error) throw error;
    },
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      showSuccess("Comentário adicionado!");
    },
    onError: (error: Error) => {
      showError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !session) return;
    addCommentMutation.mutate({
      content: content.trim(),
      post_id: postId,
      user_id: session.user.id,
    });
  };

  if (!session) {
    return (
      <div className="text-center text-muted-foreground p-4 border rounded-lg">
        <Link to="/login" className="text-primary underline">Faça login</Link> para deixar um comentário.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Textarea
        placeholder="Escreva seu comentário..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        required
      />
      <Button type="submit" className="self-end" disabled={addCommentMutation.isPending}>
        {addCommentMutation.isPending ? "Enviando..." : "Enviar Comentário"}
      </Button>
    </form>
  );
};

const CommentItem = ({ comment }: { comment: Comment }) => {
  const fallback = comment.username ? comment.username.charAt(0).toUpperCase() : "U";
  return (
    <div className="flex items-start gap-4">
      <Avatar>
        <AvatarImage src={comment.avatar_url || undefined} alt={comment.username || 'Usuário'} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold">{comment.username || "Usuário Anônimo"}</p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ptBR })}
          </p>
        </div>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{comment.content}</p>
      </div>
    </div>
  );
};

export const CommentSection = ({ postId }: { postId: string }) => {
  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
  });

  return (
    <Card>
      <CardContent className="p-6 space-y-8">
        <CommentForm postId={postId} />
        <div className="space-y-6">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
          ) : comments && comments.length > 0 ? (
            comments.map(comment => <CommentItem key={comment.id} comment={comment} />)
          ) : (
            <p className="text-center text-muted-foreground">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};