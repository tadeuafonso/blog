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
import { useEffect, useState } from "react";

export const PriceGuideFormDialog = ({ guide, open, onOpenChange, onSave }) => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);

  useEffect(() => {
    if (guide) {
      setTitle(guide.title || "");
      setSlug(guide.slug || "");
      setMaxPrice(guide.max_price?.toString() || "");
      setDisplayOrder(guide.display_order || 0);
    } else {
      setTitle("");
      setSlug("");
      setMaxPrice("");
      setDisplayOrder(0);
    }
  }, [guide]);

  const handleSave = () => {
    onSave({
      ...guide,
      title,
      slug,
      max_price: parseFloat(maxPrice) || 0,
      display_order: displayOrder,
    });
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!guide?.id) {
      setSlug(generateSlug(newTitle));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{guide ? "Editar Guia de Preço" : "Adicionar Novo Guia de Preço"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Título
            </Label>
            <Input
              id="title"
              value={title}
              onChange={handleTitleChange}
              className="col-span-3"
              placeholder="Ex: Melhores até R$ 1.000"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="slug" className="text-right">
              Slug
            </Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="col-span-3"
              placeholder="gerado-automaticamente"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="maxPrice" className="text-right">
              Preço Máximo
            </Label>
            <Input
              id="maxPrice"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="col-span-3"
              placeholder="1000"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="displayOrder" className="text-right">
              Ordem
            </Label>
            <Input
              id="displayOrder"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
              className="col-span-3"
              placeholder="0"
            />
          </div>
        </div>
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