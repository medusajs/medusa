import React from "react"
import { useAdminStockLocation } from "medusa-react"

type Props = {
  stockLocationId: string
}

const StockLocation = ({ stockLocationId }: Props) => {
  const {
    stock_location,
    isLoading
  } = useAdminStockLocation(stockLocationId)

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {stock_location && (
        <span>{stock_location.name}</span>
      )}
    </div>
  )
}

export default StockLocation
