import React from "react"
import { useAdminCapturePayment } from "medusa-react"

type Props = {
  orderId: string
}

const Order = ({ orderId }: Props) => {
  const capturePayment = useAdminCapturePayment(
    orderId
  )
  // ...

  const handleCapture = () => {
    capturePayment.mutate(void 0, {
      onSuccess: ({ order }) => {
        console.log(order.status)
      }
    })
  }

  // ...
}

export default Order
