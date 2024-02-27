import React from "react"
import { useAdminShippingOption } from "medusa-react"

type Props = {
  shippingOptionId: string
}

const ShippingOption = ({ shippingOptionId }: Props) => {
  const {
    shipping_option,
    isLoading
  } = useAdminShippingOption(
    shippingOptionId
  )

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {shipping_option && <span>{shipping_option.name}</span>}
    </div>
  )
}

export default ShippingOption
