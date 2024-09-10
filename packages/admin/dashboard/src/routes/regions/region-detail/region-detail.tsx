import { Outlet, useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { useRegion } from "../../../hooks/api/regions"
import { RegionCountrySection } from "./components/region-country-section"
import { RegionGeneralSection } from "./components/region-general-section"
import { regionLoader } from "./loader"

import after from "virtual:medusa/widgets/region/details/after"
import before from "virtual:medusa/widgets/region/details/before"
import { usePricePreferences } from "../../../hooks/api/price-preferences"

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

  // TODO: Move to loading.tsx and set as Suspense fallback for the route
  if (isLoading || isLoadingPreferences || !region) {
    return <div>Loading...</div>
  }

  if (isRegionError) {
    throw regionError
  }

  if (isPreferencesError) {
    throw preferencesError
  }

  return (
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component data={region} />
          </div>
        )
      })}
      <RegionGeneralSection
        region={region}
        pricePreferences={pricePreferences ?? []}
      />
      <RegionCountrySection region={region} />
      {after.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component data={region} />
          </div>
        )
      })}
      <JsonViewSection data={region} />
      <Outlet />
    </div>
  )
}
