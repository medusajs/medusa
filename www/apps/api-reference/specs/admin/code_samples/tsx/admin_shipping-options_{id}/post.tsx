import React from "react"
import { useAdminUpdateShippingOption } from "medusa-react"

type Props = {
  shippingOptionId: string
}

const ShippingOption = ({ shippingOptionId }: Props) => {
  const updateShippingOption = useAdminUpdateShippingOption(
    shippingOptionId
  )
  // ...

  const handleUpdate = (
    name: string,
    requirements: {
      id: string,
      type: string,
      amount: number
    }[]
  ) => {
    updateShippingOption.mutate({
      name,
      requirements
    }, {
      onSuccess: ({ shipping_option }) => {
        console.log(shipping_option.requirements)
      }
    })
  }

  // ...
}

export default ShippingOption
