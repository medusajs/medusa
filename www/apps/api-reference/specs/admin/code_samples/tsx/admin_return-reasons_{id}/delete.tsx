import React from "react"
import { useAdminDeleteReturnReason } from "medusa-react"

type Props = {
  returnReasonId: string
}

const ReturnReason = ({ returnReasonId }: Props) => {
  const deleteReturnReason = useAdminDeleteReturnReason(
    returnReasonId
  )
  // ...

  const handleDelete = () => {
    deleteReturnReason.mutate(void 0, {
      onSuccess: ({ id, object, deleted }) => {
        console.log(id)
      }
    })
  }

  // ...
}

export default ReturnReason
