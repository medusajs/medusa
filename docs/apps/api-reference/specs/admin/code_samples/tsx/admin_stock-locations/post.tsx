import React from "react"
import { useAdminCreateStockLocation } from "medusa-react"

const CreateStockLocation = () => {
  const createStockLocation = useAdminCreateStockLocation()
  // ...

  const handleCreate = (name: string) => {
    createStockLocation.mutate({
      name,
    }, {
      onSuccess: ({ stock_location }) => {
        console.log(stock_location.id)
      }
    })
  }

  // ...
}

export default CreateStockLocation
