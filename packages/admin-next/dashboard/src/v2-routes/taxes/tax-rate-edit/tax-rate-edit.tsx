import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/route-modal"
import { useTaxRate } from "../../../hooks/api/tax-rates"
import { useTaxRegion } from "../../../hooks/api/tax-regions"
import { TaxRateEditForm } from "./components"

export const TaxRateEdit = () => {
  const params = useParams()

  const { tax_region: taxRegion } = useTaxRegion(params.id!)
  const {
    tax_rate: taxRate,
    isLoading,
    isError,
    error,
  } = useTaxRate(params.taxRateId!)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    taxRegion &&
    taxRate && (
      <RouteFocusModal>
        <TaxRateEditForm taxRegion={taxRegion} taxRate={taxRate} />
      </RouteFocusModal>
    )
  )
}
