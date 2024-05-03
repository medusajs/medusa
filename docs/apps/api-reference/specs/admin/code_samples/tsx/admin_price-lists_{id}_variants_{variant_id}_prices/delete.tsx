import React from "react"
import {
  useAdminDeletePriceListVariantPrices
} from "medusa-react"

type Props = {
  priceListId: string
  variantId: string
}

const PriceListVariant = ({
  priceListId,
  variantId
}: Props) => {
  const deleteVariantPrices = useAdminDeletePriceListVariantPrices(
    priceListId,
    variantId
  )
  // ...

  const handleDeleteVariantPrices = () => {
    deleteVariantPrices.mutate(void 0, {
      onSuccess: ({ ids, deleted, object }) => {
        console.log(ids)
      }
    })
  }

  // ...
}

export default PriceListVariant
