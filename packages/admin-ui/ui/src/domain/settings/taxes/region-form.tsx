import { Region } from "@medusajs/medusa"
import { useAdminStoreTaxProviders, useAdminUpdateRegion } from "medusa-react"
import { useEffect, useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
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
  const { t } = useTranslation()

  useEffect(() => {
    reset({
      automatic_taxes: region.automatic_taxes,
      gift_cards_taxable: region.gift_cards_taxable,
      tax_provider_id: {
        label:
          region.tax_provider_id === null
            ? t("taxes-system-tax-provider", "System Tax Provider")
            : region.tax_provider_id,
        value: region.tax_provider_id,
      },
    })
  }, [region])

  const { isLoading: isProvidersLoading, tax_providers } =
    useAdminStoreTaxProviders()

  const updateRegion = useAdminUpdateRegion(region.id)

  const providerOptions = useMemo(() => {
    if (tax_providers) {
      return [
        {
          label: t("taxes-system-tax-provider", "System Tax Provider"),
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
        label: t("taxes-system-tax-provider", "System Tax Provider"),
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
          t("taxes-success", "Success"),
          t(
            "taxes-region-tax-settings-were-successfully-updated",
            "Region tax settings were successfully updated."
          ),
          "success"
        )
      },
      onError: (error) => {
        notification(t("taxes-error", "Error"), getErrorMessage(error), "error")
      },
    })
  }

  return (
    <form className="flex flex-1 flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="gap-base flex flex-1 flex-col">
        <Controller
          name="tax_provider_id"
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <Select
              disabled={isProvidersLoading}
              label={t("taxes-tax-provider", "Tax Provider")}
              options={providerOptions}
              value={value}
              onChange={onChange}
              className="mb-base"
            />
          )}
        />
        <div className="item-center flex gap-x-1.5">
          <Checkbox
            className="inter-base-regular"
            {...register("automatic_taxes")}
            label={t(
              "taxes-calculate-taxes-automatically",
              "Calculate taxes automatically?"
            )}
          />
          <IconTooltip
            content={t(
              "taxes-automatically-apply-tax-calculations-to-carts",
              "When checked Medusa will automatically apply tax calculations to Carts in this Region. When unchecked you will have to manually compute taxes at checkout. Manual taxes are recommended if using a 3rd party tax provider to avoid performing too many requests"
            )}
          />
        </div>
        <div className="item-center flex gap-x-1.5">
          <Checkbox
            className="inter-base-regular"
            {...register("gift_cards_taxable")}
            label={t(
              "taxes-apply-tax-to-gift-cards",
              "Apply tax to gift cards?"
            )}
          />
          <IconTooltip
            content={t(
              "taxes-apply-taxes-to-gift-cards",
              "When checked taxes will be applied to gift cards on checkout. In some contries tax regulations require that taxes are applied to gift cards on purchase."
            )}
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
            {t("taxes-save", "Save")}
          </Button>
        )}
      </div>
    </form>
  )
}
