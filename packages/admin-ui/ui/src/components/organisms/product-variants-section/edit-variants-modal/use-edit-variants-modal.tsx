import React, { useContext } from "react"

type EditVariantsModalContextType = {
  onClose: () => void
}

export const EditVariantsModalContext =
  React.createContext<EditVariantsModalContextType | null>(null)

export const useEditVariantsModal = () => {
  const context = useContext(EditVariantsModalContext)

  if (context === null) {
    throw new Error(
      "useEditVariantsModal must be used within a EditVariantsModalProvicer"
    )
  }

  return context
}
