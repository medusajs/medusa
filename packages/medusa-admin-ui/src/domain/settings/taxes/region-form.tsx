import { Region } from "@medusajs/medusa"
import { useAdminStoreTaxProviders, useAdminUpdateRegion } from "medusa-react"
import React, { useEffect, useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import Checkbox from "../../../components/atoms/checkbox"
import Button from "../../../components/fundamentals/button"
import IconTooltip from "../../../components/molecules/icon-tooltip"
import Select from "../../../components/molecules/select"
import useNotification from "../../../hooks/use-notification"
import { Option } from "../../../types/shared"
import { getErrorMessage } from "../../../utils/error-messages"

type RegionTaxFormProps = {
  region: Region
}

type TaxProviderOption = Option | { label: string; value: null }

type RegionTaxFormData = {
  automatic_taxes: boolean
  gift_cards_taxable: boolean
  tax_provider_id: TaxProviderOption
}

export const RegionTaxForm = ({ region }: RegionTaxFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = useForm<RegionTaxFormData>({
    defaultValues: {
      automatic_taxes: region.automatic_taxes,
      gift_cards_taxable: region.gift_cards_taxable,
      tax_provider_id: {
        label:
          region.tax_provider_id === null
            ? "System Tax Provider"
            : region.tax_provider_id,
        value: region.tax_provider_id,
      },
    },
  })
  const notification = useNotification()

  useEffect(() => {
    reset({
      automatic_taxes: region.automatic_taxes,
      gift_cards_taxable: region.gift_cards_taxable,
      tax_provider_id: {
        label:
          region.tax_provider_id === null
            ? "System Tax Provider"
            : region.tax_provider_id,
        value: region.tax_provider_id,
      },
    })
  }, [region])

  const {
    isLoading: isProvidersLoading,
    tax_providers,
  } = useAdminStoreTaxProviders()

  const updateRegion = useAdminUpdateRegion(region.id)

  const providerOptions = useMemo(() => {
    if (tax_providers) {
      return [
        {
          label: "System Tax Provider",
          value: null,
        },
        ...tax_providers.map((tp) => ({
          label: tp.id,
          value: tp.id,
        })),
      ]
    }

    return [
      {
        label: "System Tax Provider",
        value: null,
      },
    ]
  }, [tax_providers])

  const onSubmit = (data) => {
    const toSubmit = {
      ...data,
      tax_provider_id: data.tax_provider_id.value,
    }

    updateRegion.mutate(toSubmit, {
      onSuccess: () => {
        notification(
          "Success",
          "Region tax settings were successfully updated.",
          "success"
        )
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  return (
    <form className="flex flex-col flex-1" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-base flex-1">
        <Controller
          name="tax_provider_id"
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <Select
              disabled={isProvidersLoading}
              label="Tax Provider"
              options={providerOptions}
              value={value}
              onChange={onChange}
              className="mb-base"
            />
          )}
        />
        <div className="flex item-center gap-x-1.5">
          <Checkbox
            className="inter-base-regular"
            {...register("automatic_taxes")}
            label="Calculate taxes automatically?"
          />
          <IconTooltip
            content={
              "When checked Medusa will automatically apply tax calculations to Carts in this Region. When unchecked you will have to manually compute taxes at checkout. Manual taxes are recommended if using a 3rd party tax provider to avoid performing too many requests"
            }
          />
        </div>
        <div className="flex item-center gap-x-1.5">
          <Checkbox
            className="inter-base-regular"
            {...register("gift_cards_taxable")}
            label="Apply tax to gift cards?"
          />
          <IconTooltip
            content={
              "When checked taxes will be applied to gift cards on checkout. In some contries tax regulations require that taxes are applied to gift cards on purchase."
            }
          />
        </div>
      </div>
      <div className="flex justify-end">
        {isDirty && (
          <Button
            loading={updateRegion.isLoading}
            variant="primary"
            size="medium"
            type="submit"
          >
            Save
          </Button>
        )}
      </div>
    </form>
  )
}
