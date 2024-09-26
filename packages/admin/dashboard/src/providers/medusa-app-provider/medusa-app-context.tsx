import { createContext } from "react"
import { MedusaApp } from "../../core/medusa-app/medusa-app"

type MedusaAppContextValue = MedusaApp["api"]

export const MedusaAppContext = createContext<MedusaAppContextValue | null>(
  null
)
