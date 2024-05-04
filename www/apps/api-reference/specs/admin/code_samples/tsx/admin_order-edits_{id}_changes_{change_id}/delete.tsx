import React from "react"
import { useAdminDeleteOrderEditItemChange } from "medusa-react"

type Props = {
  orderEditId: string
  itemChangeId: string
}

const OrderEditItemChange = ({
  orderEditId,
  itemChangeId
}: Props) => {
  const deleteItemChange = useAdminDeleteOrderEditItemChange(
    orderEditId,
    itemChangeId
  )

  const handleDeleteItemChange = () => {
    deleteItemChange.mutate(void 0, {
      onSuccess: ({ id, object, deleted }) => {
        console.log(id)
      }
    })
  }

  // ...
}

export default OrderEditItemChange
