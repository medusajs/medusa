import React from "react"
import { useAdminDeleteShippingTaxRates } from "medusa-react"

type Props = {
  taxRateId: string
}

const TaxRate = ({ taxRateId }: Props) => {
  const removeShippingOptions = useAdminDeleteShippingTaxRates(
    taxRateId
  )
  // ...

  const handleRemoveShippingOptions = (
    shippingOptionIds: string[]
  ) => {
    removeShippingOptions.mutate({
      shipping_options: shippingOptionIds,
    }, {
      onSuccess: ({ tax_rate }) => {
        console.log(tax_rate.shipping_options)
      }
    })
  }

  // ...
}

export default TaxRate
