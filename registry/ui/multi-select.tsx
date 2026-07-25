import { useState, useMemo, useEffect, useId } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { ChevronDownIcon } from "@/components/ui/chevron-down";
import { SearchIcon as Search } from "@/components/ui/search";
import { XIcon } from "@/components/ui/x";
import { CheckIcon } from "@/components/ui/check";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n";

interface MultiSelectProps {
    options: { value: string; label: string }[];
    selected: string[];
    onSelectionChange: (selected: string[]) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
}

export function MultiSelect({
    options,
    selected,
    onSelectionChange,
    placeholder,
    searchPlaceholder,
    emptyMessage,
}: MultiSelectProps) {
    const t = useT();
    const instanceId = useId();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (newOpen) {
            document.dispatchEvent(new CustomEvent('multiselect:open', { detail: instanceId }));
        }
    };

    useEffect(() => {
        const handler = (e: Event) => {
            if ((e as CustomEvent).detail !== instanceId) setOpen(false);
        };
        document.addEventListener('multiselect:open', handler);
        return () => document.removeEventListener('multiselect:open', handler);
    }, [instanceId]);

    const filtered = useMemo(() => {
        if (!search) return options;
        const lower = search.toLowerCase();
        return options.filter(opt => opt.label.toLowerCase().includes(lower));
    }, [options, search]);

    const toggle = (value: string) => {
        onSelectionChange(
            selected.includes(value)
                ? selected.filter(v => v !== value)
                : [...selected, value]
        );
    };

    const remove = (value: string) => {
        onSelectionChange(selected.filter(v => v !== value));
    };

    const selectedLabels = useMemo(() => {
        const map = new Map(options.map(o => [o.value, o.label]));
        return selected.map(v => ({ value: v, label: map.get(v) ?? v }));
    }, [options, selected]);

    return (
        <div className="flex flex-col gap-1.5">
            <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
                <PopoverPrimitive.Trigger asChild>
                    <Button
                        variant="default2"
                        className="w-full justify-between text-left font-normal border"
                    >
                        <span className={selected.length === 0 ? "text-foreground/40" : "text-foreground"}>
                            {selected.length === 0
                                ? (placeholder ?? t("ui.common.selectPlaceholder"))
                                : t("ui.common.nSelected", { count: selected.length })}
                        </span>
                        <ChevronDownIcon size={12} className="text-foreground/40" />
                    </Button>
                </PopoverPrimitive.Trigger>
                <PopoverPrimitive.Portal container={document.getElementById('root')!}>
                    <PopoverPrimitive.Content
                        align="start"
                        sideOffset={4}
                        onInteractOutside={(e) => e.preventDefault()}
                        onOpenAutoFocus={(e) => e.preventDefault()}
                        className={cn(
                            "bg-popover text-popover-foreground z-[60] w-[var(--radix-popover-trigger-width)] rounded-md border p-0 shadow-md outline-hidden pointer-events-auto",
                            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
                        )}
                    >
                        <div className="p-2 border-b border-black/10 dark:border-white/10">
                            <div className="relative">
                                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground/40" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder={searchPlaceholder ?? t("ui.common.searchPlaceholder")}
                                    className="pl-8! h-8 text-xs"
                                />
                            </div>
                        </div>
                        <div className="max-h-[200px] overflow-y-auto scrollbar-mini p-1">
                            {filtered.length === 0 ? (
                                <div className="text-foreground/30 text-xs text-center py-4">
                                    {emptyMessage ?? t("ui.common.noResultsFound")}
                                </div>
                            ) : (
                                filtered.map(opt => {
                                    const isSelected = selected.includes(opt.value);
                                    return (
                                        <button
                                            key={opt.value}
                                            onClick={() => toggle(opt.value)}
                                            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer transition-all active:scale-[0.98] hover:bg-black/[0.05] dark:hover:bg-white/10"
                                        >
                                            <div className={`flex items-center justify-center w-4 h-4 rounded border transition-colors ${
                                                isSelected
                                                    ? "bg-primary border-primary"
                                                    : "border-black/30 dark:border-white/30"
                                            }`}>
                                                {isSelected && <CheckIcon size={10} className="text-background" />}
                                            </div>
                                            <span className={isSelected ? "text-foreground" : "text-foreground/70"}>
                                                {opt.label}
                                            </span>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </PopoverPrimitive.Content>
                </PopoverPrimitive.Portal>
            </PopoverPrimitive.Root>

            {selectedLabels.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {selectedLabels.map(item => (
                        <span
                            key={item.value}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-[#f6e37133] text-primary"
                        >
                            {item.label}
                            <button
                                onClick={() => remove(item.value)}
                                className="hover:text-foreground transition-all active:scale-90 cursor-pointer"
                            >
                                <XIcon size={10} />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
