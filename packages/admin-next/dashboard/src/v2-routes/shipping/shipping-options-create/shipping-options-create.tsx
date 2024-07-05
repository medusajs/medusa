import { useLoaderData, useParams } from "react-router-dom"

import { RouteFocusModal } from "../../../components/route-modal"
import { CreateShippingOptionsForm } from "./components/create-shipping-options-form"
import { stockLocationLoader } from "./loader"

export function ShippingOptionsCreate() {
  const { fset_id, zone_id } = useParams()
  const { stock_location: stockLocation } = useLoaderData() as Awaited<
    ReturnType<typeof stockLocationLoader>
  >

  const zone = stockLocation.fulfillment_sets
    ?.find((f) => f.id === fset_id)
    ?.service_zones?.find((z) => z.id === zone_id)

  if (!zone) {
    throw new Error("Zone set doesn't exist")
  }

  return (
    <RouteFocusModal>
      <CreateShippingOptionsForm zone={zone} />
    </RouteFocusModal>
  )
}
