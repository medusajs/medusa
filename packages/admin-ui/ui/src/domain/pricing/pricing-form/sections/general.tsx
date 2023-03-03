import React from "react"
import { Controller } from "react-hook-form"
import Switch from "../../../../components/atoms/switch"
import FeatureToggle from "../../../../components/fundamentals/feature-toggle"
import InputField from "../../../../components/molecules/input"
import Accordion from "../../../../components/organisms/accordion"
import { usePriceListForm } from "../form/pricing-form-context"

const General = () => {
  const { control, register } = usePriceListForm()

  return (
    <Accordion.Item
      forceMountContent
      required
      title="General"
      tooltip="General information for the price list."
      value="general"
    >
      <div className="flex flex-col gap-y-small group-radix-state-open:mt-5 accordion-margin-transition">
        <InputField
          label="Name"
          required
          placeholder="B2B, Black Friday..."
          {...register("name", { required: "Name is required" })}
        />
        <InputField
          label="Description"
          required
          placeholder="For our business partners..."
          {...register("description", { required: "Description is required" })}
        />
        <FeatureToggle featureFlag="tax_inclusive_pricing">
          <div className="mt-3">
            <div className="flex justify-between">
              <h2 className="inter-base-semibold">Tax inclusive prices</h2>
              <Controller
                control={control}
                name="includes_tax"
                render={({ field: { value, onChange } }) => {
                  return <Switch checked={!!value} onCheckedChange={onChange} />
                }}
              />
            </div>
            <p className="inter-base-regular text-grey-50">
              Choose to make all prices in this list inclusive of tax.
            </p>
          </div>
        </FeatureToggle>
      </div>
    </Accordion.Item>
  )
}

export default General
