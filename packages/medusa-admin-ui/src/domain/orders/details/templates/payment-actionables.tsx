import React from "react"
import Button from "../../../../components/fundamentals/button"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"

export const PaymentActionables = ({
  order,
  capturePayment,
  showRefundMenu,
}) => {
  const notification = useNotification()
  const isSystemPayment = order?.payments?.some(
    (p) => p.provider_id === "system"
  )

  const { payment_status } = order!

  // Default label and action
  let label = "Capture payment"
  let action = () => {
    capturePayment.mutate(void {}, {
      onSuccess: () =>
        notification("Success", "Successfully captured payment", "success"),
      onError: (err) => notification("Error", getErrorMessage(err), "error"),
    })
  }
  const loading = capturePayment.isLoading

  let shouldShowNotice = false
  // If payment is a system payment, we want to show a notice
  if (payment_status === "awaiting" && isSystemPayment) {
    shouldShowNotice = true
  }

  if (payment_status === "requires_action" && isSystemPayment) {
    shouldShowNotice = true
  }

  switch (true) {
    case payment_status === "captured" ||
      payment_status === "partially_refunded": {
      label = "Refund"
      action = () => showRefundMenu()
      break
    }

    case shouldShowNotice: {
      action = () =>
        console.log(
          "TODO: Show alert indicating, that you are capturing a system payment"
        )
      break
    }

    case payment_status === "requires_action": {
      return null
    }
    default:
      break
  }

  return (
    <Button
      variant="secondary"
      size="small"
      onClick={action}
      loading={loading}
      className="min-w-[130px]"
    >
      {label}
    </Button>
  )
}
