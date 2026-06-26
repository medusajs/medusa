import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { useStockLocation } from "../../../hooks/api/stock-locations"
import { LocationGeneralSection } from "./components/location-general-section"
import LocationsSalesChannelsSection from "./components/location-sales-channels-section/locations-sales-channels-section"
import { locationLoader } from "./loader"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { MetadataSection } from "../../../components/common/metadata-section"
import { RequiredPermissionsSection } from "../../../components/common/required-permissions-section"
import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer } from "../../../components/layout-composer"
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
            <LocationGeneralSection location={location} />
            <MetadataSection data={location} />
            <JsonViewSection data={location} />
            <RequiredPermissionsSection />
          </>
        ),
        side: (
          <>
            <LocationsSalesChannelsSection location={location} />
            <LocationsFulfillmentProvidersSection location={location} />
          </>
        ),
      }}
    />
  )
}
