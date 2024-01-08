import React from "react"
import { useAdminCurrencies } from "medusa-react"

const Currencies = () => {
  const { currencies, isLoading } = useAdminCurrencies()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {currencies && !currencies.length && (
        <span>No Currencies</span>
      )}
      {currencies && currencies.length > 0 && (
        <ul>
          {currencies.map((currency) => (
            <li key={currency.code}>{currency.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Currencies
