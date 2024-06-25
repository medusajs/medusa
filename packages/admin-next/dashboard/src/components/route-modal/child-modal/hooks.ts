import { useContext } from "react"
import { ChildModalContext } from "./child-modal-context"

export const useChildModal = () => {
  const context = useContext(ChildModalContext)

  if (!context) {
    throw new Error("useChildModal must be used within a ChildModalProvider")
  }

  return context
}
