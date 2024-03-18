import { zodResolver } from "@hookform/resolvers/zod"
import { Trash } from "@medusajs/icons"
import { Customer, Region } from "@medusajs/medusa"
import {
  Avatar,
  Button,
  Checkbox,
  CurrencyInput,
  Heading,
  Input,
  Label,
  ProgressTabs,
  Select,
  Text,
} from "@medusajs/ui"
import * as Collapsible from "@radix-ui/react-collapsible"
import { useInfiniteQuery } from "@tanstack/react-query"
import { debounce } from "lodash"
import {
  useAdminCreateDraftOrder,
  useAdminCustomer,
  useAdminRegions,
} from "medusa-react"
import { useCallback, useEffect, useState } from "react"
import {
  Control,
  UseFormReturn,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form"
import { useTranslation } from "react-i18next"
import { json, useSearchParams } from "react-router-dom"
import { z } from "zod"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { Combobox } from "../../../../../components/common/combobox"
import { ConditionalTooltip } from "../../../../../components/common/conditional-tooltip"
import { Form } from "../../../../../components/common/form"
import { Thumbnail } from "../../../../../components/common/thumbnail"
import { SplitView } from "../../../../../components/layout/split-view"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { getFormattedAddress } from "../../../../../lib/addresses"
import { medusa } from "../../../../../lib/medusa"
import {
  getDbAmount,
  getStylizedAmount,
} from "../../../../../lib/money-amount-helpers"
import { CreateDraftOrderSchema, View } from "./constants"
import { CreateDraftOrderDrawer } from "./create-draft-order-drawer"
import { CustomItem, ExistingItem, ShippingMethod } from "./types"

enum Tab {
  DETAILS = "details",
  SUMMARY = "summary",
}

export const CreateDraftOrderForm = () => {
  const [open, setOpen] = useState(false)

  const [view, setView] = useState<View | null>(null)
  const [tab, setTab] = useState<Tab>(Tab.DETAILS)

  const [region, setRegion] = useState<Region | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)

  const [sameAsShipping, setSameAsShipping] = useState(true)

  const { t } = useTranslation()
  const [, setSearchParams] = useSearchParams()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof CreateDraftOrderSchema>>({
    defaultValues: {
      email: "",
      region_id: "",
      shipping_methods: [],
      shipping_address: {
        address_1: "",
        address_2: "",
        city: "",
        company: "",
        country_code: "",
        first_name: "",
        last_name: "",
        phone: "",
        postal_code: "",
        province: "",
      },
      billing_address: null,
      existing_items: [],
      custom_items: [],
      customer_id: "",
    },
    resolver: zodResolver(CreateDraftOrderSchema),
  })

  const { watchedRegionId, watchedCustomerId } = useWatchItems(form.control)

  const {
    append: createCustomItem,
    remove: deleteCustomItem,
    fields: customItems,
  } = useFieldArray({
    control: form.control,
    name: "custom_items",
    keyName: "ci_id",
  })

  const {
    append: createExistingItem,
    remove: deleteExistingItem,
    fields: existingItems,
  } = useFieldArray({
    control: form.control,
    name: "existing_items",
    keyName: "ei_id",
  })

  const {
    append: createShippingMethod,
    remove: deleteShippingMethod,
    fields: shippingMethods,
  } = useFieldArray({
    control: form.control,
    name: "shipping_methods",
    keyName: "sh_id",
  })

  const { regions, isLoading: isLoadingRegions } = useAdminRegions({
    limit: 1000,
    fields: "id,name,currency_code",
  })

  const { currency_code, currency } =
    regions?.find((r) => r.id === watchedRegionId) ?? {}

  const { mutateAsync, isLoading } = useAdminCreateDraftOrder()

  const handleSubmit = form.handleSubmit(async (values) => {
    let {
      shipping_address,
      billing_address,
      existing_items,
      custom_items,
      shipping_methods,
      email,
      ...rest
    } = values

    const emailValue = email || customer?.email

    if (!emailValue) {
      form.setError("email", {
        type: "manual",
        message: "Email is required",
      })

      form.setError("customer_id", {
        type: "manual",
        message: "Customer is required",
      })

      return
    }

    if (!billing_address) {
      billing_address = shipping_address
    }

    const preparedExistingItems =
      existing_items?.map((item) => {
        const { custom_unit_price, variant_id, quantity } = item

        const customUnitPriceCast = Number(custom_unit_price)
        const customUnitPriceValue = !isNaN(customUnitPriceCast)
          ? getDbAmount(customUnitPriceCast, currency_code!)
          : undefined

        return {
          variant_id,
          quantity,
          unit_price: customUnitPriceValue,
        }
      }) || []

    const preparedCustomItems =
      custom_items?.map((item) => {
        const { unit_price, quantity, title } = item

        const unitPriceCast = Number(unit_price)
        const unitPriceValue = !isNaN(unitPriceCast)
          ? getDbAmount(unitPriceCast, currency_code!)
          : undefined

        return {
          title,
          quantity,
          unit_price: unitPriceValue,
        }
      }) || []

    const items = [...preparedExistingItems, ...preparedCustomItems]

    await mutateAsync(
      {
        ...rest,
        email: emailValue,
        shipping_address,
        billing_address,
        items: items,
        shipping_methods: [],
      },
      {
        onSuccess: ({ draft_order }) => {
          handleSuccess(`../${draft_order.id}`)
        },
      }
    )
  })

  const handleUpdateExistingItems = (items: ExistingItem[]) => {
    handleUpdateEntities(
      items,
      existingItems,
      deleteExistingItem,
      createExistingItem,
      "variant_id"
    )

    setView(null)
    setOpen(false)
  }

  const handleCreateCustomItem = (item: CustomItem) => {
    createCustomItem(item)

    setView(null)
    setOpen(false)
  }

  const handleUpdateShippingMethods = async (methods: ShippingMethod[]) => {
    try {
      const { shipping_options } = await medusa.admin.shippingOptions.list({
        id: methods.map((m) => m.option_id),
        limit: methods.length,
      })
    } catch (error) {
      // Show error in toast
      return
    }

    handleUpdateEntities(
      methods,
      shippingMethods,
      deleteShippingMethod,
      createShippingMethod,
      "option_id"
    )

    setView(null)
    setOpen(false)
  }

  const handleOpenDrawer = (view: View) => {
    setView(view)
    setOpen(true)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setView(null)
      setSearchParams(
        {},
        {
          replace: true,
        }
      )
    }

    setOpen(open)
  }

  return (
    <RouteFocusModal.Form form={form}>
      <form
        className="flex h-full flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <ProgressTabs
          value={tab}
          onValueChange={(tab) => setTab(tab as Tab)}
          className="flex h-full flex-col overflow-hidden"
        >
          <RouteFocusModal.Header>
            <div className="flex w-full items-center justify-between gap-x-4">
              <div className="-my-2 w-full max-w-[400px] border-l">
                <ProgressTabs.List className="grid w-full grid-cols-2">
                  <ProgressTabs.Trigger className="w-full" value={Tab.DETAILS}>
                    Details
                  </ProgressTabs.Trigger>
                  <ProgressTabs.Trigger className="w-full" value={Tab.SUMMARY}>
                    Summary
                  </ProgressTabs.Trigger>
                </ProgressTabs.List>
              </div>
              <div className="flex items-center gap-x-2">
                <RouteFocusModal.Close asChild>
                  <Button variant="secondary" size="small">
                    {t("actions.cancel")}
                  </Button>
                </RouteFocusModal.Close>
                <Button type="submit" size="small" isLoading={isLoading}>
                  {t("actions.save")}
                </Button>
              </div>
            </div>
          </RouteFocusModal.Header>
          <RouteFocusModal.Body className="flex h-full w-full flex-col items-center overflow-hidden">
            <ProgressTabs.Content
              value={Tab.DETAILS}
              className="flex h-full w-full flex-col items-center overflow-hidden"
            >
              <SplitView open={open} onOpenChange={handleOpenChange}>
                <SplitView.Content>
                  <div className="flex size-full flex-col items-center px-16">
                    <div className="flex w-full max-w-[720px] flex-col gap-y-8 py-16">
                      <div className="flex flex-col gap-y-1">
                        <Heading>
                          {t("draftOrders.create.createDraftOrder")}
                        </Heading>
                        <Text size="small" className="text-ui-fg-subtle">
                          {t("draftOrders.create.createDraftOrderHint")}
                        </Text>
                      </div>
                      <RegionDetails
                        control={form.control}
                        setRegion={setRegion}
                      />
                      <div className="bg-ui-border-base h-px w-full" />
                      <CustomerDetails
                        control={form.control}
                        setCustomer={setCustomer}
                      />
                      <div className="bg-ui-border-base h-px w-full" />
                      <div className="flex flex-col gap-y-4">
                        <Heading level="h2">{t("fields.items")}</Heading>
                        <div className="flex flex-col gap-y-8">
                          <fieldset className="flex flex-col gap-y-4">
                            <Form.Field
                              control={form.control}
                              name="existing_items"
                              render={({ field }) => {
                                return (
                                  <div className="flex flex-col gap-y-4">
                                    <Form.Item>
                                      <Form.Label>
                                        {t(
                                          "draftOrders.create.existingItemsLabel"
                                        )}
                                      </Form.Label>
                                      <Form.Hint>
                                        {t(
                                          "draftOrders.create.existingItemsHint"
                                        )}
                                      </Form.Hint>
                                    </Form.Item>
                                    {existingItems.length > 0 ? (
                                      existingItems.map((item, index) => {
                                        return (
                                          <div
                                            key={item.ei_id}
                                            className="bg-ui-bg-component shadow-elevation-card-rest divide-y rounded-xl"
                                          >
                                            <div className="flex items-center justify-between p-3">
                                              <div className="flex items-center gap-x-2">
                                                <div className="shadow-borders-base size-fit overflow-hidden rounded-[4px]">
                                                  <Thumbnail
                                                    src={item.thumbnail}
                                                  />
                                                </div>
                                                <div>
                                                  <div className="flex items-center gap-x-1">
                                                    <Text
                                                      size="small"
                                                      leading="compact"
                                                      weight="plus"
                                                    >
                                                      {item.product_title}
                                                    </Text>
                                                    {item.sku && (
                                                      <Text
                                                        size="small"
                                                        leading="compact"
                                                        className="text-ui-fg-subtle"
                                                      >
                                                        ({item.sku})
                                                      </Text>
                                                    )}
                                                  </div>
                                                  <Text
                                                    size="small"
                                                    leading="compact"
                                                    className="text-ui-fg-subtle"
                                                  >
                                                    {item.variant_title}
                                                  </Text>
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-x-3">
                                                <Text
                                                  size="small"
                                                  leading="compact"
                                                  className="text-ui-fg-subtle"
                                                >
                                                  {getStylizedAmount(
                                                    item.unit_price,
                                                    currency_code!
                                                  )}
                                                </Text>
                                                <ActionMenu
                                                  groups={[
                                                    {
                                                      actions: [
                                                        {
                                                          label:
                                                            t("actions.remove"),
                                                          onClick: () =>
                                                            deleteExistingItem(
                                                              index
                                                            ),
                                                          icon: <Trash />,
                                                        },
                                                      ],
                                                    },
                                                  ]}
                                                />
                                              </div>
                                            </div>
                                            <div className="flex flex-col gap-y-3 p-3">
                                              <Form.Field
                                                control={form.control}
                                                name={`existing_items.${index}.quantity`}
                                                render={({
                                                  field: { onChange, ...field },
                                                }) => {
                                                  return (
                                                    <Form.Item>
                                                      <Form.Label>
                                                        {t("fields.quantity")}
                                                      </Form.Label>
                                                      <Form.Control>
                                                        <Input
                                                          className="!bg-ui-bg-field-component hover:!bg-ui-bg-field-component-hover"
                                                          type="number"
                                                          onChange={(e) =>
                                                            onChange(
                                                              Number(
                                                                e.target.value
                                                              )
                                                            )
                                                          }
                                                          {...field}
                                                        />
                                                      </Form.Control>
                                                    </Form.Item>
                                                  )
                                                }}
                                              />
                                              <Form.Field
                                                control={form.control}
                                                name={`existing_items.${index}.custom_unit_price`}
                                                render={({ field }) => {
                                                  return (
                                                    <Form.Item>
                                                      <Form.Label optional>
                                                        {t(
                                                          "draftOrders.create.unitPriceOverrideLabel"
                                                        )}
                                                      </Form.Label>
                                                      <Form.Control>
                                                        <CurrencyInput
                                                          className="!bg-ui-bg-field-component hover:!bg-ui-bg-field-component-hover"
                                                          code={currency_code!}
                                                          symbol={
                                                            currency?.symbol_native!
                                                          }
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
                                        )
                                      })
                                    ) : (
                                      <div className="flex items-center justify-center px-2 py-3">
                                        <Text
                                          size="small"
                                          leading="compact"
                                          className="text-ui-fg-muted"
                                        >
                                          {t(
                                            "draftOrders.create.noExistingItemsAddedLabel"
                                          )}
                                        </Text>
                                      </div>
                                    )}
                                  </div>
                                )
                              }}
                            />
                            <div className="flex items-center justify-end">
                              <ConditionalTooltip
                                content={t(
                                  "draftOrders.create.chooseRegionTooltip"
                                )}
                                showTooltip={!watchedRegionId}
                              >
                                <Button
                                  disabled={!watchedRegionId}
                                  variant="secondary"
                                  size="small"
                                  type="button"
                                  onClick={() =>
                                    handleOpenDrawer(View.EXISTING_ITEMS)
                                  }
                                >
                                  {t(
                                    "draftOrders.create.addExistingItemsAction"
                                  )}
                                </Button>
                              </ConditionalTooltip>
                            </div>
                          </fieldset>
                          <fieldset className="flex flex-col gap-y-4">
                            <Form.Field
                              control={form.control}
                              name="custom_items"
                              render={({ field }) => {
                                return (
                                  <div className="flex flex-col gap-y-4">
                                    <Form.Item>
                                      <Form.Label>
                                        {t(
                                          "draftOrders.create.customItemsLabel"
                                        )}
                                      </Form.Label>
                                      <Form.Hint>
                                        {t(
                                          "draftOrders.create.customItemsHint"
                                        )}
                                      </Form.Hint>
                                    </Form.Item>
                                    {customItems.length > 0 ? (
                                      customItems.map((item, index) => {
                                        return (
                                          <div
                                            key={item.ci_id}
                                            className="bg-ui-bg-component shadow-elevation-card-rest divide-y rounded-xl"
                                          >
                                            <div className="flex items-center justify-between p-3">
                                              <div>
                                                <div className="flex items-center gap-x-1">
                                                  <Text
                                                    size="small"
                                                    leading="compact"
                                                    weight="plus"
                                                  >
                                                    {item.title}
                                                  </Text>
                                                </div>
                                              </div>

                                              <div className="flex items-center">
                                                <ActionMenu
                                                  groups={[
                                                    {
                                                      actions: [
                                                        {
                                                          label:
                                                            t("actions.remove"),
                                                          onClick: () =>
                                                            deleteExistingItem(
                                                              index
                                                            ),
                                                          icon: <Trash />,
                                                        },
                                                      ],
                                                    },
                                                  ]}
                                                />
                                              </div>
                                            </div>
                                            <div className="flex flex-col gap-y-3 p-3">
                                              <Form.Field
                                                control={form.control}
                                                name={`custom_items.${index}.quantity`}
                                                render={({ field }) => {
                                                  return (
                                                    <Form.Item>
                                                      <Form.Label>
                                                        {t("fields.quantity")}
                                                      </Form.Label>
                                                      <Form.Control>
                                                        <Input
                                                          className="!bg-ui-bg-field-component hover:!bg-ui-bg-field-component-hover"
                                                          type="number"
                                                          {...field}
                                                        />
                                                      </Form.Control>
                                                    </Form.Item>
                                                  )
                                                }}
                                              />
                                              <Form.Field
                                                control={form.control}
                                                name={`custom_items.${index}.unit_price`}
                                                render={({ field }) => {
                                                  return (
                                                    <Form.Item>
                                                      <Form.Label optional>
                                                        Custom price
                                                      </Form.Label>
                                                      <Form.Control>
                                                        <CurrencyInput
                                                          className="!bg-ui-bg-field-component hover:!bg-ui-bg-field-component-hover"
                                                          code={currency_code!}
                                                          symbol={
                                                            currency?.symbol_native!
                                                          }
                                                          {...field}
                                                        />
                                                      </Form.Control>
                                                    </Form.Item>
                                                  )
                                                }}
                                              />
                                            </div>
                                          </div>
                                        )
                                      })
                                    ) : (
                                      <div className="flex items-center justify-center px-2 py-3">
                                        <Text
                                          size="small"
                                          leading="compact"
                                          className="text-ui-fg-muted"
                                        >
                                          {t(
                                            "draftOrders.create.noCustomItemsAddedLabel"
                                          )}
                                        </Text>
                                      </div>
                                    )}
                                  </div>
                                )
                              }}
                            />
                            <div className="flex items-center justify-end">
                              <ConditionalTooltip
                                content={t(
                                  "draftOrders.create.chooseRegionTooltip"
                                )}
                                showTooltip={!watchedRegionId}
                              >
                                <Button
                                  variant="secondary"
                                  size="small"
                                  type="button"
                                  disabled={!watchedRegionId}
                                  onClick={() =>
                                    handleOpenDrawer(View.CUSTOM_ITEMS)
                                  }
                                >
                                  {t("draftOrders.create.addCustomItemAction")}
                                </Button>
                              </ConditionalTooltip>
                            </div>
                          </fieldset>
                        </div>
                      </div>
                      <div className="bg-ui-border-base h-px w-full" />
                      <div className="flex flex-col gap-y-4">
                        <Heading level="h2">{t("fields.shipping")}</Heading>
                        <div className="flex flex-col gap-y-8">
                          <fieldset className="flex flex-col gap-y-4">
                            <Form.Field
                              control={form.control}
                              name="shipping_methods"
                              render={({ field }) => {
                                return (
                                  <div className="flex flex-col gap-y-4">
                                    <Form.Item>
                                      <Form.Label>
                                        {t(
                                          "draftOrders.create.shippingMethodsLabel"
                                        )}
                                      </Form.Label>
                                      <Form.Hint>
                                        {t(
                                          "draftOrders.create.shippingMethodsHint"
                                        )}
                                      </Form.Hint>
                                    </Form.Item>
                                    <div className="overflow-hidden rounded-lg border">
                                      <div className="bg-ui-bg-field [&>div]:txt-compact-small-plus grid grid-cols-2 items-center [&>div:last-of-type]:border-r-0 [&>div]:border-b [&>div]:border-r [&>div]:px-2 [&>div]:py-1.5">
                                        <div>Shipping Option</div>
                                        <div>
                                          {t("fields.unitPrice")}{" "}
                                          {currency_code?.toUpperCase()}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              }}
                            />
                            <div className="flex items-center justify-end">
                              <ConditionalTooltip
                                showTooltip={!watchedRegionId}
                                content={t(
                                  "draftOrders.create.chooseRegionTooltip"
                                )}
                              >
                                <Button
                                  disabled={!watchedRegionId}
                                  variant="secondary"
                                  size="small"
                                  type="button"
                                  onClick={() =>
                                    handleOpenDrawer(View.SHIPPING_METHODS)
                                  }
                                >
                                  {t(
                                    "draftOrders.create.addShippingMethodsAction"
                                  )}
                                </Button>
                              </ConditionalTooltip>
                            </div>
                          </fieldset>
                        </div>
                      </div>
                      <div className="bg-ui-border-base h-px w-full" />
                      <div className="flex flex-col gap-y-4">
                        <Heading level="h2">{t("fields.address")}</Heading>
                        <Text size="small" leading="compact" weight="plus">
                          {t("addresses.shippingAddress.label")}
                        </Text>
                        <AddressFieldset
                          field="shipping_address"
                          region={regions?.find(
                            (r) => r.id === watchedRegionId
                          )}
                          control={form.control}
                        />
                      </div>
                      <div className="flex flex-col gap-y-4">
                        <div className="flex flex-col gap-y-2">
                          <Text size="small" leading="compact" weight="plus">
                            {t("addresses.billingAddress.label")}
                          </Text>
                          <Label className="flex cursor-pointer items-center gap-x-2">
                            <Checkbox
                              checked={sameAsShipping}
                              onCheckedChange={(checked) =>
                                setSameAsShipping(checked === true)
                              }
                            />
                            {t("addresses.billingAddress.sameAsShipping")}
                          </Label>
                        </div>
                        <Collapsible.Root open={!sameAsShipping}>
                          <Collapsible.Content>
                            <AddressFieldset
                              field="billing_address"
                              region={regions?.find(
                                (r) => r.id === watchedRegionId
                              )}
                              control={form.control}
                            />
                          </Collapsible.Content>
                        </Collapsible.Root>
                      </div>
                    </div>
                  </div>
                </SplitView.Content>
                <SplitView.Drawer>
                  {region && (
                    <CreateDraftOrderDrawer
                      view={view}
                      variants={{
                        onSave: handleUpdateExistingItems,
                        items: existingItems,
                        customerId: watchedCustomerId,
                        regionId: watchedRegionId,
                        currencyCode: region.currency_code,
                      }}
                      custom={{
                        onSave: handleCreateCustomItem,
                        currencyCode: region.currency_code,
                        nativeSymbol: region.currency.symbol_native,
                      }}
                      shippingMethods={{
                        regionId: watchedRegionId,
                        onSave: handleUpdateShippingMethods,
                      }}
                    />
                  )}
                </SplitView.Drawer>
              </SplitView>
            </ProgressTabs.Content>
            <ProgressTabs.Content
              value={Tab.SUMMARY}
              className="flex h-full w-full flex-col items-center overflow-hidden"
            >
              <div className="flex size-full flex-col items-center p-16">
                <div className="flex w-full max-w-[720px] flex-col gap-y-8">
                  <Heading>{t("fields.summary")}</Heading>
                  <CustomerSummary form={form} customer={customer} />
                </div>
              </div>
            </ProgressTabs.Content>
          </RouteFocusModal.Body>
        </ProgressTabs>
      </form>
    </RouteFocusModal.Form>
  )
}

const RegionDetails = ({
  control,
  setRegion,
}: {
  control: Control<z.infer<typeof CreateDraftOrderSchema>>
  setRegion: (region: Region) => void
}) => {
  const { t } = useTranslation()

  const { regions, isLoading, isError, error } = useAdminRegions({
    limit: 1000,
    fields: "id,name,currency_code",
  })

  const handleRegionChange = (regId: string) => {
    const region = regions?.find((r) => r.id === regId)

    if (!region) {
      throw json({ message: "Region not found" }, 400)
    }

    setRegion(region)
  }

  if (isError) {
    throw error
  }

  return (
    <fieldset className="grid grid-cols-2 gap-4">
      <Form.Field
        control={control}
        name="region_id"
        render={({ field: { ref, onChange, disabled, ...field } }) => {
          return (
            <Form.Item>
              <Form.Label className="!h2-core">{t("fields.region")}</Form.Label>
              <Form.Hint>{t("draftOrders.create.chooseRegionHint")}</Form.Hint>
              <Form.Control>
                <Select
                  {...field}
                  onValueChange={(id) => {
                    onChange(id)
                    handleRegionChange(id)
                  }}
                  disabled={isLoading || disabled}
                >
                  <Select.Trigger ref={ref}>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    {regions?.map((r) => (
                      <Select.Item key={r.id} value={r.id}>
                        {r.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </Form.Control>
            </Form.Item>
          )
        }}
      />
    </fieldset>
  )
}

const CustomerDetails = ({
  control,
  setCustomer,
}: {
  control: Control<z.infer<typeof CreateDraftOrderSchema>>
  setCustomer: (customer: Customer | null) => void
}) => {
  const [useExistingCustomer, setUseExistingCustomer] = useState(true)
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")

  const { t } = useTranslation()
  const watchedCustomerId = useWatch({ control, name: "customer_id" })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = useCallback(
    debounce((query) => setDebouncedQuery(query), 300),
    []
  )

  useEffect(() => {
    debouncedUpdate(query)

    return () => debouncedUpdate.cancel()
  }, [query, debouncedUpdate])

  const { customer, isError, error } = useAdminCustomer(watchedCustomerId!, {
    enabled: !!watchedCustomerId,
  })

  useEffect(() => {
    setCustomer(customer || null)
  }, [customer, setCustomer])

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["customers", debouncedQuery],
    async ({ pageParam = 0 }) => {
      const res = await medusa.admin.customers.list({
        q: debouncedQuery,
        limit: 10,
        offset: pageParam,
        has_account: true, // Only show customers with confirmed accounts
      })
      return res
    },
    {
      getNextPageParam: (lastPage) => {
        const moreCustomersExist =
          lastPage.count > lastPage.offset + lastPage.limit
        return moreCustomersExist ? lastPage.offset + lastPage.limit : undefined
      },
      keepPreviousData: true,
    }
  )

  const createLabel = (customer?: Customer) => {
    if (!customer) {
      return ""
    }

    const { first_name, last_name, email } = customer

    const name = [first_name, last_name].filter(Boolean).join(" ")

    if (name) {
      return `${name} (${email})`
    }

    return email
  }

  const options =
    data?.pages.flatMap((page) =>
      page.customers.map((c) => ({ label: createLabel(c), value: c.id }))
    ) ?? []

  if (isError) {
    throw error
  }

  return (
    <div className="flex flex-col gap-y-4">
      <Heading level="h2">{t("fields.customer")}</Heading>
      <fieldset className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {useExistingCustomer ? (
          <Form.Field
            key="customer-input"
            control={control}
            name="customer_id"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label className="text-ui-fg-subtle !font-normal">
                    {t("fields.customer")}
                  </Form.Label>
                  <Form.Control>
                    <Combobox
                      {...field}
                      searchValue={query}
                      onSearchValueChange={setQuery}
                      fetchNextPage={fetchNextPage}
                      isFetchingNextPage={isFetchingNextPage}
                      options={options}
                      autoComplete="false"
                    />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
        ) : (
          <Form.Field
            key="email-input"
            control={control}
            name="email"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label className="text-ui-fg-subtle !font-normal">
                    {t("fields.email")}
                  </Form.Label>
                  <Form.Control>
                    <Input {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
        )}
      </fieldset>
      <Label className="flex items-center gap-x-2">
        <Checkbox
          checked={useExistingCustomer}
          onCheckedChange={(val) => setUseExistingCustomer(!!val)}
        />
        <span>{t("draftOrders.create.useExistingCustomerLabel")}</span>
      </Label>
    </div>
  )
}

const ExistingItemDetails = ({
  control,
  items,
}: {
  control: Control<z.infer<typeof CreateDraftOrderSchema>>
  items?: ExistingItem[]
}) => {
  return <div></div>
}

const CustomItemDetails = ({
  control,
  items,
}: {
  control: Control<z.infer<typeof CreateDraftOrderSchema>>
  items?: CustomItem[]
}) => {
  return <div></div>
}

const CustomerSummary = ({
  form,
  customer,
}: {
  form: UseFormReturn<z.infer<typeof CreateDraftOrderSchema>>
  customer: Customer | null
}) => {
  const { t } = useTranslation()

  const shippingAddress = form.getValues("shipping_address")
  const billingAddress = form.getValues("billing_address")

  const email = form.getValues("email")
  const phone = shippingAddress?.phone

  const { first_name, last_name } = customer || shippingAddress || {}
  const name = [first_name, last_name].filter(Boolean).join(" ")
  const fallback = name ? name[0].toUpperCase() : email[0].toUpperCase()

  return (
    <div className="text-ui-fg-subtle grid grid-cols-1 gap-2">
      {customer && (
        <div className="grid grid-cols-2">
          <Text size="small" leading="compact">
            {t("fields.id")}
          </Text>
          <div className="flex items-center gap-x-2">
            <Avatar fallback={fallback} size="2xsmall" />
            <Text size="small" leading="compact">
              {name || email}
            </Text>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2">
        <Text size="small" leading="compact">
          {t("fields.email")}
        </Text>
        <Text size="small" leading="compact">
          {email}
        </Text>
      </div>
      <div className="grid grid-cols-2">
        <Text size="small" leading="compact">
          {t("fields.phone")}
        </Text>
        <Text size="small" leading="compact">
          {phone || "-"}
        </Text>
      </div>
      <div className="grid grid-cols-2">
        <Text size="small" leading="compact">
          {t("addresses.shippingAddress.label")}
        </Text>
        <Text size="small" leading="compact">
          {getFormattedAddress({ address: shippingAddress }).map((line, i) => {
            return (
              <span key={i} className="break-words">
                {line}
                <br />
              </span>
            )
          })}
        </Text>
      </div>
    </div>
  )
}

const useWatchItems = (
  control: Control<z.infer<typeof CreateDraftOrderSchema>>
) => {
  const watchedRegionId = useWatch({
    control,
    name: "region_id",
  })

  const watchedCustomerId = useWatch({
    control,
    name: "customer_id",
  })

  return {
    watchedRegionId,
    watchedCustomerId,
  }
}

const AddressFieldset = ({
  field,
  control,
  region,
}: {
  field: "shipping_address" | "billing_address"
  region?: Region
  control: Control<z.infer<typeof CreateDraftOrderSchema>>
}) => {
  const { t } = useTranslation()

  return (
    <fieldset className="flex flex-col gap-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Form.Field
          control={control}
          name={`${field}.first_name`}
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label className="text-ui-fg-subtle font-normal">
                  {t("fields.firstName")}
                </Form.Label>
                <Form.Control>
                  <Input {...field} />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
        <Form.Field
          control={control}
          name={`${field}.last_name`}
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label className="text-ui-fg-subtle font-normal">
                  {t("fields.lastName")}
                </Form.Label>
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
          control={control}
          name={`${field}.company`}
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label optional className="text-ui-fg-subtle font-normal">
                  {t("fields.company")}
                </Form.Label>
                <Form.Control>
                  <Input {...field} />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
        <Form.Field
          control={control}
          name={`${field}.phone`}
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label optional className="text-ui-fg-subtle font-normal">
                  {t("fields.phone")}
                </Form.Label>
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
          control={control}
          name={`${field}.address_1`}
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label className="text-ui-fg-subtle font-normal">
                  {t("fields.address")}
                </Form.Label>
                <Form.Control>
                  <Input {...field} />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
        <Form.Field
          control={control}
          name={`${field}.address_2`}
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label optional className="text-ui-fg-subtle font-normal">
                  {t("fields.address2")}
                </Form.Label>
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
          control={control}
          name={`${field}.city`}
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label className="text-ui-fg-subtle font-normal">
                  {t("fields.city")}
                </Form.Label>
                <Form.Control>
                  <Input {...field} />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
        <Form.Field
          control={control}
          name={`${field}.postal_code`}
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label className="text-ui-fg-subtle font-normal">
                  {t("fields.postalCode")}
                </Form.Label>
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
          control={control}
          name={`${field}.province`}
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label optional className="text-ui-fg-subtle font-normal">
                  {t("fields.province")}
                </Form.Label>
                <Form.Control>
                  <Input {...field} />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
        <Form.Field
          control={control}
          name={`${field}.country_code`}
          render={({ field: { onChange, ref, disabled, ...field } }) => {
            return (
              <ConditionalTooltip
                showTooltip={!region}
                content={t("draftOrders.create.chooseRegionTooltip")}
              >
                <Form.Item>
                  <Form.Label className="text-ui-fg-subtle font-normal">
                    {t("fields.country")}
                  </Form.Label>
                  <Form.Control>
                    <Select
                      disabled={!region || disabled}
                      onValueChange={onChange}
                      {...field}
                    >
                      <Select.Trigger ref={ref}>
                        <Select.Value />
                      </Select.Trigger>
                      <Select.Content>
                        {region?.countries.map((c) => (
                          <Select.Item key={c.iso_2} value={c.iso_2}>
                            {c.display_name}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select>
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              </ConditionalTooltip>
            )
          }}
        />
      </div>
    </fieldset>
  )
}

const handleUpdateEntities = <T,>(
  newEntities: T[],
  existingEntities: T[],
  deleteEntity: (indices: number[]) => void,
  createEntity: (entities: T[]) => void,
  entityIdKey: keyof T
) => {
  const newEntitiesIdMap = newEntities.map((e) => e[entityIdKey])
  const existingEntitiesIdMap = existingEntities.map((e) => e[entityIdKey])

  const indicesToDelete = existingEntities.reduce((acc, e, i) => {
    if (!newEntitiesIdMap.includes(e[entityIdKey])) {
      acc.push(i)
    }
    return acc
  }, [] as number[])

  const entitiesToAdd = newEntities.filter(
    (e) => !existingEntitiesIdMap.includes(e[entityIdKey])
  )

  deleteEntity(indicesToDelete)
  createEntity(entitiesToAdd)
}
