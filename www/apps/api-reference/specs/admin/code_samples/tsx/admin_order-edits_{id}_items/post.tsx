import React from "react"
import { useAdminOrderEditAddLineItem } from "medusa-react"

type Props = {
  orderEditId: string
}

const OrderEdit = ({ orderEditId }: Props) => {
  const addLineItem = useAdminOrderEditAddLineItem(
    orderEditId
  )

  const handleAddLineItem =
    (quantity: number, variantId: string) => {
      addLineItem.mutate({
        quantity,
        variant_id: variantId,
      }, {
        onSuccess: ({ order_edit }) => {
          console.log(order_edit.changes)
        }
      })
    }

  // ...
}

export default OrderEdit
