import React from "react"
import { useAdminStockLocations } from "medusa-react"

function StockLocations() {
  const {
    stock_locations,
    isLoading
  } = useAdminStockLocations()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {stock_locations && !stock_locations.length && (
        <span>No Locations</span>
      )}
      {stock_locations && stock_locations.length > 0 && (
        <ul>
          {stock_locations.map(
            (location) => (
              <li key={location.id}>{location.name}</li>
            )
          )}
        </ul>
      )}
    </div>
  )
}

export default StockLocations
