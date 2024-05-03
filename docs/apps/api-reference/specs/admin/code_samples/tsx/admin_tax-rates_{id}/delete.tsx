import React from "react"
import { useAdminDeleteTaxRate } from "medusa-react"

type Props = {
  taxRateId: string
}

const TaxRate = ({ taxRateId }: Props) => {
  const deleteTaxRate = useAdminDeleteTaxRate(taxRateId)
  // ...

  const handleDelete = () => {
    deleteTaxRate.mutate(void 0, {
      onSuccess: ({ id, object, deleted }) => {
        console.log(id)
      }
    })
  }

  // ...
}

export default TaxRate
