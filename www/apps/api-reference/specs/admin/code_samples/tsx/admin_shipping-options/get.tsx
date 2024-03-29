import React from "react"
import { useAdminShippingOptions } from "medusa-react"

const ShippingOptions = () => {
  const {
    shipping_options,
    isLoading
  } = useAdminShippingOptions()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {shipping_options && !shipping_options.length && (
        <span>No Shipping Options</span>
      )}
      {shipping_options && shipping_options.length > 0 && (
        <ul>
          {shipping_options.map((option) => (
            <li key={option.id}>{option.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ShippingOptions
