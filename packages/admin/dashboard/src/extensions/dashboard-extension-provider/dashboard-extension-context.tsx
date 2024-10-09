import { createContext } from "react"
import { DashboardExtensionManager } from "../dashboard-extension-manager"

type DasboardExtenstionContextValue = DashboardExtensionManager["api"]

export const DashboardExtensionContext =
  createContext<DasboardExtenstionContextValue | null>(null)
