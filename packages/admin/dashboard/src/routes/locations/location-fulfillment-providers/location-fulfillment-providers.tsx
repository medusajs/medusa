import { useParams } from "react-router-dom"

import { RouteFocusModal } from "../../../components/modals"
import { useStockLocation } from "../../../hooks/api/stock-locations"
import { LocationEditFulfillmentProvidersForm } from "./components/edit-fulfillment-providers-form"

export const LocationFulfillmentProviders = () => {
  const { location_id } = useParams()
  const { stock_location, isPending, isError, error } = useStockLocation(
    location_id!,
    { fields: "id,*fulfillment_providers" }
  )

  const ready = !isPending && !!stock_location

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {ready && (
        <LocationEditFulfillmentProvidersForm location={stock_location} />
      )}
    </RouteFocusModal>
  )
}
