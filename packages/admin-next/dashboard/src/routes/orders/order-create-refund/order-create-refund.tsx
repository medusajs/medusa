import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/modals"
import { usePayment, useRefundReasons } from "../../../hooks/api"
import { CreateRefundForm } from "./components/create-refund-form"

export const OrderCreateRefund = () => {
  const { t } = useTranslation()
  const params = useParams()
  const { payment, isLoading, isError, error } = usePayment(params.paymentId!)
  const {
    refund_reasons: refundReasons,
    isLoading: isRefundReasonsLoading,
    isError: isRefundReasonsError,
    error: refundReasonsError,
  } = useRefundReasons()

  if (isError) {
    throw error
  }

  if (isRefundReasonsError) {
    throw refundReasonsError
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("orders.payment.createRefund")}</Heading>
      </RouteDrawer.Header>

      {!isLoading && !isRefundReasonsLoading && payment && refundReasons && (
        <CreateRefundForm payment={payment} refundReasons={refundReasons} />
      )}
    </RouteDrawer>
  )
}
