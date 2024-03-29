import React from "react"
import { useAdminProcessSwapPayment } from "medusa-react"

type Props = {
  orderId: string,
  swapId: string
}

const Swap = ({
  orderId,
  swapId
}: Props) => {
  const processPayment = useAdminProcessSwapPayment(
    orderId
  )
  // ...

  const handleProcessPayment = () => {
    processPayment.mutate(swapId, {
      onSuccess: ({ order }) => {
        console.log(order.swaps)
      }
    })
  }

  // ...
}

export default Swap
