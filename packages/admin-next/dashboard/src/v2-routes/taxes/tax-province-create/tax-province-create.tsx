import { useParams } from "react-router-dom"
import * as zod from "zod"
import { RouteFocusModal } from "../../../components/route-modal"
import { useTaxRegion } from "../../../hooks/api/tax-regions"
import { TaxRegionCreateForm } from "../common/components/tax-region-create-form"

const CreateTaxProvinceForm = zod.object({
  province_code: zod.string(),
  country_code: zod.string(),
  parent_id: zod.string(),
  name: zod.string(),
  code: zod.string().optional(),
  rate: zod.number(),
  is_combinable: zod.boolean().default(false),
})

export const TaxProvinceCreate = () => {
  const { id } = useParams()

  const { tax_region: taxRegion } = useTaxRegion(
    id!,
    {},
    {
      enabled: !!id,
    }
  )

  return (
    <RouteFocusModal>
      <TaxRegionCreateForm
        taxRegion={taxRegion}
        formSchema={CreateTaxProvinceForm}
      />
    </RouteFocusModal>
  )
}
