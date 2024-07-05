import { Heading } from "@medusajs/ui"
import { useAdminOrder } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { TransferOrderOwnershipForm } from "./components/transfer-order-ownership-form"

export const OrderTransferOwnership = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { order, isLoading, isError, error } = useAdminOrder(id!)

  const ready = !isLoading && order

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("transferOwnership.header")}</Heading>
      </RouteDrawer.Header>
      {ready && <TransferOrderOwnershipForm order={order} />}
    </RouteDrawer>
  )
}
