import React, { useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"

import { useAdminRequestReturn, useAdminShippingOptions } from "medusa-react"
import { AdminPostOrdersOrderReturnsReq, Order } from "@medusajs/medusa"
import { Button, ProgressStatus, ProgressTabs } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { ItemsTable } from "../items-table"
import { ReturnsForm } from "./returns-form"
import { getDbAmount } from "../../../../../lib/money-amount-helpers"
import { CreateReturnSchema } from "./schema"
import { getAllReturnableItems } from "../../../../../lib/rma"

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

export function CreateReturns({ order }: CreateReturnsFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const [selectedItems, setSelectedItems] = useState([])
  const [tab, setTab] = React.useState<Tab>(Tab.ITEMS)

  const { mutateAsync: requestReturnOrder, isLoading } = useAdminRequestReturn(
    order.id
  )

  const { shipping_options = [] } = useAdminShippingOptions({
    region_id: order.region_id,
    is_return: true,
  })

  const refundableAmount = useRef(0)

  // List of line items that can be returned with updated quantities
  const returnableItems = useMemo(() => getAllReturnableItems(order, false), [])
  // Line items that are selected for return
  const selected = returnableItems.filter((i) => selectedItems.includes(i.id))

  const form = useForm<zod.infer<typeof CreateReturnSchema>>({
    defaultValues: {
      // Items not selected so we don't know defaults yet
      quantity: {},
      reason: {},
      note: {},

      location: "",
      shipping: "",
      send_notification: !order.no_notification,

      enable_custom_refund: false,
      enable_custom_shipping_price: false,

      custom_refund: 0,
      custom_shipping_price: 0,
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    const items = selected.map((item) => {
      const ret = {
        item_id: item.id,
        quantity: data.quantity[item.id],
      }

      if (data.reason[item.id]) {
        ret["reason_id"] = data.reason[item.id]
      }

      if (data.note[item.id]) {
        ret["note"] = data.note[item.id]
      }

      return ret
    })

    let refund = refundableAmount.current

    if (data.enable_custom_refund && data.custom_refund) {
      const customRefund =
        data.custom_refund === "" ? 0 : Number(data.custom_refund)
      refund = getDbAmount(customRefund, order.currency_code)
    }

    const payload: AdminPostOrdersOrderReturnsReq = {
      items,
      no_notification: !data.send_notification,
      refund,
    }

    if (data.location) {
      payload["location_id"] = data.location
    }

    if (data.shipping) {
      const option = shipping_options.find((o) => o.id === data.shipping)!

      const taxRate = option?.tax_rates.reduce((acc, curr) => {
        return acc + curr.rate / 100
      }, 0)

      let price = option.price_incl_tax
        ? Math.round(option.price_incl_tax / (1 + taxRate))
        : 0

      if (data.enable_custom_shipping_price) {
        const customShipping =
          data.custom_shipping_price === ""
            ? 0
            : Number(data.custom_shipping_price)
        price = getDbAmount(customShipping, order.currency_code)
      }

      // TODO: do we send shipping if custom refund is set?
      payload["return_shipping"] = {
        option_id: data.shipping,
        price,
      }
    }

    await requestReturnOrder(payload)

    handleSuccess(`/orders/${order.id}`)
  })

  const [status, setStatus] = React.useState<StepStatus>({
    [Tab.ITEMS]: "not-started",
    [Tab.DETAILS]: "not-started",
  })

  const onTabChange = React.useCallback(
    async (value: Tab) => {
      setTab(value)
    },
    [tab]
  )

  const onNext = React.useCallback(async () => {
    switch (tab) {
      case Tab.ITEMS: {
        selected.forEach((item) => {
          form.setValue(`quantity.${item.id}`, item.quantity)
          form.setValue(`reason.${item.id}`, "")
          form.setValue(`note.${item.id}`, "")
        })
        setTab(Tab.DETAILS)
        break
      }
      case Tab.DETAILS:
        await onSubmit()
        break
    }
  }, [tab, selected])

  const onSelectionChange = (ids: string[]) => {
    setSelectedItems(ids)

    if (ids.length) {
      const state = { ...status }
      state[Tab.ITEMS] = "in-progress"
      setStatus(state)
    }
  }

  const onRefundableAmountChange = (amount: number) => {
    refundableAmount.current = amount
  }

  useEffect(() => {
    if (tab === Tab.DETAILS) {
      const state = { ...status }
      state[Tab.ITEMS] = "completed"
      setStatus({ [Tab.ITEMS]: "completed", [Tab.DETAILS]: "not-started" })
    }
  }, [tab])

  useEffect(() => {
    if (form.formState.isDirty) {
      const state = { ...status }
      state[Tab.ITEMS] = "completed"
      setStatus({ [Tab.ITEMS]: "completed", [Tab.DETAILS]: "in-progress" })
    }
  }, [form.formState.isDirty])

  const canMoveToDetails = selectedItems.length

  return (
    <RouteFocusModal.Form form={form}>
      <ProgressTabs
        value={tab}
        className="h-full"
        onValueChange={(tab) => onTabChange(tab as Tab)}
      >
        <RouteFocusModal.Header className="flex w-full items-center justify-between">
          <ProgressTabs.List className="border-ui-border-base -my-2 ml-2 min-w-0 flex-1 border-l">
            <ProgressTabs.Trigger
              value={Tab.ITEMS}
              className="w-full max-w-[200px]"
              status={status[Tab.ITEMS]}
              disabled={tab === Tab.DETAILS}
            >
              <span className="w-full cursor-auto overflow-hidden text-ellipsis whitespace-nowrap">
                {t("orders.returns.chooseItems")}
              </span>
            </ProgressTabs.Trigger>
            <ProgressTabs.Trigger
              value={Tab.DETAILS}
              className="w-full max-w-[200px]"
              status={status[Tab.DETAILS]}
              disabled={!canMoveToDetails}
            >
              <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                {t("orders.returns.details")}
              </span>
            </ProgressTabs.Trigger>
          </ProgressTabs.List>
          <div className="flex flex-1 items-center justify-end gap-x-2">
            <Button
              className="whitespace-nowrap"
              isLoading={isLoading}
              onClick={onNext}
              disabled={!canMoveToDetails}
              type={tab === Tab.DETAILS ? "submit" : "button"}
            >
              {t(tab === Tab.DETAILS ? "general.save" : "general.next")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex h-[calc(100%-56px)] w-full flex-col items-center overflow-y-auto">
          <ProgressTabs.Content value={Tab.ITEMS} className="h-full w-full">
            <ItemsTable
              items={returnableItems}
              selectedItems={selectedItems}
              onSelectionChange={onSelectionChange}
            />
          </ProgressTabs.Content>
          <ProgressTabs.Content value={Tab.DETAILS} className="h-full w-full">
            <ReturnsForm
              form={form}
              items={selected}
              order={order}
              onRefundableAmountChange={onRefundableAmountChange}
            />
          </ProgressTabs.Content>
        </RouteFocusModal.Body>
      </ProgressTabs>
    </RouteFocusModal.Form>
  )
}
