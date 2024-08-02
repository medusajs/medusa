import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/modals"
import { usePayment } from "../../../hooks/api"
import { CreateRefundForm } from "./components/create-refund-form"

export const OrderCreateRefund = () => {
  const { t } = useTranslation()
  const params = useParams()
  const { payment, isLoading, isError, error } = usePayment(params.paymentId!)

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("orders.payment.createRefund")}</Heading>
      </RouteDrawer.Header>

      {!isLoading && payment && <CreateRefundForm payment={payment} />}
    </RouteDrawer>
  )
}
