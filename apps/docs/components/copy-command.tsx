"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** A shell command with a copy button. Used on the landing page hero. */
export function CopyCommand({
  command,
  className,
}: {
  command: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const copy = React.useCallback(() => {
    navigator.clipboard?.writeText(command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }, [command]);

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy: ${command}`}
      className={cn(
        "group inline-flex cursor-pointer items-center gap-3 rounded-lg border bg-card px-4 py-2.5 text-left font-mono text-sm text-muted-foreground transition-colors hover:border-primary/40",
        className,
      )}
    >
      <span className="select-none text-primary/60">$</span>
      <span className="truncate text-foreground">{command}</span>
      <span
        className={cn(
          "ml-1 shrink-0 text-xs transition-colors",
          copied ? "text-primary" : "text-muted-foreground/60",
        )}
      >
        {copied ? "copied" : "copy"}
      </span>
    </button>
  );
}
