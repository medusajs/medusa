import { Control, useWatch, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { CurrencyInput, Divider } from "@medusajs/ui"
import { Text } from "@medusajs/ui"
import { CurrencyInfo } from "../../../../../lib/data/currencies"
import { CreateShippingOptionSchemaType } from "../../../location-service-zone-shipping-option-create/components/create-shipping-options-form/schema"
import {
  CondtionalPriceRuleSchema,
  UpdateConditionalPriceRuleSchema,
} from "../../schema"
import { ConditionalPriceInfo } from "../../types"
import { getCustomShippingOptionPriceFieldName } from "../../utils/get-custom-shipping-option-price-field-info"
import { useShippingOptionPrice } from "../shipping-option-price-provider"
import { Form } from "../../../../../components/common/form"
import { formatValue } from "react-currency-input-field"
import { TieredPriceInput } from "../../../../../common/components/tiered-price-form/tiered-price-input"
import { TieredPriceForm } from "../../../../../common/components/tiered-price-form/tiered-price-form"

const ConditionalPriceFormSchema = z.union([
  CondtionalPriceRuleSchema,
  UpdateConditionalPriceRuleSchema,
])

type ConditionalPriceFormSchemaType = z.infer<typeof ConditionalPriceFormSchema>

interface ConditionalPriceFormProps {
  info: ConditionalPriceInfo
  variant: "create" | "update"
}

const ConditionalConditionTrigger = ({
  index,
  control,
}: {
  index: number
  control: Control<ConditionalPriceFormSchemaType>
  currency: CurrencyInfo
}) => {
  const item = useWatch({
    control,
    name: `prices.${index}`,
  })

  const { gte, lte } = item || {}

  return (
    <div className="flex min-h-7 items-center gap-x-1">
      {gte && (
        <Text size="small" weight="plus">
          {gte}+
        </Text>
      )}
      {gte && lte && <span>to</span>}
      {lte && (
        <Text size="small" weight="plus">
          {lte}
        </Text>
      )}
      {!gte && !lte && "—"}
    </div>
  )
}

const ConditionalConditionItem = ({
  index,
  control,
  currency,
}: {
  index: number
  control: Control<ConditionalPriceFormSchemaType>
  currency: CurrencyInfo
}) => {
  const { t } = useTranslation()

  return (
    <>
      <Divider variant="dashed" />
      <Form.Field
        control={control}
        name={`prices.${index}.amount`}
        render={({ field: { value, onChange, ...props } }) => (
          <Form.Item>
            <div className="grid grid-cols-2 items-start gap-x-2 p-3">
              <div className="flex h-8 items-center">
                <Form.Label>
                  {t(
                    "stockLocations.shippingOptions.conditionalPrices.rules.amount"
                  )}
                </Form.Label>
              </div>
              <div className="flex flex-col gap-y-1">
                <Form.Control>
                  <CurrencyInput
                    className="bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover focus-visible:bg-ui-bg-field-component-hover"
                    placeholder={formatValue({
                      value: "0",
                      decimalScale: currency.decimal_digits,
                    })}
                    decimalScale={currency.decimal_digits}
                    symbol={currency.symbol_native}
                    code={currency.code}
                    value={value}
                    onValueChange={(_value, _name, values) =>
                      onChange(values?.value ? values?.value : "")
                    }
                    autoFocus={false}
                    {...props}
                  />
                </Form.Control>
                <Form.ErrorMessage />
              </div>
            </div>
          </Form.Item>
        )}
      />
      <Divider variant="dashed" />
      <Form.Field
        control={control}
        name={`prices.${index}.gte`}
        render={({ field }) => (
          <TieredPriceInput
            field={field}
            label={t(
              "stockLocations.shippingOptions.conditionalPrices.rules.gte"
            )}
            toggleValues={{ active: "", inactive: null }}
            renderInput={({ field: { onChange, ...fieldProps }, value }) => (
              <CurrencyInput
                className="bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover focus-visible:bg-ui-bg-field-component-hover"
                placeholder={formatValue({
                  value: "1000",
                  decimalScale: currency.decimal_digits,
                })}
                decimalScale={currency.decimal_digits}
                symbol={currency.symbol_native}
                code={currency.code}
                value={value}
                ref={fieldProps.ref}
                onValueChange={(_value, _name, values) =>
                  onChange(values?.value ? values?.value : "")
                }
                {...fieldProps}
              />
            )}
          />
        )}
      />
      <Divider variant="dashed" />
      <Form.Field
        control={control}
        name={`prices.${index}.lte`}
        render={({ field }) => (
          <TieredPriceInput
            field={field}
            label={t(
              "stockLocations.shippingOptions.conditionalPrices.rules.lte"
            )}
            toggleValues={{ active: "", inactive: null }}
            renderInput={({ field: { onChange, ...fieldProps }, value }) => (
              <CurrencyInput
                className="bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover focus-visible:bg-ui-bg-field-component-hover"
                placeholder={formatValue({
                  value: "1000",
                  decimalScale: currency.decimal_digits,
                })}
                decimalScale={currency.decimal_digits}
                symbol={currency.symbol_native}
                code={currency.code}
                value={value}
                ref={fieldProps.ref}
                onValueChange={(_value, _name, values) =>
                  onChange(values?.value ? values?.value : "")
                }
                {...fieldProps}
              />
            )}
          />
        )}
      />
    </>
  )
}

export const ConditionalPriceForm = ({
  info,
  variant,
}: ConditionalPriceFormProps) => {
  const { t } = useTranslation()
  const { getValues, setValue: setFormValue } =
    useFormContext<CreateShippingOptionSchemaType>()
  const { onCloseConditionalPricesModal } = useShippingOptionPrice()

  const { field, type, currency, name: header } = info
  const name = getCustomShippingOptionPriceFieldName(field, type)

  return (
    <TieredPriceForm
      schema={
        variant === "create"
          ? CondtionalPriceRuleSchema
          : UpdateConditionalPriceRuleSchema
      }
      initialValues={
        getValues(name) || [
          {
            amount: "",
            gte: "",
            lte: null,
          },
        ]
      }
      onSubmit={(values) => {
        setFormValue(name, values.prices, {
          shouldDirty: true,
          shouldValidate: true,
          shouldTouch: true,
        })
        onCloseConditionalPricesModal()
      }}
      onClose={onCloseConditionalPricesModal}
      currency={currency}
      header={t("stockLocations.shippingOptions.conditionalPrices.header", {
        name: header,
      })}
      description={t(
        "stockLocations.shippingOptions.conditionalPrices.description"
      )}
      addPriceLabel={t(
        "stockLocations.shippingOptions.conditionalPrices.actions.addPrice"
      )}
      fieldConfig={{
        min: "gte",
        max: "lte",
        minLabel: t(
          "stockLocations.shippingOptions.conditionalPrices.rules.gte"
        ),
        maxLabel: t(
          "stockLocations.shippingOptions.conditionalPrices.rules.lte"
        ),
      }}
      renderConditionTrigger={(props) => (
        <ConditionalConditionTrigger {...props} />
      )}
      renderConditionItem={(props) => <ConditionalConditionItem {...props} />}
    />
  )
}
