import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { json, useParams, useSearchParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/route-modal"
import { EditShippingOptionForm } from "./components/edit-region-form"
import { useShippingOptions } from "../../../hooks/api/shipping-options"

export const ShippingOptionEdit = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()

  const { location_id, fset_id, zone_id, so_id } = useParams()
  const isReturn = searchParams.has("is_return")

  const { shipping_options, isPending, isError, error } = useShippingOptions()

  const shippingOption = shipping_options?.find((so) => so.id === so_id)

  if (isError) {
    throw error
  }

  if (!isPending && !shippingOption) {
    throw json(
      { message: `Shipping option with ID ${so_id} was not found` },
      404
    )
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("shipping.shippingOptions.edit.title")}</Heading>
      </RouteDrawer.Header>
      {!isPending && shippingOption && (
        <EditShippingOptionForm
          shippingOption={shippingOption}
          isReturn={isReturn}
        />
      )}
    </RouteDrawer>
  )
}
