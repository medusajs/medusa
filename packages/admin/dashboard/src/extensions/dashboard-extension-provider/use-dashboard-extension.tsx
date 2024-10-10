import { useContext } from "react"
import { DashboardExtensionContext } from "./dashboard-extension-context"

export const useDashboardExtension = () => {
  const context = useContext(DashboardExtensionContext)
  if (!context) {
    throw new Error(
      "useDashboardExtension must be used within a DashboardExtensionProvider"
    )
  }
  return context
}
