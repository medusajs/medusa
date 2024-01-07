import React from "react"
import { useAdminDeleteProductTaxRates } from "medusa-react"

type Props = {
  taxRateId: string
}

const TaxRate = ({ taxRateId }: Props) => {
  const removeProduct = useAdminDeleteProductTaxRates(taxRateId)
  // ...

  const handleRemoveProduct = (productIds: string[]) => {
    removeProduct.mutate({
      products: productIds,
    }, {
      onSuccess: ({ tax_rate }) => {
        console.log(tax_rate.products)
      }
    })
  }

  // ...
}

export default TaxRate
