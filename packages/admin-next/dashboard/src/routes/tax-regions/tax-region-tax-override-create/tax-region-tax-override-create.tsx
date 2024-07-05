import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/modals"
import { useTaxRegion } from "../../../hooks/api/tax-regions"
import { TaxRegionCreateTaxOverrideForm } from "./components/tax-region-override-create-form"

export const TaxRegionCreateTaxOverride = () => {
  const { id } = useParams()

  const { tax_region, isPending, isError, error } = useTaxRegion(id!)

  const ready = !isPending && !!tax_region

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {ready && <TaxRegionCreateTaxOverrideForm taxRegion={tax_region} />}
    </RouteFocusModal>
  )
}
