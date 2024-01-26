import React from "react"
import { useReturnReason } from "medusa-react"

type Props = {
  returnReasonId: string
}

const ReturnReason = ({ returnReasonId }: Props) => {
  const {
    return_reason,
    isLoading
  } = useReturnReason(
    returnReasonId
  )

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {return_reason && <span>{return_reason.label}</span>}
    </div>
  )
}

export default ReturnReason
