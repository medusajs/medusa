import React, { useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"

import { useAdminCreateClaim } from "medusa-react"
import { PricedVariant } from "@medusajs/client-types"
import { ClaimReason, LineItem, Order } from "@medusajs/medusa"
import { Button, ProgressStatus, ProgressTabs } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { OrderCreateClaimItemTable } from "./order-create-claim-item-table"
import { CreateReturnSchema } from "./schema"
import { getReturnableItemsForClaim } from "../../../../../lib/rma"
import { OrderCreateClaimDetails } from "./order-create-claim-details"

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

export function OrderCreateClaimForm({ order }: CreateReturnsFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const [selectedItems, setSelectedItems] = useState([])
  const [addedItems, setAddedItems] = useState<Partial<LineItem>[]>([])

  const [tab, setTab] = React.useState<Tab>(Tab.ITEMS)

  const { mutateAsync: createClaim, isLoading } = useAdminCreateClaim(order.id)

  // const { shipping_options = [] } = useAdminShippingOptions({
  //   region_id: order.region_id,
  //   is_return: true,
  // })

  const refundableAmount = useRef(0)

  const form = useForm<zod.infer<typeof CreateReturnSchema>>({
    defaultValues: {
      // Items not selected so we don't know defaults yet
      quantity: {},
      reason: {},
      note: {},

      location: "",
      return_shipping: "",
      send_notification: !order.no_notification,

      enable_custom_refund: false,
      enable_custom_shipping_price: false,

      custom_refund: 0,
      custom_shipping_price: 0,
    },
  })

  const returnableItems = useMemo(() => getReturnableItemsForClaim(order), [])
  const selected = returnableItems.filter((i) => selectedItems.includes(i.id))

  const onSubmit = form.handleSubmit(async (data) => {
    const type = addedItems.length ? "replace" : "refund"
    const returnShipping = data.return_shipping

    const returnableItems = selectedItems.map((itemId) => ({
      item_id: itemId,
      quantity: data.quantity[itemId],
      note: data.note[itemId],
      reason: data.reason[itemId] as ClaimReason,
    }))

    const additionalItems =
      type === "replace"
        ? addedItems.map((item) => ({
            quantity: data.quantity[item.id],
            variant_id: item.id,
          }))
        : undefined

    const itemsMissingReturnReason = returnableItems.filter(
      (i) => !data.reason[i.item_id]
    )

    if (itemsMissingReturnReason) {
      itemsMissingReturnReason.forEach((item) => {
        form.setError(
          `reason.${item.item_id}`,
          {
            type: "manual",
            message: t("orders.claims.selectReason"),
          },
          { shouldFocus: true }
        )
      })

      return
    }

    handleSuccess(`/orders/${order.id}`)
  })

  const onVariantAdd = (variants: PricedVariant[]) => {
    setAddedItems(
      variants.map((variant) => {
        const item = {
          id: variant.id,
          variant,
          thumbnail: variant.product.thumbnail,
          title: variant.product.title,
          total: variant.calculated_price_incl_tax,
          quantity: 1,
        }
        form.setValue(`quantity.${item.id}`, 1)
        form.setValue(`reason.${item.id}`, "")
        form.setValue(`note.${item.id}`, "")

        return item
      })
    )

    // TODO: set quantities to form state
  }

  const onVarianRemove = (variantId: string) => {
    setAddedItems((state) => state.filter((i) => i.id !== variantId))
  }

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
          form.setValue(`quantity.${item.id}`, item.returnable_quantity)
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
            {!!returnableItems.length ? (
              <OrderCreateClaimItemTable
                items={returnableItems}
                selectedItems={selectedItems}
                currencyCode={order.currency_code}
                onSelectionChange={onSelectionChange}
              />
            ) : (
              <span>TODO NO shipped items placeholder</span>
            )}
          </ProgressTabs.Content>
          <ProgressTabs.Content value={Tab.DETAILS} className="h-full w-full">
            <OrderCreateClaimDetails
              form={form}
              items={selected}
              order={order}
              addedItems={addedItems}
              onVariantAdd={onVariantAdd}
              onVariantRemove={onVarianRemove}
              onRefundableAmountChange={onRefundableAmountChange}
            />
          </ProgressTabs.Content>
        </RouteFocusModal.Body>
      </ProgressTabs>
    </RouteFocusModal.Form>
  )
}
