import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { useRegion } from "../../../hooks/api/regions"
import { RegionCountrySection } from "./components/region-country-section"
import { RegionGeneralSection } from "./components/region-general-section"
import { regionLoader } from "./loader"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer, detailPageDefaultEntries } from "../../../components/layout-composer"
import { usePricePreferences } from "../../../hooks/api/price-preferences"
import { REGION_DETAIL_FIELDS } from "./constants"

export const RegionDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof regionLoader>
  >

  const { id } = useParams()
  const {
    region,
    isPending: isLoading,
    isError: isRegionError,
    error: regionError,
  } = useRegion(
    id!,
    { fields: REGION_DETAIL_FIELDS },
    {
      initialData,
    }
  )

  const {
    price_preferences: pricePreferences,
    isPending: isLoadingPreferences,
    isError: isPreferencesError,
    error: preferencesError,
  } = usePricePreferences(
    {
      attribute: "region_id",
      value: id,
    },
    { enabled: !!region }
  )

  if (isLoading || isLoadingPreferences || !region) {
    return <SingleColumnPageSkeleton sections={2} showJSON showMetadata />
  }

  if (isRegionError) {
    throw regionError
  }

  if (isPreferencesError) {
    throw preferencesError
  }

  return (
    <LayoutComposer
      widgetsZonePrefix="region.details"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      data={region}
      sections={{
        main: (
          <>
            <LayoutComposer.Entry id="RegionGeneralSection">
              <RegionGeneralSection
                region={region}
                pricePreferences={pricePreferences ?? []}
              />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="RegionCountrySection">
              <RegionCountrySection region={region} />
            </LayoutComposer.Entry>
            {detailPageDefaultEntries(region, { permissions: false })}
          </>
        ),
      }}
    />
  )
}
