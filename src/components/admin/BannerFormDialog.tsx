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
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState, useRef } from "react";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";

export const BannerFormDialog = ({ banner, open, onOpenChange, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [affiliateLinkAmazon, setAffiliateLinkAmazon] = useState("");
  const [affiliateLinkMl, setAffiliateLinkMl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (banner) {
      setTitle(banner.title || "");
      setDescription(banner.description || "");
      setImageUrl(banner.image_url || "");
      setAffiliateLinkAmazon(banner.affiliate_link_amazon || "");
      setAffiliateLinkMl(banner.affiliate_link_ml || "");
      setIsActive(banner.is_active ?? true);
    } else {
      setTitle("");
      setDescription("");
      setImageUrl("");
      setAffiliateLinkAmazon("");
      setAffiliateLinkMl("");
      setIsActive(true);
    }
    setImageFile(null);
  }, [banner]);

  const handleSave = async () => {
    let finalImageUrl = imageUrl;
    if (imageFile) {
      const sanitizedFileName = imageFile.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9.\-_]/g, '');
      const filePath = `banners/${Date.now()}-${sanitizedFileName}`;
      const { error: uploadError } = await supabase.storage
        .from('post_images') // Usando o mesmo bucket por simplicidade
        .upload(filePath, imageFile);

      if (uploadError) {
        showError("Erro ao enviar a imagem: " + uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from('post_images')
        .getPublicUrl(filePath);
      
      finalImageUrl = data.publicUrl;
    }

    onSave({
      ...banner,
      title,
      description,
      image_url: finalImageUrl,
      affiliate_link_amazon: affiliateLinkAmazon,
      affiliate_link_ml: affiliateLinkMl,
      is_active: isActive,
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
          <DialogTitle>{banner ? "Editar Banner" : "Adicionar Novo Banner"}</DialogTitle>
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
              <Label htmlFor="description" className="text-right pt-2">
                Descrição
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="image" className="text-right pt-2">
                Imagem
              </Label>
              <div className="col-span-3 flex flex-col items-start gap-2">
                <p className="text-sm text-muted-foreground">
                  Tamanho ideal: <span className="font-semibold text-foreground">1200x600 pixels</span> (2:1)
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
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Pré-visualização"
                    className="mt-2 rounded-md object-cover h-32 w-64"
                  />
                )}
              </div>
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
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                Ativo
              </Label>
              <div className="col-span-3 flex items-center">
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>
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