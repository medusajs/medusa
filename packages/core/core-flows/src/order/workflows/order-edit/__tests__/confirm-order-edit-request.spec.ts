import { ChangeActionType, OrderChangeStatus, MathBN, Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { MedusaContainer } from "@medusajs/framework"
import { asFunction, createContainer } from "@medusajs/framework/awilix"
import { confirmOrderEditRequestWorkflow } from "../confirm-order-edit-request"

const buildContainer = ({
  order,
  orderChange,
  refreshedOrder,
  orderPreview,
  inventoryOverrides = {},
}: {
  order: any
  orderChange: any
  refreshedOrder: any
  orderPreview: any
  inventoryOverrides?: Record<string, any>
}): { container: MedusaContainer; calls: Record<string, any[]> } => {
  const calls: Record<string, any[]> = {
    listReservationItems: [],
    deleteReservationItemsByLineItem: [],
    createReservationItems: [],
    lockingExecute: [],
    emitEvents: [],
  }

  const container = createContainer() as unknown as MedusaContainer

  container.register(
    ContainerRegistrationKeys.QUERY,
    asFunction(() => ({
      graph: async ({ entity, fields, filters }: any) => {
        if (entity === "order") {
          return { data: [refreshedOrder ?? order] }
        }
        if (entity === "order_change") {
          return { data: [orderChange] }
        }
        return { data: [] }
      },
    }))
  )

  container.register(
    Modules.ORDER,
    asFunction(() => ({
      previewOrderChange: async () => orderPreview,
      confirmOrderChange: async () => {},
    }))
  )

  container.register(
    Modules.INVENTORY,
    asFunction(() => ({
      listReservationItems: async (filters: any) => {
        calls.listReservationItems.push(filters)
        if (filters.line_item_id?.includes("item_1")) {
          return [{ id: "res_1", inventory_item_id: "inv_1", line_item_id: "item_1" }]
        }
        return []
      },
      deleteReservationItemsByLineItem: async (ids: string[]) => {
        calls.deleteReservationItemsByLineItem.push(ids)
      },
      createReservationItems: async (items: any[]) => {
        calls.createReservationItems.push(items)
        return items.map((i, idx) => ({ id: `new_res_${idx + 1}`, ...i }))
      },
      ...inventoryOverrides,
    }))
  )

  container.register(
    Modules.LOCKING,
    asFunction(() => ({
      execute: async (keys: string[], fn: () => Promise<any>) => {
        calls.lockingExecute.push(keys)
        return await fn()
      },
      acquire: async () => {},
      release: async () => {},
    }))
  )

  container.register(
    Modules.EVENT_BUS,
    asFunction(() => ({
      emit: async (data: any) => {
        calls.emitEvents.push(data)
      },
      clearGroupedEvents: async () => {},
      releaseGroupedEvents: async () => {},
    }))
  )

  container.register(
    Modules.PAYMENT,
    asFunction(() => ({
      createPaymentCollections: async () => ({ id: "pay_col_1" }),
      updatePaymentCollections: async () => ({ id: "pay_col_1" }),
    }))
  )

  return { container, calls }
}

describe("confirmOrderEditRequestWorkflow - Inventory", () => {
  it("should not delete or create reservations when order edit is price-only (quantity_diff: 0)", async () => {
    const order = {
      id: "order_1",
      status: "pending",
      summary: {
        pending_difference: 0,
        raw_pending_difference: { value: "0" },
      },
      items: [
        {
          id: "item_1",
          variant_id: "var_1",
          quantity: 2,
          unit_price: 100,
          detail: {
            id: "orditem_1",
            item_id: "item_1",
            quantity: 2,
            fulfilled_quantity: 2,
            raw_fulfilled_quantity: { value: "2" },
          },
          variant: {
            id: "var_1",
            manage_inventory: true,
            allow_backorder: false,
            inventory_items: [
              {
                inventory_item_id: "inv_1",
                variant_id: "var_1",
                required_quantity: 1,
                inventory: {
                  location_levels: [
                    {
                      location_id: "loc_1",
                      stocked_quantity: 0,
                      reserved_quantity: 0,
                      stock_locations: { id: "loc_1", sales_channels: [{ id: "sc_1" }] },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
      sales_channel_id: "sc_1",
    }

    const orderChange = {
      id: "orch_1",
      order_id: "order_1",
      status: OrderChangeStatus.REQUESTED,
      actions: [
        {
          id: "act_1",
          action: ChangeActionType.ITEM_UPDATE,
          details: {
            reference_id: "item_1",
            quantity: 2,
            unit_price: 120,
            quantity_diff: 0,
          },
        },
      ],
    }

    const orderPreview = {
      id: "order_1",
      items: [
        {
          id: "item_1",
          quantity: 2,
          unit_price: 120,
          actions: [
            {
              action: ChangeActionType.ITEM_UPDATE,
              details: {
                reference_id: "item_1",
                quantity: 2,
                unit_price: 120,
                quantity_diff: 0,
              },
            },
          ],
        },
      ],
    }

    const { container, calls } = buildContainer({
      order,
      orderChange,
      refreshedOrder: order,
      orderPreview,
    })

    const { result } = await confirmOrderEditRequestWorkflow(container).run({
      input: { order_id: "order_1" },
    })

    expect(result).toBeDefined()
    expect(calls.deleteReservationItemsByLineItem).toHaveLength(0)
    expect(calls.createReservationItems).toHaveLength(0)
  })

  it("should subtract fulfilled quantity on partially fulfilled items when quantity increases", async () => {
    const order = {
      id: "order_1",
      status: "pending",
      summary: {
        pending_difference: 0,
        raw_pending_difference: { value: "0" },
      },
      items: [
        {
          id: "item_1",
          variant_id: "var_1",
          quantity: 5,
          unit_price: 100,
          detail: {
            id: "orditem_1",
            item_id: "item_1",
            quantity: 2,
            fulfilled_quantity: 1,
            raw_fulfilled_quantity: { value: "1" },
          },
          variant: {
            id: "var_1",
            manage_inventory: true,
            allow_backorder: false,
            inventory_items: [
              {
                inventory_item_id: "inv_1",
                variant_id: "var_1",
                required_quantity: 1,
                inventory: {
                  location_levels: [
                    {
                      location_id: "loc_1",
                      stocked_quantity: 10,
                      reserved_quantity: 1,
                      stock_locations: { id: "loc_1", sales_channels: [{ id: "sc_1" }] },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
      sales_channel_id: "sc_1",
    }

    const orderChange = {
      id: "orch_1",
      order_id: "order_1",
      status: OrderChangeStatus.REQUESTED,
      actions: [
        {
          id: "act_1",
          action: ChangeActionType.ITEM_UPDATE,
          details: {
            reference_id: "item_1",
            quantity: 5,
            quantity_diff: 3,
          },
        },
      ],
    }

    const orderPreview = {
      id: "order_1",
      items: [
        {
          id: "item_1",
          quantity: 5,
          actions: [
            {
              action: ChangeActionType.ITEM_UPDATE,
              details: {
                reference_id: "item_1",
                quantity: 5,
                quantity_diff: 3,
              },
            },
          ],
        },
      ],
    }

    const { container, calls } = buildContainer({
      order,
      orderChange,
      refreshedOrder: order,
      orderPreview,
    })

    const { result } = await confirmOrderEditRequestWorkflow(container).run({
      input: { order_id: "order_1" },
    })

    expect(result).toBeDefined()
    // Deleted previous reservation for item_1
    expect(calls.deleteReservationItemsByLineItem).toEqual([["item_1"]])
    expect(calls.createReservationItems).toHaveLength(1)
    expect(calls.createReservationItems[0][0].line_item_id).toBe("item_1")
    expect(calls.createReservationItems[0][0].inventory_item_id).toBe("inv_1")
    expect(MathBN.eq(calls.createReservationItems[0][0].quantity, 4)).toBe(true)
  })

  it("should not create reservation when quantity is updated to equal fulfilled quantity (remainder 0)", async () => {
    const order = {
      id: "order_1",
      status: "pending",
      summary: {
        pending_difference: 0,
        raw_pending_difference: { value: "0" },
      },
      items: [
        {
          id: "item_1",
          variant_id: "var_1",
          quantity: 2,
          unit_price: 100,
          detail: {
            id: "orditem_1",
            item_id: "item_1",
            quantity: 3,
            fulfilled_quantity: 2,
            raw_fulfilled_quantity: { value: "2" },
          },
          variant: {
            id: "var_1",
            manage_inventory: true,
            allow_backorder: false,
            inventory_items: [
              {
                inventory_item_id: "inv_1",
                variant_id: "var_1",
                required_quantity: 1,
                inventory: {
                  location_levels: [
                    {
                      location_id: "loc_1",
                      stocked_quantity: 2,
                      reserved_quantity: 1,
                      stock_locations: { id: "loc_1", sales_channels: [{ id: "sc_1" }] },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
      sales_channel_id: "sc_1",
    }

    const orderChange = {
      id: "orch_1",
      order_id: "order_1",
      status: OrderChangeStatus.REQUESTED,
      actions: [
        {
          id: "act_1",
          action: ChangeActionType.ITEM_UPDATE,
          details: {
            reference_id: "item_1",
            quantity: 2,
            quantity_diff: -1,
          },
        },
      ],
    }

    const orderPreview = {
      id: "order_1",
      items: [
        {
          id: "item_1",
          quantity: 2,
          actions: [
            {
              action: ChangeActionType.ITEM_UPDATE,
              details: {
                reference_id: "item_1",
                quantity: 2,
                quantity_diff: -1,
              },
            },
          ],
        },
      ],
    }

    const { container, calls } = buildContainer({
      order,
      orderChange,
      refreshedOrder: order,
      orderPreview,
    })

    const { result } = await confirmOrderEditRequestWorkflow(container).run({
      input: { order_id: "order_1" },
    })

    expect(result).toBeDefined()
    // Deletes existing 1 reservation
    expect(calls.deleteReservationItemsByLineItem).toEqual([["item_1"]])
    // No new reservation created because 2 - 2 = 0
    expect(calls.createReservationItems).toHaveLength(0)
  })

  it("should create reservation for newly added item (ITEM_ADD)", async () => {
    const order = {
      id: "order_1",
      status: "pending",
      summary: {
        pending_difference: 0,
        raw_pending_difference: { value: "0" },
      },
      items: [
        {
          id: "item_new",
          variant_id: "var_1",
          quantity: 3,
          unit_price: 100,
          detail: {
            id: "orditem_new",
            item_id: "item_new",
            quantity: 3,
            fulfilled_quantity: 0,
            raw_fulfilled_quantity: { value: "0" },
          },
          variant: {
            id: "var_1",
            manage_inventory: true,
            allow_backorder: false,
            inventory_items: [
              {
                inventory_item_id: "inv_1",
                variant_id: "var_1",
                required_quantity: 1,
                inventory: {
                  location_levels: [
                    {
                      location_id: "loc_1",
                      stocked_quantity: 10,
                      reserved_quantity: 0,
                      stock_locations: { id: "loc_1", sales_channels: [{ id: "sc_1" }] },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
      sales_channel_id: "sc_1",
    }

    const orderChange = {
      id: "orch_1",
      order_id: "order_1",
      status: OrderChangeStatus.REQUESTED,
      actions: [
        {
          id: "act_add",
          action: ChangeActionType.ITEM_ADD,
          details: {
            reference_id: "item_new",
            quantity: 3,
          },
        },
      ],
    }

    const orderPreview = {
      id: "order_1",
      items: [
        {
          id: "item_new",
          quantity: 3,
          actions: [
            {
              action: ChangeActionType.ITEM_ADD,
              details: {
                reference_id: "item_new",
                quantity: 3,
              },
            },
          ],
        },
      ],
    }

    const { container, calls } = buildContainer({
      order: { id: "order_1", items: [] },
      orderChange,
      refreshedOrder: order,
      orderPreview,
    })

    const { result } = await confirmOrderEditRequestWorkflow(container).run({
      input: { order_id: "order_1" },
    })

    expect(result).toBeDefined()
    expect(calls.deleteReservationItemsByLineItem).toHaveLength(0)
    expect(calls.createReservationItems).toHaveLength(1)
    expect(calls.createReservationItems[0][0].line_item_id).toBe("item_new")
    expect(calls.createReservationItems[0][0].inventory_item_id).toBe("inv_1")
    expect(MathBN.eq(calls.createReservationItems[0][0].quantity, 3)).toBe(true)
  })
})
