import { useParams, useSearchParams } from "react-router-dom"

import { RouteFocusModal } from "../../../components/modals"
import { useStockLocation } from "../../../hooks/api/stock-locations"
import { CreateShippingOptionsForm } from "./components/create-shipping-options-form"
import { LOC_CREATE_SHIPPING_OPTION_FIELDS } from "./constants"
import { FulfillmentSetType } from "../common/constants"
import { jsonResponse } from "../../../lib/json-response"

export function LocationServiceZoneShippingOptionCreate() {
  const { location_id, fset_id, zone_id } = useParams()
  const [searchParams] = useSearchParams()
  const isReturn = searchParams.has("is_return")

  const { stock_location, isPending, isFetching, isError, error } =
    useStockLocation(location_id!, {
      fields: LOC_CREATE_SHIPPING_OPTION_FIELDS,
    })

  const fulfillmentSet = stock_location?.fulfillment_sets?.find(
    (f) => f.id === fset_id
  )

  if (!isPending && !isFetching && !fulfillmentSet) {
    throw jsonResponse(
      { message: `Fulfillment set with ID ${fset_id} was not found` },
      404
    )
  }

  const zone = fulfillmentSet?.service_zones?.find((z) => z.id === zone_id)

  if (!isPending && !isFetching && !zone) {
    throw jsonResponse(
      { message: `Service zone with ID ${zone_id} was not found` },
      404
    )
  }

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal prev={`/settings/locations/${location_id}`}>
      {zone && (
        <CreateShippingOptionsForm
          zone={zone}
          isReturn={isReturn}
          locationId={location_id!}
          type={fulfillmentSet!.type as FulfillmentSetType}
        />
      )}
    </RouteFocusModal>
  )
}
