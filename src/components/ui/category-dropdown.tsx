import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCategories } from "@/hooks/use-categories";

interface CategoryDropdownProps {
  value?: string | string[];
  onChange?: (value: any) => void;
  multiple?: boolean;
  placeholder?: string;
  className?: string;
}

export function CategoryDropdown({
  value,
  onChange,
  multiple = false,
  placeholder = "Select role in the film industry",
  className,
}: CategoryDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const { data: categories, isLoading } = useCategories();

  // Group categories by department
  const groupedCategories = React.useMemo(() => {
    if (!categories) return {};
    return categories.reduce((acc, category) => {
      const dept = category.department || "Other";
      if (!acc[dept]) {
        acc[dept] = [];
      }
      acc[dept].push(category);
      return acc;
    }, {} as Record<string, typeof categories>);
  }, [categories]);

  const handleSelect = (currentValue: string) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(currentValue)
        ? currentValues.filter((v) => v !== currentValue)
        : [...currentValues, currentValue];
      onChange?.(newValues);
    } else {
      onChange?.(currentValue === value ? "" : currentValue);
      setOpen(false);
    }
  };

  const getDisplayText = () => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.length === 0) return placeholder;
      return `${currentValues.length} Selected`;
    } else {
      if (!value) return placeholder;
      const selected = categories?.find((c) => c.name === value);
      return selected ? selected.name : placeholder;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <span className="truncate">{getDisplayText()}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search roles..." />
          <CommandList onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()}>
            <CommandEmpty>{isLoading ? "Loading..." : "No roles found."}</CommandEmpty>
            {Object.entries(groupedCategories).map(([department, items]) => (
              <CommandGroup key={department} heading={department}>
                {items.map((item) => {
                  const isSelected = multiple
                    ? Array.isArray(value) && value.includes(item.name)
                    : value === item.name;

                  return (
                    <CommandItem
                      key={item.id}
                      value={item.name}
                      onSelect={(val) => {
                        // CommandItem lowercases the value by default unless specified, 
                        // so we pass the exact item.name manually to ensure exact case match.
                        handleSelect(item.name);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {item.name}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
