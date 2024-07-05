import React from "react"
import { useAdminDraftOrderRegisterPayment } from "medusa-react"

type Props = {
  draftOrderId: string
}

const DraftOrder = ({ draftOrderId }: Props) => {
  const registerPayment = useAdminDraftOrderRegisterPayment(
    draftOrderId
  )
  // ...

  const handlePayment = () => {
    registerPayment.mutate(void 0, {
      onSuccess: ({ order }) => {
        console.log(order.id)
      }
    })
  }

  // ...
}

export default DraftOrder
