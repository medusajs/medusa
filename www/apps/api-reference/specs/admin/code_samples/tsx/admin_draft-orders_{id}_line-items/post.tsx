import React from "react"
import { useAdminDraftOrderAddLineItem } from "medusa-react"

type Props = {
  draftOrderId: string
}

const DraftOrder = ({ draftOrderId }: Props) => {
  const addLineItem = useAdminDraftOrderAddLineItem(
    draftOrderId
  )
  // ...

  const handleAdd = (quantity: number) => {
    addLineItem.mutate({
      quantity,
    }, {
      onSuccess: ({ draft_order }) => {
        console.log(draft_order.cart)
      }
    })
  }

  // ...
}

export default DraftOrder
