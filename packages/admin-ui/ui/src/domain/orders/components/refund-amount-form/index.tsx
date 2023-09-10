import { Order } from "@medusajs/medusa"
import { Controller, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import Button from "../../../../components/fundamentals/button"
import CrossIcon from "../../../../components/fundamentals/icons/cross-icon"
import EditIcon from "../../../../components/fundamentals/icons/edit-icon"
import { AmountInput } from "../../../../components/molecules/amount-input"
import { NestedForm } from "../../../../utils/nested-form"
import { formatAmountWithSymbol } from "../../../../utils/prices"

type Props = {
  form: NestedForm<RefundAmountFormType>
  order: Order
  initialValue?: number
}

export type RefundAmountFormType = {
  amount?: number
}

const RefundAmountForm = ({ form, initialValue = 0, order }: Props) => {
  const { t } = useTranslation()
  const {
    control,
    path,
    setValue,
    clearErrors,
    formState: { errors },
  } = form

  const refundAmount = useWatch({
    control,
    name: path("amount"),
  })

  const enableEdit = () => {
    setValue(path("amount"), initialValue)
  }

  const disableEdit = () => {
    setValue(path("amount"), undefined)
    clearErrors(path("amount"))
  }

  return (
    <div className="gap-x-xsmall grid grid-cols-[40px_1fr] justify-end">
      <div className="flex flex-shrink justify-end">
        {refundAmount !== undefined ? (
          <Button
            variant="secondary"
            size="small"
            type="button"
            className="h-10 w-10"
            aria-label={t(
              "refund-amount-form-cancel-editing-refund-amount",
              "Cancel editing refund amount"
            )}
            onClick={disableEdit}
          >
            <CrossIcon size={16} className="text-grey-40" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="small"
            type="button"
            onClick={enableEdit}
            aria-label={t(
              "refund-amount-form-edit-refund-amount",
              "Edit refund amount"
            )}
            className="h-10 w-10"
          >
            <EditIcon size={16} className="text-grey-40" />
          </Button>
        )}
      </div>
      <div>
        {refundAmount !== undefined ? (
          <Controller
            control={control}
            name={path("amount")}
            rules={{
              min: {
                value: 0,
                message: t(
                  "refund-amount-form-refund-amount-cannot-be-negative",
                  "Refund amount cannot be negative"
                ),
              },
              required: true,
              validate: (value) => {
                if (value === undefined || !(value >= 0)) {
                  return t(
                    "refund-amount-form-the-refund-amount-must-be-at-least-0",
                    "The refund amount must be at least 0"
                  )
                }
              },
            }}
            render={({ field: { value, onChange, name } }) => {
              return (
                <AmountInput
                  currencyCode={order.currency_code}
                  onChange={onChange}
                  name={name}
                  value={value}
                  errors={errors}
                />
              )
            }}
          />
        ) : (
          <div className="flex h-10 items-center">
            <p>
              {formatAmountWithSymbol({
                amount: initialValue,
                currency: order.currency_code,
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RefundAmountForm
