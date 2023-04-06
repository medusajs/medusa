import { useAdminRegions } from "medusa-react"
import { useEffect, useMemo } from "react"
import { Controller, useWatch } from "react-hook-form"
import { Option } from "../../../../types/shared"
import FormValidator from "../../../../utils/form-validator"
import { NestedForm } from "../../../../utils/nested-form"
import { NextSelect } from "../../../molecules/select/next-select"

type RegionOption = Option & {
  currency_code: string
}

export type GiftCardRegionFormType = {
  region_id: RegionOption
}

type GiftCardRegionFormProps = {
  form: NestedForm<GiftCardRegionFormType>
}

const GiftCardRegionForm = ({ form }: GiftCardRegionFormProps) => {
  const {
    control,
    path,
    formState: { errors },
    setValue,
  } = form

  const { regions } = useAdminRegions({
    limit: 100,
  })

  const regionOptions: RegionOption[] = useMemo(() => {
    return (
      regions?.map((r) => ({
        label: r.name,
        value: r.id,
        currency_code: r.currency_code,
      })) || []
    )
  }, [regions])

  const subscriber = useWatch({
    control,
    name: path("region_id"),
  })

  useEffect(() => {
    if (!subscriber) {
      setValue(path("region_id"), regionOptions[0], {
        shouldDirty: true,
      })
    }
  }, [subscriber, regionOptions, setValue, path])

  return (
    <Controller
      name={path("region_id")}
      rules={{
        required: FormValidator.required("Region"),
      }}
      control={control}
      render={({ field }) => {
        return (
          <NextSelect
            label="Region"
            required
            {...field}
            errors={errors}
            options={regionOptions}
          />
        )
      }}
    />
  )
}

export default GiftCardRegionForm
