import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import { appDescription, appName } from "@/lib/shared";
import "./global.css";

/** Vercel injects the production domain at build time; localhost otherwise. */
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${appName} — the design language behind every 9AM script`,
    template: `%s · ${appName}`,
  },
  description: appDescription,
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen antialiased">
        {/* defaultTheme dark: the kit ships dark, and every component was drawn
            against the dark palette first. */}
        <RootProvider theme={{ defaultTheme: "dark" }}>{children}</RootProvider>
      </body>
    </html>
  );
}
