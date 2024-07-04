import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/modals"
import { useTaxRegion } from "../../../hooks/api/tax-regions"
import { TaxRegionTaxRateCreateForm } from "./components/tax-region-tax-rate-create-form"

export const TaxRegionTaxRateCreate = () => {
  const { id, provinceId } = useParams()

  const { tax_region, isPending, isError, error } = useTaxRegion(
    provinceId || id!
  )

  const ready = !isPending && !!tax_region

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {ready && <TaxRegionTaxRateCreateForm taxRegion={tax_region} />}
    </RouteFocusModal>
  )
}
