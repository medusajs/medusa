import React from "react"
import { useAdminUpdateTaxRate } from "medusa-react"

type Props = {
  taxRateId: string
}

const TaxRate = ({ taxRateId }: Props) => {
  const updateTaxRate = useAdminUpdateTaxRate(taxRateId)
  // ...

  const handleUpdate = (
    name: string
  ) => {
    updateTaxRate.mutate({
      name
    }, {
      onSuccess: ({ tax_rate }) => {
        console.log(tax_rate.name)
      }
    })
  }

  // ...
}

export default TaxRate
