import React from "react"
import { useAdminDeleteShippingOption } from "medusa-react"

type Props = {
  shippingOptionId: string
}

const ShippingOption = ({ shippingOptionId }: Props) => {
  const deleteShippingOption = useAdminDeleteShippingOption(
    shippingOptionId
  )
  // ...

  const handleDelete = () => {
    deleteShippingOption.mutate(void 0, {
      onSuccess: ({ id, object, deleted }) => {
        console.log(id)
      }
    })
  }

  // ...
}

export default ShippingOption
