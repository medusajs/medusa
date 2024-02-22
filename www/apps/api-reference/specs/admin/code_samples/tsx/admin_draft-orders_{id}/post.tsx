import React from "react"
import { useAdminUpdateDraftOrder } from "medusa-react"

type Props = {
  draftOrderId: string
}

const DraftOrder = ({ draftOrderId }: Props) => {
  const updateDraftOrder = useAdminUpdateDraftOrder(
    draftOrderId
  )
  // ...

  const handleUpdate = (email: string) => {
    updateDraftOrder.mutate({
      email,
    }, {
      onSuccess: ({ draft_order }) => {
        console.log(draft_order.id)
      }
    })
  }

  // ...
}

export default DraftOrder
