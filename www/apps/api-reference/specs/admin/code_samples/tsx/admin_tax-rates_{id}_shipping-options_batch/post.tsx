import React from "react"
import { useAdminCreateShippingTaxRates } from "medusa-react"

type Props = {
  taxRateId: string
}

const TaxRate = ({ taxRateId }: Props) => {
  const addShippingOption = useAdminCreateShippingTaxRates(
    taxRateId
  )
  // ...

  const handleAddShippingOptions = (
    shippingOptionIds: string[]
  ) => {
    addShippingOption.mutate({
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
