import { useAdminStore } from "medusa-react"
import { useAccount } from "../context/account"

export const useStorePermissions = () => {
  const { store } = useAdminStore()
  const { email } = useAccount()

  const isMarketHausStore = store && store?.type === "markethaus"
  const isDev = process.env.NODE_ENV === "development"
  const isSuperAdmin = email === "admin@market.haus"

  // We can add more permissions based things here.
  return {
    canCreateRegions: !isMarketHausStore || isDev || isSuperAdmin,
    canDeleteRegions: !isMarketHausStore || isDev || isSuperAdmin,
    canEditRegions: !isMarketHausStore || isDev || isSuperAdmin,
    canManageCurrencySettings: !isMarketHausStore || isDev || isSuperAdmin,
    canManageTaxSettings: !isMarketHausStore || isDev || isSuperAdmin,
    allowRegionPricing: !isMarketHausStore,
  }
}
