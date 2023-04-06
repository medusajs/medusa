import { UseFormReturn } from "react-hook-form"
import { nestedForm } from "../../../../../utils/nested-form"
import InputError from "../../../../atoms/input-error"
import IconTooltip from "../../../../molecules/icon-tooltip"
import Accordion from "../../../../organisms/accordion"
import { PricesFormType } from "../../../general/prices-form"
import CustomsForm, { CustomsFormType } from "../../customs-form"
import DimensionsForm, { DimensionsFormType } from "../../dimensions-form"
import VariantGeneralForm, {
  VariantGeneralFormType,
} from "../variant-general-form"
import VariantPricesForm from "../variant-prices-form"
import VariantSelectOptionsForm, {
  VariantOptionValueType,
  VariantSelectOptionsFormType,
} from "../variant-select-options-form"
import VariantStockForm, { VariantStockFormType } from "../variant-stock-form"

export type CreateFlowVariantFormType = {
  /**
   * Used to identify the variant during product create flow. Will not be submitted to the backend.
   */
  _internal_id?: string
  general: VariantGeneralFormType
  prices: PricesFormType
  stock: VariantStockFormType
  options: VariantSelectOptionsFormType
  customs: CustomsFormType
  dimensions: DimensionsFormType
}

type Props = {
  form: UseFormReturn<CreateFlowVariantFormType, any>
  options: VariantOptionValueType[]
  onCreateOption: (optionId: string, value: string) => void
}

/**
 * Re-usable Product Variant form used to add and edit product variants during the product create flow.
 * @example
 * const MyForm = () => {
 *   const form = useForm<CreateFlowVariantFormType>()
 *   const { handleSubmit } = form
 *
 *   const onSubmit = handleSubmit((data) => {
 *     // do something with data
 *   })
 *
 *   return (
 *     <form onSubmit={onSubmit}>
 *       <CreateFlowVariantForm form={form} />
 *       <Button type="submit">Submit</Button>
 *     </form>
 *   )
 * }
 */
const CreateFlowVariantForm = ({ form, options, onCreateOption }: Props) => {
  return (
    <Accordion type="multiple" defaultValue={["general"]}>
      <Accordion.Item title="General" value="general" required>
        <div>
          <VariantGeneralForm form={nestedForm(form, "general")} />
          <div className="mt-xlarge">
            <div className="gap-x-2xsmall mb-base flex items-center">
              <h3 className="inter-base-semibold">Options</h3>
              <IconTooltip
                type="info"
                content="Options are used to define the color, size, etc. of the variant."
              />
            </div>
            <VariantSelectOptionsForm
              form={nestedForm(form, "options")}
              options={options}
              onCreateOption={onCreateOption}
            />
            <InputError errors={form.formState.errors} name="options" />
          </div>
        </div>
      </Accordion.Item>
      <Accordion.Item title="Pricing" value="pricing">
        <VariantPricesForm form={nestedForm(form, "prices")} />
      </Accordion.Item>
      <Accordion.Item title="Stock & Inventory" value="stock">
        <VariantStockForm form={nestedForm(form, "stock")} />
      </Accordion.Item>
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
        <div className="mt-xlarge">
          <h3 className="inter-base-semibold mb-2xsmall">Customs</h3>
          <p className="inter-base-regular text-grey-50 mb-large">
            Configure if you are shipping internationally.
          </p>
          <CustomsForm form={nestedForm(form, "customs")} />
        </div>
      </Accordion.Item>
    </Accordion>
  )
}

export default CreateFlowVariantForm
