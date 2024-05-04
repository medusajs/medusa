import React from "react"
import { useAdminCreateSwap } from "medusa-react"

type Props = {
  orderId: string
}

const CreateSwap = ({ orderId }: Props) => {
  const createSwap = useAdminCreateSwap(orderId)
  // ...

  const handleCreate = (
    returnItems: {
      item_id: string,
      quantity: number
    }[]
  ) => {
    createSwap.mutate({
      return_items: returnItems
    }, {
      onSuccess: ({ order }) => {
        console.log(order.swaps)
      }
    })
  }

  // ...
}

export default CreateSwap
