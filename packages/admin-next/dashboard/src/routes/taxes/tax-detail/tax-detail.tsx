import { useAdminRegion } from "medusa-react"
import { Outlet, useLoaderData, useParams } from "react-router-dom"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { TaxCountriesSection } from "./components/tax-countries-section"
import { TaxDefaultTaxRateSection } from "./components/tax-default-tax-rate-section"
import { TaxDetailsSection } from "./components/tax-general-section"
import { TaxRatesSection } from "./components/tax-rates-section"
import { taxRegionLoader } from "./loader"

export const TaxDetail = () => {
  const { id } = useParams()
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof taxRegionLoader>
  >

  const { region, isLoading, isError, error } = useAdminRegion(id!, {
    initialData,
  })

  if (isLoading || !region) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="grid grid-cols-1 gap-x-4 xl:grid-cols-[1fr,400px]">
        <div className="flex flex-col gap-y-2">
          <TaxDetailsSection region={region} />
          <TaxRatesSection region={region} />
          <div className="flex flex-col gap-y-2 xl:hidden">
            <TaxDefaultTaxRateSection region={region} />
            <TaxCountriesSection region={region} />
          </div>
          <JsonViewSection data={region} />
        </div>
        <div className="hidden flex-col gap-y-2 xl:flex">
          <TaxDefaultTaxRateSection region={region} />
          <TaxCountriesSection region={region} />
        </div>
      </div>
      <Outlet />
    </div>
  )
}
