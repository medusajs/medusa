import { useAdminRegion } from "medusa-react"
import { useParams } from "react-router-dom"
import { TaxDetailsSection } from "../../components/tax-details-section"
import { TaxRatesSection } from "../../components/tax-rates-section"

export const TaxDetails = () => {
  const { id } = useParams()

  const { region, isLoading, isError, error } = useAdminRegion(id!)

  if (isLoading) {
    return <div>Loading</div>
  }

  if (isError || !region) {
    const err = error ? JSON.parse(JSON.stringify(error)) : null
    return (
      <div>
        {(err as Error & { status: number })?.status === 404 ? (
          <div>Not found</div>
        ) : (
          <div>Something went wrong!</div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-2">
      <TaxDetailsSection region={region} />
      <TaxRatesSection />
    </div>
  )
}
