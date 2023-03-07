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
  refetchInventory: () => void
  isLoading: boolean
  itemId: string
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
const EditFlowVariantForm = ({
  form,
  isLoading,
  locationLevels,
  refetchInventory,
  itemId,
}: Props) => {
  if (isLoading) {
    return null
  }

  return (
    <>
      <VariantStockForm
        locationLevels={locationLevels}
        refetchInventory={refetchInventory}
        itemId={itemId}
        form={nestedForm(form, "stock")}
      />
      {/* <p className="inter-base-regular text-grey-50">
        Shipping information can be required depending on your shipping
        provider, and whether or not you are shipping internationally.
      </p> */}
      {/* <div className="mt-large">
        <h3 className="inter-base-semibold mb-2xsmall">Dimensions</h3>
        <p className="inter-base-regular text-grey-50 mb-large">
          Configure to calculate the most accurate shipping rates.
        </p>
        <DimensionsForm form={nestedForm(form, "dimensions")} />
      </div> */}
      {/* <div className="mt-xlarge">
        <h3 className="inter-base-semibold mb-2xsmall">Customs</h3>
        <p className="inter-base-regular text-grey-50 mb-large">
          Configure if you are shipping internationally.
        </p>
        <CustomsForm form={nestedForm(form, "customs")} />
      </div> */}
    </>
  )
}

export default EditFlowVariantForm
