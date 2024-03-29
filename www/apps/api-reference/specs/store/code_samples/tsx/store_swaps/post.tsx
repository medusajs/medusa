import React from "react"
import { useCreateSwap } from "medusa-react"

type Props = {
  orderId: string
}

type CreateData = {
  return_items: {
    item_id: string
    quantity: number
  }[]
  additional_items: {
    variant_id: string
    quantity: number
  }[]
  return_shipping_option: string
}

const CreateSwap = ({
  orderId
}: Props) => {
  const createSwap = useCreateSwap()
  // ...

  const handleCreate = (
    data: CreateData
  ) => {
    createSwap.mutate({
      ...data,
      order_id: orderId
    }, {
      onSuccess: ({ swap }) => {
        console.log(swap.id)
      }
    })
  }

  // ...
}

export default CreateSwap
