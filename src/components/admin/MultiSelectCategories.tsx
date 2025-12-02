import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface Category {
  slug: string;
  title: string;
}

const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase.from('categories').select('slug, title');
  if (error) throw new Error(error.message);
  return data || [];
};

interface MultiSelectCategoriesProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function MultiSelectCategories({ selected, onChange }: MultiSelectCategoriesProps) {
  const [open, setOpen] = React.useState(false)
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['all_categories_for_select'],
    queryFn: fetchCategories,
  });

  const handleSelect = (slug: string) => {
    if (selected.includes(slug)) {
      onChange(selected.filter((s) => s !== slug));
    } else {
      onChange([...selected, slug]);
    }
  };

  const handleRemove = (slug: string) => {
    onChange(selected.filter((s) => s !== slug));
  };

  const getCategoryTitle = (slug: string) => {
    return categories?.find(c => c.slug === slug)?.title || slug;
  }

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            Selecione as categorias...
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Buscar categoria..." />
            <CommandList>
              <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
              <CommandGroup>
                {isLoading ? (
                  <CommandItem>Carregando...</CommandItem>
                ) : (
                  categories?.map((category) => (
                    <CommandItem
                      key={category.slug}
                      value={category.slug}
                      onSelect={() => {
                        handleSelect(category.slug)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selected.includes(category.slug) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {category.title}
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="flex flex-wrap gap-1 mt-2">
        {selected.map((slug) => (
          <Badge
            key={slug}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {getCategoryTitle(slug)}
            <button
              type="button"
              className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => handleRemove(slug)}
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  )
}