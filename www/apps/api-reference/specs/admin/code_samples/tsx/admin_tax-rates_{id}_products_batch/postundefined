import React from "react"
import { useAdminCreateProductTaxRates } from "medusa-react"

type Props = {
  taxRateId: string
}

const TaxRate = ({ taxRateId }: Props) => {
  const addProduct = useAdminCreateProductTaxRates(taxRateId)
  // ...

  const handleAddProduct = (productIds: string[]) => {
    addProduct.mutate({
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
