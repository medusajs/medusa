import { zodResolver } from "@hookform/resolvers/zod"
import {
  Plus,
  TriangleDownMini,
  XMark,
  XMarkMini,
  CubeSolid,
} from "@medusajs/icons"
import {
  Button,
  clx,
  CurrencyInput,
  Divider,
  Heading,
  IconButton,
  Text,
} from "@medusajs/ui"
import { Accordion as RadixAccordion } from "radix-ui"
import React, { ReactNode, useRef, useState, useEffect } from "react"
import {
  Control,
  ControllerRenderProps,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { formatValue } from "react-currency-input-field"
import { Form } from "../../../../../components/common/form"
import { StackedFocusModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useCombinedRefs } from "../../../../../hooks/use-combined-refs"
import { formatQuantityPrices } from "../../../common/utils"
import { i18n } from "../../../../../components/utilities/i18n"
import { CurrencyInfo } from "../../../../../lib/data/currencies"
import { getLocaleAmount } from "../../../../../lib/money-amount-helpers"
import { PriceListUpdateCurrencyPrice } from "../../schemas"

const QuantityPriceRuleSchema = z
  .object({
    amount: z.string().optional(),
    min_quantity: z.string().optional(),
    max_quantity: z.string().optional(),
    id: z.string().optional(),
  })
  .refine(
    (data) => {
      const min = data.min_quantity ? parseInt(data.min_quantity, 10) : null
      const max = data.max_quantity ? parseInt(data.max_quantity, 10) : null
      return min === null || max === null || min <= max
    },
    {
      message: i18n.t("priceLists.quantityPricing.errors.minGreaterThanMax"),
      path: ["min_quantity"],
    }
  )

const QuantityPriceFormSchema = z.object({
  prices: z.array(QuantityPriceRuleSchema),
})

type QuantityPriceFormSchemaType = z.infer<typeof QuantityPriceFormSchema>

const RULE_ITEM_PREFIX = "rule-item"

const getRuleValue = (index: number) => `${RULE_ITEM_PREFIX}-${index}`

interface QuantityPriceFormProps {
  info: {
    currency: CurrencyInfo
    name: string
    prices: PriceListUpdateCurrencyPrice[]
  }
  onClose: () => void
  onSave: (prices: PriceListUpdateCurrencyPrice[]) => void
}

export const QuantityPriceForm = ({
  info,
  onClose,
  onSave,
}: QuantityPriceFormProps) => {
  const { t } = useTranslation()
  const [value, setValue] = useState<string[]>([getRuleValue(0)])

  const { currency, name, prices: initialPrices } = info

  const quantityPriceForm = useForm<QuantityPriceFormSchemaType>({
    defaultValues: {
      prices: (Array.isArray(initialPrices) ? initialPrices : []).map((p) => ({
        amount: p.amount?.toString() || "",
        min_quantity: p.min_quantity?.toString() || "",
        max_quantity: p.max_quantity?.toString() || "",
        id: p.id ?? undefined,
      })),
    },
    resolver: zodResolver(QuantityPriceFormSchema),
  })

  useEffect(() => {
    if (quantityPriceForm.getValues("prices").length === 0) {
      quantityPriceForm.setValue("prices", [
        {
          amount: "",
          min_quantity: "",
          max_quantity: "",
        },
      ])
    }
  }, [quantityPriceForm])

  const { fields, append, remove } = useFieldArray({
    control: quantityPriceForm.control,
    name: "prices",
  })

  const handleAdd = () => {
    append({
      amount: "",
      min_quantity: "",
      max_quantity: "",
    })

    setValue([...value, getRuleValue(fields.length)])
  }

  const handleRemove = (index: number) => {
    remove(index)
  }

  const onSubmit = (values: QuantityPriceFormSchemaType) => {
    const formattedPrices = formatQuantityPrices(values.prices)
    onSave(formattedPrices)
    onClose()
  }

  const onError = (e: any) => {
    const indexesWithErrors = Object.keys(e.prices || {})
    setValue((prev) => {
      const values = new Set(prev)

      indexesWithErrors.forEach((index) => {
        values.add(getRuleValue(Number(index)))
      })

      return Array.from(values)
    })
  }

  const handleOnSubmit = async (event?: React.BaseSyntheticEvent) => {
    try {
      await quantityPriceForm.handleSubmit(onSubmit, onError)(event)
    } catch (error) {
      console.error("Unexpected form submission error:", error)
    }
  }

  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      event.stopPropagation()
      handleOnSubmit()
    }
  }

  return (
    <Form {...quantityPriceForm}>
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
                        {t("priceLists.quantityPricing.header", {
                          name: name,
                        })}
                      </Heading>
                    </StackedFocusModal.Title>
                    <StackedFocusModal.Description asChild>
                      <Text size="small" className="text-ui-fg-subtle">
                        {t("priceLists.quantityPricing.description")}
                      </Text>
                    </StackedFocusModal.Description>
                  </div>
                  <QuantityPriceList value={value} onValueChange={setValue}>
                    {fields.map((field, index) => (
                      <QuantityPriceItem
                        key={field.id}
                        index={index}
                        onRemove={handleRemove}
                        currency={currency}
                        control={quantityPriceForm.control}
                      />
                    ))}
                  </QuantityPriceList>
                  <div className="flex items-center justify-end">
                    <Button
                      variant="secondary"
                      size="small"
                      type="button"
                      onClick={handleAdd}
                    >
                      {t("priceLists.quantityPricing.actions.addPrice")}
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

interface QuantityPriceListProps {
  children?: ReactNode
  value: string[]
  onValueChange: (value: string[]) => void
}

const QuantityPriceList = ({
  children,
  value,
  onValueChange,
}: QuantityPriceListProps) => {
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

interface QuantityPriceItemProps {
  index: number
  currency: CurrencyInfo
  onRemove: (index: number) => void
  control: Control<QuantityPriceFormSchemaType>
}

const QuantityPriceItem = ({
  index,
  currency,
  onRemove,
  control,
}: QuantityPriceItemProps) => {
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
              <QuantityDisplay index={index} control={control} />
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
                      {t("priceLists.quantityPricing.rules.amount")}
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
          name={`prices.${index}.min_quantity`}
          render={({ field }) => {
            return (
              <QuantityInput
                field={field}
                label={t("priceLists.quantityPricing.rules.minQuantity")}
              />
            )
          }}
        />
        <Divider variant="dashed" />
        <Form.Field
          control={control}
          name={`prices.${index}.max_quantity`}
          render={({ field }) => {
            return (
              <QuantityInput
                field={field}
                label={t("priceLists.quantityPricing.rules.maxQuantity")}
              />
            )
          }}
        />
      </RadixAccordion.Content>
    </RadixAccordion.Item>
  )
}

interface QuantityInputProps {
  label: string
  placeholder?: string
  field: ControllerRenderProps<
    QuantityPriceFormSchemaType,
    `prices.${number}.max_quantity` | `prices.${number}.min_quantity`
  >
}

const QuantityInput = ({ field, label }: QuantityInputProps) => {
  const { t } = useTranslation()
  const innerRef = useRef<HTMLInputElement>(null)
  const [isActive, setIsActive] = useState(false)

  const { value, onChange, ref, ...props } = field

  const refs = useCombinedRefs(innerRef, ref)

  useEffect(() => {
    if (value !== null && value !== "") {
      setIsActive(true)
    }
  }, [value])

  const action = () => {
    if (!isActive) {
      onChange("1")
      setIsActive(true)
      requestAnimationFrame(() => {
        innerRef.current?.focus()
      })
    } else {
      onChange("")
      setIsActive(false)
    }
  }

  return (
    <Form.Item>
      <div className="grid grid-cols-2 items-start gap-x-2 p-3">
        <div className="flex h-8 items-center gap-x-1">
          <IconButton size="2xsmall" variant="transparent" onClick={action}>
            {!isActive ? <Plus /> : <XMark />}
          </IconButton>
          <Form.Label>{label}</Form.Label>
        </div>
        {isActive && (
          <div className="flex flex-col gap-y-1">
            <Form.Control>
              <div className="bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover focus-within:bg-ui-bg-field-component-hover shadow-buttons-neutral placeholder-ui-fg-muted text-ui-fg-base transition-fg focus-within:shadow-borders-interactive-with-active relative flex h-8 w-full items-center gap-x-1 overflow-hidden rounded-md">
                <span className="flex w-fit min-w-[48px] items-center gap-x-1 border-r px-2 py-[9px]">
                  <CubeSolid className="text-ui-fg-muted" />
                  <Text
                    size="small"
                    leading="compact"
                    className="text-ui-fg-muted pointer-events-none select-none uppercase"
                  >
                    {t("priceLists.quantityPricing.rules.qty")}
                  </Text>
                </span>
                <input
                  className="h-full min-w-0 flex-1 appearance-none bg-transparent text-right text-sm outline-none disabled:cursor-not-allowed"
                  value={value}
                  ref={refs}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "")
                    if (val === "") {
                      onChange("")
                      return
                    }
                    if (parseInt(val, 10) < 1) {
                      return
                    }
                    onChange(val)
                  }}
                  {...props}
                />
                <span className="flex w-fit min-w-[32px] items-center justify-center border-l px-2 py-[9px] text-right">
                  <Text
                    size="small"
                    leading="compact"
                    className="text-ui-fg-muted pointer-events-none select-none"
                  >
                    {t("priceLists.quantityPricing.rules.pcs")}
                  </Text>
                </span>
              </div>
            </Form.Control>
            <Form.ErrorMessage />
          </div>
        )}
      </div>
    </Form.Item>
  )
}

