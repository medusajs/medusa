import { Heading } from "@zjedene-medusa/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/modals"
import { useOrder } from "../../../hooks/api"
import { DEFAULT_FIELDS } from "../order-detail/constants"
import { EditOrderShippingAddressForm } from "./components/edit-order-shipping-address-form"

export const OrderEditShippingAddress = () => {
  const { t } = useTranslation()
  const params = useParams()

  const { order, isPending, isError } = useOrder(params.id!, {
    fields: DEFAULT_FIELDS,
  })

  if (!isPending && isError) {
    throw new Error("Order not found")
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("orders.edit.shippingAddress.title")}</Heading>
      </RouteDrawer.Header>

      {order && <EditOrderShippingAddressForm order={order} />}
    </RouteDrawer>
  )
}
