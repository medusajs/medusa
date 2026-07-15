import { createContext } from "react"
import { LayoutCustomizerHostValue } from "./customizer-host-provider"

export const LayoutCustomizerHostContext =
  createContext<LayoutCustomizerHostValue | null>(null)