const AmountDisplay = ({
  index,
  control,
  currency,
}: {
  index: number
  control: Control<QuantityPriceFormSchemaType>
  currency: CurrencyInfo
}) => {
  const amount = useWatch({
    control,
    name: `prices.${index}.amount`,
  })

  return (
    <Text size="small" weight="plus">
      {amount ? getLocaleAmount(Number(amount), currency.code) : "—"}
    </Text>
  )
}

const QuantityDisplay = ({
  index,
  control,
}: {
  index: number
  control: Control<QuantityPriceFormSchemaType>
}) => {
  const { t } = useTranslation()
  const min = useWatch({
    control,
    name: `prices.${index}.min_quantity`,
  })
  const max = useWatch({
    control,
    name: `prices.${index}.max_quantity`,
  })

  if (!min && !max) {
    return (
      <Text size="small" className="text-ui-fg-subtle">
        {t("priceLists.quantityPricing.rules.allQuantities")}
      </Text>
    )
  }

  return (
    <Text size="small" className="text-ui-fg-subtle">
      {min ? `${t("priceLists.quantityPricing.rules.min")}: ${min}` : ""}
      {min && max ? " / " : ""}
      {max ? `${t("priceLists.quantityPricing.rules.max")}: ${max}` : ""}
    </Text>
  )
}
