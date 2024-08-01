import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import * as zod from "zod"

import {
  Button,
  Heading,
  Input,
  ProgressStatus,
  ProgressTabs,
  Switch,
  Textarea,
  clx,
  toast,
} from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { Form } from "../../../../../components/common/form"
import { CountrySelect } from "../../../../../components/inputs/country-select"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import {
  inventoryItemsQueryKeys,
  useCreateInventoryItem,
} from "../../../../../hooks/api/inventory"
import { sdk } from "../../../../../lib/client"
import { queryClient } from "../../../../../lib/query-client"
import { optionalInt } from "../../../../../lib/validation"
import { CreateInventoryAvailabilityForm } from "./create-inventory-availability-form"

enum Tab {
  DETAILS = "details",
  AVAILABILITY = "availability",
}

type StepStatus = {
  [key in Tab]: ProgressStatus
}

const CreateInventoryItemSchema = zod.object({
  title: zod.string().min(1),

  sku: zod.string().optional(),
  hs_code: zod.string().optional(),
  weight: optionalInt,
  length: optionalInt,
  height: optionalInt,
  width: optionalInt,
  origin_country: zod.string().optional(),
  mid_code: zod.string().optional(),
  material: zod.string().optional(),
  description: zod.string().optional(),
  requires_shipping: zod.boolean().optional(),
  thumbnail: zod.string().optional(),
  locations: zod.record(zod.string(), zod.number().optional()).optional(),
  // metadata: zod.record(zod.string(), zod.unknown()).optional(),
})

export function CreateInventoryItemForm() {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const [tab, setTab] = React.useState<Tab>(Tab.DETAILS)

  const form = useForm<zod.infer<typeof CreateInventoryItemSchema>>({
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
    },
    resolver: zodResolver(CreateInventoryItemSchema),
  })

  const { mutateAsync: createInventoryItem, isPending: isLoading } =
    useCreateInventoryItem()

  const handleSubmit = form.handleSubmit(async (data) => {
    const { locations, ...payload } = data

    for (const k in payload) {
      if (payload[k] === "") {
        delete payload[k]
        continue
      }

      if (["weight", "length", "height", "width"].includes(k)) {
        payload[k] = parseInt(payload[k])
      }
    }

    try {
      const { inventory_item } = await createInventoryItem(payload)

      try {
        await sdk.admin.inventoryItem.batchUpdateLevels(inventory_item.id, {
          create: Object.entries(locations)
            .filter(([_, quantiy]) => !!quantiy)
            .map(([location_id, stocked_quantity]) => ({
              location_id,
              stocked_quantity,
            })),
        })

        await queryClient.invalidateQueries({
          queryKey: inventoryItemsQueryKeys.lists(),
        })
      } catch (e) {
        toast.error(e.message)
      }

      handleSuccess()
    } catch (e) {
      toast.error(e.message)
    }
  })

  const [status, setStatus] = React.useState<StepStatus>({
    [Tab.AVAILABILITY]: "not-started",
    [Tab.DETAILS]: "not-started",
  })

  const onTabChange = React.useCallback(async (value: Tab) => {
    const result = await form.trigger()

    if (!result) {
      return
    }

    setTab(value)
  }, [])

  const onNext = React.useCallback(async () => {
    const result = await form.trigger()

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
  }, [tab])

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

    if (tab === Tab.AVAILABILITY) {
      setStatus((prev) => ({
        ...prev,
        [Tab.DETAILS]: "completed",
        [Tab.AVAILABILITY]: "in-progress",
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
          </RouteFocusModal.Header>

          <RouteFocusModal.Body
            className={clx(
              "flex h-full w-full flex-col items-center divide-y overflow-hidden",
              { "mx-auto": tab === Tab.DETAILS }
            )}
          >
            <ProgressTabs.Content value={Tab.DETAILS} className="h-full w-full">
              <div className="mx-auto w-[720px] px-1 py-8">
                <Heading level="h2" className="mb-12 mt-8 text-2xl">
                  {t("inventory.create.title")}
                </Heading>

                <div className="flex flex-col gap-y-6">
                  <div className="grid grid-cols-1 gap-x-3 gap-y-6 lg:grid-cols-2">
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

                    <div className="col-span-2">
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
                    <div className="col-span-2">
                      <Form.Field
                        control={form.control}
                        name="requires_shipping"
                        render={({ field: { value, onChange, ...field } }) => {
                          return (
                            <Form.Item>
                              <div className="flex flex-col gap-y-1">
                                <div className="flex items-center justify-between">
                                  <Form.Label>
                                    {t("inventory.create.requiresShipping")}
                                  </Form.Label>
                                  <Form.Control>
                                    <Switch
                                      checked={value}
                                      onCheckedChange={(checked) =>
                                        onChange(!!checked)
                                      }
                                      {...field}
                                    />
                                  </Form.Control>
                                </div>
                                <Form.Hint>
                                  {t("inventory.create.requiresShippingHint")}
                                </Form.Hint>
                              </div>
                              <Form.ErrorMessage />
                            </Form.Item>
                          )
                        }}
                      />
                    </div>

                    {/* <Form.Field*/}
                    {/*  className="col-span-1"*/}
                    {/*  control={form.control}*/}
                    {/*  name="location_ids"*/}
                    {/*  render={({ field }) => {*/}
                    {/*    return (*/}
                    {/*      <Form.Item>*/}
                    {/*        <Form.Label optional>*/}
                    {/*          {t("inventory.create.locations")}*/}
                    {/*        </Form.Label>*/}
                    {/*        <Form.Control>*/}
                    {/*          <Combobox*/}
                    {/*            {...field}*/}
                    {/*            multiple*/}
                    {/*            options={locations.options}*/}
                    {/*            searchValue={locations.searchValue}*/}
                    {/*            onSearchValueChange={*/}
                    {/*              locations.onSearchValueChange*/}
                    {/*            }*/}
                    {/*            fetchNextPage={locations.fetchNextPage}*/}
                    {/*          />*/}
                    {/*        </Form.Control>*/}
                    {/*        <Form.ErrorMessage />*/}
                    {/*      </Form.Item>*/}
                    {/*    )*/}
                    {/*  }}*/}
                    {/* />*/}
                  </div>

                  <Heading level="h3" className="my-6">
                    {t("inventory.create.attributes")}
                  </Heading>

                  <div className="grid grid-cols-1 gap-x-4 gap-y-8 lg:grid-cols-2">
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
              <CreateInventoryAvailabilityForm form={form} />
            </ProgressTabs.Content>
          </RouteFocusModal.Body>
        </ProgressTabs>
      </form>
    </RouteFocusModal.Form>
  )
}
