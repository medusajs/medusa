import { createContext } from "react"
import type { ExtensionApi } from "../../dashboard-app/types"

export const ExtensionContext = createContext<ExtensionApi | null>(null)
