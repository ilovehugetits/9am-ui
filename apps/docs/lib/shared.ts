export const appName = "9AM UI";
export const appDescription =
  "The shared design language, NUI plumbing and FiveM CEF workarounds behind every 9AM Studios script.";

export const docsRoute = "/docs";
export const docsImageRoute = "/og/docs";
export const docsContentRoute = "/llms.mdx/docs";

export const gitConfig = {
  user: "ilovehugetits",
  repo: "9am-ui",
  branch: "main",
};

export const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

/** The registry URL consumers put in their components.json. */
export const registryUrl = `https://raw.githubusercontent.com/${gitConfig.user}/${gitConfig.repo}/${gitConfig.branch}/r/{name}.json`;
