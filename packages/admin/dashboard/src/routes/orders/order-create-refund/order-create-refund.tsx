import { Heading } from "@zjedene-medusa/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/modals"
import { useOrder, usePlugins } from "../../../hooks/api"
import { getLoyaltyPlugin } from "../../../lib/plugins"
import { OrderBalanceSettlementForm } from "../order-balance-settlement"
import { DEFAULT_FIELDS } from "../order-detail/constants"
import { CreateRefundForm } from "./components/create-refund-form"

export const OrderCreateRefund = () => {
  const { t } = useTranslation()
  const params = useParams()
  const { order } = useOrder(params.id!, {
    fields: DEFAULT_FIELDS,
  })

  const { plugins = [] } = usePlugins()
  const loyaltyPlugin = getLoyaltyPlugin(plugins)

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("orders.payment.createRefund")}</Heading>
      </RouteDrawer.Header>

      {order && !loyaltyPlugin && <CreateRefundForm order={order} />}
      {order && loyaltyPlugin && <OrderBalanceSettlementForm order={order} />}
    </RouteDrawer>
  )
}
