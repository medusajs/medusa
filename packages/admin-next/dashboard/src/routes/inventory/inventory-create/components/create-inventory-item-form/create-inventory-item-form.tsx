import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import * as zod from "zod"

import {
  Button,
  Heading,
  ProgressStatus,
  ProgressTabs,
  clx,
  Input,
} from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { CreateInventoryAvailabilityForm } from "./create-inventory-availability-form"
import { Form } from "../../../../../components/common/form"
import { useStockLocations } from "../../../../../hooks/api/stock-locations"
import { Combobox } from "../../../../../components/inputs/combobox"
import { useComboboxData } from "../../../../../hooks/use-combobox-data"
import { client } from "../../../../../lib/client"
import { z } from "zod"

enum Tab {
  DETAILS = "details",
  AVAILABILITY = "availability",
}

type StepStatus = {
  [key in Tab]: ProgressStatus
}

const CreateInventoryItemSchema = zod.object({
  title: z.string().optional(),

  sku: z.string().optional(),
  hs_code: z.string().optional(),
  weight: z.number().optional(),
  length: z.number().optional(),
  height: z.number().optional(),
  width: z.number().optional(),
  origin_country: z.string().optional(),
  mid_code: z.string().optional(),
  material: z.string().optional(),
  description: z.string().optional(),
  requires_shipping: z.boolean().optional(),
  thumbnail: z.string().optional(),
  // metadata: z.record(z.string(), z.unknown()).optional(),
})

type CreateInventoryItemFormProps = {}

export function CreateInventoryItemForm({}: CreateInventoryItemFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const [tab, setTab] = React.useState<Tab>(Tab.DETAILS)

  // const { stock_locations } = useStockLocations({
  //   limit: 1000,
  // })

  // const locations = useComboboxData({
  //   queryKey: ["locations"],
  //   queryFn: client.stockLocations.list,
  //   getOptions: (data) =>
  //     data.stock_locations.map((location) => ({
  //       label: location.name,
  //       value: location.id,
  //     })),
  // })

  const form = useForm<zod.infer<typeof CreateInventoryItemSchema>>({
    defaultValues: {
      title: "",
      sku: "",
    },
    resolver: zodResolver(CreateInventoryItemSchema),
  })

  const { mutateAsync: createInventoryItem, isPending: isLoading } = {}

  const handleSubmit = form.handleSubmit(async (data) => {
    await createInventoryItem({
      title: data.title,
      sku: data.sku,
    })

    handleSuccess()
  })

  const [status, setStatus] = React.useState<StepStatus>({
    [Tab.AVAILABILITY]: "not-started",
    [Tab.DETAILS]: "not-started",
  })

  const onTabChange = React.useCallback(async (value: Tab) => {
    setTab(value)
  }, [])

  const onNext = React.useCallback(async () => {
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
                onClick={onNext}
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
              "flex h-full w-fit flex-col items-center divide-y overflow-hidden",
              { "mx-auto": tab === Tab.DETAILS }
            )}
          >
            <ProgressTabs.Content value={Tab.DETAILS} className="h-full w-full">
              <div className="container mx-auto w-[720px] px-1 py-8">
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

                    {/*<Form.Field*/}
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
                    {/*/>*/}
                  </div>

                  <Heading level="h3" className="my-6">
                    {t("inventory.create.attributes")}
                  </Heading>
                </div>
              </div>
            </ProgressTabs.Content>

            <ProgressTabs.Content
              value={Tab.AVAILABILITY}
              className="h-full w-full"
              style={{ width: "100vw" }}
            >
              <CreateInventoryAvailabilityForm form={form} />
            </ProgressTabs.Content>
          </RouteFocusModal.Body>
        </ProgressTabs>
      </form>
    </RouteFocusModal.Form>
  )
}
