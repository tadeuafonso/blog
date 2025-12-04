import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState, useRef } from "react";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { useQuery } from "@tanstack/react-query";

const fetchReviews = async () => {
  const { data, error } = await supabase.from('posts').select('id, title').order('title', { ascending: true });
  if (error) throw new Error(error.message);
  return data;
};

export const SmartphoneFormDialog = ({ smartphone, open, onOpenChange, onSave }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [ratingText, setRatingText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [affiliateLinkAmazon, setAffiliateLinkAmazon] = useState("");
  const [affiliateLinkMl, setAffiliateLinkMl] = useState("");
  const [linkedReviewId, setLinkedReviewId] = useState<string | null>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ['all_reviews_for_select'],
    queryFn: fetchReviews,
  });

  useEffect(() => {
    if (smartphone) {
      setName(smartphone.name || "");
      setPrice(smartphone.price || "");
      setRatingText(smartphone.rating_text || "");
      setImageUrl(smartphone.image_url || "");
      setAffiliateLinkAmazon(smartphone.affiliate_link_amazon || "");
      setAffiliateLinkMl(smartphone.affiliate_link_ml || "");
      setLinkedReviewId(smartphone.linked_review_id || "");
    } else {
      setName("");
      setPrice("");
      setRatingText("");
      setImageUrl("");
      setAffiliateLinkAmazon("");
      setAffiliateLinkMl("");
      setLinkedReviewId("");
    }
    setImageFile(null);
  }, [smartphone]);

  const handleSave = async () => {
    let finalImageUrl = imageUrl;
    if (imageFile) {
      const sanitizedFileName = imageFile.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9.\-_]/g, '');
      const filePath = `smartphones/${Date.now()}-${sanitizedFileName}`;
      const { error: uploadError } = await supabase.storage
        .from('post_images')
        .upload(filePath, imageFile);

      if (uploadError) {
        showError("Erro ao enviar a imagem: " + uploadError.message);
        return;
      }

      const { data } = supabase.storage.from('post_images').getPublicUrl(filePath);
      finalImageUrl = data.publicUrl;
    }

    onSave({
      ...smartphone,
      name,
      price,
      rating_text: ratingText,
      image_url: finalImageUrl,
      affiliate_link_amazon: affiliateLinkAmazon,
      affiliate_link_ml: affiliateLinkMl,
      linked_review_id: linkedReviewId || null,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imageUrl && imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }
      setImageUrl(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{smartphone ? "Editar Smartphone" : "Adicionar Novo Smartphone"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-6">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nome</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="image" className="text-right pt-2">Imagem</Label>
              <div className="col-span-3 flex flex-col items-start gap-2">
                <Button type="button" variant="outline" onClick={triggerFileUpload}>
                  <Upload className="mr-2 h-4 w-4" /> Selecionar Imagem
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                {imageUrl && <img src={imageUrl} alt="Pré-visualização" className="mt-2 rounded-md object-cover h-32 w-32" />}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Preço</Label>
              <Input id="price" value={price} onChange={(e) => setPrice(e.target.value)} className="col-span-3" placeholder="Ex: R$ 4.999,00" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ratingText" className="text-right">Texto da Avaliação</Label>
              <Input id="ratingText" value={ratingText} onChange={(e) => setRatingText(e.target.value)} className="col-span-3" placeholder="Ex: 4,8 (7,6 mil)" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="linkedReview" className="text-right">Vincular Review</Label>
              <Select value={linkedReviewId || ""} onValueChange={(value) => setLinkedReviewId(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={isLoadingReviews ? "Carregando..." : "Selecione um review"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
                  {!isLoadingReviews && reviews?.map(review => (
                    <SelectItem key={review.id} value={review.id}>{review.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="affiliateLinkAmazon" className="text-right">Link Amazon</Label>
              <Input id="affiliateLinkAmazon" value={affiliateLinkAmazon} onChange={(e) => setAffiliateLinkAmazon(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="affiliateLinkMl" className="text-right">Link Mercado Livre</Label>
              <Input id="affiliateLinkMl" value={affiliateLinkMl} onChange={(e) => setAffiliateLinkMl(e.target.value)} className="col-span-3" />
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild><Button type="button" variant="secondary">Cancelar</Button></DialogClose>
          <Button type="submit" onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};