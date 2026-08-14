import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { githubUrl } from "./shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="font-display text-lg tracking-tight">
          9<span className="text-primary">AM</span> UI
        </span>
      ),
    },
    githubUrl,
    links: [
      { text: "Docs", url: "/docs", active: "nested-url" },
      { text: "Components", url: "/docs/components/button", active: "nested-url" },
    ],
  };
}
