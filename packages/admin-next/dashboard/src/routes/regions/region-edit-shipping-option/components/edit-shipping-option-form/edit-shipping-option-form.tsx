import { zodResolver } from "@hookform/resolvers/zod"
import {
  Region,
  ShippingOption,
  ShippingOptionRequirement,
} from "@medusajs/medusa"
import {
  Button,
  CurrencyInput,
  Input,
  Select,
  Switch,
  Text,
} from "@medusajs/ui"
import { useAdminUpdateShippingOption } from "medusa-react"
import { useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Form } from "../../../../../components/common/form"
import { IncludesTaxTooltip } from "../../../../../components/common/tax-badge/tax-badge"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"
import {
  getDbAmount,
  getPresentationalAmount,
} from "../../../../../lib/money-amount-helpers"
import { ShippingOptionPriceType } from "../../../common/constants"

type EditShippingOptionFormProps = {
  region: Region
  shippingOption: ShippingOption
}

const EditShippingOptionSchema = zod
  .object({
    name: zod.string().min(1),
    admin_only: zod.boolean(),
    price_type: zod.nativeEnum(ShippingOptionPriceType),
    includes_tax: zod.boolean(),
    amount: zod
      .union([zod.string(), zod.number()])
      .refine((value) => {
        if (value === "") {
          return false
        }

        const num = Number(value)

        if (isNaN(num)) {
          return false
        }

        return num >= 0
      }, "Amount must be a positive number")
      .optional(),
    min_subtotal: zod
      .union([zod.string(), zod.number()])
      .refine((value) => {
        if (value === "") {
          return true
        }

        const num = Number(value)

        if (isNaN(num)) {
          return false
        }

        return num >= 0
      }, "Min. subtotal must be a positive number")
      .optional(),
    max_subtotal: zod
      .union([zod.string(), zod.number()])
      .refine((value) => {
        if (value === "") {
          return true
        }

        const num = Number(value)

        if (isNaN(num)) {
          return false
        }

        return num >= 0
      }, "Max. subtotal must be a positive number")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.price_type === ShippingOptionPriceType.FLAT_RATE) {
      if (typeof data.amount === "string" && data.amount === "") {
        return ctx.addIssue({
          code: "custom",
          message: "Amount is required",
          path: ["amount"],
        })
      }
    }
  })

