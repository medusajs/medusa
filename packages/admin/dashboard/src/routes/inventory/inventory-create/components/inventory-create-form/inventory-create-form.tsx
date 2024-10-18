import { zodResolver } from "@hookform/resolvers/zod"
import {
  Button,
  Heading,
  Input,
  ProgressStatus,
  ProgressTabs,
  Textarea,
  clx,
  toast,
} from "@medusajs/ui"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { HttpTypes } from "@medusajs/types"
import { Divider } from "../../../../../components/common/divider"
import { Form } from "../../../../../components/common/form"
import { SwitchBox } from "../../../../../components/common/switch-box"
import { CountrySelect } from "../../../../../components/inputs/country-select"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import {
  inventoryItemsQueryKeys,
  useCreateInventoryItem,
} from "../../../../../hooks/api/inventory"
import { sdk } from "../../../../../lib/client"
import {
  transformNullableFormData,
  transformNullableFormNumber,
  transformNullableFormNumbers,
} from "../../../../../lib/form-helpers"
import { queryClient } from "../../../../../lib/query-client"
import { InventoryAvailabilityForm } from "./inventory-availability-form"
import { CreateInventoryItemSchema } from "./schema"

enum Tab {
  DETAILS = "details",
  AVAILABILITY = "availability",
}

type StepStatus = {
  [key in Tab]: ProgressStatus
}

type InventoryCreateFormProps = {
  locations: HttpTypes.AdminStockLocation[]
}

