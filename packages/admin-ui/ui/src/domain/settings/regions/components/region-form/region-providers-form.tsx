import { Controller } from "react-hook-form"
import { NextSelect } from "../../../../../components/molecules/select/next-select"
import { Option } from "../../../../../types/shared"
import { NestedForm } from "../../../../../utils/nested-form"
import { useStoreData } from "./use-store-data"

export type RegionProvidersFormType = {
  payment_providers: Option[]
  fulfillment_providers: Option[]
}

type Props = {
  form: NestedForm<RegionProvidersFormType>
}

const RegionProvidersForm = ({ form }: Props) => {
  const {
    control,
    path,
    formState: { errors },
  } = form
  const { fulfillmentProviderOptions, paymentProviderOptions } = useStoreData()

  return (
    <div className="gap-large grid grid-cols-2">
      <Controller
        control={control}
        name={path("payment_providers")}
        rules={{
          required: "Payment providers are required",
          minLength: {
            value: 1,
            message: "Payment providers are required",
          },
        }}
        render={({ field: { value, onBlur, onChange } }) => {
          return (
            <NextSelect
              label="Payment Providers"
              placeholder="Choose payment providers..."
              options={paymentProviderOptions}
              isMulti
              isClearable
              required
              selectAll
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              name={path("payment_providers")}
              errors={errors}
            />
          )
        }}
      />
      <Controller
        control={control}
        name={path("fulfillment_providers")}
        rules={{
          required: "Fulfillment providers are required",
          minLength: {
            value: 1,
            message: "Fulfillment providers are required",
          },
        }}
        render={({ field: { onBlur, onChange, value } }) => {
          return (
            <NextSelect
              label="Fulfillment Providers"
              placeholder="Choose fulfillment providers..."
              options={fulfillmentProviderOptions}
              required
              isMulti
              isClearable
              selectAll
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              name={path("fulfillment_providers")}
              errors={errors}
            />
          )
        }}
      />
    </div>
  )
}

export default RegionProvidersForm
