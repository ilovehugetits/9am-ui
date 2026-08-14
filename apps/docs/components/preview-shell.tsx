"use client";

import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import * as React from "react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";
import { ClientOnly } from "./client-only";

/**
 * The Preview/Code tab pair.
 *
 * Split out of `preview.tsx` because the code pane has to be sized from a
 * runtime measurement: the collapsed code height is whatever the rendered
 * preview happens to be, so switching tabs never resizes the container. Every
 * example is a different height, so this cannot be a constant.
 *
 * `preview` and `code` arrive already rendered from the server component —
 * the code block is highlighted at build time and is opaque here, which is why
 * its scroll container is addressed through a class and a CSS variable rather
 * than props.
 */
export function PreviewShell({
  preview,
  code,
  className,
  center = true,
}: {
  preview: React.ReactNode;
  code: React.ReactNode;
  className?: string;
  center?: boolean;
}) {
  const previewRef = React.useRef<HTMLDivElement>(null);

  /**
   * Held in state rather than a ref: Radix unmounts the inactive tab's
   * children, so the code pane does not exist until the tab is first opened.
   * A ref would stay null with nothing to re-trigger the measurement.
   */
  const [codeNode, setCodeNode] = React.useState<HTMLDivElement | null>(null);

  const [height, setHeight] = React.useState<number | null>(null);
  const [expanded, setExpanded] = React.useState(false);
  const [canExpand, setCanExpand] = React.useState(false);

  /**
   * Measure the preview pane.
   *
   * Fumadocs hides the inactive tab with `display: none`, so the observer
   * reports 0 whenever the Code tab is showing. Zero readings are ignored and
   * the last real measurement stands — otherwise the code pane would collapse
   * the moment you looked at it.
   */
  React.useEffect(() => {
    const el = previewRef.current;
    if (!el) return;

    const measure = () => {
      const next = el.getBoundingClientRect().height;
      if (next > 0) setHeight(next);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /**
   * Is the code actually clipped at the collapsed height?
   *
   * Only measured while collapsed — expanding makes scrollHeight equal
   * clientHeight, which would hide the Collapse button again.
   */
  React.useEffect(() => {
    const viewport = codeNode?.querySelector<HTMLElement>(
      ".preview-code-viewport",
    );
    if (!viewport) return;

    const check = () => {
      if (expanded || viewport.clientHeight === 0) return;
      setCanExpand(viewport.scrollHeight > viewport.clientHeight + 4);
    };

    check();
    const observer = new ResizeObserver(check);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [codeNode, height, expanded]);

  /**
   * Collapsing removes several hundred pixels from above the fold, so the
   * reader is left staring at whatever followed the example. `flushSync`
   * applies the height first, then the pane is pulled back into view if its
   * top ended up behind the sticky header.
   */
  const collapse = () => {
    if (!codeNode) return;

    flushSync(() => setExpanded(false));

    const viewport = codeNode.querySelector<HTMLElement>(
      ".preview-code-viewport",
    );
    if (viewport) viewport.scrollTop = 0;

    const HEADER_OFFSET = 96;
    const { top } = codeNode.getBoundingClientRect();
    if (top < HEADER_OFFSET) window.scrollBy({ top: top - HEADER_OFFSET });
  };

  return (
    <Tabs items={["Preview", "Code"]} defaultIndex={0} className="my-6">
      <Tab value="Preview" className="p-0">
        <div
          ref={previewRef}
          data-preview=""
          className={cn(
            "not-prose relative overflow-hidden rounded-lg border bg-background p-6",
            center && "flex min-h-[240px] items-center justify-center",
            className,
          )}
        >
          <ClientOnly>{preview}</ClientOnly>
        </div>
      </Tab>

      {/* `p-0` is safe here, unlike a bare code block: fumadocs pairs the
          panel's p-4 with `[&>figure:only-child]:-m-4`, and that selector does
          not match once the figure is wrapped in this div. */}
      <Tab value="Code" className="p-0">
        <div
          ref={setCodeNode}
          data-code-pane=""
          data-expanded={expanded ? "" : undefined}
          className="relative"
          style={
            height
              ? ({ "--preview-height": `${height}px` } as React.CSSProperties)
              : undefined
          }
        >
          {code}

          {canExpand &&
            (expanded ? (
              <div className="flex justify-center border-t border-fd-border bg-fd-card py-2">
                <ToggleButton expanded onClick={collapse} />
              </div>
            ) : (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-fd-card via-fd-card/90 to-transparent pt-12 pb-2.5">
                <ToggleButton onClick={() => setExpanded(true)} />
              </div>
            ))}
        </div>
      </Tab>
    </Tabs>
  );
}

function ToggleButton({
  expanded = false,
  onClick,
}: {
  expanded?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="pointer-events-auto inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-md border border-fd-border bg-fd-background px-3 text-xs font-medium text-fd-muted-foreground shadow-sm transition-colors hover:text-fd-foreground"
    >
      {expanded ? "Collapse" : "Expand"}
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className={cn("transition-transform", expanded && "rotate-180")}
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
}
