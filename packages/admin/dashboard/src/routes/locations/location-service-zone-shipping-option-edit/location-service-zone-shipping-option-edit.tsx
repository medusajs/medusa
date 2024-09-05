import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { json, useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/modals"
import { useShippingOptions } from "../../../hooks/api/shipping-options"
import { EditShippingOptionForm } from "./components/edit-region-form"

export const LocationServiceZoneShippingOptionEdit = () => {
  const { t } = useTranslation()

  const { location_id, so_id } = useParams()

  const { shipping_options, isPending, isError, error } = useShippingOptions({
    id: so_id,
  })

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
        <Heading>{t("stockLocations.shippingOptions.edit.header")}</Heading>
      </RouteDrawer.Header>
      {!isPending && shippingOption && (
        <EditShippingOptionForm
          shippingOption={shippingOption}
          locationId={location_id!}
        />
      )}
    </RouteDrawer>
  )
}
