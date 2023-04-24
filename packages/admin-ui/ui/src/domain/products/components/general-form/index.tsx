import React, { ChangeEvent } from "react"
import { Controller } from "react-hook-form"
import InputHeader from "../../../../components/fundamentals/input-header"
import InputField from "../../../../components/molecules/input"
import Select from "../../../../components/molecules/select/next-select/select"
import TextArea from "../../../../components/molecules/textarea"
import { useSelectedVendor } from "../../../../context/vendor"
import { useAdminShippingProfiles } from "../../../../hooks/admin/shipping-profiles/queries"
import { Option } from "../../../../types/shared"
import FormValidator from "../../../../utils/form-validator"
import PricesForm from "../prices-form"
import { formatHandle } from "../../../../utils/format-handle"
import { NestedForm } from "../../../../utils/nested-form"
import { useStorePermissions } from "../../../../hooks/use-store-permissions"
import { Price } from "@medusajs/medusa"
import { TaxCategoriesForm } from "../tax-categories/TaxCategoriesForm"

export type GeneralFormType = {
  title: string
  subtitle: string | null
  handle: string
  prices: Price[]
  material: string | null
  description: string | null
  tax_category_id: string | null
  shipping_profile: Option | null
  customer_response_prompt: string | null
}

type Props = {
  form: NestedForm<GeneralFormType>
  requireHandle?: boolean
}

const GeneralForm = ({ form, requireHandle = true }: Props) => {
  const {
    register,
    path,
    control,
    formState: { errors },
  } = form

  const { selectedVendor } = useSelectedVendor()

  const { allowRegionPricing } = useStorePermissions()

  const storeProfiles = useAdminShippingProfiles({
    vendor_id: null,
    type: "default",
  })

  const storeShippingProfiles = (storeProfiles?.shipping_profiles || []).filter(
    (sp) => sp.shipping_options.length > 0
  )

  const vendorProfiles = useAdminShippingProfiles({
    vendor_id: selectedVendor?.id,
    type: "vendor_default",
  })

  const profileOptions = [
    ...(vendorProfiles?.shipping_profiles || []),
    ...storeShippingProfiles,
  ].map((p) => ({ label: p.name, value: p.id }))

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-large mb-small">
        <InputField
          label="Title"
          placeholder="Winter Jacket"
          required
          {...register(path("title"), {
            required: "Title is required",
            minLength: {
              value: 1,
              message: "Title must be at least 1 character",
            },
            pattern: FormValidator.whiteSpaceRule("Title"),
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.value.length > 0) {
                form.setValue(path("handle"), formatHandle(e.target.value))
              }
            },
          })}
          errors={errors}
        />
        <InputField
          label="Subtitle"
          placeholder="Warm and cozy..."
          {...register(path("subtitle"), {
            pattern: FormValidator.whiteSpaceRule("Subtitle"),
          })}
          errors={errors}
        />
      </div>
      <p className="inter-base-regular text-grey-50 mb-large">
        Give your product a short and clear title.
        <br />
        50-60 characters is the recommended length for search engines.
      </p>
      <div className="grid grid-cols-2 gap-x-large mb-large">
        <InputField
          label="Handle"
          tooltipContent="The handle is the part of the URL that identifies the product."
          placeholder="winter-jacket"
          required={requireHandle}
          {...register(path("handle"), {
            required: requireHandle ? "Handle is required" : undefined,
            minLength: FormValidator.minOneCharRule("Handle"),
            pattern: FormValidator.whiteSpaceRule("Handle"),
          })}
          prefix="/"
          errors={errors}
        />
        <InputField
          label="Material"
          placeholder="100% cotton"
          {...register(path("material"), {
            minLength: FormValidator.minOneCharRule("Material"),
            pattern: FormValidator.whiteSpaceRule("Material"),
          })}
          errors={errors}
        />
      </div>

      <InputHeader label="Default Price" className="mb-xsmall" />

      <PricesForm
        required={true}
        form={form}
        allowRegionPricing={allowRegionPricing}
      />

      <TaxCategoriesForm form={form} />

      <TextArea
        label="Description"
        placeholder="A warm and cozy jacket..."
        rows={3}
        className="mb-small"
        {...register(path("description"))}
        errors={errors}
      />

      <TextArea
        label="Prompt the customer for more information"
        placeholder="e.g. Are there any special instructions for this order?"
        rows={3}
        className="mb-small"
        {...register(path("customer_response_prompt"))}
        errors={errors}
      />

      {profileOptions.length > 1 && (
        <Controller
          control={control}
          name={path("shipping_profile")}
          rules={{
            required: FormValidator.required("Shipping Profile"),
          }}
          render={({ field: { value, onChange } }) => (
            <Select
              label="Shipping Profile"
              required={true}
              value={value}
              name={path("shipping_profile")}
              options={profileOptions}
              onChange={onChange}
              errors={errors}
            />
          )}
        />
      )}
    </div>
  )
}

export default GeneralForm
