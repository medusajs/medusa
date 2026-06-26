/**
 * Named locations a `LayoutComposer` can portal its customizer controls into.
 * Each location corresponds to a `LayoutCustomizerSlot` mounted somewhere in
 * the shell.
 */
export const LAYOUT_TRIGGER_LOCATIONS = {
  /** The icon button slot in the app shell's top bar (default). */
  TOPBAR: "topbar",
  /**
   * A dedicated top-bar slot for edit-mode controls (Cancel/Save), kept
   * separate from `TOPBAR` so a composer triggered elsewhere can surface its
   * controls in the top bar without colliding with another composer's trigger.
   */
  TOPBAR_CONTROLS: "topbar-controls",
  /** A row inside the dropdown of the main sidebar's header. */
  SIDEBAR_HEADER: "sidebar-header",
} as const
