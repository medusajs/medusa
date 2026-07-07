import { createContext } from "react"
import type { PermissionsContextValue } from "../../lib/permissions"

export const PermissionsContext =
  createContext<PermissionsContextValue | null>(null)
