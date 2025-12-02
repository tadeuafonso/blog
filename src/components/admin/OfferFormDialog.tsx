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
import { useEffect, useState, useRef } from "react";
import { Upload } from "lucide-react";

export const OfferFormDialog = ({ offer, open, onOpenChange, onSave }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [tag, setTag] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (offer) {
      setName(offer.name || "");
      setPrice(offer.price || "");
      setImage(offer.image || "");
      setTag(offer.tag || "");
    } else {
      // Reset form for new offer
      setName("");
      setPrice("");
      setImage("");
      setTag("");
    }
  }, [offer]);

  const handleSave = () => {
    onSave({
      ...offer,
      name,
      price,
      image,
      tag,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (image && image.startsWith("blob:")) {
        URL.revokeObjectURL(image);
      }
      const newImageUrl = URL.createObjectURL(file);
      setImage(newImageUrl);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{offer ? "Editar Oferta" : "Adicionar Nova Oferta"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-6">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="image" className="text-right pt-2">
                Imagem
              </Label>
              <div className="col-span-3 flex flex-col items-start gap-2">
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
              <Label htmlFor="price" className="text-right">
                Preço
              </Label>
              <Input
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="col-span-3"
                placeholder="Ex: R$ 1.299"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tag" className="text-right">
                Tag
              </Label>
              <Input
                id="tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="col-span-3"
                placeholder="Ex: Oferta Relâmpago"
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