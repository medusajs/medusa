import React from "react"
import { useAdminDeletePriceListPrices } from "medusa-react"

const PriceList = (
  priceListId: string
) => {
  const deletePrices = useAdminDeletePriceListPrices(priceListId)
  // ...

  const handleDeletePrices = (priceIds: string[]) => {
    deletePrices.mutate({
      price_ids: priceIds
    }, {
      onSuccess: ({ ids, deleted, object }) => {
        console.log(ids)
      }
    })
  }

  // ...
}

export default PriceList
