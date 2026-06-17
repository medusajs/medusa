import { useContext } from "react"
import type { ExtensionApi } from "../../dashboard-app/types"
import { ExtensionContext } from "./extension-context"

export const useExtension = (): ExtensionApi => {
  const context = useContext(ExtensionContext)
  if (!context) {
    throw new Error("useExtension must be used within a ExtensionProvider")
  }
  return context
}
