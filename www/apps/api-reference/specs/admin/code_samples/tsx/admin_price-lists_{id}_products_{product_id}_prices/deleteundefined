import React from "react"
import {
  useAdminDeletePriceListProductPrices
} from "medusa-react"

type Props = {
  priceListId: string
  productId: string
}

const PriceListProduct = ({
  priceListId,
  productId
}: Props) => {
  const deleteProductPrices = useAdminDeletePriceListProductPrices(
    priceListId,
    productId
  )
  // ...

  const handleDeleteProductPrices = () => {
    deleteProductPrices.mutate(void 0, {
      onSuccess: ({ ids, deleted, object }) => {
        console.log(ids)
      }
    })
  }

  // ...
}

export default PriceListProduct
