import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import * as zod from "zod"

import { HttpTypes } from "@medusajs/types"
import {
  Button,
  Heading,
  Input,
  ProgressStatus,
  ProgressTabs,
  RadioGroup,
  Select,
  toast,
} from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { Divider } from "../../../../../components/common/divider"
import { Form } from "../../../../../components/common/form"
import { SwitchBox } from "../../../../../components/common/switch-box"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useFulfillmentProviders } from "../../../../../hooks/api/fulfillment-providers"
import { useRegions } from "../../../../../hooks/api/regions"
import { useCreateShippingOptions } from "../../../../../hooks/api/shipping-options"
import { useShippingProfiles } from "../../../../../hooks/api/shipping-profiles"
import { formatProvider } from "../../../../../lib/format-provider"
import { getDbAmount } from "../../../../../lib/money-amount-helpers"
import { ShippingOptionPriceType } from "../../../common/constants"
import { CreateShippingOptionsPricesForm } from "./create-shipping-options-prices-form"

enum Tab {
  DETAILS = "details",
  PRICING = "pricing",
}

type StepStatus = {
  [key in Tab]: ProgressStatus
}

const CreateShippingOptionSchema = zod.object({
  name: zod.string().min(1),
  price_type: zod.nativeEnum(ShippingOptionPriceType),
  enabled_in_store: zod.boolean(),
  shipping_profile_id: zod.string(),
  provider_id: zod.string().min(1),
  region_prices: zod.record(zod.string(), zod.string().optional()),
  currency_prices: zod.record(zod.string(), zod.string().optional()),
})

type CreateShippingOptionFormProps = {
  zone: HttpTypes.AdminServiceZone
  locationId: string
  isReturn?: boolean
}

