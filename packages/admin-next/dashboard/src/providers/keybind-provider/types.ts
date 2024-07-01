export type KeybindContextState = {}

export type Platform = "Mac" | "Windows" | "Linux"

export type Keys = {
  [key in Platform]?: string[]
}

export type ShortcutType =
  | "pageShortcut"
  | "settingShortcut"
  | "commandShortcut"

export type Shortcut = {
  keys: Keys
  type: ShortcutType
  label: string
  callback: () => void
  _defaultKeys?: Keys
}
