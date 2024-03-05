import { useAdminRegion } from "medusa-react"
import { useParams } from "react-router-dom"
import { TaxDetailsSection } from "./components/tax-details-section"
import { TaxRatesSection } from "./components/tax-rates-section"

export const TaxDetails = () => {
  const { id } = useParams()

  const { region, isLoading, isError, error } = useAdminRegion(id!)

  if (isLoading || !region) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    <div className="flex flex-col gap-y-2">
      <TaxDetailsSection region={region} />
      <TaxRatesSection region={region} />
    </div>
  )
}
