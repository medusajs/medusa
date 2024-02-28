import { zodResolver } from "@hookform/resolvers/zod"
import {
  FulfillmentOption,
  Region,
  ShippingOptionRequirement,
  ShippingProfile,
} from "@medusajs/medusa"
import {
  Button,
  CurrencyInput,
  Heading,
  Input,
  RadioGroup,
  Select,
  Switch,
  Text,
  clx,
} from "@medusajs/ui"
import { useAdminCreateShippingOption } from "medusa-react"
import { useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { Form } from "../../../../../components/common/form"
import { IncludesTaxTooltip } from "../../../../../components/common/tax-badge/tax-badge"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { formatProvider } from "../../../../../lib/format-provider"
import { getDbAmount } from "../../../../../lib/money-amount-helpers"
import { ShippingOptionPriceType } from "../../../shared/constants"

type CreateShippingOptionProps = {
  region: Region
  shippingProfiles: ShippingProfile[]
  fulfillmentOptions: FulfillmentOption[]
}

enum ShippingOptionType {
  OUTBOUND = "outbound",
  RETURN = "return",
}

const CreateShippingOptionSchema = zod
  .object({
    name: zod.string().min(1),
    type: zod.nativeEnum(ShippingOptionType),
    admin_only: zod.boolean(),
    provider_id: zod.string().min(1),
    profile_id: zod.string().min(1),
    includes_tax: zod.boolean(),
    price_type: zod.nativeEnum(ShippingOptionPriceType),
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

export const CreateShippingOptionForm = ({
  region,
  fulfillmentOptions,
  shippingProfiles,
}: CreateShippingOptionProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof CreateShippingOptionSchema>>({
    defaultValues: {
      name: "",
      type: ShippingOptionType.OUTBOUND,
      admin_only: false,
      provider_id: "",
      profile_id: "",
      price_type: ShippingOptionPriceType.FLAT_RATE,
      includes_tax: false,
      amount: "",
      min_subtotal: "",
      max_subtotal: "",
    },
    resolver: zodResolver(CreateShippingOptionSchema),
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
    defaultValue: false,
  })

  const { mutateAsync, isLoading } = useAdminCreateShippingOption()

  const getPricePayload = (amount?: string | number) => {
    if (!amount) {
      return undefined
    }

    const amountValue = typeof amount === "string" ? Number(amount) : amount
    return getDbAmount(amountValue, region.currency_code)
  }

  const handleSubmit = form.handleSubmit(async (values) => {
    const { type, amount, min_subtotal, max_subtotal, ...rest } = values

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
        region_id: region.id,
        data: {},
        is_return: type === ShippingOptionType.RETURN,
        amount: isFlatRate ? amountPayload : undefined,
        requirements: requirements.length ? requirements : undefined,
        ...rest,
      },
      {
        onSuccess: () => {
          handleSuccess()
        },
        onError: (error) => {
          console.error(error)
        },
      }
    )
  })

  return (
    <RouteFocusModal.Form form={form}>
      <form
        className="flex h-full flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" type="submit" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body>
          <div
            className={clx(
              "flex h-full w-full flex-col items-center overflow-y-auto p-16"
            )}
            id="form-section"
          >
            <div className="flex w-full max-w-[720px] flex-col gap-y-8">
              <div>
                <Heading>
                  {t("regions.shippingOption.createShippingOption")}
                </Heading>
                <Text size="small" className="text-ui-fg-subtle">
                  {t("regions.shippingOption.createShippingOptionHint")}
                </Text>
              </div>
              <Form.Field
                control={form.control}
                name="type"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("fields.type")}</Form.Label>
                      <Form.Control>
                        <RadioGroup
                          {...field}
                          onValueChange={field.onChange}
                          className="grid grid-cols-1 gap-4 md:grid-cols-2"
                        >
                          <RadioGroup.ChoiceBox
                            value={ShippingOptionType.OUTBOUND}
                            label={t("regions.shippingOption.type.outbound")}
                            description={t(
                              "regions.shippingOption.type.outboundHint"
                            )}
                          />
                          <RadioGroup.ChoiceBox
                            value={ShippingOptionType.RETURN}
                            label={t("regions.shippingOption.type.return")}
                            description={t(
                              "regions.shippingOption.type.returnHint"
                            )}
                          />
                        </RadioGroup>
                      </Form.Control>
                    </Form.Item>
                  )
                }}
              />
              <div className="bg-ui-border-base h-px w-full" />
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
                          {t(
                            "regions.shippingOption.availability.adminOnlyHint"
                          )}
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
                          <Form.Label>
                            {t("fields.taxInclusivePricing")}
                          </Form.Label>
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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                                  {t(
                                    "regions.shippingOption.priceType.flatRate"
                                  )}
                                </Select.Item>
                                <Select.Item
                                  value={ShippingOptionPriceType.CALCULATED}
                                >
                                  {t(
                                    "regions.shippingOption.priceType.calculated"
                                  )}
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
                      render={({ field }) => {
                        return (
                          <Form.Item>
                            <Form.Label
                              icon={
                                <IncludesTaxTooltip includesTax={includesTax} />
                              }
                            >
                              {t("fields.price")}
                            </Form.Label>
                            <Form.Control>
                              <CurrencyInput
                                code={region.currency_code}
                                symbol={region.currency.symbol_native}
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
              </div>
              <div className="bg-ui-border-base h-px w-full" />
              <div className="flex flex-col gap-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Form.Field
                    control={form.control}
                    name="profile_id"
                    render={({ field: { onChange, ref, ...field } }) => {
                      return (
                        <Form.Item>
                          <Form.Label>{t("fields.shippingProfile")}</Form.Label>
                          <Form.Control>
                            <Select onValueChange={onChange} {...field}>
                              <Select.Trigger ref={ref}>
                                <Select.Value />
                              </Select.Trigger>
                              <Select.Content>
                                {shippingProfiles.map((profile) => (
                                  <Select.Item
                                    key={profile.id}
                                    value={profile.id}
                                  >
                                    {profile.name}
                                  </Select.Item>
                                ))}
                              </Select.Content>
                            </Select>
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />
                  <Form.Field
                    control={form.control}
                    name="provider_id"
                    render={({ field: { onChange, ref, ...field } }) => {
                      return (
                        <Form.Item>
                          <Form.Label>
                            {t("fields.fulfillmentProvider")}
                          </Form.Label>
                          <Form.Control>
                            <Select onValueChange={onChange} {...field}>
                              <Select.Trigger ref={ref}>
                                <Select.Value />
                              </Select.Trigger>
                              <Select.Content>
                                {fulfillmentOptions.map((option) => (
                                  <Select.Item
                                    key={option.provider_id}
                                    value={option.provider_id}
                                  >
                                    {formatProvider(option.provider_id)}
                                  </Select.Item>
                                ))}
                              </Select.Content>
                            </Select>
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />
                </div>
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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Form.Field
                    control={form.control}
                    name="min_subtotal"
                    shouldUnregister
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label
                            icon={
                              <IncludesTaxTooltip includesTax={includesTax} />
                            }
                            optional
                          >
                            {t("fields.minSubtotal")}
                          </Form.Label>
                          <Form.Control>
                            <CurrencyInput
                              code={region.currency_code}
                              symbol={region.currency.symbol_native}
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
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label
                            icon={
                              <IncludesTaxTooltip includesTax={includesTax} />
                            }
                            optional
                          >
                            {t("fields.maxSubtotal")}
                          </Form.Label>
                          <Form.Control>
                            <CurrencyInput
                              code={region.currency_code}
                              symbol={region.currency.symbol_native}
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
            </div>
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
