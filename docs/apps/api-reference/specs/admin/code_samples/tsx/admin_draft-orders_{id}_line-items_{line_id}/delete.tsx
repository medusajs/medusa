import React from "react"
import { useAdminDraftOrderRemoveLineItem } from "medusa-react"

type Props = {
  draftOrderId: string
}

const DraftOrder = ({ draftOrderId }: Props) => {
  const deleteLineItem = useAdminDraftOrderRemoveLineItem(
    draftOrderId
  )
  // ...

  const handleDelete = (itemId: string) => {
    deleteLineItem.mutate(itemId, {
      onSuccess: ({ draft_order }) => {
        console.log(draft_order.cart)
      }
    })
  }

  // ...
}

export default DraftOrder
