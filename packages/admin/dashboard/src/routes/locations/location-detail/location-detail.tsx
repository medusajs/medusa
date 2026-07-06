import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { useStockLocation } from "../../../hooks/api/stock-locations"
import { LocationGeneralSection } from "./components/location-general-section"
import LocationsSalesChannelsSection from "./components/location-sales-channels-section/locations-sales-channels-section"
import { locationLoader } from "./loader"

import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer, detailPageDefaultEntries } from "../../../components/layout-composer"
import LocationsFulfillmentProvidersSection from "./components/location-fulfillment-providers-section/location-fulfillment-providers-section"
import { LOCATION_DETAILS_FIELD } from "./constants"

export const LocationDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof locationLoader>
  >

  const { location_id } = useParams()
  const {
    stock_location: location,
    isPending: isLoading,
    isError,
    error,
  } = useStockLocation(
    location_id!,
    { fields: LOCATION_DETAILS_FIELD },
    { initialData }
  )

  if (isLoading || !location) {
    return (
      <TwoColumnPageSkeleton mainSections={3} sidebarSections={2} showJSON />
    )
  }

  if (isError) {
    throw error
  }

  return (
    <LayoutComposer
      widgetsZonePrefix="location.details"
      preferredLayoutId={CORE_LAYOUT_IDS.TWO_COLUMN}
      data={location}
      sections={{
        main: (
          <>
            <LayoutComposer.Entry id="LocationGeneralSection">
              <LocationGeneralSection location={location} />
            </LayoutComposer.Entry>
            {detailPageDefaultEntries(location)}
          </>
        ),
        side: (
          <>
            <LayoutComposer.Entry id="LocationsSalesChannelsSection">
              <LocationsSalesChannelsSection location={location} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="LocationsFulfillmentProvidersSection">
              <LocationsFulfillmentProvidersSection location={location} />
            </LayoutComposer.Entry>
          </>
        ),
      }}
    />
  )
}
