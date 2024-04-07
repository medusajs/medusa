import { createContext } from "react"
import { CreatePromotionContextValue } from "./types"

export const CreatePromotionContext =
  createContext<CreatePromotionContextValue | null>(null)
