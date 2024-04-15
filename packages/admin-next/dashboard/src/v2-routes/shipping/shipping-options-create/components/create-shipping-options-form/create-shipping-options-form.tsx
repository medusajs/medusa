import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect } from "react"
import * as zod from "zod"

import {
  Button,
  Heading,
  Input,
  ProgressStatus,
  ProgressTabs,
  RadioGroup,
  Switch,
  Text,
  clx,
  Select,
} from "@medusajs/ui"
import { ServiceZoneDTO } from "@medusajs/types"
import { useTranslation } from "react-i18next"

import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { Form } from "../../../../../components/common/form"
import { CreateShippingOptionsPricesForm } from "./create-shipping-options-prices-form"
import { useCreateShippingOptions } from "../../../../../hooks/api/shipping-options"
import { useShippingProfiles } from "../../../../../hooks/api/shipping-profiles"
import { getDbAmount } from "../../../../../lib/money-amount-helpers"

enum Tab {
  DETAILS = "details",
  PRICING = "pricing",
}

enum ShippingAllocation {
  FlatRate = "flat",
  Calculated = "calculated",
}

type StepStatus = {
  [key in Tab]: ProgressStatus
}

const CreateServiceZoneSchema = zod.object({
  name: zod.string().min(1),
  price_type: zod.nativeEnum(ShippingAllocation),
  enable_in_store: zod.boolean().optional(),
  shipping_profile_id: zod.string(),
  region_prices: zod.record(zod.string(), zod.string().optional()),
  currency_prices: zod.record(zod.string(), zod.string().optional()),
})

type CreateServiceZoneFormProps = {
  zone: ServiceZoneDTO
}

export function CreateShippingOptionsForm({
  zone,
}: CreateServiceZoneFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const [tab, setTab] = React.useState<Tab>(Tab.DETAILS)

  const form = useForm<zod.infer<typeof CreateServiceZoneSchema>>({
    defaultValues: {
      name: "",
      price_type: ShippingAllocation.FlatRate,
      enable_in_store: true,
      shipping_profile_id: "",
      region_prices: {},
      currency_prices: {},
    },
    resolver: zodResolver(CreateServiceZoneSchema),
  })

  const isCalculatedPriceType =
    form.watch("price_type") === ShippingAllocation.Calculated

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

    /**
     * TODO: region prices
     */
    // Object.entries(data.region_prices).map(([region_id, value]) => {})

    await createShippingOption({
      name: data.name,
      price_type: data.price_type,
      service_zone_id: zone.id,
      shipping_profile_id: data.shipping_profile_id,
      provider_id: "manual_test-provider", // TODO: FETCH PROVIDERS
      prices: [...currencyPrices],
      type: {
        // TODO: FETCH TYPES
        label: "Type label",
        description: "Type description",
        code: "type-code",
      },
    })

    handleSuccess("/shipping")
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
    form.watch("name").length && form.watch("shipping_profile_id")

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
      <form
        className="flex h-full flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <ProgressTabs
          value={tab}
          className="h-full"
          onValueChange={(tab) => onTabChange(tab as Tab)}
        >
          <RouteFocusModal.Header>
            <ProgressTabs.List className="border-ui-border-base -my-2 ml-2 min-w-0 flex-1 border-l">
              <ProgressTabs.Trigger
                value={Tab.DETAILS}
                status={status[Tab.DETAILS]}
                className="w-full max-w-[200px]"
              >
                <span className="w-full cursor-auto overflow-hidden text-ellipsis whitespace-nowrap">
                  {t("shipping.shippingOptions.create.details")}
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
                    {t("shipping.shippingOptions.create.pricing")}
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

          <RouteFocusModal.Body
            className={clx(
              "flex h-full w-fit flex-col items-center divide-y overflow-hidden",
              { "mx-auto": tab === Tab.DETAILS }
            )}
          >
            <ProgressTabs.Content value={Tab.DETAILS} className="h-full w-full">
              <div className="container mx-auto w-[720px] px-1 py-8">
                <Heading className="mb-12 mt-8 text-2xl">
                  {t("shipping.shippingOptions.create.title", {
                    zone: zone.name,
                  })}
                </Heading>

                <div>
                  <Text weight="plus">
                    {t("shipping.shippingOptions.create.subtitle")}
                  </Text>
                  <Text className="text-ui-fg-subtle mb-8 mt-2">
                    {t("shipping.shippingOptions.create.description")}
                  </Text>
                </div>

                <Form.Field
                  control={form.control}
                  name="price_type"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>
                          {t("shipping.shippingOptions.create.allocation")}
                        </Form.Label>
                        <Form.Control>
                          <RadioGroup
                            className="flex justify-between gap-4"
                            {...field}
                            onValueChange={field.onChange}
                          >
                            <RadioGroup.ChoiceBox
                              className="flex-1"
                              value={ShippingAllocation.FlatRate}
                              label={t("shipping.shippingOptions.create.fixed")}
                              description={t(
                                "shipping.shippingOptions.create.fixedDescription"
                              )}
                            />
                            <RadioGroup.ChoiceBox
                              className="flex-1"
                              value={ShippingAllocation.Calculated}
                              label={t(
                                "shipping.shippingOptions.create.calculated"
                              )}
                              description={t(
                                "shipping.shippingOptions.create.calculatedDescription"
                              )}
                            />
                          </RadioGroup>
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />

                <div className="mt-4 flex flex-col divide-y">
                  <div className="mt-4 grid grid-cols-2 gap-4">
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
                      name="shipping_profile_id"
                      render={({ field: { onChange, ...field } }) => {
                        return (
                          <Form.Item>
                            <Form.Label>
                              {t("shipping.shippingOptions.create.profile")}
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
                  </div>
                  <div className="mt-8 pt-8">
                    <Form.Field
                      control={form.control}
                      name="enable_in_store"
                      render={({ field: { value, onChange, ...field } }) => (
                        <Form.Item>
                          <div className="flex items-center justify-between">
                            <Form.Label>
                              {t("shipping.shippingOptions.create.enable")}
                            </Form.Label>
                            <Form.Control>
                              <Switch
                                {...field}
                                checked={!!value}
                                onCheckedChange={onChange}
                              />
                            </Form.Control>
                          </div>
                          <Form.Hint className="!mt-1">
                            {t(
                              "shipping.shippingOptions.create.enableDescription"
                            )}
                          </Form.Hint>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )}
                    />
                  </div>
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
        </ProgressTabs>
      </form>
    </RouteFocusModal.Form>
  )
}
