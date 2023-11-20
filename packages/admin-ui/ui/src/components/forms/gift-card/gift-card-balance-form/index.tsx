import { Controller } from "react-hook-form"
import FormValidator from "../../../../utils/form-validator"
import { NestedForm } from "../../../../utils/nested-form"
import { formatAmountWithSymbol } from "../../../../utils/prices"
import PriceFormInput from "../../general/prices-form/price-form-input"
import { useTranslation } from "react-i18next"
export type GiftCardBalanceFormType = {
  amount: number
}

export type GiftCardBalanceFormProps = {
  form: NestedForm<GiftCardBalanceFormType>
  currencyCode: string
  originalAmount?: number
}

const GiftCardBalanceForm = ({
  form,
  currencyCode,
  originalAmount,
}: GiftCardBalanceFormProps) => {
  const {
    control,
    path,
    formState: { errors },
  } = form
  const { t } = useTranslation()
  return (
    <Controller
      name={path("amount")}
      rules={{
        required: FormValidator.required(t("Balance")),
        min: {
          value: 0,
          message: t("Balance must be greater than 0"),
        },
        max: originalAmount
          ? {
              value: originalAmount,
              message: `${t(
                "The updated balance cannot exceed the original value of"
              )} ${formatAmountWithSymbol({
                amount: originalAmount,
                currency: currencyCode,
              })}`,
            }
          : undefined,
      }}
      control={control}
      render={({ field: { value, onChange, name } }) => {
        return (
          <PriceFormInput
            label={t("Amount")}
            currencyCode={currencyCode}
            onChange={onChange}
            amount={value}
            name={name}
            errors={errors}
            required
          />
        )
      }}
    />
  )
}

export default GiftCardBalanceForm
