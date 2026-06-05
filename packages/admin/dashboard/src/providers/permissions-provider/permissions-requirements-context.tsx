import { createContext } from "react"
import type { PermissionsRequirementsContextValue } from "../../lib/permissions"

export const PermissionsRequirementsContext =
  createContext<PermissionsRequirementsContextValue | null>(null)
