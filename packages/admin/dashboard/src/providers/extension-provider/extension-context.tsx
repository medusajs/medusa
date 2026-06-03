import { createContext } from "react"
import { ExtensionApi } from "../../dashboard-app/types"

export const ExtensionContext = createContext<ExtensionApi | null>(null)
