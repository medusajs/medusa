import React from "react"
import { useAdminPaymentsCapturePayment } from "medusa-react"

type Props = {
  paymentId: string
}

const Payment = ({ paymentId }: Props) => {
  const capture = useAdminPaymentsCapturePayment(
    paymentId
  )
  // ...

  const handleCapture = () => {
    capture.mutate(void 0, {
      onSuccess: ({ payment }) => {
        console.log(payment.amount)
      }
    })
  }

  // ...
}

export default Payment
