import { createContext } from "react"
import { Feature } from "./types"

type FeatureContextValue = {
  isFeatureEnabled: (feature: Feature) => boolean
}

export const FeatureContext = createContext<FeatureContextValue | null>(null)
