import { json, useParams } from "react-router-dom"

import { RouteFocusModal } from "../../../components/modals"
import { useShippingOption } from "../../../hooks/api/shipping-options"
import { EditShippingOptionsPricingForm } from "./components/create-shipping-options-form"

export function LocationServiceZoneShippingOptionPricing() {
  const { so_id, location_id } = useParams()

  if (!so_id) {
    throw json({
      message: "Shipping Option ID paramater is missing",
      status: 404,
    })
  }

  const { shipping_option: shippingOption, isError, error } =
    useShippingOption(so_id, {
      fields: "*prices,*prices.price_rules",
    })

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal prev={`/settings/locations/${location_id}`}>
      {shippingOption && (
        <EditShippingOptionsPricingForm shippingOption={shippingOption} />
      )}
    </RouteFocusModal>
  )
}