export const EditShippingOptionForm = ({
  region,
  shippingOption,
}: EditShippingOptionFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const defaultAmount = shippingOption.amount
    ? getPresentationalAmount(shippingOption.amount, region.currency_code)
    : ""

  const defaultMinSubtotal = shippingOption.requirements.find(
    (r) => r.type === "min_subtotal"
  )
  const defaultMinSubtotalAmount = defaultMinSubtotal
    ? getPresentationalAmount(defaultMinSubtotal.amount, region.currency_code)
    : ""

  const defaultMaxSubtotal = shippingOption.requirements.find(
    (r) => r.type === "max_subtotal"
  )
  const defaultMaxSubtotalAmount = defaultMaxSubtotal
    ? getPresentationalAmount(defaultMaxSubtotal.amount, region.currency_code)
    : ""

  const form = useForm<zod.infer<typeof EditShippingOptionSchema>>({
    defaultValues: {
      admin_only: shippingOption.admin_only,
      name: shippingOption.name,
      amount: defaultAmount,
      max_subtotal: defaultMaxSubtotalAmount,
      min_subtotal: defaultMinSubtotalAmount,
      price_type: shippingOption.price_type,
      includes_tax: shippingOption.includes_tax,
    },
    resolver: zodResolver(EditShippingOptionSchema),
  })

  const watchedPriceType = useWatch({
    control: form.control,
    name: "price_type",
    defaultValue: ShippingOptionPriceType.FLAT_RATE,
  })

  const isFlatRate = watchedPriceType === ShippingOptionPriceType.FLAT_RATE

  const includesTax = useWatch({
    control: form.control,
    name: "includes_tax",
  })

  const { mutateAsync, isLoading } = useAdminUpdateShippingOption(
    shippingOption.id
  )

  const getPricePayload = (amount?: string | number) => {
    if (!amount) {
      return undefined
    }

    const amountValue = typeof amount === "string" ? Number(amount) : amount
    return getDbAmount(amountValue, region.currency_code)
  }

  const handleSubmit = form.handleSubmit(async (values) => {
    const { amount, min_subtotal, max_subtotal, ...rest } = values

    const amountPayload = getPricePayload(amount)

    const minSubtotalPayload = getPricePayload(min_subtotal)
    const maxSubtotalPayload = getPricePayload(max_subtotal)

    const minSubtotalRequirement = minSubtotalPayload
      ? {
          amount: minSubtotalPayload,
          type: "min_subtotal",
        }
      : undefined

    const maxSubtotalRequirement = maxSubtotalPayload
      ? {
          amount: maxSubtotalPayload,
          type: "max_subtotal",
        }
      : undefined

    const requirements = [
      minSubtotalRequirement,
      maxSubtotalRequirement,
    ].filter(Boolean) as ShippingOptionRequirement[]

    await mutateAsync(
      {
        amount: amountPayload,
        requirements,
        ...rest,
      },
      {
        onSuccess: () => {
          handleSuccess()
        },
      }
    )
  })

  return (
    <RouteDrawer.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="flex flex-1 flex-col gap-y-8 overflow-y-auto">
          <Form.Field
            control={form.control}
            name="admin_only"
            render={({ field: { value, onChange, ...field } }) => {
              return (
                <Form.Item>
                  <div>
                    <div className="flex items-center justify-between">
                      <Form.Label>
                        {t("regions.shippingOption.availability.adminOnly")}
                      </Form.Label>
                      <Form.Control>
                        <Switch
                          checked={value}
                          onCheckedChange={onChange}
                          {...field}
                        />
                      </Form.Control>
                    </div>
                    <Form.Hint>
                      {t("regions.shippingOption.availability.adminOnlyHint")}
                    </Form.Hint>
                  </div>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
          <div className="bg-ui-border-base h-px w-full" />
          <Form.Field
            control={form.control}
            name="includes_tax"
            render={({ field: { value, onChange, ...field } }) => {
              return (
                <Form.Item>
                  <div>
                    <div className="flex items-start justify-between">
                      <Form.Label>{t("fields.taxInclusivePricing")}</Form.Label>
                      <Form.Control>
                        <Switch
                          {...field}
                          checked={value}
                          onCheckedChange={onChange}
                        />
                      </Form.Control>
                    </div>
                    <Form.Hint>{t("regions.taxInclusiveHint")}</Form.Hint>
                    <Form.ErrorMessage />
                  </div>
                </Form.Item>
              )
            }}
          />
          <div className="bg-ui-border-base h-px w-full" />
          <div className="flex flex-col gap-y-4">
            <Form.Field
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.name")}</Form.Label>
                    <Form.Control>
                      <Input {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="price_type"
              render={({ field: { onChange, ref, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Label>
                      {t("regions.shippingOption.priceType.label")}
                    </Form.Label>
                    <Form.Control>
                      <Select onValueChange={onChange} {...field}>
                        <Select.Trigger ref={ref}>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                          <Select.Item
                            value={ShippingOptionPriceType.FLAT_RATE}
                          >
                            {t("regions.shippingOption.priceType.flatRate")}
                          </Select.Item>
                          <Select.Item
                            value={ShippingOptionPriceType.CALCULATED}
                          >
                            {t("regions.shippingOption.priceType.calculated")}
                          </Select.Item>
                        </Select.Content>
                      </Select>
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            {isFlatRate && (
              <Form.Field
                control={form.control}
                name="amount"
                shouldUnregister
                render={({ field: { onChange, ...field } }) => {
                  return (
                    <Form.Item>
                      <Form.Label
                        icon={<IncludesTaxTooltip includesTax={includesTax} />}
                      >
                        {t("fields.price")}
                      </Form.Label>
                      <Form.Control>
                        <CurrencyInput
                          code={region.currency_code}
                          symbol={region.currency.symbol_native}
                          onValueChange={onChange}
                          {...field}
                        />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            )}
          </div>
          <div className="bg-ui-border-base h-px w-full" />
          <div className="flex flex-col gap-y-4">
            <div>
              <Text size="small" leading="compact" weight="plus">
                {t("regions.shippingOption.requirements.label")}
              </Text>
              <Text size="small" className="text-ui-fg-subtle">
                {t("regions.shippingOption.requirements.hint")}
              </Text>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Form.Field
                control={form.control}
                name="min_subtotal"
                shouldUnregister
                render={({ field: { onChange, ...field } }) => {
                  return (
                    <Form.Item>
                      <Form.Label
                        icon={<IncludesTaxTooltip includesTax={includesTax} />}
                        optional
                      >
                        {t("fields.minSubtotal")}
                      </Form.Label>
                      <Form.Control>
                        <CurrencyInput
                          code={region.currency_code}
                          symbol={region.currency.symbol_native}
                          onValueChange={onChange}
                          {...field}
                        />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                control={form.control}
                name="max_subtotal"
                shouldUnregister
                render={({ field: { onChange, ...field } }) => {
                  return (
                    <Form.Item>
                      <Form.Label
                        icon={<IncludesTaxTooltip includesTax={includesTax} />}
                        optional
                      >
                        {t("fields.maxSubtotal")}
                      </Form.Label>
                      <Form.Control>
                        <CurrencyInput
                          code={region.currency_code}
                          symbol={region.currency.symbol_native}
                          onValueChange={onChange}
                          {...field}
                        />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </div>
          </div>
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button size="small" type="submit" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
