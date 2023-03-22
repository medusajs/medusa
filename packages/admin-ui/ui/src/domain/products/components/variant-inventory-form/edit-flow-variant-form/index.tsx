import { InventoryLevelDTO } from "@medusajs/medusa"
import { UseFormReturn } from "react-hook-form"
import { nestedForm } from "../../../../../utils/nested-form"
import VariantStockForm, { VariantStockFormType } from "../variant-stock-form"

export type EditFlowVariantFormType = {
  stock: VariantStockFormType
}

type Props = {
  form: UseFormReturn<EditFlowVariantFormType, any>
  locationLevels: InventoryLevelDTO[]
  isLoading: boolean
}

/**
 * Re-usable Product Variant form used to add and edit product variants.
 * @example
 * const MyForm = () => {
 *   const form = useForm<VariantFormType>()
 *   const { handleSubmit } = form
 *
 *   const onSubmit = handleSubmit((data) => {
 *     // do something with data
 *   })
 *
 *   return (
 *     <form onSubmit={onSubmit}>
 *       <VariantForm form={form} />
 *       <Button type="submit">Submit</Button>
 *     </form>
 *   )
 * }
 */
const EditFlowVariantForm = ({ form, isLoading, locationLevels }: Props) => {
  if (isLoading) {
    return null
  }

  return (
    <>
      <VariantStockForm
        locationLevels={locationLevels}
        form={nestedForm(form, "stock")}
      />
    </>
  )
}

export default EditFlowVariantForm
