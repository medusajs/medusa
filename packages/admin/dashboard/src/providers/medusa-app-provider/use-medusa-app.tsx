import { useContext } from "react"
import { MedusaAppContext } from "./medusa-app-context"

export const useMedusaApp = () => {
  const context = useContext(MedusaAppContext)
  if (!context) {
    throw new Error("useMedusaApp must be used within a MedusaAppProvider")
  }
  return context
}
