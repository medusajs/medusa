import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { json, useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/modals"
import { useShippingOptions } from "../../../hooks/api/shipping-options"
import { EditShippingOptionForm } from "./components/edit-region-form"
import { FulfillmentSetType } from "../common/constants"

export const LocationServiceZoneShippingOptionEdit = () => {
  const { t } = useTranslation()

  const { location_id, so_id } = useParams()

  const { shipping_options, isPending, isFetching, isError, error } =
    useShippingOptions({
      id: so_id,
      fields: "+service_zone.fulfillment_set.type",
    })

  const shippingOption = shipping_options?.find((so) => so.id === so_id)

  if (!isPending && !isFetching && !shippingOption) {
    throw json(
      { message: `Shipping option with ID ${so_id} was not found` },
      404
    )
  }

  if (isError) {
    throw error
  }

  const isPickup =
    shippingOption?.service_zone.fulfillment_set.type ===
    FulfillmentSetType.Pickup

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>
          {t(
            `stockLocations.${
              isPickup ? "pickupOptions" : "shippingOptions"
            }.edit.header`
          )}
        </Heading>
      </RouteDrawer.Header>
      {shippingOption && (
        <EditShippingOptionForm
          shippingOption={shippingOption}
          locationId={location_id!}
          type={
            shippingOption.service_zone.fulfillment_set
              .type as FulfillmentSetType
          }
        />
      )}
    </RouteDrawer>
  )
}
