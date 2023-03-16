import { useAdminStockLocations } from "medusa-react"

const useStockLocations = () => {
  const { stock_locations } = useAdminStockLocations()

  const getLocationNameById = (locationId: string | null) =>
    stock_locations?.find((stock_location) => stock_location.id === locationId)
      ?.name

  return { stock_locations, getLocationNameById }
}

export default useStockLocations
