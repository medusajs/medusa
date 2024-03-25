import { useContext } from "react"
import { CreateDraftOrderContext } from "./context"

export const useCreateDraftOrder = () => {
  const context = useContext(CreateDraftOrderContext)

  if (!context) {
    throw new Error(
      "useCreateDraftOrder must be used within a CreateDraftOrderProvider"
    )
  }

  return context
}
