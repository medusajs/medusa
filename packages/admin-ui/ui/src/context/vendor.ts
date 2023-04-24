import { Vendor } from "@medusajs/medusa"
import { useAdminStore } from "medusa-react"
import React, { useContext } from "react"

export const SelectedVendorContext = React.createContext<
  Vendor | null | undefined
>(null)

export const useSelectedVendor = () => {
  const { store } = useAdminStore()
  const selectedVendor = useContext(SelectedVendorContext)

  return {
    isStoreView: !selectedVendor,
    isVendorView: !!selectedVendor,
    selectedVendor: selectedVendor || store?.primary_vendor,
    isPrimary: selectedVendor?.id === store?.primary_vendor_id,
  }
}
