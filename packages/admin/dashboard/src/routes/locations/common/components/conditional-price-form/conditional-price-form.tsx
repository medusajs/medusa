import { zodResolver } from "@hookform/resolvers/zod"
import {
  InformationCircleSolid,
  Plus,
  TriangleDownMini,
  XMark,
  XMarkMini,
} from "@zjedene-medusa/icons"
import {
  Badge,
  Button,
  clx,
  CurrencyInput,
  Divider,
  Heading,
  IconButton,
  Label,
  Text,
  Tooltip,
} from "@zjedene-medusa/ui"
import { Accordion as RadixAccordion } from "radix-ui"
import React, { Fragment, ReactNode, useRef, useState } from "react"
import {
  Control,
  ControllerRenderProps,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"

import { formatValue } from "react-currency-input-field"
import { Form } from "../../../../../components/common/form"
import { StackedFocusModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useCombinedRefs } from "../../../../../hooks/use-combined-refs"
import { castNumber } from "../../../../../lib/cast-number"
import { CurrencyInfo } from "../../../../../lib/data/currencies"
import { getLocaleAmount } from "../../../../../lib/money-amount-helpers"
import { CreateShippingOptionSchemaType } from "../../../location-service-zone-shipping-option-create/components/create-shipping-options-form/schema"
import {
  CondtionalPriceRuleSchema,
  CondtionalPriceRuleSchemaType,
  UpdateConditionalPriceRuleSchema,
  UpdateConditionalPriceRuleSchemaType,
} from "../../schema"
import { ConditionalPriceInfo } from "../../types"
import { getCustomShippingOptionPriceFieldName } from "../../utils/get-custom-shipping-option-price-field-info"
import { useShippingOptionPrice } from "../shipping-option-price-provider"

const RULE_ITEM_PREFIX = "rule-item"

const getRuleValue = (index: number) => `${RULE_ITEM_PREFIX}-${index}`

interface ConditionalPriceFormProps {
  info: ConditionalPriceInfo
  variant: "create" | "update"
}

export const ConditionalPriceForm = ({
  info,
  variant,
}: ConditionalPriceFormProps) => {
  const { t } = useTranslation()
  const { getValues, setValue: setFormValue } =
    useFormContext<CreateShippingOptionSchemaType>()
  const { onCloseConditionalPricesModal } = useShippingOptionPrice()

  const [value, setValue] = useState<string[]>([getRuleValue(0)])

  const { field, type, currency, name: header } = info

  const name = getCustomShippingOptionPriceFieldName(field, type)

  const conditionalPriceForm = useForm<
    CondtionalPriceRuleSchemaType | UpdateConditionalPriceRuleSchemaType
  >({
    defaultValues: {
      prices: getValues(name) || [
        {
          amount: "",
          gte: "",
          lte: null,
        },
      ],
    },
    resolver: zodResolver(
      variant === "create"
        ? CondtionalPriceRuleSchema
        : UpdateConditionalPriceRuleSchema
    ),
  })

  const { fields, append, remove } = useFieldArray({
    control: conditionalPriceForm.control,
    name: "prices",
  })

  const handleAdd = () => {
    append({
      amount: "",
      gte: "",
      lte: null,
    })

    setValue([...value, getRuleValue(fields.length)])
  }

  const handleRemove = (index: number) => {
    remove(index)
  }

  const handleOnSubmit = conditionalPriceForm.handleSubmit(
    (values) => {
      setFormValue(name, values.prices, {
        shouldDirty: true,
        shouldValidate: true,
        shouldTouch: true,
      })
      onCloseConditionalPricesModal()
    },
    (e) => {
      const indexesWithErrors = Object.keys(e.prices || {})
      setValue((prev) => {
        const values = new Set(prev)

        indexesWithErrors.forEach((index) => {
          values.add(getRuleValue(Number(index)))
        })

        return Array.from(values)
      })
    }
  )

  // Intercept the Cmd + Enter key to only save the inner form.
  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      console.log("Fired")

      event.preventDefault()
      event.stopPropagation()

      handleOnSubmit()
    }
  }

  return (
    <Form {...conditionalPriceForm}>
      <KeyboundForm
        onSubmit={handleOnSubmit}
        onKeyDown={handleOnKeyDown}
        className="flex h-full flex-col"
      >
        <StackedFocusModal.Content>
          <StackedFocusModal.Header />
          <StackedFocusModal.Body className="size-full overflow-hidden">
            <div className="flex size-full flex-1 flex-col items-center overflow-y-auto">
              <div className="flex w-full max-w-[720px] flex-col gap-y-8 px-6 py-16">
                <div className="flex w-full flex-col gap-y-6">
                  <div>
                    <StackedFocusModal.Title asChild>
                      <Heading>
                        {t(
                          "stockLocations.shippingOptions.conditionalPrices.header",
                          {
                            name: header,
                          }
                        )}
                      </Heading>
                    </StackedFocusModal.Title>
                    <StackedFocusModal.Description asChild>
                      <Text size="small" className="text-ui-fg-subtle">
                        {t(
                          "stockLocations.shippingOptions.conditionalPrices.description"
                        )}
                      </Text>
                    </StackedFocusModal.Description>
                  </div>
                  <ConditionalPriceList value={value} onValueChange={setValue}>
                    {fields.map((field, index) => (
                      <ConditionalPriceItem
                        key={field.id}
                        index={index}
                        onRemove={handleRemove}
                        currency={currency}
                        control={conditionalPriceForm.control}
                      />
                    ))}
                  </ConditionalPriceList>
                  <div className="flex items-center justify-end">
                    <Button
                      variant="secondary"
                      size="small"
                      type="button"
                      onClick={handleAdd}
                    >
                      {t(
                        "stockLocations.shippingOptions.conditionalPrices.actions.addPrice"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </StackedFocusModal.Body>
          <StackedFocusModal.Footer>
            <div className="flex items-center justify-end gap-2">
              <StackedFocusModal.Close asChild>
                <Button variant="secondary" size="small" type="button">
                  {t("actions.cancel")}
                </Button>
              </StackedFocusModal.Close>
              <Button size="small" type="button" onClick={handleOnSubmit}>
                {t("actions.save")}
              </Button>
            </div>
          </StackedFocusModal.Footer>
        </StackedFocusModal.Content>
      </KeyboundForm>
    </Form>
  )
}

interface ConditionalPriceListProps {
  children?: ReactNode
  value: string[]
  onValueChange: (value: string[]) => void
}

const ConditionalPriceList = ({
  children,
  value,
  onValueChange,
}: ConditionalPriceListProps) => {
  return (
    <RadixAccordion.Root
      type="multiple"
      defaultValue={[getRuleValue(0)]}
      value={value}
      onValueChange={onValueChange}
      className="flex flex-col gap-y-3"
    >
      {children}
    </RadixAccordion.Root>
  )
}

interface ConditionalPriceItemProps {
  index: number
  currency: CurrencyInfo
  onRemove: (index: number) => void
  control: Control<CondtionalPriceRuleSchemaType>
}

const ConditionalPriceItem = ({
  index,
  currency,
  onRemove,
  control,
}: ConditionalPriceItemProps) => {
  const { t } = useTranslation()

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onRemove(index)
  }

  return (
    <RadixAccordion.Item
      value={getRuleValue(index)}
      className={clx(
        "bg-ui-bg-component shadow-elevation-card-rest rounded-lg"
      )}
    >
      <RadixAccordion.Trigger asChild>
        <div className="group/trigger flex w-full cursor-pointer items-start justify-between gap-x-2 p-3">
          <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
            <div className="flex h-7 items-center">
              <AmountDisplay
                index={index}
                currency={currency}
                control={control}
              />
            </div>
            <div className="flex min-h-7 items-center">
              <ConditionDisplay
                index={index}
                currency={currency}
                control={control}
              />
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <IconButton
              size="small"
              variant="transparent"
              className="text-ui-fg-muted hover:text-ui-fg-subtle focus-visible:text-ui-fg-subtle"
              onClick={handleRemove}
            >
              <XMarkMini />
            </IconButton>
            <IconButton
              size="small"
              variant="transparent"
              className="text-ui-fg-muted hover:text-ui-fg-subtle focus-visible:text-ui-fg-subtle"
            >
              <TriangleDownMini className="transition-transform group-data-[state=open]/trigger:rotate-180" />
            </IconButton>
          </div>
        </div>
      </RadixAccordion.Trigger>
      <RadixAccordion.Content className="text-ui-fg-subtle">
        <Divider variant="dashed" />
        <Form.Field
          control={control}
          name={`prices.${index}.amount`}
          render={({ field: { value, onChange, ...props } }) => {
            return (
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
            )
          }}
        />
        <Divider variant="dashed" />
        <Form.Field
          control={control}
          name={`prices.${index}.gte`}
          render={({ field }) => {
            return (
              <OperatorInput
                field={field}
                label={t(
                  "stockLocations.shippingOptions.conditionalPrices.rules.gte"
                )}
                currency={currency}
                placeholder="1000"
              />
            )
          }}
        />
        <Divider variant="dashed" />
        <Form.Field
          control={control}
          name={`prices.${index}.lte`}
          render={({ field }) => {
            return (
              <OperatorInput
                field={field}
                label={t(
                  "stockLocations.shippingOptions.conditionalPrices.rules.lte"
                )}
                currency={currency}
                placeholder="1000"
              />
            )
          }}
        />
        <ReadOnlyConditions
          index={index}
          control={control}
          currency={currency}
        />
      </RadixAccordion.Content>
    </RadixAccordion.Item>
  )
}

