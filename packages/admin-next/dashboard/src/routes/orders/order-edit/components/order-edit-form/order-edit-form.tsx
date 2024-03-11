import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as zod from "zod"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"
import { getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button, clx, Heading, Text } from "@medusajs/ui"
import { Order } from "@medusajs/medusa"

import { RouteFocusModal } from "../../../../../components/route-modal"
import { SplitView } from "../../../../../components/layout/split-view"
import ItemsTable from "./items-table.tsx"
import { useItemsTableColumns } from "./items-table-columns.tsx"

type OrderEditFormProps = {
  order: Order
}

export function OrderEditForm({ order }: OrderEditFormProps) {
  const { t } = useTranslation()

  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const [, setSearchParams] = useSearchParams()

  const columns = useItemsTableColumns(order)

  const currentItems = order.items || []
  // TODO check status - only one OE can be active
  const addedItems =
    order.edits.find((e) => e.status === "created")?.items || []

  const form = useForm<zod.infer<any>>({
    defaultValues: {},
    // resolver: zodResolver(any),
  })

  const currentItemsTable = useReactTable({
    data: currentItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // getRowId,
  })

  const addedItemsTable = useReactTable({
    data: addedItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // getRowId,
  })

  useEffect(() => {
    // TODO create OE on mount or fetch active one
  }, [])

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

  return (
    <RouteFocusModal.Form form={form}>
      <form
        className="flex h-full flex-col overflow-hidden"
        // onSubmit={handleSubmit}
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
                      <div className="pb-4">
                        <ItemsTable table={addedItemsTable} />
                      </div>
                    )}

                    <div className="mt-2 flex justify-end">
                      <Button variant="secondary" type="button">
                        {t("orders.edits.addItems")}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </SplitView.Content>
            <SplitView.Drawer> TODO table</SplitView.Drawer>
          </SplitView>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
