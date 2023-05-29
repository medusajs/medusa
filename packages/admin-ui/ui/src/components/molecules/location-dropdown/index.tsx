import { useEffect, useMemo } from "react"
import { useAdminStockLocations } from "medusa-react"
import { NextSelect } from "../select/next-select"

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
      return locations.find((l) => l.id === selectedLocation) ?? locations[0]
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
      options={locations.map((l) => ({
        label: l.name,
        value: l.id,
      }))}
      value={{ value: selectedLocObj.id, label: selectedLocObj.name }}
    />
  )
}

export default LocationDropdown
