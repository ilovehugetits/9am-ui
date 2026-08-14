import path from "node:path";
import { fileURLToPath } from "node:url";
import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * The repo root, two levels up. Every live preview imports out of `registry/`,
 * which sits outside this app — without pinning the root, Next infers it from
 * the nearest lockfile and either warns or traces the wrong file set on Vercel.
 */
const repoRoot = path.resolve(here, "../..");

const withMDX = createMDX();

const config: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: repoRoot,
  turbopack: { root: repoRoot },
  // Several links are built from registry metadata (`/docs/components/${name}`),
  // which typed routes cannot narrow to a literal union.
  typedRoutes: false,
};

export default withMDX(config);
