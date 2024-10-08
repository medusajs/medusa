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
  _defaultKeys?: Keys
} & (
  | {
      callback: () => void
      to?: never
    }
  | {
      to: string
      callback?: never
    }
)
