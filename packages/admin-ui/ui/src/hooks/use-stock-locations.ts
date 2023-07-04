import { useAdminStockLocations } from "medusa-react"
import { useEffect } from "react"
import { useFeatureFlag } from "../providers/feature-flag-provider"

const useStockLocations = () => {
  const { isFeatureEnabled } = useFeatureFlag()
  const isStockLocationsEnabled = isFeatureEnabled("stockLocationService")
  const { stock_locations, refetch } = useAdminStockLocations(
    {},
    {
      enabled: isStockLocationsEnabled,
    }
  )

  useEffect(() => {
    if (isStockLocationsEnabled) {
      void refetch()
    }
  }, [isStockLocationsEnabled, refetch])

  const getLocationNameById = (locationId: string | null) =>
    stock_locations?.find((stock_location) => stock_location.id === locationId)
      ?.name

  return { stock_locations, getLocationNameById }
}

export default useStockLocations
