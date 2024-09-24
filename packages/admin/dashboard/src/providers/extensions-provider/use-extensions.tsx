import { useContext } from "react"
import { ExtensionsContext } from "./extensions-context"

export const useExtensions = () => {
  const context = useContext(ExtensionsContext)
  if (!context) {
    throw new Error("useExtensions must be used within a ExtensionsProvider")
  }
  return {
    getWidgets: context.api.getWidgets,
    getMenuItems: context.api.getMenuItems,
  }
}
