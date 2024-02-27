import React from "react"
import { useAdminDraftOrderUpdateLineItem } from "medusa-react"

type Props = {
  draftOrderId: string
}

const DraftOrder = ({ draftOrderId }: Props) => {
  const updateLineItem = useAdminDraftOrderUpdateLineItem(
    draftOrderId
  )
  // ...

  const handleUpdate = (
    itemId: string,
    quantity: number
  ) => {
    updateLineItem.mutate({
      item_id: itemId,
      quantity,
    })
  }

  // ...
}

export default DraftOrder
