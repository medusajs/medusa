import { Controller, useForm } from "react-hook-form"
import { adminStoreKeys, useAdminUpdateCurrency } from "medusa-react"
import { useTranslation } from "react-i18next"
import CoinsIcon from "../../../../components/fundamentals/icons/coins-icon"
import { Currency } from "@medusajs/medusa"
import FeatureToggle from "../../../../components/fundamentals/feature-toggle"
import Switch from "../../../../components/atoms/switch"
import { getErrorMessage } from "../../../../utils/error-messages"
import { useEffect } from "react"
import useNotification from "../../../../hooks/use-notification"
import { useQueryClient } from "@tanstack/react-query"

type CurrencyTaxSettingFormType = {
  includes_tax: boolean
}

type Props = {
  currency: Currency
  isDefault: boolean
}

const CurrencyTaxSetting = ({ currency, isDefault }: Props) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { mutate } = useAdminUpdateCurrency(currency.code)
  const { handleSubmit, control, reset } = useForm<CurrencyTaxSettingFormType>({
    defaultValues: {
      includes_tax: currency.includes_tax,
    },
  })

  const notification = useNotification()

  useEffect(() => {
    reset({
      includes_tax: currency.includes_tax,
    })
  }, [currency])

  const onSubmit = handleSubmit((data: CurrencyTaxSettingFormType) => {
    mutate(data, {
      onSuccess: () => {
        notification(
          t("components-success", "Success"),
          t(
            "components-successfully-updated-currency",
            "Successfully updated currency"
          ),
          "success"
        )

        // When we update a currency, we need to invalidate the store in order for this change to be reflected across admin
        queryClient.invalidateQueries(adminStoreKeys.all)
      },
      onError: (error) => {
        notification(
          t("components-error", "Error"),
          getErrorMessage(error),
          "error"
        )
        reset({
          includes_tax: currency.includes_tax,
        })
      },
    })
  })

  return (
    <form>
      <div className="inter-base-regular flex items-center justify-between">
        <div className="gap-x-base flex items-center">
          <div className="bg-grey-10 rounded-rounded w-xlarge h-xlarge flex items-center justify-center">
            <CoinsIcon size={20} className="text-grey-50" />
          </div>
          <div className="gap-x-xsmall flex items-center">
            <p className="inter-base-semibold text-grey-90">
              {currency.code.toUpperCase()}
            </p>
            <p className="text-grey-50 inter-small-regular">{currency.name}</p>
          </div>
          {isDefault && (
            <div className="bg-grey-10 rounded-rounded px-xsmall py-[2px]">
              <p className="inter-small-semibold text-grey-50">
                {t("components-default", "Default")}
              </p>
            </div>
          )}
        </div>
        <FeatureToggle featureFlag="tax_inclusive_pricing">
          <Controller
            control={control}
            name="includes_tax"
            render={({ field: { value, onChange } }) => {
              return (
                <Switch
                  checked={value}
                  onCheckedChange={(data) => {
                    onChange(data)
                    onSubmit()
                  }}
                />
              )
            }}
          />
        </FeatureToggle>
      </div>
    </form>
  )
}

export default CurrencyTaxSetting
