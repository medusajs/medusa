import React, { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import * as zod from "zod"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"
import {
  adminOrderEditsKeys,
  adminOrderKeys,
  useAdminCancelOrderEdit,
  useAdminConfirmOrderEdit,
  useAdminOrderEditAddLineItem,
  useAdminUpdateOrderEdit,
} from "medusa-react"

import { Button, clx, Heading, Text, Textarea } from "@medusajs/ui"
import { Order, OrderEdit } from "@medusajs/medusa"

import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { SplitView } from "../../../../../components/layout/split-view"
import { VariantTable } from "../variant-table"

import { medusa, queryClient } from "../../../../../lib/medusa.ts"
import { MoneyAmountCell } from "../../../../../components/table/table-cells/common/money-amount-cell"
import { Form } from "../../../../../components/common/form"
import { OrderEditItem } from "./order-edit-item"

type OrderEditFormProps = {
  order: Order
  orderEdit: OrderEdit
}

const QuantitiesSchema = zod.union(
  zod.record(zod.string(), zod.number().optional()),
  zod.object({ note: zod.string().optional() })
)

export function OrderEditForm({ order, orderEdit }: OrderEditFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const [, setSearchParams] = useSearchParams()

  /**
   * STATE
   */
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAddingItems, setIsAddingItems] = useState(false)

  /**
   * FORM
   */
  const form = useForm<zod.infer<typeof QuantitiesSchema>>({
    defaultValues: order.items.reduce(
      (acc, i) => {
        acc[i.id] = i.quantity
        return acc
      },
      { note: orderEdit.internal_note || "" }
    ),
  })

  /**
   * CRUD HOOKS
   */
  const { mutateAsync: confirmOrderEdit } = useAdminConfirmOrderEdit(
    orderEdit.id
  )
  const { mutateAsync: cancelOrderEdit } = useAdminCancelOrderEdit(orderEdit.id)
  const { mutateAsync: addLineItemToOrderEdit } = useAdminOrderEditAddLineItem(
    orderEdit.id
  )
  const { mutateAsync: updateOrderEdit } = useAdminUpdateOrderEdit(orderEdit.id)

  const onQuantityChangeComplete = async (itemId: string) => {
    setIsSubmitting(true)

    const quantity = form.getValues()[itemId]

    // if (form.getValues()[itemId] === 0) {
    //   await medusa.admin.orderEdits.removeLineItem(orderEdit.id, itemId)
    // } else

    if (quantity > 0) {
      await medusa.admin.orderEdits.updateLineItem(orderEdit.id, itemId, {
        quantity,
      })
    }
    await queryClient.invalidateQueries(
      adminOrderEditsKeys.detail(orderEdit.id)
    )

    setIsSubmitting(false)
  }

  const currentItems = useMemo(
    () =>
      orderEdit?.items
        .sort((i1, i2) => i1.id.localeCompare(i2.id))
        .filter((i) => i.original_item_id) || [],
    [orderEdit]
  )
  const addedItems = useMemo(
    () =>
      orderEdit?.items
        .sort((i1, i2) => i1.id.localeCompare(i2.id))
        .filter((i) => !i.original_item_id) || [],
    [orderEdit]
  )

  /**
   * EFFECTS
   */
  useEffect(() => {
    if (orderEdit) {
      orderEdit?.items.forEach((i) => {
        form.setValue(i.id, i.quantity)
      })
    }
  }, [orderEdit?.items.length])

  /**
   * HANDLERS
   */
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSearchParams(
        {},
        {
          replace: true,
        }
      )
    }

    setOpen(open)
  }

  const onVariantsSelect = async (variantIds: string[]) => {
    setIsAddingItems(true)
    try {
      await Promise.all(
        variantIds.map((id) =>
          addLineItemToOrderEdit({ variant_id: id, quantity: 1 })
        )
      )

      await queryClient.invalidateQueries(adminOrderKeys.detail(order.id))
    } finally {
      setIsAddingItems(false)
    }

    setOpen(false)
  }

  const onItemRemove = async (itemId: string) => {
    setIsSubmitting(true)

    const change = orderEdit.changes.find(
      (change) =>
        change.line_item_id === itemId ||
        change.original_line_item_id === itemId
    )
    try {
      if (change) {
        if (change.type === "item_add") {
          await medusa.admin.orderEdits.deleteItemChange(
            orderEdit.id,
            change.id
          )
        }
        if (change.type === "item_update") {
          await medusa.admin.orderEdits.deleteItemChange(
            orderEdit.id,
            change.id
          )
          await medusa.admin.orderEdits.removeLineItem(orderEdit.id, itemId)
        }
      } else {
        await medusa.admin.orderEdits.removeLineItem(orderEdit.id, itemId)
      }

      await queryClient.invalidateQueries(
        adminOrderEditsKeys.detail(orderEdit.id)
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true)

    try {
      if (data.note !== orderEdit?.internal_note) {
        await updateOrderEdit({ internal_note: data.note })
      }

      await confirmOrderEdit() // TODO error notification if fails
    } finally {
      setIsSubmitting(false)
    }

    handleSuccess(`/orders/${order.id}`)
  })

  // TODO pass on "cancel" close
  const handlCancel = async () => {
    await cancelOrderEdit()

    handleSuccess(`/orders/${order.id}`)
  }

  return (
    <RouteFocusModal.Form form={form}>
      <form className="flex h-full flex-col" onSubmit={handleSubmit}>
        <RouteFocusModal.Header>
          <div className="flex   h-full items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button type="submit" size="small" isLoading={isSubmitting}>
              {t("actions.confirm")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex h-full w-full flex-col items-center overflow-hidden">
          <SplitView open={open} onOpenChange={handleOpenChange}>
            <SplitView.Content>
              <div className="conatiner mx-auto max-w-[720px]">
                <div className={clx("flex h-full w-full flex-col pt-16")}>
                  <Heading level="h1" className="pb-8 text-left">
                    {t("orders.edits.title")}
                  </Heading>

                  <Text className="text-ui-fg-base mb-1" weight="plus">
                    {t("orders.edits.currentItems")}
                  </Text>
                  <Text className="text-ui-fg-subtle mb-4">
                    {t("orders.edits.currentItemsDescription")}
                  </Text>

                  {currentItems.map((item) => (
                    <OrderEditItem
                      key={item.id}
                      item={item}
                      form={form}
                      currencyCode={order.currency_code}
                      onRemove={onItemRemove}
                      onQuantityChangeComplete={onQuantityChangeComplete}
                    />
                  ))}

                  <div className="border-b border-dashed pb-10 ">
                    <Text className="text-ui-fg-base mb-1 mt-8" weight="plus">
                      {t("orders.edits.addItems")}
                    </Text>
                    <Text className="text-ui-fg-subtle mb-2">
                      {t("orders.edits.addItemsDescription")}
                    </Text>

                    {!!addedItems.length &&
                      addedItems.map((item) => (
                        <div key={item.id} className="pb-4 pt-2">
                          <OrderEditItem
                            item={item}
                            form={form}
                            currencyCode={order.currency_code}
                            onRemove={onItemRemove}
                            onQuantityChangeComplete={onQuantityChangeComplete}
                          />
                        </div>
                      ))}

                    <div className="m mt-2 flex justify-end">
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => setOpen(true)}
                      >
                        {t("orders.edits.addItems")}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-y-2 border-b border-dashed py-10">
                    <div className="text-ui-fg-subtle flex justify-between text-sm">
                      <Text className="min-w-[50%] ">
                        {t("orders.edits.amountPaid")}
                      </Text>
                      <MoneyAmountCell
                        align="right"
                        currencyCode={order.currency_code}
                        amount={order.paid_total - order.refunded_total}
                      />
                    </div>
                    <div className="text-ui-fg-subtle flex justify-between text-sm ">
                      <Text className="min-w-[50%] ">
                        {t("orders.edits.newTotal")}
                      </Text>
                      <MoneyAmountCell
                        align="right"
                        currencyCode={order.currency_code}
                        amount={orderEdit.total}
                      />
                    </div>
                    <div className="text-ui-fg-base flex justify-between text-sm">
                      <Text className="min-w-[50%]" weight="plus">
                        {t("orders.edits.differenceDue")}
                      </Text>
                      <MoneyAmountCell
                        align="right"
                        currencyCode={order.currency_code}
                        amount={orderEdit.total - order.paid_total}
                      />
                    </div>
                  </div>

                  <div className="py-10">
                    <Form.Field
                      control={form.control}
                      name="note"
                      render={({ field }) => {
                        return (
                          <Form.Item>
                            <Text
                              className="text-ui-fg-base mb-1"
                              weight="plus"
                            >
                              {t("fields.note")}
                            </Text>
                            <Form.Control>
                              <Textarea {...field} />
                            </Form.Control>
                            <Form.ErrorMessage />
                          </Form.Item>
                        )
                      }}
                    />
                  </div>
                </div>
              </div>
            </SplitView.Content>
            <SplitView.Drawer>
              <VariantTable
                isAddingItems={isAddingItems}
                onSave={onVariantsSelect}
                order={order}
              />
            </SplitView.Drawer>
          </SplitView>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
