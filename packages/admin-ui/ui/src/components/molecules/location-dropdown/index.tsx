import { useEffect, useMemo } from "react"

import { NextSelect } from "../select/next-select"
import { StockLocationDTO } from "@medusajs/types"
import { useAdminStockLocations } from "medusa-react"

const LocationDropdown = ({
  selectedLocation,
  onChange,
}: {
  selectedLocation?: string
  onChange: (id: string) => void
}) => {
  const { stock_locations: locations, isLoading } = useAdminStockLocations()

  useEffect(() => {
    if (!selectedLocation && !isLoading && locations?.length) {
      onChange(locations[0].id)
    }
  }, [isLoading, locations, onChange, selectedLocation])

  const selectedLocObj = useMemo(() => {
    if (!isLoading && locations) {
      return (
        locations.find((l: StockLocationDTO) => l.id === selectedLocation) ??
        locations[0]
      )
    }
  }, [selectedLocation, locations, isLoading])

  if (isLoading || !locations || !selectedLocObj) {
    return null
  }

  return (
    <NextSelect
      isMulti={false}
      onChange={(loc) => {
        onChange(loc!.value)
      }}
      options={locations.map((l: StockLocationDTO) => ({
        label: l.name,
        value: l.id,
      }))}
      value={{ value: selectedLocObj.id, label: selectedLocObj.name }}
    />
  )
}

export default LocationDropdown
