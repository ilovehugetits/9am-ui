import * as React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type TooltipSide = "top" | "right" | "bottom" | "left";

/** Small "?" icon that reveals an explanatory tooltip on hover. */
export function InfoTip({
    children,
    side = "top",
    className,
}: {
    children: React.ReactNode;
    side?: TooltipSide;
    className?: string;
}) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span
                    className={cn(
                        "inline-flex items-center justify-center shrink-0 text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-help",
                        className
                    )}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={13}
                        height={13}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <path d="M12 17h.01" />
                    </svg>
                </span>
            </TooltipTrigger>
            <TooltipContent side={side} sideOffset={6} className="max-w-[260px] leading-relaxed">
                {children}
            </TooltipContent>
        </Tooltip>
    );
}

/**
 * Hover tooltip around an interactive element (button, switch, badge).
 * Note: disabled buttons swallow pointer events — wrap them in a span first.
 */
export function Tip({
    label,
    side = "top",
    children,
}: {
    label: React.ReactNode;
    side?: TooltipSide;
    children: React.ReactNode;
}) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent side={side} sideOffset={6} className="max-w-[240px] leading-relaxed">
                {label}
            </TooltipContent>
        </Tooltip>
    );
}
