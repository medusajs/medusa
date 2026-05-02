import { Control, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { CurrencyInput, Divider } from "@medusajs/ui"
import { CubeSolid } from "@medusajs/icons"
import { Text } from "@medusajs/ui"
import { i18n } from "../../../../../components/utilities/i18n"
import { CurrencyInfo } from "../../../../../lib/data/currencies"
import { PriceListUpdateCurrencyPrice } from "../../schemas"
import { formatQuantityPrices } from "../../../common/utils"
import { Form } from "../../../../../components/common/form"
import { formatValue } from "react-currency-input-field"
import { TieredPriceInput } from "../../../../../common/components/tiered-price-form/tiered-price-input"
import { TieredPriceForm } from "../../../../../common/components/tiered-price-form/tiered-price-form"

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

interface QuantityPriceFormProps {
  info: {
    currency: CurrencyInfo
    name: string
    prices: PriceListUpdateCurrencyPrice[]
  }
  onClose: () => void
  onSave: (prices: PriceListUpdateCurrencyPrice[]) => void
}

const QuantityConditionTrigger = ({
  index,
  control,
}: {
  index: number
  control: Control<QuantityPriceFormSchemaType>
}) => {
  const minQuantity = useWatch({
    control,
    name: `prices.${index}.min_quantity`,
  })
  const maxQuantity = useWatch({
    control,
    name: `prices.${index}.max_quantity`,
  })

  return (
    <div className="flex min-h-7 items-center gap-x-1">
      {minQuantity && (
        <Text size="small" weight="plus">
          {minQuantity}+
        </Text>
      )}
      {minQuantity && maxQuantity && <span>to</span>}
      {maxQuantity && (
        <Text size="small" weight="plus">
          {maxQuantity}
        </Text>
      )}
      {!minQuantity && !maxQuantity && "—"}
    </div>
  )
}

const QuantityConditionItem = ({
  index,
  control,
  currency,
}: {
  index: number
  control: Control<QuantityPriceFormSchemaType>
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
        )}
      />
      <Divider variant="dashed" />
      <Form.Field
        control={control}
        name={`prices.${index}.min_quantity`}
        render={({ field }) => (
          <TieredPriceInput
            field={field}
            label={t("priceLists.quantityPricing.rules.minQuantity")}
            toggleValues={{ active: "1", inactive: "" }}
            renderInput={({ field, value }) => (
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
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "")
                    if (val === "") {
                      field.onChange("")
                      return
                    }
                    if (parseInt(val, 10) < 1) {
                      return
                    }
                    field.onChange(val)
                  }}
                  {...field}
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
            )}
          />
        )}
      />
      <Divider variant="dashed" />
      <Form.Field
        control={control}
        name={`prices.${index}.max_quantity`}
        render={({ field }) => (
          <TieredPriceInput
            field={field}
            label={t("priceLists.quantityPricing.rules.maxQuantity")}
            toggleValues={{ active: "1", inactive: "" }}
            renderInput={({ field, value }) => (
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
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "")
                    if (val === "") {
                      field.onChange("")
                      return
                    }
                    if (parseInt(val, 10) < 1) {
                      return
                    }
                    field.onChange(val)
                  }}
                  {...field}
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
            )}
          />
        )}
      />
    </>
  )
}

export const QuantityPriceForm = ({
  info,
  onClose,
  onSave,
}: QuantityPriceFormProps) => {
  const { t } = useTranslation()
  const { currency, name, prices: initialPrices } = info

  return (
    <TieredPriceForm
      schema={QuantityPriceFormSchema}
      initialValues={(Array.isArray(initialPrices) && initialPrices.length > 0
        ? initialPrices
        : [{ amount: "", min_quantity: "", max_quantity: "" }]
      ).map((p) => ({
        amount: p.amount?.toString() || "",
        min_quantity: p.min_quantity?.toString() || "",
        max_quantity: p.max_quantity?.toString() || "",
        id: p.id ?? undefined,
      }))}
      onSubmit={(values) => onSave(formatQuantityPrices(values.prices))}
      onClose={onClose}
      currency={currency}
      header={t("priceLists.quantityPricing.header", {
        name: name,
      })}
      description={t("priceLists.quantityPricing.description")}
      addPriceLabel={t("priceLists.quantityPricing.actions.addPrice")}
      fieldConfig={{
        min: "min_quantity",
        max: "max_quantity",
        minLabel: t("priceLists.quantityPricing.rules.minQuantity"),
        maxLabel: t("priceLists.quantityPricing.rules.maxQuantity"),
      }}
      renderConditionTrigger={(props) => (
        <QuantityConditionTrigger {...props} />
      )}
      renderConditionItem={(props) => <QuantityConditionItem {...props} />}
    />
  )
}
