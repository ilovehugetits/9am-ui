import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import type { ReactNode } from "react";
import { getExampleSource } from "@/lib/registry";
import { PreviewShell } from "./preview-shell";

/**
 * A live component example and the exact file that produced it.
 *
 * `children` is the example rendered for real — same import path a consumer
 * would write, resolved through tsconfig `paths` to `registry/`. `name` points
 * at that same file, whose text is shown in the Code tab. There is no second
 * copy of the snippet to keep in sync: the preview and the code are one file,
 * so an example that stops compiling breaks the docs build rather than quietly
 * documenting an API that no longer exists.
 *
 * Highlighting happens here, on the server; the tabs and the collapsed-height
 * behaviour live in `PreviewShell`.
 */
export function Preview({
  name,
  children,
  className,
  center = true,
}: {
  /** Path under `apps/docs/examples`, without the extension. */
  name: string;
  children: ReactNode;
  className?: string;
  /** Turn off for examples that need to fill the frame (viewport, app-shell). */
  center?: boolean;
}) {
  return (
    <PreviewShell
      className={className}
      center={center}
      preview={children}
      code={
        <DynamicCodeBlock
          lang="tsx"
          code={getExampleSource(name)}
          codeblock={{
            // The class is the handle PreviewShell uses to size and measure the
            // scroll area; see the [data-code-pane] rules in global.css.
            viewportProps: { className: "preview-code-viewport" },
          }}
        />
      }
    />
  );
}
