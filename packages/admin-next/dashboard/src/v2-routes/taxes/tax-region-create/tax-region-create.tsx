import * as zod from "zod"
import { RouteFocusModal } from "../../../components/route-modal"
import { TaxRegionCreateForm } from "../tax-province-create/components"

const CreateTaxRegionForm = zod.object({
  province_code: zod.string().optional(),
  country_code: zod.string(),
  parent_id: zod.string().optional(),

  name: zod.string(),
  code: zod.string().optional(),
  rate: zod.number(),
  is_combinable: zod.boolean().default(false),
})

export const TaxRegionCreate = () => {
  return (
    <RouteFocusModal>
      <TaxRegionCreateForm formSchema={CreateTaxRegionForm} />
    </RouteFocusModal>
  )
}
