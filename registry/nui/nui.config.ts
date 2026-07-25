/**
 * Per-script configuration for the 9AM NUI layer.
 *
 * This is the ONE kit file you are expected to edit after installing.
 * `bunx 9am-ui check` deliberately skips it — everything else should stay as
 * shipped so fixes keep flowing down from the registry.
 */
export const nuiConfig = {
  /**
   * Resource name used to build the `https://<resource>/<callback>` URL.
   *
   * In CEF this is read from `window.GetParentResourceName()` and this value is
   * never touched; it only applies when the app runs as a plain browser page
   * (`bun run start`), where it just needs to be something recognisable in the
   * network tab.
   */
  resourceName: "9am-script",

  /** localStorage key the theme toggle persists to. Namespaced per script so
   *  two 9AM NUIs open in the same CEF context can't stomp each other. */
  themeStorageKey: "9am-script:theme",

  /** Theme used on first run, before the player has toggled anything. */
  defaultTheme: "dark" as "light" | "dark",
} as const;