interface OperatorInputProps {
  currency: CurrencyInfo
  placeholder: string
  label: string
  field: ControllerRenderProps<
    CondtionalPriceRuleSchemaType,
    `prices.${number}.lte` | `prices.${number}.gte`
  >
}

const OperatorInput = ({
  field,
  label,
  currency,
  placeholder,
}: OperatorInputProps) => {
  const innerRef = useRef<HTMLInputElement>(null)

  const { value, onChange, ref, ...props } = field

  const refs = useCombinedRefs(innerRef, ref)

  const action = () => {
    if (value === null) {
      onChange("")

      requestAnimationFrame(() => {
        innerRef.current?.focus()
      })

      return
    }

    onChange(null)
  }

  const isNull = value === null

  return (
    <Form.Item>
      <div className="grid grid-cols-2 items-start gap-x-2 p-3">
        <div className="flex h-8 items-center gap-x-1">
          <IconButton size="2xsmall" variant="transparent" onClick={action}>
            {isNull ? <Plus /> : <XMark />}
          </IconButton>
          <Form.Label>{label}</Form.Label>
        </div>
        {!isNull && (
          <div className="flex flex-col gap-y-1">
            <Form.Control>
              <CurrencyInput
                className="bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover focus-visible:bg-ui-bg-field-component-hover"
                placeholder={formatValue({
                  value: placeholder,
                  decimalScale: currency.decimal_digits,
                })}
                decimalScale={currency.decimal_digits}
                symbol={currency.symbol_native}
                code={currency.code}
                value={value}
                ref={refs}
                onValueChange={(_value, _name, values) =>
                  onChange(values?.value ? values?.value : "")
                }
                {...props}
              />
            </Form.Control>
            <Form.ErrorMessage />
          </div>
        )}
      </div>
    </Form.Item>
  )
}

const ReadOnlyConditions = ({
  index,
  control,
  currency,
}: {
  index: number
  control: Control<CondtionalPriceRuleSchemaType>
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

const AmountDisplay = ({
  index,
  currency,
  control,
}: {
  index: number
  currency: CurrencyInfo
  control: Control<CondtionalPriceRuleSchemaType>
}) => {
  const amount = useWatch({
    control,
    name: `prices.${index}.amount`,
  })

  if (amount === "" || amount === undefined) {
    return (
      <Text size="small" weight="plus">
        -
      </Text>
    )
  }

  const castAmount = castNumber(amount)

  return (
    <Text size="small" weight="plus">
      {getLocaleAmount(castAmount, currency.code)}
    </Text>
  )
}

const ConditionContainer = ({ children }: { children: ReactNode }) => (
  <div className="text-ui-fg-subtle txt-small flex flex-wrap items-center gap-1.5">
    {children}
  </div>
)

const ConditionDisplay = ({
  index,
  currency,
  control,
}: {
  index: number
  currency: CurrencyInfo
  control: Control<CondtionalPriceRuleSchemaType>
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

  const renderCondition = () => {
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

  return renderCondition()
}
