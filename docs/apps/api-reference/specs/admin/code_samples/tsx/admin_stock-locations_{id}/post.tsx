import React from "react"
import { useAdminUpdateStockLocation } from "medusa-react"

type Props = {
  stockLocationId: string
}

const StockLocation = ({ stockLocationId }: Props) => {
  const updateLocation = useAdminUpdateStockLocation(
    stockLocationId
  )
  // ...

  const handleUpdate = (
    name: string
  ) => {
    updateLocation.mutate({
      name
    }, {
      onSuccess: ({ stock_location }) => {
        console.log(stock_location.name)
      }
    })
  }
}

export default StockLocation
