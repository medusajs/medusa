import { useLoaderData } from "react-router-dom"

import { RouteFocusModal } from "../../../components/route-modal"
import { CreateShippingForm } from "./components/create-shipping-form"
import { stockLocationLoader } from "./loader"

export function ShippingCreate() {
  const { stock_location: stockLocation } = useLoaderData() as Awaited<
    ReturnType<typeof stockLocationLoader>
  >

  return (
    <RouteFocusModal>
      <CreateShippingForm location={stockLocation} />
    </RouteFocusModal>
  )
}
