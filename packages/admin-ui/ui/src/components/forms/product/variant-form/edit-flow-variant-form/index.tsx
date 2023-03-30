import { useFieldArray, UseFormReturn } from "react-hook-form"
import CustomsForm, { CustomsFormType } from "../../customs-form"
import DimensionsForm, { DimensionsFormType } from "../../dimensions-form"
import VariantGeneralForm, {
  VariantGeneralFormType,
} from "../variant-general-form"
import VariantStockForm, { VariantStockFormType } from "../variant-stock-form"

import { useFeatureFlag } from "../../../../../providers/feature-flag-provider"
import { nestedForm } from "../../../../../utils/nested-form"
import IconTooltip from "../../../../molecules/icon-tooltip"
import InputField from "../../../../molecules/input"
import Accordion from "../../../../organisms/accordion"
import MetadataForm, { MetadataFormType } from "../../../general/metadata-form"
import { PricesFormType } from "../../../general/prices-form"
import VariantPricesForm from "../variant-prices-form"

export type EditFlowVariantFormType = {
  /**
   * Used to identify the variant during product create flow. Will not be submitted to the backend.
   */
  _internal_id?: string
  general: VariantGeneralFormType
  prices: PricesFormType
  stock: VariantStockFormType
  options: {
    title: string
    value: string
    id: string
  }[]
  customs: CustomsFormType
  dimensions: DimensionsFormType
  metadata: MetadataFormType
}

type Props = {
  form: UseFormReturn<EditFlowVariantFormType, any>
  isEdit?: boolean
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
const EditFlowVariantForm = ({ form, isEdit }: Props) => {
  const { isFeatureEnabled } = useFeatureFlag()
  const { fields } = useFieldArray({
    control: form.control,
    name: "options",
  })

  const showStockAndInventory = !isEdit || !isFeatureEnabled("inventoryService")

  return (
    <Accordion type="multiple" defaultValue={["general"]}>
      <Accordion.Item title="General" value="general" required>
        <div>
          <VariantGeneralForm form={nestedForm(form, "general")} />
          <div className="mt-xlarge">
            <div className="mb-base gap-x-2xsmall flex items-center">
              <h3 className="inter-base-semibold">Options</h3>
              <IconTooltip
                type="info"
                content="Options are used to define the color, size, etc. of the variant."
              />
            </div>
            <div className="gap-large pb-2xsmall grid grid-cols-2">
              {fields.map((field, index) => {
                return (
                  <InputField
                    required
                    key={field.id}
                    label={field.title}
                    {...form.register(`options.${index}.value`, {
                      required: `Option value for ${field.title} is required`,
                    })}
                    errors={form.formState.errors}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </Accordion.Item>
      <Accordion.Item title="Pricing" value="pricing">
        <VariantPricesForm form={nestedForm(form, "prices")} />
      </Accordion.Item>
      {showStockAndInventory && (
        <Accordion.Item title="Stock & Inventory" value="stock">
          <VariantStockForm form={nestedForm(form, "stock")} />
        </Accordion.Item>
      )}
      <Accordion.Item title="Shipping" value="shipping">
        <p className="inter-base-regular text-grey-50">
          Shipping information can be required depending on your shipping
          provider, and whether or not you are shipping internationally.
        </p>
        <div className="mt-large">
          <h3 className="inter-base-semibold mb-2xsmall">Dimensions</h3>
          <p className="inter-base-regular text-grey-50 mb-large">
            Configure to calculate the most accurate shipping rates.
          </p>
          <DimensionsForm form={nestedForm(form, "dimensions")} />
        </div>
        {showStockAndInventory && (
          <div className="mt-xlarge">
            <h3 className="inter-base-semibold mb-2xsmall">Customs</h3>
            <p className="inter-base-regular text-grey-50 mb-large">
              Configure if you are shipping internationally.
            </p>
            <CustomsForm form={nestedForm(form, "customs")} />
          </div>
        )}
      </Accordion.Item>
      <Accordion.Item title="Metadata" value="metadata">
        <p className="inter-base-regular text-grey-50 mb-base">
          Metadata can be used to store additional information about the
          variant.
        </p>
        <MetadataForm form={nestedForm(form, "metadata")} />
      </Accordion.Item>
    </Accordion>
  )
}

export default EditFlowVariantForm
