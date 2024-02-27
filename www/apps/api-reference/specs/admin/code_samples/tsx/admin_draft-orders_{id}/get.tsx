import React from "react"
import { useAdminDraftOrder } from "medusa-react"

type Props = {
  draftOrderId: string
}

const DraftOrder = ({ draftOrderId }: Props) => {
  const {
    draft_order,
    isLoading,
  } = useAdminDraftOrder(draftOrderId)

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {draft_order && <span>{draft_order.display_id}</span>}

    </div>
  )
}

export default DraftOrder
