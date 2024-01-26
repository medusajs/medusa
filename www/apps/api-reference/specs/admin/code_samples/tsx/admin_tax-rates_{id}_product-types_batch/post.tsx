import React from "react"
import {
  useAdminCreateProductTypeTaxRates,
} from "medusa-react"

type Props = {
  taxRateId: string
}

const TaxRate = ({ taxRateId }: Props) => {
  const addProductTypes = useAdminCreateProductTypeTaxRates(
    taxRateId
  )
  // ...

  const handleAddProductTypes = (productTypeIds: string[]) => {
    addProductTypes.mutate({
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
