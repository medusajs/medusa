import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { AdminOrder } from "@medusajs/types"
import { Button, Heading, Input, Select, toast } from "@medusajs/ui"
import { useForm, useWatch } from "react-hook-form"

import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { Form } from "../../../../../components/common/form"
import { useStockLocations } from "../../../../../hooks/api/stock-locations"
import { getFulfillableQuantity } from "../../../../../lib/order-item"
import { OrderAllocateItemsItem } from "./order-allocate-items-item"
import { AllocateItemsSchema } from "./constants"
import { useCreateReservationItem } from "../../../../../hooks/api/reservations.tsx"

type OrderCreateFulfillmentFormProps = {
  order: AdminOrder
}

export function OrderAllocateItemsForm({
  order,
}: OrderCreateFulfillmentFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const { mutateAsync: allocateItems, isPending: isMutating } =
    useCreateReservationItem()

  const [itemsToAllocate, setItemsToAllocate] = useState(() =>
    order.items.filter(
      (item) =>
        item.variant.manage_inventory && getFulfillableQuantity(item) > 0
    )
  )

  // TODO - empty state UI
  const noItemsToAllocate = !itemsToAllocate.length

  const form = useForm<zod.infer<typeof AllocateItemsSchema>>({
    defaultValues: {
      location_id: "",
      quantity: {},
    },
    resolver: zodResolver(AllocateItemsSchema),
  })

  const { stock_locations = [] } = useStockLocations()

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      const promises = Object.entries(data.quantity).map(
        ([inventoryItemId, quantity]) =>
          allocateItems({
            location_id: data.location_id,
            inventory_item_id: inventoryItemId,
            quantity,
            // line_item_id: "TODO"
          })
      )

      await Promise.all(promises)

      handleSuccess(`/orders/${order.id}`)

      toast.success(t("general.success"), {
        description: t("orders.allocateItems.toast.created"),
        dismissLabel: t("actions.close"),
      })
    } catch (e) {
      toast.error(t("general.error"), {
        description: e.message,
        dismissLabel: t("actions.close"),
      })
    }
  })

  const selectedLocationId = useWatch({
    name: "location_id",
    control: form.control,
  })

  return (
    <RouteFocusModal.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" type="submit" isLoading={isMutating}>
              {t("orders.allocateItems.action")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex h-full w-full flex-col items-center divide-y overflow-y-auto">
          <div className="flex size-full flex-col items-center overflow-auto p-16">
            <div className="flex w-full max-w-[736px] flex-col justify-center px-2 pb-2">
              <div className="flex flex-col gap-8 divide-y divide-dashed">
                <Heading>{t("orders.allocateItems.title")}</Heading>
                <div className="flex-1 divide-y divide-dashed pt-8">
                  <Form.Field
                    control={form.control}
                    name="location_id"
                    render={({ field: { onChange, ref, ...field } }) => {
                      return (
                        <Form.Item>
                          <Form.Label>{t("fields.location")}</Form.Label>
                          <Form.Hint>
                            {t("orders.allocateItems.locationDescription")}
                          </Form.Hint>
                          <Form.Control>
                            <Select onValueChange={onChange} {...field}>
                              <Select.Trigger
                                className="bg-ui-bg-base"
                                ref={ref}
                              >
                                <Select.Value />
                              </Select.Trigger>
                              <Select.Content>
                                {stock_locations.map((l) => (
                                  <Select.Item key={l.id} value={l.id}>
                                    {l.name}
                                  </Select.Item>
                                ))}
                              </Select.Content>
                            </Select>
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />

                  <Form.Item className="mt-8 pt-8">
                    <div className="flex flex-col items-center lg:flex-row">
                      <div className="flex-1">
                        <Form.Label>
                          {t("orders.allocateItems.itemsToAllocate")}
                        </Form.Label>
                        <Form.Hint>
                          {t("orders.allocateItems.itemsToAllocateDesc")}
                        </Form.Hint>
                      </div>
                      <div className="flex-1">
                        <Input placeholder={t("orders.allocateItems.search")} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-y-1">
                      {itemsToAllocate.map((item) => (
                        <OrderAllocateItemsItem
                          key={item.id}
                          form={form}
                          item={item}
                          locationId={selectedLocationId}
                        />
                      ))}
                    </div>
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
