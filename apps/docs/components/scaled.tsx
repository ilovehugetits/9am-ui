import type { ReactNode } from "react";

/**
 * Shrink a fixed-size example to fit the docs column.
 *
 * `@9am/app-shell` is deliberately a fixed 1280×720 panel — see its page for
 * why — which is wider than the prose column it has to be shown in. Scaling
 * the whole thing keeps the real proportions visible; laying it out fluidly
 * would misrepresent the one property the component exists to guarantee.
 *
 * This lives in the docs rather than in the example file so the code a reader
 * copies is the component as they would actually use it.
 */
export function Scaled({
  width,
  height,
  children,
}: {
  width: number;
  height: number;
  children: ReactNode;
}) {
  // The outer box reserves the scaled footprint; the inner box renders at full
  // size and is transformed down into it.
  const scale = 0.52;

  return (
    <div
      className="relative mx-auto overflow-hidden"
      style={{ width: width * scale, height: height * scale }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ width, height, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}
