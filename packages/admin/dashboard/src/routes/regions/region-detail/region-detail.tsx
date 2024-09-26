import { useLoaderData, useParams } from "react-router-dom"

import { useRegion } from "../../../hooks/api/regions"
import { RegionCountrySection } from "./components/region-country-section"
import { RegionGeneralSection } from "./components/region-general-section"
import { regionLoader } from "./loader"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { SingleColumnPage } from "../../../components/layout/pages"
import { usePricePreferences } from "../../../hooks/api/price-preferences"
import { useMedusaApp } from "../../../providers/medusa-app-provider"

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
    { fields: "*payment_providers,*countries" },
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

  const { getWidgets } = useMedusaApp()

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
    <SingleColumnPage
      widgets={{
        before: getWidgets("region.details.before"),
        after: getWidgets("region.details.after"),
      }}
      data={region}
      hasOutlet
      showJSON
      showMetadata
    >
      <RegionGeneralSection
        region={region}
        pricePreferences={pricePreferences ?? []}
      />
      <RegionCountrySection region={region} />
    </SingleColumnPage>
  )
}
