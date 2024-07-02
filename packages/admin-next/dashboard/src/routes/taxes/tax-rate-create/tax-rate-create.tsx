import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/modals"
import { useTaxRegion } from "../../../hooks/api/tax-regions"
import { TaxRateCreateForm } from "./components"

export const TaxRateCreate = () => {
  const params = useParams()
  const { tax_region: taxRegion, isError, error } = useTaxRegion(params.id!)

  if (isError) {
    throw error
  }

  return (
    taxRegion && (
      <RouteFocusModal>
        <TaxRateCreateForm taxRegion={taxRegion} />
      </RouteFocusModal>
    )
  )
}
