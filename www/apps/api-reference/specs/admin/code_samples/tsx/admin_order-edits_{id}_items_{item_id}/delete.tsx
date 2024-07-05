import React from "react"
import { useAdminOrderEditDeleteLineItem } from "medusa-react"

type Props = {
  orderEditId: string
  itemId: string
}

const OrderEditLineItem = ({
  orderEditId,
  itemId
}: Props) => {
  const removeLineItem = useAdminOrderEditDeleteLineItem(
    orderEditId,
    itemId
  )

  const handleRemoveLineItem = () => {
    removeLineItem.mutate(void 0, {
      onSuccess: ({ order_edit }) => {
        console.log(order_edit.changes)
      }
    })
  }

  // ...
}

export default OrderEditLineItem
