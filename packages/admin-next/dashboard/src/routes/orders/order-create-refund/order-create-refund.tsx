import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/modals"
import { useOrder, useRefundReasons } from "../../../hooks/api"
import { DEFAULT_FIELDS } from "../order-detail/constants"
import { CreateRefundForm } from "./components/create-refund-form"

export const OrderCreateRefund = () => {
  const { t } = useTranslation()
  const params = useParams()
  const { order } = useOrder(params.id!, {
    fields: DEFAULT_FIELDS,
  })

  const {
    refund_reasons: refundReasons,
    isLoading: isRefundReasonsLoading,
    isError: isRefundReasonsError,
    error: refundReasonsError,
  } = useRefundReasons()

  if (isRefundReasonsError) {
    throw refundReasonsError
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("orders.payment.createRefund")}</Heading>
      </RouteDrawer.Header>

      {order && !isRefundReasonsLoading && refundReasons && (
        <CreateRefundForm order={order} refundReasons={refundReasons} />
      )}
    </RouteDrawer>
  )
}
