import React from "react"
import { useAdminCancelReturn } from "medusa-react"

type Props = {
  returnId: string
}

const Return = ({ returnId }: Props) => {
  const cancelReturn = useAdminCancelReturn(
    returnId
  )
  // ...

  const handleCancel = () => {
    cancelReturn.mutate(void 0, {
      onSuccess: ({ order }) => {
        console.log(order.returns)
      }
    })
  }

  // ...
}

export default Return
