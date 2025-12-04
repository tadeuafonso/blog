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
import { Textarea } from "@/components/ui/textarea";
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
import { MultiSelectCategories } from "./MultiSelectCategories";

export const PostFormDialog = ({ post, open, onOpenChange, onSave }) => {
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("Rascunho");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [summary, setSummary] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [affiliateLinkAmazon, setAffiliateLinkAmazon] = useState("");
  const [affiliateLinkMl, setAffiliateLinkMl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (post) {
      setTitle(post.title || "");
      setRating(post.rating?.toString().replace('.', ',') || "");
      setPrice(post.price?.toString().replace('.', ',') || "");
      setStatus(post.status || "Rascunho");
      setImage(post.image || "");
      setTags(post.tags || []);
      setSummary(post.summary || "");
      setPros(post.pros?.join("\n") || "");
      setCons(post.cons?.join("\n") || "");
      setConclusion(post.conclusion || "");
      setAffiliateLinkAmazon(post.affiliate_link_amazon || "");
      setAffiliateLinkMl(post.affiliate_link_ml || "");
    } else {
      setTitle("");
      setRating("");
      setPrice("");
      setStatus("Rascunho");
      setImage("");
      setTags([]);
      setSummary("");
      setPros("");
      setCons("");
      setConclusion("");
      setAffiliateLinkAmazon("");
      setAffiliateLinkMl("");
    }
    setImageFile(null);
  }, [post]);

  const handleSave = async () => {
    let imageUrl = image;
    if (imageFile) {
      const sanitizedFileName = imageFile.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9.\-_]/g, '');
      const filePath = `${Date.now()}-${sanitizedFileName}`;
      const { error: uploadError } = await supabase.storage
        .from('post_images')
        .upload(filePath, imageFile);

      if (uploadError) {
        showError("Erro ao enviar a imagem: " + uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from('post_images')
        .getPublicUrl(filePath);
      
      imageUrl = data.publicUrl;
    }

    onSave({
      ...post,
      title,
      rating: parseFloat(rating.replace(',', '.')) || 0,
      price: price ? parseFloat(price.replace(',', '.')) : null,
      status,
      image: imageUrl,
      tags: tags,
      summary,
      pros: pros.split("\n").filter(Boolean),
      cons: cons.split("\n").filter(Boolean),
      conclusion,
      affiliate_link_amazon: affiliateLinkAmazon,
      affiliate_link_ml: affiliateLinkMl,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (image && image.startsWith("blob:")) {
        URL.revokeObjectURL(image);
      }
      setImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const digitsOnly = rawValue.replace(/[^0-9]/g, "");
    const limitedDigits = digitsOnly.slice(0, 2);

    let formattedValue = limitedDigits;
    if (limitedDigits.length === 2) {
      if (limitedDigits === "10") {
        formattedValue = "10";
      } else {
        formattedValue = `${limitedDigits[0]},${limitedDigits.slice(1)}`;
      }
    }
    
    setRating(formattedValue);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (/^\d*[,]?\d{0,2}$/.test(value)) {
      setPrice(value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{post ? "Editar Review" : "Adicionar Nova Review"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-6">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Título
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="image" className="text-right pt-2">
                Imagem
              </Label>
              <div className="col-span-3 flex flex-col items-start gap-2">
                <p className="text-sm text-muted-foreground">
                  Tamanho ideal: 1200x1200 pixels (1:1)
                </p>
                <Button type="button" variant="outline" onClick={triggerFileUpload}>
                  <Upload className="mr-2 h-4 w-4" />
                  Selecionar Imagem
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                />
                {image && (
                  <img
                    src={image}
                    alt="Pré-visualização"
                    className="mt-2 rounded-md object-cover h-32 w-32"
                  />
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rating" className="text-right">
                Avaliação
              </Label>
              <Input
                id="rating"
                type="text"
                value={rating}
                onChange={handleRatingChange}
                className="col-span-3"
                placeholder="Ex: 9,8"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Preço (R$)
              </Label>
              <Input
                id="price"
                type="text"
                value={price}
                onChange={handlePriceChange}
                className="col-span-3"
                placeholder="Ex: 2499,90"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Publicado">Publicado</SelectItem>
                  <SelectItem value="Rascunho">Rascunho</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="tags" className="text-right pt-2">
                Categorias
              </Label>
              <div className="col-span-3">
                <MultiSelectCategories selected={tags} onChange={setTags} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="summary" className="text-right pt-2">
                Resumo
              </Label>
              <Textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="col-span-3"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="pros" className="text-right pt-2">
                Pontos Positivos
              </Label>
              <Textarea
                id="pros"
                value={pros}
                onChange={(e) => setPros(e.target.value)}
                className="col-span-3"
                rows={5}
                placeholder="Um ponto por linha..."
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="cons" className="text-right pt-2">
                Pontos Negativos
              </Label>
              <Textarea
                id="cons"
                value={cons}
                onChange={(e) => setCons(e.target.value)}
                className="col-span-3"
                rows={5}
                placeholder="Um ponto por linha..."
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="conclusion" className="text-right pt-2">
                Conclusão
              </Label>
              <Textarea
                id="conclusion"
                value={conclusion}
                onChange={(e) => setConclusion(e.target.value)}
                className="col-span-3"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="affiliateLinkAmazon" className="text-right">
                Link Amazon
              </Label>
              <Input
                id="affiliateLinkAmazon"
                value={affiliateLinkAmazon}
                onChange={(e) => setAffiliateLinkAmazon(e.target.value)}
                className="col-span-3"
                placeholder="Link de afiliado da Amazon"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="affiliateLinkMl" className="text-right">
                Link Mercado Livre
              </Label>
              <Input
                id="affiliateLinkMl"
                value={affiliateLinkMl}
                onChange={(e) => setAffiliateLinkMl(e.target.value)}
                className="col-span-3"
                placeholder="Link de afiliado do Mercado Livre"
              />
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleSave}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};