import React from "react"
import { useAdminUpdateReturnReason } from "medusa-react"

type Props = {
  returnReasonId: string
}

const ReturnReason = ({ returnReasonId }: Props) => {
  const updateReturnReason = useAdminUpdateReturnReason(
    returnReasonId
  )
  // ...

  const handleUpdate = (
    label: string
  ) => {
    updateReturnReason.mutate({
      label,
    }, {
      onSuccess: ({ return_reason }) => {
        console.log(return_reason.label)
      }
    })
  }

  // ...
}

export default ReturnReason
