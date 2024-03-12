import { zodResolver } from "@hookform/resolvers/zod"
import { Region } from "@medusajs/medusa"
import {
  Button,
  Checkbox,
  Heading,
  Input,
  Label,
  Select,
  Text,
  clx,
} from "@medusajs/ui"
import * as Collapsible from "@radix-ui/react-collapsible"
import {
  useAdminCreateDraftOrder,
  useAdminCustomers,
  useAdminRegions,
  useMedusa,
} from "medusa-react"
import { useState } from "react"
import { Control, useFieldArray, useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"
import { z } from "zod"

import { ConditionalTooltip } from "../../../../components/common/conditional-tooltip"
import { Form } from "../../../../components/common/form"
import { SplitView } from "../../../../components/layout/split-view"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../components/route-modal"
import { AddShippingMethodDrawer } from "./add-shipping-method-drawer"
import { AddVariantDrawer } from "./add-variant-drawer"
import {
  AddressPayload,
  CustomItemSchema,
  ExistingItemSchema,
  ShippingMethodSchema,
} from "./constants"
import { CustomItem, ExistingItem, ShippingMethod } from "./types"

const CreateDraftOrderSchema = z.object({
  email: z.string().email(),
  region_id: z.string().min(1),
  customer_id: z.string().optional(),
  shipping_address: AddressPayload,
  billing_address: AddressPayload.nullable(),
  existing_items: z.array(ExistingItemSchema).optional(),
  custom_items: z.array(CustomItemSchema).optional(),
  shipping_methods: z.array(ShippingMethodSchema).optional(),
})

type View = "existing_items" | "shipping_methods"

export const CreateDraftOrderForm = () => {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<View | null>(null)
  const [sameAsShipping, setSameAsShipping] = useState(true)

  const { t } = useTranslation()
  const { client } = useMedusa()
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
  })

  const {
    append: createExistingItem,
    remove: deleteExistingItem,
    fields: existingItems,
  } = useFieldArray({
    control: form.control,
    name: "existing_items",
  })

  const {
    append: createShippingMethod,
    remove: deleteShippingMethod,
    fields: shippingMethods,
  } = useFieldArray({
    control: form.control,
    name: "shipping_methods",
  })

  const { regions, isLoading: isLoadingRegions } = useAdminRegions({
    limit: 1000,
    fields: "id,name,currency_code",
  })

  const { customers, isLoading: isLoadingCustomers } = useAdminCustomers()

  const { currency_code, currency } =
    regions?.find((r) => r.id === watchedRegionId) ?? {}

  const { mutateAsync, isLoading } = useAdminCreateDraftOrder()

  const handleSubmit = form.handleSubmit(async (values) => {
    let {
      shipping_address,
      billing_address,
      existing_items,
      custom_items,
      ...rest
    } = values

    if (!billing_address) {
      billing_address = shipping_address
    }

    await mutateAsync(
      {
        ...rest,
        shipping_address,
        billing_address,
        items: [],
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
  }

  const handleUpdateShippingMethods = (methods: ShippingMethod[]) => {
    handleUpdateEntities(
      methods,
      shippingMethods,
      deleteShippingMethod,
      createShippingMethod,
      "option_id"
    )
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
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button type="submit" size="small" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex h-full w-full flex-col items-center overflow-hidden">
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
                  <fieldset className="grid grid-cols-2 gap-4">
                    <Form.Field
                      control={form.control}
                      name="region_id"
                      render={({
                        field: { ref, onChange, disabled, ...field },
                      }) => {
                        return (
                          <Form.Item>
                            <Form.Label className="!h2-core">
                              {t("fields.region")}
                            </Form.Label>
                            <Form.Hint>
                              {t("draftOrders.create.chooseRegionHint")}
                            </Form.Hint>
                            <Form.Control>
                              <Select
                                {...field}
                                onValueChange={onChange}
                                disabled={isLoadingRegions || disabled}
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
                  <div className="bg-ui-border-base h-px w-full" />
                  <div className="flex flex-col gap-y-4">
                    <Heading level="h2">{t("fields.customer")}</Heading>
                    <fieldset className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Form.Field
                        control={form.control}
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
                    </fieldset>
                  </div>
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
                                    {t("draftOrders.create.existingItemsLabel")}
                                  </Form.Label>
                                  <Form.Hint>
                                    {t("draftOrders.create.existingItemsHint")}
                                  </Form.Hint>
                                </Form.Item>
                                <div className="overflow-hidden rounded-lg border">
                                  <div className="bg-ui-bg-field [&>div]:txt-compact-small-plus grid grid-cols-5 items-start [&>div:last-of-type]:border-r-0 [&>div]:size-full [&>div]:border-b [&>div]:border-r [&>div]:px-2 [&>div]:py-1.5">
                                    <div>{t("fields.product")}</div>
                                    <div>{t("fields.sku")}</div>
                                    <div>{t("fields.variant")}</div>
                                    <div>{t("fields.quantity")}</div>
                                    <div>{t("fields.unitPrice")}</div>
                                  </div>
                                  {existingItems.length > 0 ? (
                                    existingItems.map((item) => {
                                      return (
                                        <div
                                          key={item.id}
                                          className={clx(
                                            "bg-ui-bg-base grid grid-cols-5 items-center",
                                            "[&>div]:txt-compact-small [&>div]:text-ui-fg-subtle [&>div]:size-full [&>div]:text-pretty [&>div]:border-b [&>div]:border-r [&>div]:px-2 [&>div]:py-1.5",
                                            "[&:last-of-type>div]:border-b-0 [&>div:last-of-type]:border-r-0"
                                          )}
                                        >
                                          <div>{item.product_title}</div>
                                          <div>{item.sku ?? "-"}</div>
                                          <div>{item.variant_title}</div>
                                          <div>{item.quantity}</div>
                                          <div className="relative flex size-full">
                                            <Text
                                              className="text-ui-fg-muted absolute left-2"
                                              size="small"
                                              leading="compact"
                                            >
                                              {currency?.symbol_native}
                                            </Text>
                                            <input className="w-full" />
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
                              onClick={() => handleOpenDrawer("existing_items")}
                            >
                              {t("draftOrders.create.addExistingItemsAction")}
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
                                    {t("draftOrders.create.customItemsLabel")}
                                  </Form.Label>
                                  <Form.Hint>
                                    {t("draftOrders.create.customItemsHint")}
                                  </Form.Hint>
                                </Form.Item>
                                <div className="overflow-hidden rounded-lg border">
                                  <div className="bg-ui-bg-field [&>div]:txt-compact-small-plus grid grid-cols-3 items-center [&>div:last-of-type]:border-r-0 [&>div]:border-b [&>div]:border-r [&>div]:px-2 [&>div]:py-1.5">
                                    <div>{t("fields.title")}</div>
                                    <div>{t("fields.quantity")}</div>
                                    <div>
                                      {t("fields.unitPrice")}{" "}
                                      {currency_code?.toUpperCase()}
                                    </div>
                                  </div>
                                  {customItems.length > 0 ? (
                                    customItems.map((item) => {
                                      return (
                                        <div
                                          key={item.id}
                                          className="bg-ui-bg-field [&>div]:txt-compact-small-plus grid grid-cols-3 items-center [&>div:last-of-type]:border-r-0 [&>div]:border-b [&>div]:border-r [&>div]:px-2 [&>div]:py-1.5"
                                        >
                                          <div>
                                            <Text size="small">
                                              {item.title}
                                            </Text>
                                          </div>
                                          <div>
                                            <Text size="small">
                                              {item.quantity}
                                            </Text>
                                          </div>
                                          <div>
                                            <Text size="small">
                                              {item.unit_price}
                                            </Text>
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
                              onClick={() => handleOpenDrawer("existing_items")}
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
                                handleOpenDrawer("shipping_methods")
                              }
                            >
                              {t("draftOrders.create.addShippingMethodsAction")}
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
                      {t("addresses.shippingAddress")}
                    </Text>
                    <AddressFieldset
                      field="shipping_address"
                      region={regions?.find((r) => r.id === watchedRegionId)}
                      control={form.control}
                    />
                  </div>
                  <div className="flex flex-col gap-y-4">
                    <div className="flex flex-col gap-y-2">
                      <Text size="small" leading="compact" weight="plus">
                        {t("addresses.billingAddress")}
                      </Text>
                      <Label className="flex cursor-pointer items-center gap-x-2">
                        <Checkbox
                          checked={sameAsShipping}
                          onCheckedChange={(checked) =>
                            setSameAsShipping(checked === true)
                          }
                        />
                        {t("addresses.sameAsShipping")}
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
              <Drawer
                view={view}
                variants={{
                  onSave: handleUpdateExistingItems,
                  items: existingItems,
                  customerId: watchedCustomerId,
                  regionId: watchedRegionId,
                  currencyCode: currency_code,
                }}
                custom={{
                  onSave: createCustomItem,
                  currencyCode: currency_code,
                }}
                shippingMethods={{
                  regionId: watchedRegionId,
                  onSave: handleUpdateShippingMethods,
                }}
              />
            </SplitView.Drawer>
          </SplitView>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}

const Drawer = ({
  view,
  variants,
  shippingMethods,
}: {
  view: View | null
  variants: {
    regionId?: string
    customerId?: string
    currencyCode?: string
    items?: ExistingItem[]
    onSave: (items: ExistingItem[]) => void
  }
  custom: {
    onSave: (item: CustomItem) => void
    currencyCode?: string
  }
  shippingMethods: {
    regionId?: string
    onSave: (items: ShippingMethod[]) => void
  }
}) => {
  if (view === "existing_items") {
    return <AddVariantDrawer {...variants} />
  }

  if (view === "shipping_methods") {
    return <AddShippingMethodDrawer {...shippingMethods} />
  }

  return null
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