export function InventoryCreateForm({ locations }: InventoryCreateFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const [tab, setTab] = useState<Tab>(Tab.DETAILS)

  const form = useForm<CreateInventoryItemSchema>({
    defaultValues: {
      title: "",
      sku: "",
      hs_code: "",
      weight: "",
      length: "",
      height: "",
      width: "",
      origin_country: "",
      mid_code: "",
      material: "",
      description: "",
      requires_shipping: true,
      thumbnail: "",
      locations: Object.fromEntries(
        locations.map((location) => [location.id, ""])
      ),
    },
    resolver: zodResolver(CreateInventoryItemSchema),
  })

  const {
    trigger,
    formState: { isDirty },
  } = form

  const { mutateAsync: createInventoryItem, isPending: isLoading } =
    useCreateInventoryItem()

  const handleSubmit = form.handleSubmit(async (data) => {
    const { locations, weight, length, height, width, ...payload } = data

    const cleanData = transformNullableFormData(payload, false)
    const cleanNumbers = transformNullableFormNumbers(
      {
        weight,
        length,
        height,
        width,
      },
      false
    )

    const { inventory_item } = await createInventoryItem(
      {
        ...cleanData,
        ...cleanNumbers,
      },
      {
        onError: (e) => {
          toast.error(e.message)
          return
        },
      }
    )

    await sdk.admin.inventoryItem
      .batchUpdateLevels(inventory_item.id, {
        create: Object.entries(locations ?? {})
          .filter(([_, quantiy]) => !!quantiy)
          .map(([location_id, stocked_quantity]) => ({
            location_id,
            stocked_quantity: transformNullableFormNumber(
              stocked_quantity,
              false
            ),
          })),
      })
      .then(async () => {
        await queryClient.invalidateQueries({
          queryKey: inventoryItemsQueryKeys.lists(),
        })
      })
      .catch((e) => {
        // Since the inventory item is created, we only log the error,
        // but still close the modal to prevent the user from trying to
        // create the same item again.
        toast.error(e.message)
      })
      .finally(() => {
        handleSuccess()
        toast.success(t("inventory.create.successToast"))
      })
  })

  const [status, setStatus] = useState<StepStatus>({
    [Tab.AVAILABILITY]: "not-started",
    [Tab.DETAILS]: "not-started",
  })

  const onTabChange = useCallback(
    async (value: Tab) => {
      const result = await trigger()

      if (!result) {
        return
      }

      setTab(value)
    },
    [trigger]
  )

  const onNext = useCallback(async () => {
    const result = await trigger()

    if (!result) {
      return
    }

    switch (tab) {
      case Tab.DETAILS: {
        setTab(Tab.AVAILABILITY)
        break
      }
      case Tab.AVAILABILITY:
        break
    }
  }, [tab, trigger])

  useEffect(() => {
    if (isDirty) {
      setStatus((prev) => ({ ...prev, [Tab.DETAILS]: "in-progress" }))
    } else {
      setStatus((prev) => ({ ...prev, [Tab.DETAILS]: "not-started" }))
    }
  }, [isDirty])

  useEffect(() => {
    if (tab === Tab.DETAILS && isDirty) {
      setStatus((prev) => ({ ...prev, [Tab.DETAILS]: "in-progress" }))
    }

    if (tab === Tab.AVAILABILITY) {
      setStatus((prev) => ({
        ...prev,
        [Tab.DETAILS]: "completed",
        [Tab.AVAILABILITY]: "in-progress",
      }))
    }
  }, [tab, isDirty])

  return (
    <RouteFocusModal.Form form={form}>
      <ProgressTabs
        value={tab}
        className="h-full"
        onValueChange={(tab) => onTabChange(tab as Tab)}
      >
        <KeyboundForm
          className="flex h-full flex-col overflow-hidden"
          onSubmit={handleSubmit}
        >
          <RouteFocusModal.Header>
            <ProgressTabs.List className="border-ui-border-base -my-2 ml-2 min-w-0 flex-1 border-l">
              <ProgressTabs.Trigger
                value={Tab.DETAILS}
                status={status[Tab.DETAILS]}
                className="w-full max-w-[200px]"
              >
                <span className="w-full cursor-auto overflow-hidden text-ellipsis whitespace-nowrap">
                  {t("inventory.create.details")}
                </span>
              </ProgressTabs.Trigger>
              <ProgressTabs.Trigger
                value={Tab.AVAILABILITY}
                className="w-full max-w-[200px]"
                status={status[Tab.AVAILABILITY]}
              >
                <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                  {t("inventory.create.availability")}
                </span>
              </ProgressTabs.Trigger>
            </ProgressTabs.List>
          </RouteFocusModal.Header>

          <RouteFocusModal.Body
            className={clx(
              "flex h-full w-full flex-col items-center divide-y overflow-hidden",
              { "mx-auto": tab === Tab.DETAILS }
            )}
          >
            <ProgressTabs.Content
              value={Tab.DETAILS}
              className="h-full w-full overflow-auto px-3"
            >
              <div className="mx-auto flex w-full max-w-[720px] flex-col gap-y-8 px-px py-16">
                <div className="flex flex-col gap-y-8">
                  <Heading>{t("inventory.create.title")}</Heading>
                  <div className="flex flex-col gap-y-6">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <Form.Field
                        control={form.control}
                        name="title"
                        render={({ field }) => {
                          return (
                            <Form.Item>
                              <Form.Label>{t("fields.title")}</Form.Label>
                              <Form.Control>
                                <Input
                                  {...field}
                                  placeholder={t("fields.title")}
                                />
                              </Form.Control>
                              <Form.ErrorMessage />
                            </Form.Item>
                          )
                        }}
                      />

                      <Form.Field
                        control={form.control}
                        name="sku"
                        render={({ field }) => {
                          return (
                            <Form.Item>
                              <Form.Label>{t("fields.sku")}</Form.Label>
                              <Form.Control>
                                <Input {...field} placeholder="sku-123" />
                              </Form.Control>
                              <Form.ErrorMessage />
                            </Form.Item>
                          )
                        }}
                      />
                    </div>

                    <Form.Field
                      control={form.control}
                      name="description"
                      render={({ field }) => {
                        return (
                          <Form.Item>
                            <Form.Label optional>
                              {t("products.fields.description.label")}
                            </Form.Label>
                            <Form.Control>
                              <Textarea
                                {...field}
                                placeholder="The item description"
                              />
                            </Form.Control>
                          </Form.Item>
                        )
                      }}
                    />
                  </div>

                  <SwitchBox
                    control={form.control}
                    name="requires_shipping"
                    label={t("inventory.create.requiresShipping")}
                    description={t("inventory.create.requiresShippingHint")}
                  />
                </div>

                <Divider />

                <div className="flex flex-col gap-y-6">
                  <Heading level="h2">
                    {t("inventory.create.attributes")}
                  </Heading>

                  <div className="grid grid-cols-1 gap-x-4 gap-y-4 lg:grid-cols-2 lg:gap-y-8">
                    <Form.Field
                      control={form.control}
                      name="width"
                      render={({ field }) => {
                        return (
                          <Form.Item>
                            <Form.Label optional>
                              {t("products.fields.width.label")}
                            </Form.Label>
                            <Form.Control>
                              <Input
                                {...field}
                                type="number"
                                min={0}
                                placeholder="100"
                              />
                            </Form.Control>
                          </Form.Item>
                        )
                      }}
                    />

                    <Form.Field
                      control={form.control}
                      name="length"
                      render={({ field }) => {
                        return (
                          <Form.Item>
                            <Form.Label optional>
                              {t("products.fields.length.label")}
                            </Form.Label>
                            <Form.Control>
                              <Input
                                {...field}
                                type="number"
                                min={0}
                                placeholder="100"
                              />
                            </Form.Control>
                          </Form.Item>
                        )
                      }}
                    />

                    <Form.Field
                      control={form.control}
                      name="height"
                      render={({ field }) => {
                        return (
                          <Form.Item>
                            <Form.Label optional>
                              {t("products.fields.height.label")}
                            </Form.Label>
                            <Form.Control>
                              <Input
                                {...field}
                                type="number"
                                min={0}
                                placeholder="100"
                              />
                            </Form.Control>
                          </Form.Item>
                        )
                      }}
                    />

                    <Form.Field
                      control={form.control}
                      name="weight"
                      render={({ field }) => {
                        return (
                          <Form.Item>
                            <Form.Label optional>
                              {t("products.fields.weight.label")}
                            </Form.Label>
                            <Form.Control>
                              <Input
                                {...field}
                                type="number"
                                min={0}
                                placeholder="100"
                              />
                            </Form.Control>
                          </Form.Item>
                        )
                      }}
                    />

                    <Form.Field
                      control={form.control}
                      name="mid_code"
                      render={({ field }) => {
                        return (
                          <Form.Item>
                            <Form.Label optional>
                              {t("products.fields.mid_code.label")}
                            </Form.Label>
                            <Form.Control>
                              <Input {...field} />
                            </Form.Control>
                          </Form.Item>
                        )
                      }}
                    />

                    <Form.Field
                      control={form.control}
                      name="hs_code"
                      render={({ field }) => {
                        return (
                          <Form.Item>
                            <Form.Label optional>
                              {t("products.fields.hs_code.label")}
                            </Form.Label>
                            <Form.Control>
                              <Input {...field} />
                            </Form.Control>
                          </Form.Item>
                        )
                      }}
                    />

                    <Form.Field
                      control={form.control}
                      name="origin_country"
                      render={({ field }) => {
                        return (
                          <Form.Item>
                            <Form.Label optional>
                              {t("products.fields.countryOrigin.label")}
                            </Form.Label>
                            <Form.Control>
                              <CountrySelect {...field} />
                            </Form.Control>
                          </Form.Item>
                        )
                      }}
                    />

                    <Form.Field
                      control={form.control}
                      name="material"
                      render={({ field }) => {
                        return (
                          <Form.Item>
                            <Form.Label optional>
                              {t("products.fields.material.label")}
                            </Form.Label>
                            <Form.Control>
                              <Input {...field} />
                            </Form.Control>
                          </Form.Item>
                        )
                      }}
                    />
                  </div>
                </div>
              </div>
            </ProgressTabs.Content>

            <ProgressTabs.Content
              value={Tab.AVAILABILITY}
              className="size-full"
            >
              <InventoryAvailabilityForm form={form} locations={locations} />
            </ProgressTabs.Content>
          </RouteFocusModal.Body>
          <RouteFocusModal.Footer>
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
                onClick={tab !== Tab.AVAILABILITY ? onNext : undefined}
                key={tab === Tab.AVAILABILITY ? "details" : "pricing"}
                type={tab === Tab.AVAILABILITY ? "submit" : "button"}
              >
                {tab === Tab.AVAILABILITY
                  ? t("actions.save")
                  : t("general.next")}
              </Button>
            </div>
          </RouteFocusModal.Footer>
        </KeyboundForm>
      </ProgressTabs>
    </RouteFocusModal.Form>
  )
}
