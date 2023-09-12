import { useTranslation } from "react-i18next"
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
  const { t } = useTranslation()
  if (swapAmount + manualRefund + swapRefund + returnRefund === 0) {
    return null
  }

  return (
    <>
      {!!swapAmount && (
        <DisplayTotal
          currency={currency}
          totalAmount={swapAmount}
          totalTitle={t("templates-total-for-swaps", "Total for Swaps")}
        />
      )}
      {!!swapRefund && (
        <DisplayTotal
          currency={currency}
          totalAmount={returnRefund}
          totalTitle={t("templates-refunded-for-swaps", "Refunded for Swaps")}
        />
      )}
      {!!returnRefund && (
        <DisplayTotal
          currency={currency}
          totalAmount={returnRefund}
          totalTitle={t(
            "templates-refunded-for-returns",
            "Refunded for Returns"
          )}
        />
      )}
      {!!manualRefund && (
        <DisplayTotal
          currency={currency}
          totalAmount={manualRefund}
          totalTitle={t("templates-manually-refunded", "Manually refunded")}
        />
      )}
      <DisplayTotal
        variant={"bold"}
        currency={currency}
        totalAmount={paidTotal - refundedTotal}
        totalTitle={t("templates-net-total", "Net Total")}
      />
    </>
  )
}
