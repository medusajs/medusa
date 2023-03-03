import React from "react"
import { DisplayTotal } from "./display-total"

export const PaymentDetails = ({
  currency,
  swapAmount,
  manualRefund,
  swapRefund,
  returnRefund,
  paidTotal,
  refundedTotal,
}) => {
  if (swapAmount + manualRefund + swapRefund + returnRefund === 0) {
    return null
  }

  return (
    <>
      {!!swapAmount && (
        <DisplayTotal
          currency={currency}
          totalAmount={swapAmount}
          totalTitle={"Total for Swaps"}
        />
      )}
      {!!swapRefund && (
        <DisplayTotal
          currency={currency}
          totalAmount={returnRefund}
          totalTitle={"Refunded for Swaps"}
        />
      )}
      {!!returnRefund && (
        <DisplayTotal
          currency={currency}
          totalAmount={returnRefund}
          totalTitle={"Refunded for Returns"}
        />
      )}
      {!!manualRefund && (
        <DisplayTotal
          currency={currency}
          totalAmount={manualRefund}
          totalTitle={"Manually refunded"}
        />
      )}
      <DisplayTotal
        variant={"bold"}
        currency={currency}
        totalAmount={paidTotal - refundedTotal}
        totalTitle={"Net Total"}
      />
    </>
  )
}
