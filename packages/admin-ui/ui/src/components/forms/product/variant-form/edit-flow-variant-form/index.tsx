import CustomsForm, { CustomsFormType } from "../../customs-form"
import DimensionsForm, { DimensionsFormType } from "../../dimensions-form"
import MetadataForm, { MetadataFormType } from "../../../general/metadata-form"
import { UseFormReturn, useFieldArray } from "react-hook-form"
import VariantGeneralForm, {
  VariantGeneralFormType,
} from "../variant-general-form"
import VariantStockForm, { VariantStockFormType } from "../variant-stock-form"

import Accordion from "../../../../organisms/accordion"
import IconTooltip from "../../../../molecules/icon-tooltip"
import InputField from "../../../../molecules/input"
import { PricesFormType } from "../../../general/prices-form"
import { nestedForm } from "../../../../../utils/nested-form"
import { useFeatureFlag } from "../../../../../providers/feature-flag-provider"
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation()
  const { isFeatureEnabled } = useFeatureFlag()
  const { fields } = useFieldArray({
    control: form.control,
    name: "options",
  })

  const showStockAndInventory = !isEdit || !isFeatureEnabled("inventoryService")

  return (
    <Accordion type="multiple" defaultValue={["general"]}>
      <Accordion.Item
        title={t("edit-flow-variant-form-general-title", "General")}
        value="general"
        required
      >
        <div>
          <VariantGeneralForm form={nestedForm(form, "general")} />
          <div className="mt-xlarge">
            <div className="mb-base gap-x-2xsmall flex items-center">
              <h3 className="inter-base-semibold">
                {t("edit-flow-variant-form-options-title", "Options")}
              </h3>
              <IconTooltip
                type="info"
                content={t(
                  "edit-flow-variant-form-options-tooltip",
                  "Options are used to define the color, size, etc. of the variant."
                )}
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
                      required: t(
                        "edit-flow-variant-form-option-input-error",
                        `Option value for {{field}} is required`,
                        { field: field.title }
                      ),
                    })}
                    errors={form.formState.errors}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </Accordion.Item>
      {showStockAndInventory && (
        <Accordion.Item
          title={t(
            "edit-flow-variant-form-stock-inventory-title",
            "Stock & Inventory"
          )}
          value="stock"
        >
          <VariantStockForm form={nestedForm(form, "stock")} />
        </Accordion.Item>
      )}
      <Accordion.Item
        title={t("edit-flow-variant-form-shipping-title", "Shipping")}
        value="shipping"
      >
        <p className="inter-base-regular text-grey-50">
          {t(
            "edit-flow-variant-form-shipping-description",
            "Shipping information can be required depending on your shipping provider, and whether or not you are shipping internationally."
          )}
        </p>
        <div className="mt-large">
          <h3 className="inter-base-semibold mb-2xsmall">
            {t("edit-flow-variant-form-dimensions-title", "Dimensions")}
          </h3>
          <p className="inter-base-regular text-grey-50 mb-large">
            {t(
              "edit-flow-variant-form-dimensions-description",
              "Configure to calculate the most accurate shipping rates."
            )}
          </p>
          <DimensionsForm form={nestedForm(form, "dimensions")} />
        </div>
        {showStockAndInventory && (
          <div className="mt-xlarge">
            <h3 className="inter-base-semibold mb-2xsmall">
              {t("edit-flow-variant-form-customs-title", "Customs")}
            </h3>
            <p className="inter-base-regular text-grey-50 mb-large">
              {t(
                "edit-flow-variant-form-customs-description",
                "Configure if you are shipping internationally."
              )}
            </p>
            <CustomsForm form={nestedForm(form, "customs")} />
          </div>
        )}
      </Accordion.Item>
      <Accordion.Item
        title={t("edit-flow-variant-form-metadata-title", "Metadata")}
        value="metadata"
      >
        <p className="inter-base-regular text-grey-50 mb-base">
          {t(
            "edit-flow-variant-form-metadata-description",
            "Metadata can be used to store additional information about the variant."
          )}
        </p>
        <MetadataForm form={nestedForm(form, "metadata")} />
      </Accordion.Item>
    </Accordion>
  )
}

export default EditFlowVariantForm