export function CreateShippingOptionsForm({
  zone,
  isReturn,
  locationId,
}: CreateShippingOptionFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const [tab, setTab] = React.useState<Tab>(Tab.DETAILS)

  const { fulfillment_providers = [] } = useFulfillmentProviders({
    is_enabled: true,
  })

  const { regions = [] } = useRegions({
    limit: 999,
    fields: "id,currency_code",
  })

  const form = useForm<zod.infer<typeof CreateShippingOptionSchema>>({
    defaultValues: {
      name: "",
      price_type: ShippingOptionPriceType.FlatRate,
      enabled_in_store: true,
      shipping_profile_id: "",
      provider_id: "",
      region_prices: {},
      currency_prices: {},
    },
    resolver: zodResolver(CreateShippingOptionSchema),
  })

  const isCalculatedPriceType =
    form.watch("price_type") === ShippingOptionPriceType.Calculated

  const { mutateAsync: createShippingOption, isPending: isLoading } =
    useCreateShippingOptions()

  const { shipping_profiles: shippingProfiles } = useShippingProfiles({
    limit: 999,
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    const currencyPrices = Object.entries(data.currency_prices)
      .map(([code, value]) => {
        const amount =
          value === "" ? undefined : getDbAmount(Number(value), code)

        return {
          currency_code: code,
          amount: amount,
        }
      })
      .filter((o) => !!o.amount)

    const regionsMap = new Map(regions.map((r) => [r.id, r.currency_code]))

    const regionPrices = Object.entries(data.region_prices)
      .map(([region_id, value]) => {
        const code = regionsMap.get(region_id)

        const amount =
          value === "" ? undefined : getDbAmount(Number(value), code)

        return {
          region_id,
          amount: amount,
        }
      })
      .filter((o) => !!o.amount)

    await createShippingOption(
      {
        name: data.name,
        price_type: data.price_type,
        service_zone_id: zone.id,
        shipping_profile_id: data.shipping_profile_id,
        provider_id: data.provider_id,
        prices: [...currencyPrices, ...regionPrices],
        rules: [
          {
            value: isReturn ? '"true"' : '"false"', // we want JSONB saved as string
            attribute: "is_return",
            operator: "eq",
          },
          {
            value: data.enabled_in_store ? '"true"' : '"false"', // we want JSONB saved as string
            attribute: "enabled_in_store",
            operator: "eq",
          },
        ],
        type: {
          // TODO: FETCH TYPES
          label: "Type label",
          description: "Type description",
          code: "type-code",
        },
      },
      {
        onSuccess: ({ shipping_option }) => {
          toast.success(t("general.success"), {
            description: t("location.shippingOptions.create.successToast", {
              name: shipping_option.name,
            }),
            dismissable: true,
            dismissLabel: t("general.close"),
          })

          handleSuccess(`/settings/locations/${locationId}`)
        },
        onError: (e) => {
          toast.error(t("general.error"), {
            description: e.message,
            dismissable: true,
            dismissLabel: t("actions.close"),
          })
        },
      }
    )
  })

  const [status, setStatus] = React.useState<StepStatus>({
    [Tab.PRICING]: "not-started",
    [Tab.DETAILS]: "not-started",
  })

  const onTabChange = React.useCallback(async (value: Tab) => {
    setTab(value)
  }, [])

  const onNext = React.useCallback(async () => {
    switch (tab) {
      case Tab.DETAILS: {
        setTab(Tab.PRICING)
        break
      }
      case Tab.PRICING:
        break
    }
  }, [tab])

  const canMoveToPricing =
    form.watch("name").length &&
    form.watch("shipping_profile_id") &&
    form.watch("provider_id")

  useEffect(() => {
    if (form.formState.isDirty) {
      setStatus((prev) => ({ ...prev, [Tab.DETAILS]: "in-progress" }))
    } else {
      setStatus((prev) => ({ ...prev, [Tab.DETAILS]: "not-started" }))
    }
  }, [form.formState.isDirty])

  useEffect(() => {
    if (tab === Tab.DETAILS && form.formState.isDirty) {
      setStatus((prev) => ({ ...prev, [Tab.DETAILS]: "in-progress" }))
    }

    if (tab === Tab.PRICING) {
      const hasPricingSet = form
        .getValues(["region_prices", "currency_prices"])
        .map(Object.keys)
        .some((i) => i.length)

      setStatus((prev) => ({
        ...prev,
        [Tab.DETAILS]: "completed",
        [Tab.PRICING]: hasPricingSet ? "in-progress" : "not-started",
      }))
    }
  }, [tab])

  return (
    <RouteFocusModal.Form form={form}>
      <ProgressTabs
        value={tab}
        className="flex h-full flex-col overflow-hidden"
        onValueChange={(tab) => onTabChange(tab as Tab)}
      >
        <form className="flex h-full flex-col" onSubmit={handleSubmit}>
          <RouteFocusModal.Header>
            <ProgressTabs.List className="border-ui-border-base -my-2 ml-2 min-w-0 flex-1 border-l">
              <ProgressTabs.Trigger
                value={Tab.DETAILS}
                status={status[Tab.DETAILS]}
                className="w-full max-w-[200px]"
              >
                <span className="w-full cursor-auto overflow-hidden text-ellipsis whitespace-nowrap">
                  {t("location.shippingOptions.create.details")}
                </span>
              </ProgressTabs.Trigger>
              {!isCalculatedPriceType && (
                <ProgressTabs.Trigger
                  value={Tab.PRICING}
                  className="w-full max-w-[200px]"
                  status={status[Tab.PRICING]}
                  disabled={!canMoveToPricing}
                >
                  <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                    {t("location.shippingOptions.create.pricing")}
                  </span>
                </ProgressTabs.Trigger>
              )}
            </ProgressTabs.List>
            <div className="flex items-center justify-end gap-x-2">
              <RouteFocusModal.Close asChild>
                <Button variant="secondary" size="small">
                  {t("actions.cancel")}
                </Button>
              </RouteFocusModal.Close>
              <Button
                size="small"
                className="whitespace-nowrap"
                isLoading={isLoading}
                onClick={onNext}
                disabled={!canMoveToPricing}
                key={
                  tab === Tab.PRICING || isCalculatedPriceType
                    ? "details"
                    : "pricing"
                }
                type={
                  tab === Tab.PRICING || isCalculatedPriceType
                    ? "submit"
                    : "button"
                }
              >
                {tab === Tab.PRICING || isCalculatedPriceType
                  ? t("actions.save")
                  : t("general.next")}
              </Button>
            </div>
          </RouteFocusModal.Header>

          <RouteFocusModal.Body className="size-full overflow-hidden">
            <ProgressTabs.Content
              value={Tab.DETAILS}
              className="size-full overflow-y-auto"
            >
              <div className="flex flex-1 flex-col items-center overflow-y-auto">
                <div className="flex w-full max-w-[720px] flex-col gap-y-8 px-2 py-16">
                  <Heading>
                    {t(
                      `location.shippingOptions.create.header.${
                        isReturn ? "return" : "outbound"
                      }`,
                      {
                        zone: zone.name,
                      }
                    )}
                  </Heading>

                  <Form.Field
                    control={form.control}
                    name="price_type"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label>
                            {t("location.shippingOptions.create.allocation")}
                          </Form.Label>
                          <Form.Control>
                            <RadioGroup
                              className="grid grid-cols-1 gap-4 md:grid-cols-2"
                              {...field}
                              onValueChange={field.onChange}
                            >
                              <RadioGroup.ChoiceBox
                                className="flex-1"
                                value={ShippingOptionPriceType.FlatRate}
                                label={t(
                                  "location.shippingOptions.create.fixed"
                                )}
                                description={t(
                                  "location.shippingOptions.create.fixedDescription"
                                )}
                              />
                              <RadioGroup.ChoiceBox
                                className="flex-1"
                                value={ShippingOptionPriceType.Calculated}
                                label={t(
                                  "location.shippingOptions.create.calculated"
                                )}
                                description={t(
                                  "location.shippingOptions.create.calculatedDescription"
                                )}
                              />
                            </RadioGroup>
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />

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
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Form.Field
                      control={form.control}
                      name="shipping_profile_id"
                      render={({ field: { onChange, ...field } }) => {
                        return (
                          <Form.Item>
                            <Form.Label>
                              {t("location.shippingOptions.create.profile")}
                            </Form.Label>
                            <Form.Control>
                              <Select {...field} onValueChange={onChange}>
                                <Select.Trigger ref={field.ref}>
                                  <Select.Value />
                                </Select.Trigger>
                                <Select.Content>
                                  {(shippingProfiles ?? []).map((profile) => (
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
                          </Form.Item>
                        )
                      }}
                    />

                    <Form.Field
                      control={form.control}
                      name="provider_id"
                      render={({ field: { onChange, ...field } }) => {
                        return (
                          <Form.Item>
                            <Form.Label>
                              {t("location.shippingOptions.edit.provider")}
                            </Form.Label>
                            <Form.Control>
                              <Select {...field} onValueChange={onChange}>
                                <Select.Trigger ref={field.ref}>
                                  <Select.Value />
                                </Select.Trigger>
                                <Select.Content>
                                  {fulfillment_providers.map((provider) => (
                                    <Select.Item
                                      key={provider.id}
                                      value={provider.id}
                                    >
                                      {formatProvider(provider.id)}
                                    </Select.Item>
                                  ))}
                                </Select.Content>
                              </Select>
                            </Form.Control>
                          </Form.Item>
                        )
                      }}
                    />
                  </div>

                  <Divider />

                  <SwitchBox
                    control={form.control}
                    name="enabled_in_store"
                    label={t("location.shippingOptions.create.enable")}
                    description={t(
                      "location.shippingOptions.create.enableDescription"
                    )}
                  />
                </div>
              </div>
            </ProgressTabs.Content>

            <ProgressTabs.Content
              value={Tab.PRICING}
              className="h-full w-full"
              style={{ width: "100vw" }}
            >
              <CreateShippingOptionsPricesForm form={form} />
            </ProgressTabs.Content>
          </RouteFocusModal.Body>
        </form>
      </ProgressTabs>
    </RouteFocusModal.Form>
  )
}
