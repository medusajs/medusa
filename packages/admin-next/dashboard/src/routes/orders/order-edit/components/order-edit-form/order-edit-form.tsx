import React, { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import * as zod from "zod"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"
import { getCoreRowModel, useReactTable } from "@tanstack/react-table"

import { Button, clx, Heading, Text } from "@medusajs/ui"
import { Order } from "@medusajs/medusa"

import { RouteFocusModal } from "../../../../../components/route-modal"
import { SplitView } from "../../../../../components/layout/split-view"
import ItemsTable from "./items-table.tsx"
import { useItemsTableColumns } from "./items-table-columns.tsx"
import { VariantTable } from "../variant-table"
import {
  adminOrderKeys,
  useAdminCreateOrderEdit,
  useAdminOrderEditAddLineItem,
} from "medusa-react"
import { queryClient } from "../../../../../lib/medusa.ts"

type OrderEditFormProps = {
  order: Order
}

let flag = false

export function OrderEditForm({ order }: OrderEditFormProps) {
  const { t } = useTranslation()

  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const orderEdit = order.edits.find((oe) => oe.status === "created")

  const { mutateAsync: createOrderEdit } = useAdminCreateOrderEdit()
  const { mutateAsync: addLineItemToOrderEdit } = useAdminOrderEditAddLineItem(
    orderEdit?.id
  )

  const onQuantityChange = (value: number, itemId: string) => {
    const state = { ...quantities }
    state[itemId] = value
    setQuantities(state)
  }

  const [, setSearchParams] = useSearchParams()

  const columns = useItemsTableColumns(order, quantities, onQuantityChange)

  const currentItems = order.items || []
  const addedItems = useMemo(
    () => orderEdit?.items.filter((i) => !i.original_item_id) || [],
    [orderEdit]
  )

  const form = useForm<zod.infer<any>>({})

  const currentItemsTable = useReactTable({
    data: currentItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const addedItemsTable = useReactTable({
    data: addedItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  useEffect(() => {
    ;(async () => {
      if (!orderEdit && !flag) {
        flag = true
        await createOrderEdit({
          order_id: order.id,
          // created_by: // TODO
        })
      }
      flag = false
    })()
  }, [])

  useEffect(() => {
    if (orderEdit) {
      orderEdit?.items.forEach((i) => {
        if (!(i.id in quantities)) {
          quantities[i.id] = i.quantity
        }
      })
    }
  }, [orderEdit?.items.length, quantities])

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
    await Promise.all(
      variantIds.map((id) =>
        addLineItemToOrderEdit({ variant_id: id, quantity: 1 })
      )
    )

    await queryClient.invalidateQueries(adminOrderKeys.detail(order.id))

    setOpen(false)
  }

  return (
    <RouteFocusModal.Form form={form}>
      <RouteFocusModal.Header>
        <div className="flex   h-full items-center justify-end gap-x-2">
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

                <ItemsTable table={currentItemsTable} />

                <div className="border-b border-dashed pb-10 ">
                  <Text className="text-ui-fg-base mb-1 mt-8" weight="plus">
                    {t("orders.edits.addItems")}
                  </Text>
                  <Text className="text-ui-fg-subtle mb-2">
                    {t("orders.edits.addItemsDescription")}
                  </Text>

                  {!!addedItems.length && (
                    <div className="pb-4 pt-2">
                      <ItemsTable table={addedItemsTable} />
                    </div>
                  )}

                  <div className="mt-2 flex justify-end">
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() => setOpen(true)}
                    >
                      {t("orders.edits.addItems")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SplitView.Content>
          <SplitView.Drawer>
            <VariantTable onSave={onVariantsSelect} order={order} />
          </SplitView.Drawer>
        </SplitView>
      </RouteFocusModal.Body>
    </RouteFocusModal.Form>
  )
}
