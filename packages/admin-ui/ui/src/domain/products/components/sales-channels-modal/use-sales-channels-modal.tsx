import { SalesChannel } from "@medusajs/medusa"
import React, { useContext } from "react"

type SalesChannelsModalContextType = {
  source: SalesChannel[]
  onClose: () => void
  onSave: (channels: SalesChannel[]) => void
}

export const SalesChannelsModalContext = React.createContext<SalesChannelsModalContextType | null>(
  null
)

export const useSalesChannelsModal = () => {
  const context = useContext(SalesChannelsModalContext)

  if (context === null) {
    throw new Error(
      "useSalesChannelsModal must be used within a SalesChannelsModalProvider"
    )
  }

  return context
}
