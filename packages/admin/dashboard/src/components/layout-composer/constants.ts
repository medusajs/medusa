/**
 * The single top-bar slot a `LayoutComposer` portals its edit controls into
 * while editing. The matching `LayoutCustomizerSlot` is mounted in the shell's
 * top bar, next to the `CustomizerMenu` (the one trigger for every host).
 */
export const LAYOUT_CONTROLS_LOCATION = "topbar-controls"

/**
 * Stable identifier for each customizable host. The `CustomizerMenu` lists
 * these, and each `LayoutComposer` claims one via its `customizeId` prop so the
 * menu can drive it into edit mode. Add a new host by adding an id here, an
 * entry in the menu's host list, and a composer that claims it.
 */
export const CUSTOMIZE_IDS = {
  PAGE: "page",
  TOPBAR: "topbar",
  MAIN_SIDEBAR: "main-sidebar",
  SETTINGS_SIDEBAR: "settings-sidebar",
} as const

export type CustomizeId = (typeof CUSTOMIZE_IDS)[keyof typeof CUSTOMIZE_IDS]
