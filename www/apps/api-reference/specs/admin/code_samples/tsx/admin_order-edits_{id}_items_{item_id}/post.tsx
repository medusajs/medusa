import React from "react"
import { useAdminOrderEditUpdateLineItem } from "medusa-react"

type Props = {
  orderEditId: string
  itemId: string
}

const OrderEditItemChange = ({
  orderEditId,
  itemId
}: Props) => {
  const updateLineItem = useAdminOrderEditUpdateLineItem(
    orderEditId,
    itemId
  )

  const handleUpdateLineItem = (quantity: number) => {
    updateLineItem.mutate({
      quantity,
    }, {
      onSuccess: ({ order_edit }) => {
        console.log(order_edit.items)
      }
    })
  }

  // ...
}

export default OrderEditItemChange
