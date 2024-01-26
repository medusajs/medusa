import React from "react"
import { useAdminDiscounts } from "medusa-react"

const Discounts = () => {
  const { discounts, isLoading } = useAdminDiscounts()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {discounts && !discounts.length && (
        <span>No customers</span>
      )}
      {discounts && discounts.length > 0 && (
        <ul>
          {discounts.map((discount) => (
            <li key={discount.id}>{discount.code}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Discounts
