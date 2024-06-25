import { createContext } from "react"
import { KeybindContextState } from "./types"

export const KeybindContext = createContext<KeybindContextState | null>(null)
