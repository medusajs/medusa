import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/route-modal"
import { useOrder } from "../../../hooks/api/orders"
import { TransferCustomerOrderOwnershipForm } from "./components/transfer-customer-order-ownership-form"

export const CustomerTransferOwnership = () => {
  const { t } = useTranslation()
  const { order_id } = useParams()

  const { order, isLoading, isError, error } = useOrder(order_id!)

  const ready = !isLoading && order

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("transferOwnership.header")}</Heading>
      </RouteDrawer.Header>
      {ready && <TransferCustomerOrderOwnershipForm order={order} />}
    </RouteDrawer>
  )
}
