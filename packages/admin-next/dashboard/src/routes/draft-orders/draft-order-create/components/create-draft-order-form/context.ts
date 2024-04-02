import { createContext } from "react"
import { CreateDraftOrderContextValue } from "./types"

export const CreateDraftOrderContext =
  createContext<CreateDraftOrderContextValue | null>(null)
