import React from "react"
import { useAdminTaxRates } from "medusa-react"

const TaxRates = () => {
  const {
    tax_rates,
    isLoading
  } = useAdminTaxRates()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {tax_rates && !tax_rates.length && (
        <span>No Tax Rates</span>
      )}
      {tax_rates && tax_rates.length > 0 && (
        <ul>
          {tax_rates.map((tax_rate) => (
            <li key={tax_rate.id}>{tax_rate.code}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TaxRates
