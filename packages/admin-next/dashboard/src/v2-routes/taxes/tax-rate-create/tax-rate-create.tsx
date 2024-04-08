import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/route-modal"
import { useTaxRegion } from "../../../hooks/api/tax-regions"
import { TaxRateCreateForm } from "./components"

export const TaxRateCreate = () => {
  const params = useParams()
  const { t } = useTranslation()

  const { tax_region: taxRegion } = useTaxRegion(params.id!)

  return (
    taxRegion && (
      <RouteFocusModal>
        <TaxRateCreateForm taxRegion={taxRegion} />
      </RouteFocusModal>
    )
  )
}
