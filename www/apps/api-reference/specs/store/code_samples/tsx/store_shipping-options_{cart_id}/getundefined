import React from "react"
import { useCartShippingOptions } from "medusa-react"

type Props = {
  cartId: string
}

const ShippingOptions = ({ cartId }: Props) => {
  const { shipping_options, isLoading } =
    useCartShippingOptions(cartId)

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {shipping_options && !shipping_options.length && (
        <span>No shipping options</span>
      )}
      {shipping_options && (
        <ul>
          {shipping_options.map(
            (shipping_option) => (
              <li key={shipping_option.id}>
                {shipping_option.name}
              </li>
            )
          )}
        </ul>
      )}
    </div>
  )
}

export default ShippingOptions
