import { useParams } from "react-router-dom"

import { RouteFocusModal } from "../../../components/route-modal"
import { useShippingOptions } from "../../../hooks/api/shipping-options"
import { EditShippingOptionsPricingForm } from "./components/create-shipping-options-form"

export function ShippingOptionsEditPricing() {
  const { so_id } = useParams()

  const { shipping_options, isPending } = useShippingOptions({
    // TODO: change this when GET option by id endpoint is implemented
    id: [so_id],
    fields: "*prices,*prices.price_rules",
    limit: 999,
  })

  const shippingOption = shipping_options?.find((so) => so.id === so_id)

  if (!isPending && !shippingOption) {
    throw new Error(`Shipping option with id: ${so_id} not found`)
  }

  return (
    <RouteFocusModal>
      {shippingOption && (
        <EditShippingOptionsPricingForm shippingOption={shippingOption} />
      )}
    </RouteFocusModal>
  )
}
