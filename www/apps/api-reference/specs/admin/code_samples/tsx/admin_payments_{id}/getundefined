import React from "react"
import { useAdminPayment } from "medusa-react"

type Props = {
  paymentId: string
}

const Payment = ({ paymentId }: Props) => {
  const {
    payment,
    isLoading,
  } = useAdminPayment(paymentId)

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {payment && <span>{payment.amount}</span>}

    </div>
  )
}

export default Payment
