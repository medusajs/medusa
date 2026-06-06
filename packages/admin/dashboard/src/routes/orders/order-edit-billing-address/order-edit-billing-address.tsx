import { Heading } from "@zjedene-medusa/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/modals"
import { useOrder } from "../../../hooks/api"
import { DEFAULT_FIELDS } from "../order-detail/constants"
import { EditOrderBillingAddressForm } from "./components/edit-order-billing-address-form"

export const OrderEditBillingAddress = () => {
  const { t } = useTranslation()
  const params = useParams()

  const { order, isPending, isError, error } = useOrder(params.id!, {
    fields: DEFAULT_FIELDS,
  })

  if (!isPending && isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("orders.edit.billingAddress.title")}</Heading>
      </RouteDrawer.Header>

      {order && <EditOrderBillingAddressForm order={order} />}
    </RouteDrawer>
  )
}
