import React from "react"
import { useShippingOptions } from "medusa-react"

const ShippingOptions = () => {
  const {
    shipping_options,
    isLoading,
  } = useShippingOptions()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {shipping_options?.length &&
        shipping_options?.length > 0 && (
        <ul>
          {shipping_options?.map((shipping_option) => (
            <li key={shipping_option.id}>
              {shipping_option.id}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ShippingOptions
