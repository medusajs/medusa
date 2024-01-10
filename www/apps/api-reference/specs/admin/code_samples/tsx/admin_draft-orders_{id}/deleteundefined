import React from "react"
import { useAdminDeleteDraftOrder } from "medusa-react"

type Props = {
  draftOrderId: string
}

const DraftOrder = ({ draftOrderId }: Props) => {
  const deleteDraftOrder = useAdminDeleteDraftOrder(
    draftOrderId
  )
  // ...

  const handleDelete = () => {
    deleteDraftOrder.mutate(void 0, {
      onSuccess: ({ id, object, deleted }) => {
        console.log(id)
      }
    })
  }

  // ...
}

export default DraftOrder
