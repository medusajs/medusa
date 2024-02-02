import React from "react"
import {
  useAdminDeleteProductTypeTaxRates,
} from "medusa-react"

type Props = {
  taxRateId: string
}

const TaxRate = ({ taxRateId }: Props) => {
  const removeProductTypes = useAdminDeleteProductTypeTaxRates(
    taxRateId
  )
  // ...

  const handleRemoveProductTypes = (
    productTypeIds: string[]
  ) => {
    removeProductTypes.mutate({
      product_types: productTypeIds,
    }, {
      onSuccess: ({ tax_rate }) => {
        console.log(tax_rate.product_types)
      }
    })
  }

  // ...
}

export default TaxRate
