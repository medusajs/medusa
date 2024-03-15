import React, { useState } from "react"
import { useForm } from "react-hook-form"

import { Order } from "@medusajs/medusa"
import { Button, ProgressStatus, ProgressTabs } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { RouteFocusModal } from "../../../../../components/route-modal"
import { ItemsTable } from "../items-table"
import { ReturnsForm } from "./returns-form"

type CreateReturnsFormProps = {
  order: Order
}

enum Tab {
  ITEMS = "items",
  DETAILS = "details",
}

type StepStatus = {
  [key in Tab]: ProgressStatus
}

const CreateReturnSchema = zod.object({
  quantity: zod.record<string, number>(zod.string(), zod.number()),
  location: zod.string(),
  shipping: zod.string(),
  send_notification: zod.boolean().optional(),

  enable_custom_refund: zod.boolean().optional(),
  enable_custom_shipping_price: zod.boolean().optional(),

  custom_refund: zod.number().optional(),
  custom_shipping_price: zod.number().optional(),
})

export function CreateReturnsForm({ order }: CreateReturnsFormProps) {
  const { t } = useTranslation()

  const [selectedItems, setSelectedItems] = useState([])
  const [tab, setTab] = React.useState<Tab>(Tab.ITEMS)

  const isSubmitting = false
  const isEditDirty = false

  const selected = order.items.filter((i) => selectedItems.includes(i.id))

  const form = useForm<typeof CreateReturnSchema>({
    defaultValues: {
      quantity: {},
    },
  })

  const [status, setStatus] = React.useState<StepStatus>({
    [Tab.ITEMS]: "not-started",
    [Tab.DETAILS]: "not-started",
  })

  const onTabChange = React.useCallback(
    async (value: Tab) => {
      if (tab === Tab.DETAILS) {
        // await onExitProductPrices(value)
        return
      }

      setTab(value)
    },
    [tab]
  )

  const onBack = React.useCallback(async () => {
    switch (tab) {
      case Tab.ITEMS:
        // onModalStateChange(false)
        break
      case Tab.DETAILS:
        setTab(Tab.ITEMS)
        break
    }
  }, [tab])

  const onNext = React.useCallback(async () => {
    switch (tab) {
      case Tab.ITEMS:
        // onValidateProducts()
        setTab(Tab.DETAILS)
        break
      case Tab.DETAILS:
        // await onSubmit()
        break
    }
  }, [tab])

  const onSelectionChange = (ids: string[]) => {
    setSelectedItems(ids)
  }

  return (
    <RouteFocusModal.Form form={form}>
      <ProgressTabs
        value={tab}
        onValueChange={(tab) => onTabChange(tab as Tab)}
      >
        <RouteFocusModal.Header className="flex w-full items-center justify-between">
          <ProgressTabs.List className="border-ui-border-base -my-2 ml-2 min-w-0 flex-1 border-l">
            <ProgressTabs.Trigger
              value={Tab.ITEMS}
              className="w-full max-w-[200px]"
              status={status[Tab.ITEMS]}
            >
              <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                {t("orders.returns.chooseItems")}
              </span>
            </ProgressTabs.Trigger>
            <ProgressTabs.Trigger
              // disabled={status[Tab.DETAILS] !== "completed"}
              value={Tab.DETAILS}
              className="w-full max-w-[200px]"
              status={status[Tab.DETAILS]}
            >
              <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                {t("orders.returns.details")}
              </span>
            </ProgressTabs.Trigger>
          </ProgressTabs.List>
          <div className="flex flex-1 items-center justify-end gap-x-2">
            <Button
              disabled={isSubmitting}
              variant="secondary"
              onClick={onBack}
            >
              {t("actions.back")}
            </Button>
            <Button
              type="button"
              className="whitespace-nowrap"
              isLoading={isSubmitting}
              onClick={onNext}
            >
              {t(tab === Tab.DETAILS ? "actions.save" : "actions.next")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex h-full w-full flex-col items-center overflow-y-auto">
          <ProgressTabs.Content value={Tab.ITEMS} className="h-full w-full">
            <ItemsTable
              items={order.items}
              selectedItems={selectedItems}
              onSelectionChange={onSelectionChange}
            />
          </ProgressTabs.Content>
          <ProgressTabs.Content value={Tab.DETAILS} className="h-full w-full">
            <ReturnsForm form={form} items={selected} order={order} />
          </ProgressTabs.Content>
        </RouteFocusModal.Body>
      </ProgressTabs>
    </RouteFocusModal.Form>
  )
}
