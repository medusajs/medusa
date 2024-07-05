import React from "react"
import { useAdminTaxRate } from "medusa-react"

type Props = {
  taxRateId: string
}

const TaxRate = ({ taxRateId }: Props) => {
  const { tax_rate, isLoading } = useAdminTaxRate(taxRateId)

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {tax_rate && <span>{tax_rate.code}</span>}
    </div>
  )
}

export default TaxRate
