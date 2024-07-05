import React from "react"
import { useAdminDeletePriceListProductsPrices } from "medusa-react"

type Props = {
  priceListId: string
}

const PriceList = ({
  priceListId
}: Props) => {
  const deleteProductsPrices = useAdminDeletePriceListProductsPrices(
    priceListId
  )
  // ...

  const handleDeleteProductsPrices = (productIds: string[]) => {
    deleteProductsPrices.mutate({
      product_ids: productIds
    }, {
      onSuccess: ({ ids, deleted, object }) => {
        console.log(ids)
      }
    })
  }

  // ...
}

export default PriceList
