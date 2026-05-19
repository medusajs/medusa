import { InformationCircleSolid } from "@medusajs/icons"
import {
  Badge,
  CurrencyInput,
  Divider,
  Label,
  Text,
  Tooltip,
} from "@medusajs/ui"
import { Fragment, ReactNode } from "react"
import { Control, useWatch, useFormContext } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { z } from "zod"
import { castNumber } from "../../../../../lib/cast-number"
import { CurrencyInfo } from "../../../../../lib/data/currencies"
import { getLocaleAmount } from "../../../../../lib/money-amount-helpers"
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

const ConditionContainer = ({ children }: { children: ReactNode }) => (
  <div className="text-ui-fg-subtle txt-small flex flex-wrap items-center gap-1.5">
    {children}
  </div>
)

const ConditionDisplay = ({
  index,
  control,
  currency,
}: {
  index: number
  control: Control<ConditionalPriceFormSchemaType>
  currency: CurrencyInfo
}) => {
  const { t, i18n } = useTranslation()

  const gte = useWatch({
    control,
    name: `prices.${index}.gte`,
  })

  const lte = useWatch({
    control,
    name: `prices.${index}.lte`,
  })

  const castGte = gte ? castNumber(gte) : undefined
  const castLte = lte ? castNumber(lte) : undefined

  if (!castGte && !castLte) {
    return null
  }

  if (castGte && !castLte) {
    return (
      <ConditionContainer>
        <Trans
          i18n={i18n}
          i18nKey="stockLocations.shippingOptions.conditionalPrices.summaries.greaterThan"
          components={[
            <Badge size="2xsmall" key="attribute" />,
            <Badge size="2xsmall" key="gte" />,
          ]}
          values={{
            attribute: t(
              "stockLocations.shippingOptions.conditionalPrices.attributes.cartItemTotal"
            ),
            gte: getLocaleAmount(castGte, currency.code),
          }}
        />
      </ConditionContainer>
    )
  }

  if (!castGte && castLte) {
    return (
      <ConditionContainer>
        <Trans
          i18n={i18n}
          i18nKey="stockLocations.shippingOptions.conditionalPrices.summaries.lessThan"
          components={[
            <Badge size="2xsmall" key="attribute" />,
            <Badge size="2xsmall" key="lte" />,
          ]}
          values={{
            attribute: t(
              "stockLocations.shippingOptions.conditionalPrices.attributes.cartItemTotal"
            ),
            lte: getLocaleAmount(castLte, currency.code),
          }}
        />
      </ConditionContainer>
    )
  }

  if (castGte && castLte) {
    return (
      <ConditionContainer>
        <Trans
          i18n={i18n}
          i18nKey="stockLocations.shippingOptions.conditionalPrices.summaries.range"
          components={[
            <Badge size="2xsmall" key="attribute" />,
            <Badge size="2xsmall" key="gte" />,
            <Badge size="2xsmall" key="lte" />,
          ]}
          values={{
            attribute: t(
              "stockLocations.shippingOptions.conditionalPrices.attributes.cartItemTotal"
            ),
            gte: getLocaleAmount(castGte, currency.code),
            lte: getLocaleAmount(castLte, currency.code),
          }}
        />
      </ConditionContainer>
    )
  }

  return null
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
                  value: "10",
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
                  value: "10",
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
      <ReadOnlyConditions index={index} control={control} currency={currency} />
    </>
  )
}

const ReadOnlyConditions = ({
  index,
  control,
  currency,
}: {
  index: number
  control: Control<ConditionalPriceFormSchemaType>
  currency: CurrencyInfo
}) => {
  const { t } = useTranslation()

  const item = useWatch({
    control,
    name: `prices.${index}`,
  })

  if (item.eq == null && item.gt == null && item.lt == null) {
    return null
  }

  return (
    <div>
      <Divider variant="dashed" />
      <div className="flex items-center gap-x-1 px-3 pt-3">
        <Text size="small" leading="compact" weight="plus">
          {t(
            "stockLocations.shippingOptions.conditionalPrices.customRules.label"
          )}
        </Text>
        <Tooltip
          content={t(
            "stockLocations.shippingOptions.conditionalPrices.customRules.tooltip"
          )}
        >
          <InformationCircleSolid className="text-ui-fg-muted" />
        </Tooltip>
      </div>
      <div>
        {item.eq != null && (
          <div className="grid grid-cols-2 items-start gap-x-2 p-3">
            <div className="flex h-8 items-center">
              <Label weight="plus" size="small">
                {t(
                  "stockLocations.shippingOptions.conditionalPrices.customRules.eq"
                )}
              </Label>
            </div>
            <CurrencyInput
              className="bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover focus-visible:bg-ui-bg-field-component-hover"
              symbol={currency.symbol_native}
              code={currency.code}
              value={item.eq}
              disabled
            />
          </div>
        )}
        {item.gt != null && (
          <Fragment>
            <Divider variant="dashed" />
            <div className="grid grid-cols-2 items-start gap-x-2 p-3">
              <div className="flex h-8 items-center">
                <Label weight="plus" size="small">
                  {t(
                    "stockLocations.shippingOptions.conditionalPrices.customRules.gt"
                  )}
                </Label>
              </div>
              <CurrencyInput
                className="bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover focus-visible:bg-ui-bg-field-component-hover"
                symbol={currency.symbol_native}
                code={currency.code}
                value={item.gt}
                disabled
              />
            </div>
          </Fragment>
        )}
        {item.lt != null && (
          <Fragment>
            <Divider variant="dashed" />
            <div className="grid grid-cols-2 items-start gap-x-2 p-3">
              <div className="flex h-8 items-center">
                <Label weight="plus" size="small">
                  {t(
                    "stockLocations.shippingOptions.conditionalPrices.customRules.lt"
                  )}
                </Label>
              </div>
              <CurrencyInput
                className="bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover focus-visible:bg-ui-bg-field-component-hover"
                symbol={currency.symbol_native}
                code={currency.code}
                value={item.lt}
                disabled
              />
            </div>
          </Fragment>
        )}
      </div>
    </div>
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
      renderConditionTrigger={(props) => <ConditionDisplay {...props} />}
      renderConditionItem={(props) => <ConditionalConditionItem {...props} />}
    />
  )
}
