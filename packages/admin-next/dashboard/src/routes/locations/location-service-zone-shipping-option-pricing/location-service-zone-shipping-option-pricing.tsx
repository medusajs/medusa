import { json, useParams } from "react-router-dom"

import { RouteFocusModal } from "../../../components/route-modal"
import { useShippingOptions } from "../../../hooks/api/shipping-options"
import { EditShippingOptionsPricingForm } from "./components/create-shipping-options-form"

export function LocationServiceZoneShippingOptionPricing() {
  const { so_id, location_id } = useParams()

  const { shipping_options, isPending } = useShippingOptions({
    // TODO: change this when GET option by id endpoint is implemented
    id: [so_id!],
    fields: "*prices,*prices.price_rules",
  })

  const shippingOption = shipping_options?.find((so) => so.id === so_id)

  if (!isPending && !shippingOption) {
    throw json(`Shipping option with id: ${so_id} not found`, { status: 404 })
  }

  return (
    <RouteFocusModal prev={`/settings/locations/${location_id}`}>
      {shippingOption && (
        <EditShippingOptionsPricingForm shippingOption={shippingOption} />
      )}
    </RouteFocusModal>
  )
}
